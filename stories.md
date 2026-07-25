---
layout: page
title: "stories"
permalink: /stories/
---

<div class="list-controls">
  {% include story-filters.html %}
  {% include search-box.html target=".story-list" label="search stories" %}
</div>

{% include story-list.html posts=site.posts empty="No stories yet. Check back soon!" %}
