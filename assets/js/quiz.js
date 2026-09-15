/* ---------------------------------------------------------------------------
   The live review game behind /teaching/ (the screen at the front of the room)
   and /teaching/play/ (a student's phone).

   WHY THERE IS SCRIPT HERE AT ALL. The site's rule is no JavaScript without a
   clear reason, and the reason is that this page is a game: a room code, a
   countdown, seventy phones answering at once and a leaderboard between
   sections. None of that can be done with markup and CSS.

   HOW IT WORKS WITHOUT A SERVER. The site is static, so there is nothing to run
   a game server on. Instead the host's browser IS the server. It opens a peer
   connection under a made-up room code, every phone connects straight to it,
   and the host keeps the scores in memory. The library that does this is
   PeerJS, vendored in assets/js/vendor/ so the page depends on no CDN staying
   up during class.

   What still has to be reachable during class: a small public broker that
   introduces the two browsers to each other. Once introduced they talk
   directly. If the broker is unreachable, the lobby says so instead of
   failing silently.

   WHERE THE ANSWERS LIVE. The host page carries the answer key, because the
   host does the scoring. The player page does not: it receives a question over
   the wire, sends back a choice, and is told whether it was right. A student
   reading the source of the page they were sent finds no key in it.

   NOTHING IS STORED, except one thing. Scores live in the host tab's memory
   until the tab is closed. No names, no answers and no scores are written
   anywhere, sent anywhere, or kept after the game. The one exception is on the
   student's own phone: it remembers its own player token and name for this one
   room code, so that a phone that locks or drops rejoins as itself instead of
   as a stranger. That never leaves the phone and is cleared when the game ends.

   BUILT FOR A FULL SECTION, NOT A HANDFUL. Four things here exist only because
   a room might hold seventy phones for seventy-five minutes:

     IDENTITY IS A TOKEN, NOT A NAME. Two students called Sarah are two
     players. Matching a rejoin by name merged them into one, and silently
     stopped counting the first one's answers.

     LATE ARRIVALS ARE LET IN. Getting seventy phones through a QR scan takes
     longer than the first question does. Someone who joins mid-game starts at
     zero and plays from wherever the room is.

     THE CONNECTION IS KEPT WARM AND REPAIRS ITSELF. The host pings every
     phone on a timer, and either end re-establishes the link, with backoff,
     when it drops. A silent data channel across seventy-five minutes of
     campus wifi is a data channel that quietly dies.

     NEITHER SCREEN IS ALLOWED TO SLEEP. A locked phone loses its connection;
     a sleeping host laptop ends the game for everyone.
--------------------------------------------------------------------------- */

