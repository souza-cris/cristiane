/* ---------------------------------------------------------------------------
   The live review game behind /teaching/ (the screen at the front of the room)
   and /teaching/play/ (a student's phone).

   WHY THERE IS SCRIPT HERE AT ALL. The site's rule is no JavaScript without a
   clear reason, and the reason is that this page is a game: a room code, a
   countdown, twenty phones answering at once and a leaderboard between
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

   NOTHING IS STORED. Scores live in the host tab's memory until the tab is
   closed. No names, no answers and no scores are written anywhere, sent
   anywhere, or kept after the game.
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

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
  var MAX_NAME = 18;

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

  /* =======================================================================
     THE HOST: the screen at the front of the room
     ======================================================================= */

  function startHost() {
    var data = JSON.parse(el('quiz-data').textContent);
    var seconds = data.seconds_per_question || 20;

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

    var players = [];          // { conn, name, score, sectionScore, answer, ms }
    var peer = null;
    var code = null;
    var index = -1;            // which question is on screen
    var phase = 'idle';        // idle | asking | revealed
    var ticker = null;
    var deadline = 0;
    var askedAt = 0;

    var nodes = {
      code: el('host-code'),
      joinUrl: el('host-join-url'),
      qr: el('host-qr'),
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

    function live() {
      return players.filter(function (p) { return p.conn && p.conn.open; });
    }

    function send(player, message) {
      if (player.conn && player.conn.open) {
        try { player.conn.send(message); } catch (e) { /* a phone that left */ }
      }
    }

    function broadcast(message) {
      live().forEach(function (p) { send(p, message); });
    }

    function standings() {
      return players.slice().sort(function (a, b) {
        if (b.score !== a.score) { return b.score - a.score; }
        return a.name.localeCompare(b.name);
      });
    }

    /* ---- opening the room ---- */

    function openRoom() {
      code = makeCode();
      peer = new Peer(PEER_PREFIX + code, PEER_OPTIONS);

      peer.on('open', function () {
        var url = location.origin + el('quiz-host').dataset.playUrl + '?r=' + code;
        nodes.code.textContent = code;
        nodes.joinUrl.textContent = url.replace(/^https?:\/\//, '');
        drawQr(url);
        show(hostRoot, 'host-lobby');
      });

      peer.on('connection', function (conn) { welcome(conn); });

      peer.on('error', function (err) {
        /* A code already in use somewhere in the world: take another one. */
        if (err && err.type === 'unavailable-id') {
          peer.destroy();
          openRoom();
          return;
        }
        if (err && err.type === 'peer-unavailable') { return; }
        fail(err && err.message ? err.message : 'The connection failed.');
      });

      peer.on('disconnected', function () {
        if (phase !== 'idle') { peer.reconnect(); }
      });
    }

    function fail(message) {
      nodes.errorText.textContent = message;
      show(hostRoot, 'host-error');
    }

    function drawQr(url) {
      clear(nodes.qr);
      try {
        var qr = qrcode(0, 'M');
        qr.addData(url);
        qr.make();
        nodes.qr.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 1, scalable: true });
      } catch (e) {
        /* No QR is survivable: the code and the address are both on screen. */
        nodes.qr.textContent = '';
      }
    }

    /* ---- players arriving ---- */

    function welcome(conn) {
      conn.on('data', function (message) { fromPlayer(conn, message); });
      conn.on('close', function () { renderPlayers(); });
      conn.on('error', function () { renderPlayers(); });
    }

    function fromPlayer(conn, message) {
      if (!message || typeof message !== 'object') { return; }

      if (message.t === 'join') {
        var name = cleanName(message.name);
        if (!name) { name = 'Player'; }

        /* A phone that dropped and came back keeps the score it had. Matching
           is by name, which is also how a student would expect it to work. */
        var existing = null;
        players.forEach(function (p) {
          if (p.name.toLowerCase() === name.toLowerCase()) { existing = p; }
        });

        if (existing) {
          existing.conn = conn;
        } else {
          if (phase !== 'idle') {
            conn.send({ t: 'shut' });
            return;
          }
          players.push({
            conn: conn, name: name, score: 0, sectionScore: 0, answer: null, ms: 0
          });
        }

        conn.send({ t: 'ok', name: name });
        if (phase === 'asking') { sendQuestion(findPlayer(conn)); }
        renderPlayers();
        return;
      }

      if (message.t === 'a') {
        if (phase !== 'asking' || message.i !== index) { return; }
        var player = findPlayer(conn);
        if (!player || player.answer !== null) { return; }

        player.answer = message.choice;
        /* The phone reports how long it took from the moment the question
           appeared on it, which is fairer than timing it here: this end cannot
           tell a slow thinker from a slow connection. Clamped so a wrong clock
           cannot buy points. */
        player.ms = Math.max(0, Math.min(seconds * 1000, Number(message.ms) || 0));
        renderAnswered();

        if (allAnswered()) { finishQuestion(); }
      }
    }

    function findPlayer(conn) {
      var found = null;
      players.forEach(function (p) { if (p.conn === conn) { found = p; } });
      return found;
    }

    function allAnswered() {
      var waiting = live().filter(function (p) { return p.answer === null; });
      return live().length > 0 && waiting.length === 0;
    }

    function renderPlayers() {
      clear(nodes.players);
      players.forEach(function (p) {
        var chip = document.createElement('li');
        chip.className = 'quiz-player';
        chip.textContent = p.name;
        nodes.players.appendChild(chip);
      });
      nodes.count.textContent = players.length === 1 ? '1 player' : players.length + ' players';
      nodes.start.disabled = players.length === 0;
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

      askedAt = Date.now();
      deadline = askedAt + seconds * 1000;
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
      var done = live().filter(function (p) { return p.answer !== null; }).length;
      nodes.answered.textContent = done + ' of ' + live().length + ' answered';
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
        if (p.answer === null) { return; }
        tally[p.answer] += 1;
        if (q.isPoll) { p.lastGain = 0; return; }
        if (p.answer === q.answer) {
          /* Right is worth 600. Speed is worth up to 400 more, so knowing the
             answer always beats guessing quickly. */
          var speed = 1 - (p.ms / (seconds * 1000));
          p.lastGain = Math.round((600 + 400 * speed) / 10) * 10;
        } else {
          p.lastGain = 0;
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

      nodes.rankTitle.textContent = last ? 'Final ranking' : q.section + ' standings';
      nodes.rankSub.textContent = last
        ? 'Where everyone finished'
        : 'Points so far, with this section in green';

      clear(nodes.rankList);
      /* Every section shows a top ten, which is what fits on a projector. The
         last one shows the whole room, because that is the result everybody
         wants to find themselves in. */
      (last ? order : order.slice(0, 10)).forEach(function (p, i) {
        var row = document.createElement('li');
        row.className = 'quiz-rank__row';

        var pos = document.createElement('span');
        pos.className = 'quiz-rank__pos';
        pos.textContent = (i + 1) + '.';
        row.appendChild(pos);

        var name = document.createElement('span');
        name.className = 'quiz-rank__name';
        name.textContent = p.name;
        row.appendChild(name);

        if (!last) {
          var gain = document.createElement('span');
          gain.className = 'quiz-rank__gain' + (p.sectionScore === 0 ? ' is-zero' : '');
          gain.textContent = '+' + p.sectionScore;
          row.appendChild(gain);
        }

        var score = document.createElement('span');
        score.className = 'quiz-rank__score';
        score.textContent = p.score;
        row.appendChild(score);

        nodes.rankList.appendChild(row);
      });

      var top = order.slice(0, 3).map(function (p) {
        return { name: p.name, score: p.score };
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
      openRoom();
    });

    nodes.start.addEventListener('click', function () { askNext(); });
    nodes.next.addEventListener('click', function () { afterQuestion(); });
    nodes.rankNext.addEventListener('click', function () {
      if (index >= questions.length - 1) { location.reload(); return; }
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
    var current = -1;
    var shownAt = 0;
    var countdown = null;

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
      errorText: el('play-error-text')
    };

    var fromUrl = (location.search.match(/[?&]r=([A-Za-z0-9]+)/) || [])[1];
    if (fromUrl) { nodes.code.value = fromUrl.toUpperCase(); }

    function fail(message) {
      nodes.errorText.textContent = message;
      show(playRoot, 'play-error');
    }

    nodes.form.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = nodes.code.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      var name = cleanName(nodes.name.value);
      if (!code || !name) { return; }

      show(playRoot, 'play-connecting');
      peer = new Peer(PEER_OPTIONS);

      peer.on('open', function () {
        conn = peer.connect(PEER_PREFIX + code, { reliable: true });
        conn.on('open', function () { conn.send({ t: 'join', name: name }); });
        conn.on('data', fromHost);
        conn.on('close', function () {
          fail('The connection to the game closed. Reload this page to rejoin with the same name and keep your score.');
        });
      });

      peer.on('error', function (err) {
        if (err && err.type === 'peer-unavailable') {
          fail('No game is running under code ' + code + '. Check the code on the screen.');
          return;
        }
        fail('Could not reach the game. Check your connection and try again.');
      });
    });

    function fromHost(message) {
      if (!message || typeof message !== 'object') { return; }

      if (message.t === 'ok') {
        nodes.you.textContent = message.name;
        show(playRoot, 'play-wait');
        return;
      }

      if (message.t === 'shut') {
        fail('That game has already started, so it is not taking new players.');
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
        show(playRoot, 'play-question');
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
        show(playRoot, 'play-result');
        return;
      }

      if (message.t === 'rank') {
        nodes.rankTitle.textContent = message.last ? 'Final ranking' : message.section;
        nodes.rankLine.textContent = ordinal(message.rank) + ' of ' + message.of +
          ', ' + message.score + ' points';
        clear(nodes.rankTop);
        message.top.forEach(function (p, i) {
          var row = document.createElement('li');
          row.className = 'quiz-rank__row';

          var pos = document.createElement('span');
          pos.className = 'quiz-rank__pos';
          pos.textContent = (i + 1) + '.';
          row.appendChild(pos);

          var name = document.createElement('span');
          name.className = 'quiz-rank__name';
          name.textContent = p.name;
          row.appendChild(name);

          var score = document.createElement('span');
          score.className = 'quiz-rank__score';
          score.textContent = p.score;
          row.appendChild(score);

          nodes.rankTop.appendChild(row);
        });
        show(playRoot, 'play-rank');
      }
    }

    function answer(choice, tile) {
      if (!conn || !conn.open) { return; }
      var tiles = nodes.options.children;
      for (var i = 0; i < tiles.length; i += 1) { tiles[i].disabled = true; }
      tile.classList.add('is-picked');
      conn.send({ t: 'a', i: current, choice: choice, ms: Date.now() - shownAt });
      stopClock();
      show(playRoot, 'play-locked');
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
