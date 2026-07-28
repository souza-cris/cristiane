---
layout: page
title: "journey"
permalink: /journey/
description: "Two decades from project management to a PhD: four countries, seven companies, and the path from industry into information systems research."
---

<div class="profile">
  <img class="profile-photo" src="{{ '/assets/img/cris.jpg' | relative_url }}" width="800" height="1200" alt="Cris Souza">
  <p class="profile-intro">Currently in Tuscaloosa, AL as a <strong class="highlight">Ph.D. student</strong> in MIS, <strong class="highlight">teaching assistant</strong>, and a <strong class="highlight">researcher</strong> at the University of Alabama.</p>
</div>

<p class="journey__tagline">from industry to academia. continuously improving.</p>

<p class="journey__throughline">Project management, transformation, agile, information systems development. Four countries, seven companies, industries from packaging to banking. Over a decade leading teams and leaders. A bachelor's, an MBA, a master's, and now a PhD. Why take a career off the shelf when I can build my own?</p>

{% comment %}
  The country count is derived from the distinct flags in the milestone data,
  so adding or removing a milestone keeps this sentence honest. Never type the
  number by hand.
{% endcomment %}
{% assign countries = site.data.journey | map: "flag" | uniq %}
<p class="journey__geography">{{ countries.size }} countries · {{ countries | join: " " }} · select any stop to read more</p>

<ul class="timeline-legend">
  <li class="timeline-legend__item timeline-legend__item--academia">academia</li>
  <li class="timeline-legend__item timeline-legend__item--industry">industry</li>
  <li class="timeline-legend__scroll">scroll →</li>
</ul>

{% include journey-timeline.html %}
