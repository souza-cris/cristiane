---
layout: default
---

<section class="hero">
  <p class="hero__eyebrow">Hello, my name is</p>
  <h1 class="hero__headline">Cris</h1>
  <p class="hero__subheadline">PhD student - researcher - tech leader - traveler - cat lady</p>

  <!-- Home carries no top menu, so these ARE its navigation. Same list as every
       other page, from _data/sections.yml — never write the sections out here. -->
  <nav class="hero__nav" aria-label="Sections">
    {% include section-links.html class="hero__ctas" %}
  </nav>
</section>

{% include updates-widget.html %}
