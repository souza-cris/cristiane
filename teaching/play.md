---
layout: page
title: "join the game"
permalink: /teaching/play/
description: "Join the live MIS200-322 review game. Enter the game code shown on the screen and play from your phone."
---

{%- comment -%}
  THE PHONE. This is the page the QR code points at.

  It deliberately contains no questions and no answer key. Everything it shows
  arrives over the connection from the host screen while the game is running, so
  a student who reads the source of this page finds nothing to read.
{%- endcomment -%}

<link rel="stylesheet" href="{{ '/assets/css/quiz.css' | relative_url }}">

<div class="quiz quiz-play" id="quiz-play">

  <section class="quiz-screen quiz-play__screen" id="play-start">
    <form class="quiz-form" id="play-form">
      <label class="quiz-sr" for="play-code">Game code</label>
      <input class="quiz-input" id="play-code" name="code" type="text" inputmode="latin"
             autocomplete="off" autocapitalize="characters" spellcheck="false"
             maxlength="6" placeholder="Game code" required>

      {%- comment -%}
        The name field asks for a player name rather than a real one. It is
        what goes up on the projector, so a handful of examples does two jobs:
        it tells students the leaderboard is public, and it gets better names
        than twenty variations of "asdf". The hint is a real <label>, tied to
        the input by aria-describedby, so it is read out rather than being
        decoration a screen reader skips.
      {%- endcomment -%}
      <label class="quiz-sr" for="play-name">Player name</label>
      <input class="quiz-input" id="play-name" name="name" type="text"
             autocomplete="off" maxlength="18" placeholder="Player name"
             aria-describedby="play-name-hint" required>
      <p class="quiz-hint-inline" id="play-name-hint">
        Pick something you will spot on the big screen —
        <strong>Katniss</strong>, <strong>Grogu</strong>,
        <strong>Shrek</strong>, <strong>Wednesday</strong>.
      </p>

      <button type="submit" class="quiz-btn quiz-btn--primary">Join</button>
    </form>
    <p class="quiz-note">The code is on the screen at the front of the room.</p>
  </section>

  <section class="quiz-screen quiz-play__screen" id="play-connecting" hidden aria-live="polite">
    <p class="quiz-play__big">Joining</p>
  </section>

  {%- comment -%}
    Dropping out is normal across a seventy-five minute class: a phone locks, a
    student walks behind a pillar, the wifi hiccups. The script reconnects by
    itself and this is what it shows while it does, so a wobble reads as a
    wobble rather than as the end of the student's game. Their score is held on
    the host and comes back with them.
  {%- endcomment -%}
  <section class="quiz-screen quiz-play__screen" id="play-reconnecting" hidden aria-live="polite">
    <p class="quiz-play__big" id="play-retry-text">Reconnecting…</p>
    <p class="quiz-play__note">Keep this page open. Your score is safe.</p>
  </section>

  <section class="quiz-screen quiz-play__screen" id="play-wait" hidden aria-live="polite">
    <p class="quiz-play__big" id="play-you"></p>
    <p class="quiz-play__note">You are in. Watch the big screen.</p>
  </section>

  <section class="quiz-screen quiz-play__screen" id="play-question" hidden>
    <p class="quiz-play__note" id="play-clock" aria-live="off"></p>
    <p id="play-prompt"></p>
    <div class="quiz-options" id="play-options"></div>
  </section>

  <section class="quiz-screen quiz-play__screen" id="play-locked" hidden aria-live="polite">
    <p class="quiz-play__big">Answer in</p>
    <p class="quiz-play__note">Waiting for everyone else.</p>
  </section>

  <section class="quiz-screen quiz-play__screen" id="play-result" hidden aria-live="polite">
    <p class="quiz-play__big" id="play-verdict"></p>
    <p class="quiz-play__note" id="play-detail"></p>
    <p class="quiz-play__score" id="play-score"></p>
  </section>

  <section class="quiz-screen quiz-play__screen" id="play-rank" hidden aria-live="polite">
    <p class="quiz-play__big" id="play-rank-title"></p>
    <p class="quiz-play__score" id="play-rank-line"></p>
    <ol class="quiz-rank__list" id="play-rank-top"></ol>
  </section>

  <section class="quiz-screen quiz-play__screen quiz-error" id="play-error" hidden aria-live="polite">
    <p class="quiz-error__title">Not connected</p>
    <p id="play-error-text"></p>
  </section>

</div>

<noscript>
  <p class="quiz-error">This page needs JavaScript to join the game.</p>
</noscript>

<script src="{{ '/assets/js/vendor/peerjs.min.js' | relative_url }}"></script>
<script src="{{ '/assets/js/quiz.js' | relative_url }}"></script>
