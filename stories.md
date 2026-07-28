---
layout: page
title: "stories"
permalink: /stories/
description: "Writing by Cris Souza on research, technology, and what actually happens when people and AI work together."
---

<div class="list-controls">
  {% include story-filters.html %}
  {% include search-box.html target=".story-list" label="search stories" %}
</div>

{% include story-list.html posts=site.posts empty="No stories yet. Check back soon!" %}
