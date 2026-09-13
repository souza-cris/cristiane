---
layout: page
title: "teaching"
permalink: /teaching/
description: "A live review game for MIS200-322. Students join from their phones with a QR code, answer on a timer, and the ranking is shown after every section."
---

{%- comment -%}
  THE HOST SCREEN. This is the page projected at the front of the room: it opens
  the room, shows the code and the QR, runs the clock and keeps the scores.

  The student's phone gets /teaching/play/ instead, which is a separate page on
  purpose: the answer key is in the JSON below, and the page students are sent
  to does not carry it. The phone is told a question and told whether it was
  right; it never sees the key.

  The questions themselves are in _data/quiz_mis200_unit1.yml. Edit them there,
  not here.
{%- endcomment -%}

<link rel="stylesheet" href="{{ '/assets/css/quiz.css' | relative_url }}">

<script type="application/json" id="quiz-data">{{ site.data.quiz_mis200_unit1 | jsonify }}</script>

<div class="quiz quiz-host" id="quiz-host" data-play-url="{{ '/teaching/play/' | relative_url }}">
  <div class="quiz-host__inner">

    <div class="quiz-bar">
      <span class="quiz-bar__label">{{ site.data.quiz_mis200_unit1.course }} review game</span>
      <button type="button" class="quiz-btn quiz-btn--quiet" id="host-fullscreen">Full screen</button>
    </div>

    <section class="quiz-screen" id="host-intro" aria-live="polite">
      <h2>{{ site.data.quiz_mis200_unit1.title }}</h2>
      <p class="quiz-note">
        {{ site.data.quiz_mis200_unit1.sections | size }} sections,
        {% assign total = 0 %}{% for s in site.data.quiz_mis200_unit1.sections %}{% assign total = total | plus: s.questions.size %}{% endfor %}{{ total }} questions,
        {{ site.data.quiz_mis200_unit1.seconds_per_question }} seconds each. Faster correct answers score more.
        The ranking is shown after every section.
      </p>
      <p class="quiz-note">
        Open the room, put this screen on the projector, and have everyone scan
        the code. Keep this tab open: it is running the game, and closing it
        ends it for everyone.
      </p>
      <p><button type="button" class="quiz-btn quiz-btn--primary" id="host-open">Open the room</button></p>
    </section>

    <section class="quiz-screen" id="host-connecting" hidden aria-live="polite">
      <p class="quiz-play__big" id="host-status">Opening the room</p>
    </section>

    <section class="quiz-screen" id="host-lobby" hidden>
      <div class="quiz-lobby">
        <div>
          <p class="quiz-join__step">Scan the code, or go to</p>
          <p class="quiz-join__url" id="host-join-url"></p>
          <p class="quiz-join__step">and enter the game code</p>
          <p class="quiz-code" id="host-code"></p>
        </div>
        <div class="quiz-qr" id="host-qr" role="img" aria-label="QR code to join the game"></div>
      </div>

      <div class="quiz-bar">
        <span class="quiz-bar__label" id="host-player-count" aria-live="polite">0 players</span>
        <button type="button" class="quiz-btn quiz-btn--primary" id="host-start" disabled>Start the game</button>
      </div>

      <ul class="quiz-players" id="host-players"></ul>
    </section>

    <section class="quiz-screen" id="host-question" hidden>
      <p class="quiz-q__meta">
        <span id="host-section"></span>
        <span id="host-position"></span>
      </p>
      <h2 class="quiz-q__prompt" id="host-prompt"></h2>
      <div class="quiz-timer"><div class="quiz-timer__fill" id="host-timer-fill"></div></div>
      <p class="quiz-counts">
        <span id="host-answered" aria-live="polite"></span>
        <span id="host-timer-text"></span>
      </p>
      <div class="quiz-options" id="host-options"></div>
      <p class="quiz-hint" id="host-hint" hidden></p>
      <p><button type="button" class="quiz-btn quiz-btn--primary" id="host-next" hidden>Next question</button></p>
    </section>

    <section class="quiz-screen" id="host-rank" hidden>
      <h2 class="quiz-rank__title" id="host-rank-title"></h2>
      <p class="quiz-rank__sub" id="host-rank-sub"></p>
      <ol class="quiz-rank__list" id="host-rank-list"></ol>
      <p><button type="button" class="quiz-btn quiz-btn--primary" id="host-rank-next">Next section</button></p>
    </section>

    <section class="quiz-screen quiz-error" id="host-error" hidden>
      <p class="quiz-error__title">The room could not open</p>
      <p id="host-error-text"></p>
      <p class="quiz-note">
        Reload the page to try again. If it keeps failing, the network is
        probably blocking the connection the game needs.
      </p>
    </section>

  </div>
</div>

<noscript>
  <p class="quiz-error">This game needs JavaScript. Without it there is nothing on this page to play.</p>
</noscript>

<script src="{{ '/assets/js/vendor/peerjs.min.js' | relative_url }}"></script>
<script src="{{ '/assets/js/vendor/qrcode.min.js' | relative_url }}"></script>
<script src="{{ '/assets/js/quiz.js' | relative_url }}"></script>