(function () {
  'use strict';

  var hostRoot = document.getElementById('quiz-host');
  var playRoot = document.getElementById('quiz-play');
  if (!hostRoot && !playRoot) { return; }

  /* Room codes are made from an alphabet with no 0/O and no 1/I/L, because
     somebody always has to read this off a projector from the back row. */
  var ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  var CODE_LENGTH = 4;

  /* Every peer this page creates is named with this prefix, so a code only has
     to be unique among this site's games rather than among every PeerJS user
     in the world. */
  var PEER_PREFIX = 'crissouza-quiz-';

  /* How the two browsers find a route to each other. STUN alone is enough on
     most networks. The relay is the fallback for networks that refuse direct
     connections, which some campus and guest wifi does; traffic through it
     stays encrypted end to end. Remove the relay entries to use STUN only. */
  var PEER_OPTIONS = {
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' },
        {
          urls: ['turn:openrelay.metered.ca:80', 'turn:openrelay.metered.ca:443'],
          username: 'openrelayproject',
          credential: 'openrelayproject'
        }
      ]
    }
  };

  /* Keeping the link alive. The host pings on this interval; a phone that has
     not been heard from in STALE_AFTER is assumed gone, which matters because
     an open-looking connection to a phone in someone's pocket would otherwise
     hold up "everyone has answered". STALE_AFTER is several missed pings, so a
     slow network is never mistaken for a departure. */
  var PING_EVERY = 20000;
  var STALE_AFTER = 95000;

  /* Reconnection backoff. Seventy phones re-dialing in the same second is the
     thing that knocks the broker over, so each retry waits longer and adds a
     random slice to spread the crowd out. */
  var RETRY_BASE = 800;
  var RETRY_MAX = 10000;
  var RETRY_GIVE_UP = 40;

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
  var MAX_NAME = 18;

  /* How many rows a leaderboard shows. Ten is what fits on a projector and
     stays readable from the back of a lecture hall — including the final one,
     where the rest of the room reads its own placement off its own phone. */
  var BOARD_SIZE = 10;

  function el(id) { return document.getElementById(id); }

  /* Show exactly one screen inside a root and hide its siblings. */
  function show(root, id) {
    var screens = root.querySelectorAll('.quiz-screen');
    for (var i = 0; i < screens.length; i += 1) {
      screens[i].hidden = screens[i].id !== id;
    }
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  /* Names come from students, so they are only ever written with textContent.
     Nothing a player types is ever put into the page as markup. */
  function cleanName(raw) {
    return String(raw || '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
  }

  function makeCode() {
    var out = '';
    for (var i = 0; i < CODE_LENGTH; i += 1) {
      out += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return out;
  }

  /* A token that identifies one phone for one game. Long enough that two
     phones never draw the same one. */
  function makeToken() {
    var out = '';
    for (var i = 0; i < 16; i += 1) {
      out += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return out;
  }

  function backoff(attempt) {
    var wait = Math.min(RETRY_BASE * Math.pow(1.6, attempt), RETRY_MAX);
    return wait + Math.random() * wait * 0.5;
  }

  /* Keep the screen awake for the length of the game. A phone that locks drops
     its connection; a host laptop that sleeps ends the game for the whole room.
     The API is not everywhere and can be refused, so every call is guarded and
     nothing depends on it working. */
  function keepAwake() {
    var lock = null;
    if (!navigator.wakeLock || !navigator.wakeLock.request) { return; }

    function take() {
      if (document.visibilityState !== 'visible') { return; }
      try {
        navigator.wakeLock.request('screen').then(function (got) {
          lock = got;
          /* The browser drops the lock whenever the tab is hidden, so it has
             to be taken again each time the page comes back. */
          lock.addEventListener('release', function () { lock = null; });
        }, function () { /* refused; the game still works */ });
      } catch (e) { /* not supported here */ }
    }

    take();
    document.addEventListener('visibilitychange', function () {
      if (!lock) { take(); }
    });
  }

  /* One option tile. Used on both surfaces: clickable on a phone, a display
     tile on the projected screen. */
  function optionTile(index, label, clickable) {
    var node = document.createElement('button');
    node.type = 'button';
    node.className = 'quiz-opt quiz-opt--' + index;
    if (!clickable) { node.tabIndex = -1; node.setAttribute('aria-hidden', 'true'); }

    var key = document.createElement('span');
    key.className = 'quiz-opt__key';
    key.textContent = LETTERS[index];
    node.appendChild(key);

    var text = document.createElement('span');
    text.className = 'quiz-opt__text';
    text.textContent = label;
    node.appendChild(text);

    return node;
  }

  /* One row of a leaderboard, on either surface. `place` is the position being
     shown, counting from 1; the top three are marked so they read as a podium
     rather than as three more rows. */
  function rankRow(place, name, score, gain) {
    var row = document.createElement('li');
    row.className = 'quiz-rank__row';
    if (place <= 3) { row.className += ' is-podium is-place-' + place; }

    var pos = document.createElement('span');
    pos.className = 'quiz-rank__pos';
    pos.textContent = place + '.';
    row.appendChild(pos);

    var who = document.createElement('span');
    who.className = 'quiz-rank__name';
    who.textContent = name;
    row.appendChild(who);

    if (typeof gain === 'number') {
      var up = document.createElement('span');
      up.className = 'quiz-rank__gain' + (gain === 0 ? ' is-zero' : '');
      up.textContent = '+' + gain;
      row.appendChild(up);
    }

    var points = document.createElement('span');
    points.className = 'quiz-rank__score';
    points.textContent = score;
    row.appendChild(points);

    return row;
  }

  /* =======================================================================
     THE HOST: the screen at the front of the room
     ======================================================================= */

  function startHost() {
    var data = JSON.parse(el('quiz-data').textContent);
    var seconds = data.seconds_per_question || 60;

    /* The sections flattened into one run of questions. Each one remembers
       which section it belongs to and whether it closes that section, which is
       what triggers a leaderboard. */
    var questions = [];
    data.sections.forEach(function (section, sectionIndex) {
      section.questions.forEach(function (q, i) {
        questions.push({
          section: section.name,
          sectionIndex: sectionIndex,
          prompt: q.prompt,
          options: q.options,
          answer: q.answer,
          hint: q.hint,
          isPoll: q.answer === 'poll' || q.answer === null || q.answer === undefined,
          endsSection: i === section.questions.length - 1
        });
      });
    });

    /* { token, conn, name, label, score, sectionScore, answer, ms, seen } */
    var players = [];
    var byToken = {};
    var peer = null;
    var code = null;
    var index = -1;            // which question is on screen
    var phase = 'idle';        // idle | asking | revealed | ranking
    var ticker = null;
    var heartbeat = null;
    var deadline = 0;
    var openAttempt = 0;

    var nodes = {
      code: el('host-code'),
      joinUrl: el('host-join-url'),
      qr: el('host-qr'),
      rankCode: el('host-rank-code'),
      rankUrl: el('host-rank-url'),
      rankQr: el('host-rank-qr'),
      players: el('host-players'),
      count: el('host-player-count'),
      start: el('host-start'),
      next: el('host-next'),
      status: el('host-status'),
      section: el('host-section'),
      position: el('host-position'),
      prompt: el('host-prompt'),
      options: el('host-options'),
      timerFill: el('host-timer-fill'),
      timerText: el('host-timer-text'),
      answered: el('host-answered'),
      hint: el('host-hint'),
      rankTitle: el('host-rank-title'),
      rankSub: el('host-rank-sub'),
      rankList: el('host-rank-list'),
      rankNext: el('host-rank-next'),
      errorText: el('host-error-text')
    };

    /* Everyone we still believe is holding a phone. A connection that reports
       itself open but has gone quiet past STALE_AFTER does not count: without
       this, one pocketed phone makes the room wait out every clock. */
    function live() {
      var now = Date.now();
      return players.filter(function (p) {
        return p.conn && p.conn.open && (now - p.seen) < STALE_AFTER;
      });
    }

    function send(player, message) {
      if (player.conn && player.conn.open) {
        try { player.conn.send(message); } catch (e) { /* a phone that left */ }
      }
    }

    function standings() {
      return players.slice().sort(function (a, b) {
        if (b.score !== a.score) { return b.score - a.score; }
        return a.label.localeCompare(b.label);
      });
    }

    /* ---- opening the room ---- */

    function openRoom() {
      code = makeCode();
      peer = new Peer(PEER_PREFIX + code, PEER_OPTIONS);

      peer.on('open', function () {
        openAttempt = 0;
        var url = location.origin + el('quiz-host').dataset.playUrl + '?r=' + code;
        var plain = url.replace(/^https?:\/\//, '');

        nodes.code.textContent = code;
        nodes.joinUrl.textContent = plain;
        drawQr(nodes.qr, url);

        /* The same code and QR are painted onto the leaderboard now, while the
           room is opening, rather than each time a board goes up. A board is
           the one moment in the game when the screen is not a question and
           nobody is against a clock, which makes it the natural place for a
           student who has not joined yet to catch up.

           The address shown there drops the ?r= that the QR carries. Somebody
           reading it off a projector is typing it, and telling them to type a
           code that is already in the address they are typing is two ways of
           saying the same thing, at the size where the screen has least room
           for it. */
        nodes.rankCode.textContent = code;
        nodes.rankUrl.textContent = plain.replace(/\?.*$/, '');
        drawQr(nodes.rankQr, url);

        if (phase === 'idle') { show(hostRoot, 'host-lobby'); }
        startHeartbeat();
      });

      peer.on('connection', function (conn) { welcome(conn); });

      peer.on('error', function (err) {
        var type = err && err.type;

        /* A code already in use somewhere in the world: take another one. But
           only before anyone has joined — renaming the room mid-game would
           strand every phone in it. */
        if (type === 'unavailable-id') {
          if (phase === 'idle' && players.length === 0) {
            peer.destroy();
            openRoom();
          }
          return;
        }

        /* A phone that vanished between dialing and connecting. Not our
           problem, and not worth a screen. */
        if (type === 'peer-unavailable') { return; }

        /* The broker went away. Seventy phones arriving at once can do this.
           Keep retrying rather than ending the game: the phones already
           connected are talking to us directly and are unaffected. */
        if (type === 'network' || type === 'server-error' ||
            type === 'socket-error' || type === 'socket-closed') {
          retryRoom();
          return;
        }

        fail(err && err.message ? err.message : 'The connection failed.');
      });

      peer.on('disconnected', function () {
        /* Lost the broker, not the phones. Always reconnect — a room that
           stops accepting arrivals while sitting in the lobby is a room
           nobody can join. */
        retryRoom();
      });
    }

    function retryRoom() {
      if (openAttempt >= RETRY_GIVE_UP) {
        fail('Lost contact with the connection service and could not get it back.');
        return;
      }
      var wait = backoff(openAttempt);
      openAttempt += 1;
      setTimeout(function () {
        if (!peer || peer.destroyed) { openRoom(); return; }
        if (peer.disconnected) {
          try { peer.reconnect(); } catch (e) { openRoom(); }
        }
      }, wait);
    }

    function fail(message) {
      nodes.errorText.textContent = message;
      show(hostRoot, 'host-error');
    }

    function drawQr(node, url) {
      if (!node) { return; }
      clear(node);
      try {
        var qr = qrcode(0, 'M');
        qr.addData(url);
        qr.make();
        node.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 1, scalable: true });
      } catch (e) {
        /* No QR is survivable: the code and the address are both on screen. */
        node.textContent = '';
      }
    }

    /* Ping every phone on a timer. This does two jobs: it keeps a data channel
       that would otherwise sit silent through a sixty-second question from
       being closed by something in the middle, and the replies are what tell
       us who is still here. */
    function startHeartbeat() {
      if (heartbeat) { return; }
      heartbeat = setInterval(function () {
        var now = Date.now();
        var changed = false;
        players.forEach(function (p) {
          if (p.conn && p.conn.open) {
            send(p, { t: 'ping' });
            if ((now - p.seen) >= STALE_AFTER && !p.stale) { p.stale = true; changed = true; }
          } else if (!p.stale) {
            p.stale = true;
            changed = true;
          }
        });
        if (changed) {
          renderPresence();
          if (phase === 'asking' && allAnswered()) { finishQuestion(); }
        }
      }, PING_EVERY);
    }

    /* ---- players arriving ---- */

    function welcome(conn) {
      /* Which player this connection belongs to, decided by the token in its
         join message. Held here rather than looked up from the connection
         later, because a reconnecting phone arrives on a brand new connection
         object and the old one may still be sitting in the list. */
      var owner = null;

      conn.on('data', function (message) {
        if (!message || typeof message !== 'object') { return; }

        if (message.t === 'join') {
          owner = admit(conn, message);
          return;
        }

        if (!owner) { return; }
        owner.seen = Date.now();
        if (owner.stale) { owner.stale = false; renderPresence(); }

        if (message.t === 'pong') { return; }
        if (message.t === 'a') { answerFrom(owner, message); }
      });

      conn.on('close', function () {
        if (owner && owner.conn === conn) { owner.stale = true; }
        renderPresence();
      });
      conn.on('error', function () { renderPresence(); });
    }

    /* A phone identifies itself by a token it generated and keeps. Two
       students who both type "Sarah" hold two different tokens and are two
       players; one student whose phone locked and came back holds the same
       token and gets her score back. */
    function admit(conn, message) {
      var token = String(message.token || '').slice(0, 32);
      var name = cleanName(message.name) || 'Player';
      var player = token ? byToken[token] : null;

      if (player) {
        /* The same phone, back again. Drop the stale connection if one is
           somehow still open, so nothing is sent down a dead pipe. */
        if (player.conn && player.conn !== conn) {
          try { player.conn.close(); } catch (e) { /* already gone */ }
        }
        player.conn = conn;
        player.stale = false;
        if (name !== player.name) {
          var was = player.name;
          player.name = name;
          relabel(was);          // the name being vacated may now be unique
          relabel(name);
        }
      } else {
        player = {
          token: token || makeToken(),
          conn: conn,
          name: name,
          label: name,
          score: 0,
          sectionScore: 0,
          answer: null,
          ms: 0,
          stale: false,
          seen: 0,
          joinedAt: index
        };
        players.push(player);
        byToken[player.token] = player;
        relabel(name);
      }

      player.seen = Date.now();

      try {
        conn.send({ t: 'ok', name: player.label, started: phase !== 'idle' });
      } catch (e) { return player; }

      /* Anybody may join at any point. Seventy phones do not all get through a
         QR scan before the first question ends, and locking the stragglers out
         of the whole review is worse than letting them start from zero. A
         phone that arrives mid-question gets the time that is actually left. */
      if (phase === 'asking') { sendQuestion(player); }

      renderPlayers();
      return player;
    }

    /* Two people really can be called Sarah. Both keep the name they typed and
       both get a letter, in the order they joined: Sarah_A, Sarah_B. A letter
       is worth more than a number here — "Sarah_B" is something the room can
       say out loud, where "Sarah (2)" reads as second place.

       This runs over everybody sharing the name, not just the arrival, because
       the first Sarah was plain "Sarah" until the second one turned up and has
       to become Sarah_A at that moment. Her phone is told its new name, so the
       board and the phone never disagree. A name that falls back to being
       unique loses its letter again the same way. */
    function relabel(name) {
      var key = String(name).toLowerCase();
      var sharing = players.filter(function (p) {
        return p.name.toLowerCase() === key;
      });

      sharing.forEach(function (p, i) {
        var next = sharing.length === 1 ? p.name : p.name + '_' + suffix(i);
        if (p.label === next) { return; }
        p.label = next;
        if (p.chip) { p.chip.textContent = next; }
        send(p, { t: 'name', name: next });
      });
    }

    /* A..Z covers any real room. Past that, stop inventing letters and count. */
    function suffix(i) {
      return i < 26 ? String.fromCharCode(65 + i) : String(i + 1);
    }

    function answerFrom(player, message) {
      if (phase !== 'asking' || message.i !== index) { return; }
      if (player.answer !== null) { return; }

      player.answer = message.choice;
      /* The phone reports how long it took from the moment the question
         appeared on it, which is fairer than timing it here: this end cannot
         tell a slow thinker from a slow connection. Clamped so a wrong clock
         cannot buy points. */
      player.ms = Math.max(0, Math.min(seconds * 1000, Number(message.ms) || 0));
      renderAnswered();

      if (allAnswered()) { finishQuestion(); }
    }

    function allAnswered() {
      var here = live();
      if (here.length === 0) { return false; }
      return here.every(function (p) { return p.answer !== null; });
    }

    /* The lobby list is appended to, not rebuilt. Rebuilding it re-ran the
       arrival animation on every chip each time somebody joined, which with
       seventy arrivals is several thousand animations and a lobby that never
       stops twitching. */
    function renderPlayers() {
      players.forEach(function (p) {
        if (p.chip) {
          if (p.chip.textContent !== p.label) { p.chip.textContent = p.label; }
          return;
        }
        var chip = document.createElement('li');
        chip.className = 'quiz-player';
        chip.textContent = p.label;
        p.chip = chip;
        nodes.players.appendChild(chip);
      });
      renderPresence();
    }

    function renderPresence() {
      players.forEach(function (p) {
        if (p.chip) { p.chip.classList.toggle('is-away', !!p.stale); }
      });
      var here = live().length;
      nodes.count.textContent = players.length === 1
        ? '1 player'
        : players.length + ' players' + (here < players.length ? ', ' + here + ' connected' : '');
      nodes.start.disabled = players.length === 0;
      if (phase === 'asking') { renderAnswered(); }
    }

    /* ---- asking ---- */

    function askNext() {
      index += 1;
      if (index >= questions.length) { index = questions.length - 1; showRanking(); return; }

      var q = questions[index];
      if (index === 0 || q.sectionIndex !== questions[index - 1].sectionIndex) {
        players.forEach(function (p) { p.sectionScore = 0; });
      }

      phase = 'asking';
      players.forEach(function (p) { p.answer = null; p.ms = 0; });

      nodes.section.textContent = q.section;
      nodes.position.textContent = 'Question ' + (index + 1) + ' of ' + questions.length;
      nodes.prompt.textContent = q.prompt;
      nodes.hint.hidden = true;
      nodes.next.hidden = true;

      clear(nodes.options);
      q.options.forEach(function (label, i) {
        nodes.options.appendChild(optionTile(i, label, false));
      });

      show(hostRoot, 'host-question');
      renderAnswered();

      deadline = Date.now() + seconds * 1000;
      tick();
      ticker = setInterval(tick, 100);

      live().forEach(sendQuestion);
    }

    function sendQuestion(player) {
      if (!player) { return; }
      var q = questions[index];
      send(player, {
        t: 'q',
        i: index,
        of: questions.length,
        section: q.section,
        prompt: q.prompt,
        options: q.options,
        /* A phone joining late gets the time that is actually left. */
        seconds: Math.max(1, Math.round((deadline - Date.now()) / 1000))
      });
    }

    function tick() {
      var left = Math.max(0, deadline - Date.now());
      var share = left / (seconds * 1000);
      nodes.timerFill.style.width = (share * 100) + '%';
      nodes.timerFill.classList.toggle('is-low', share <= 0.25);
      nodes.timerText.textContent = Math.ceil(left / 1000) + 's';
      if (left <= 0) { finishQuestion(); }
    }

    function renderAnswered() {
      var here = live();
      var done = here.filter(function (p) { return p.answer !== null; }).length;
      nodes.answered.textContent = done + ' of ' + here.length + ' answered';
    }

    /* ---- revealing ---- */

    function finishQuestion() {
      if (phase !== 'asking') { return; }
      phase = 'revealed';
      clearInterval(ticker);
      nodes.timerFill.style.width = '0%';
      nodes.timerText.textContent = 'Time up';

      var q = questions[index];
      var tally = q.options.map(function () { return 0; });

      players.forEach(function (p) {
        p.lastGain = 0;
        if (p.answer === null) { return; }
        if (typeof tally[p.answer] === 'number') { tally[p.answer] += 1; }
        if (q.isPoll) { return; }
        if (p.answer === q.answer) {
          /* Right is worth 600. Speed is worth up to 400 more, so knowing the
             answer always beats guessing quickly. */
          var speed = 1 - (p.ms / (seconds * 1000));
          p.lastGain = Math.round((600 + 400 * speed) / 10) * 10;
        }
        p.score += p.lastGain;
        p.sectionScore += p.lastGain;
      });

      /* Light up the key, dim the rest, and show how the room voted. */
      var tiles = nodes.options.children;
      for (var i = 0; i < tiles.length; i += 1) {
        var count = document.createElement('span');
        count.className = 'quiz-opt__tally';
        count.textContent = tally[i];
        tiles[i].appendChild(count);
        if (q.isPoll) { continue; }
        if (i === q.answer) { tiles[i].classList.add('is-key'); }
        else { tiles[i].classList.add('is-dim'); }
      }

      if (q.hint) {
        nodes.hint.textContent = q.hint;
        nodes.hint.hidden = false;
      }

      var order = standings();
      players.forEach(function (p) {
        send(p, {
          t: 'result',
          poll: q.isPoll,
          correct: q.isPoll ? null : p.answer === q.answer,
          answered: p.answer !== null,
          gained: p.lastGain || 0,
          score: p.score,
          rank: order.indexOf(p) + 1,
          of: players.length
        });
      });

      nodes.next.hidden = false;
      nodes.next.textContent = q.endsSection ? 'Show the ranking' : 'Next question';
      nodes.next.focus();
    }

    function afterQuestion() {
      if (questions[index].endsSection) { showRanking(); } else { askNext(); }
    }

    /* ---- ranking ---- */

    function showRanking() {
      var q = questions[index];
      var last = index === questions.length - 1;
      var order = standings();
      phase = 'ranking';

      nodes.rankTitle.textContent = last ? 'Final ranking' : q.section + ' standings';
      nodes.rankSub.textContent = last
        ? 'The top ten. Everyone else: your placement is on your phone.'
        : 'Top ten so far, with this section in green';

      /* Every board is a top ten, the last one included. Seventy rows do not
         fit on a projector and cannot be read from the back row; the students
         who are not on it are each told their own placement on their phone. */
      clear(nodes.rankList);
      order.slice(0, BOARD_SIZE).forEach(function (p, i) {
        nodes.rankList.appendChild(
          rankRow(i + 1, p.label, p.score, last ? undefined : p.sectionScore)
        );
      });

      var top = order.slice(0, 3).map(function (p) {
        return { name: p.label, score: p.score };
      });

      players.forEach(function (p) {
        send(p, {
          t: 'rank',
          section: q.section,
          last: last,
          rank: order.indexOf(p) + 1,
          of: players.length,
          score: p.score,
          gained: p.sectionScore,
          top: top
        });
      });

      nodes.rankNext.textContent = last
        ? 'Run it again'
        : 'Start ' + questions[index + 1].section;
      show(hostRoot, 'host-rank');
      nodes.rankNext.focus();
    }

    /* ---- wiring ---- */

    el('host-open').addEventListener('click', function () {
      nodes.status.textContent = 'Opening the room';
      show(hostRoot, 'host-connecting');
      keepAwake();
      openRoom();
    });

    nodes.start.addEventListener('click', function () { askNext(); });
    nodes.next.addEventListener('click', function () { afterQuestion(); });
    nodes.rankNext.addEventListener('click', function () {
      if (index >= questions.length - 1) {
        /* Tell the phones to forget this game before reloading, so nobody
           rejoins the next round carrying the last round's identity. */
        players.forEach(function (p) { send(p, { t: 'over' }); });
        setTimeout(function () { location.reload(); }, 250);
        return;
      }
      askNext();
    });

    el('host-fullscreen').addEventListener('click', function () {
      if (document.fullscreenElement) { document.exitFullscreen(); }
      else if (hostRoot.requestFullscreen) { hostRoot.requestFullscreen(); }
    });

    /* Closing this tab ends the game for everyone, so make it deliberate. */
    window.addEventListener('beforeunload', function (e) {
      if (phase === 'idle') { return; }
      e.preventDefault();
      e.returnValue = '';
    });
  }

  /* =======================================================================
     THE PLAYER: a phone
     ======================================================================= */

  function startPlayer() {
    var conn = null;
    var peer = null;
    var code = null;
    var name = '';
    var token = '';
    var current = -1;
    var shownAt = 0;
    var countdown = null;
    var attempt = 0;
    var finished = false;

    var nodes = {
      form: el('play-form'),
      code: el('play-code'),
      name: el('play-name'),
      you: el('play-you'),
      prompt: el('play-prompt'),
      options: el('play-options'),
      clock: el('play-clock'),
      verdict: el('play-verdict'),
      detail: el('play-detail'),
      score: el('play-score'),
      rankTitle: el('play-rank-title'),
      rankLine: el('play-rank-line'),
      rankTop: el('play-rank-top'),
      errorText: el('play-error-text'),
      retryText: el('play-retry-text')
    };

    /* The phone remembers its own token for one room code, so that locking the
       screen, losing wifi in the stairwell or reloading the page all bring the
       same player back rather than creating a new one. This never leaves the
       phone. Storage can throw outright in a private window, so every touch is
       guarded and the game works without it — a reload then simply joins as
       somebody new. */
    function remember(key, value) {
      try { localStorage.setItem('crissouza-quiz-' + key, value); } catch (e) { /* fine */ }
    }
    function recall(key) {
      try { return localStorage.getItem('crissouza-quiz-' + key) || ''; } catch (e) { return ''; }
    }
    function forget(key) {
      try { localStorage.removeItem('crissouza-quiz-' + key); } catch (e) { /* fine */ }
    }

    function showPlay(id) {
      show(playRoot, id);
    }

    var fromUrl = (location.search.match(/[?&]r=([A-Za-z0-9]+)/) || [])[1];
    if (fromUrl) {
      nodes.code.value = fromUrl.toUpperCase();
      var saved = recall(nodes.code.value + '-name');
      if (saved) { nodes.name.value = saved; }
    }

    function fail(message) {
      nodes.errorText.textContent = message;
      showPlay('play-error');
    }

    nodes.form.addEventListener('submit', function (e) {
      e.preventDefault();
      code = nodes.code.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      name = cleanName(nodes.name.value);
      if (!code || !name) { return; }

      token = recall(code + '-token');
      if (!token) { token = makeToken(); remember(code + '-token', token); }
      remember(code + '-name', name);

      keepAwake();
      showPlay('play-connecting');
      dial();
    });

    /* Open a peer, find the host, and say hello. Everything that can go wrong
       between here and the host's lobby is temporary as far as this function
       is concerned: it waits and tries again rather than ending the student's
       game. Seventy phones dialing at the same moment is exactly the situation
       the broker is worst at, and the backoff is what gets them all in. */
    function dial() {
      if (finished) { return; }

      if (peer) {
        try { peer.destroy(); } catch (e) { /* already gone */ }
      }
      peer = new Peer(PEER_OPTIONS);

      peer.on('open', function () {
        conn = peer.connect(PEER_PREFIX + code, { reliable: true });

        conn.on('open', function () {
          attempt = 0;
          conn.send({ t: 'join', name: name, token: token });
        });
        conn.on('data', fromHost);
        conn.on('close', function () { retry('Reconnecting'); });
        conn.on('error', function () { retry('Reconnecting'); });

        /* A connection that never opens is as dead as one that closed, and it
           does not always raise an error. Give it a window, then redial. */
        setTimeout(function () {
          if (conn && !conn.open && !finished) { retry('Still trying to join'); }
        }, 12000);
      });

      peer.on('disconnected', function () {
        if (!finished) { retry('Reconnecting'); }
      });

      peer.on('error', function (err) {
        var type = err && err.type;
        if (type === 'peer-unavailable') {
          /* Either the code is wrong, or the host is momentarily off the
             broker. Both look identical from here, so try a few times before
             telling a student their code is bad. */
          if (attempt >= 4) {
            fail('No game is running under code ' + code +
                 '. Check the code on the screen, then reload this page.');
            return;
          }
          retry('Looking for the game');
          return;
        }
        retry('Reconnecting');
      });
    }

    function retry(label) {
      if (finished) { return; }
      if (attempt >= RETRY_GIVE_UP) {
        fail('Lost the connection to the game and could not get it back. Reload this page to rejoin with your score.');
        return;
      }
      if (nodes.retryText) { nodes.retryText.textContent = label + '…'; }
      showPlay('play-reconnecting');
      var wait = backoff(attempt);
      attempt += 1;
      setTimeout(dial, wait);
    }

    function fromHost(message) {
      if (!message || typeof message !== 'object') { return; }

      /* Answering the host's heartbeat is what keeps this phone counted as
         present, and keeps a silent channel from being closed underneath us. */
      if (message.t === 'ping') {
        if (conn && conn.open) { conn.send({ t: 'pong' }); }
        return;
      }

      if (message.t === 'ok') {
        nodes.you.textContent = message.name;
        /* Coming back mid-question: sit on the wait screen until the host
           sends the next thing, rather than flashing a stale question. */
        showPlay('play-wait');
        return;
      }

      /* Somebody else turned up with the same name, so this phone is now
         Sarah_B. Only the name changes — whatever screen the student is on
         stays put, because this can land in the middle of a question. */
      if (message.t === 'name') {
        nodes.you.textContent = message.name;
        return;
      }

      if (message.t === 'over') {
        finished = true;
        forget(code + '-token');
        return;
      }

      if (message.t === 'q') {
        current = message.i;
        shownAt = Date.now();
        nodes.prompt.textContent = message.prompt;
        clear(nodes.options);
        message.options.forEach(function (label, i) {
          var tile = optionTile(i, label, true);
          tile.addEventListener('click', function () { answer(i, tile); });
          nodes.options.appendChild(tile);
        });
        runClock(message.seconds);
        showPlay('play-question');
        return;
      }

      if (message.t === 'result') {
        stopClock();
        if (message.poll) {
          nodes.verdict.textContent = 'Thanks';
          nodes.verdict.className = 'quiz-play__big';
          nodes.detail.textContent = 'No points on this one.';
        } else if (!message.answered) {
          nodes.verdict.textContent = 'No answer';
          nodes.verdict.className = 'quiz-play__big is-bad';
          nodes.detail.textContent = 'The clock ran out.';
        } else if (message.correct) {
          nodes.verdict.textContent = 'Correct';
          nodes.verdict.className = 'quiz-play__big is-good';
          nodes.detail.textContent = '+' + message.gained + ' points';
        } else {
          nodes.verdict.textContent = 'Not this time';
          nodes.verdict.className = 'quiz-play__big is-bad';
          nodes.detail.textContent = 'The answer is on the big screen.';
        }
        nodes.score.textContent = message.score + ' points, ' +
          ordinal(message.rank) + ' of ' + message.of;
        showPlay('play-result');
        return;
      }

      if (message.t === 'rank') {
        nodes.rankTitle.textContent = message.last ? 'Final ranking' : message.section;
        nodes.rankLine.textContent = ordinal(message.rank) + ' of ' + message.of +
          ', ' + message.score + ' points';
        clear(nodes.rankTop);
        message.top.forEach(function (p, i) {
          nodes.rankTop.appendChild(rankRow(i + 1, p.name, p.score));
        });
        showPlay('play-rank');
      }
    }

    function answer(choice, tile) {
      if (!conn || !conn.open) { return; }
      var tiles = nodes.options.children;
      for (var i = 0; i < tiles.length; i += 1) { tiles[i].disabled = true; }
      tile.classList.add('is-picked');
      conn.send({ t: 'a', i: current, choice: choice, ms: Date.now() - shownAt });
      stopClock();
      showPlay('play-locked');
    }

    function runClock(secondsLeft) {
      stopClock();
      var ends = Date.now() + secondsLeft * 1000;
      function paint() {
        var left = Math.max(0, Math.ceil((ends - Date.now()) / 1000));
        nodes.clock.textContent = left + 's';
        if (left <= 0) { stopClock(); }
      }
      paint();
      countdown = setInterval(paint, 250);
    }

    function stopClock() {
      if (countdown) { clearInterval(countdown); countdown = null; }
    }

    function ordinal(n) {
      var rest = n % 100;
      if (rest >= 11 && rest <= 13) { return n + 'th'; }
      var suffix = ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
      return n + suffix;
    }
  }

  /* The vendored library defines Peer; without it neither surface can run. */
  if (typeof Peer === 'undefined') {
    var root = hostRoot || playRoot;
    var warning = root.querySelector('.quiz-screen');
    if (warning) { warning.textContent = 'The game could not load its connection library.'; }
    return;
  }

  if (hostRoot) { startHost(); }
  if (playRoot) { startPlayer(); }
}());
