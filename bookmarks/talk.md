---
layout: page
title: "talks"
permalink: /bookmarks/talk/
type: talk
---

<div class="list-controls">
  {% include bookmark-filters.html %}
  {% include search-box.html target=".bookmark-list" label="search bookmarks" %}
</div>

{% assign filtered = site.data.bookmarks | where: "type", "talk" | sort: "addedDate" | reverse %}
{% include bookmark-list.html items=filtered empty="No talks yet." %}
