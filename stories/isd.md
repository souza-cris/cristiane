---
layout: page
title: "information systems stories"
permalink: /stories/isd/
keyword: isd
---

<div class="list-controls">
  {% include story-filters.html %}
  {% include search-box.html target=".story-list" label="search stories" %}
</div>

{% assign filtered = site.posts | where_exp: "post", "post.keywords contains page.keyword" %}
{% include story-list.html posts=filtered empty="No ISD stories yet." %}
