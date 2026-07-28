---
layout: page
title: "more bookmarks"
permalink: /bookmarks/more/
type: more
---

<div class="list-controls">
  {% include bookmark-filters.html %}
  {% include search-box.html target=".bookmark-list" label="search bookmarks" %}
</div>

{% assign filtered = site.data.bookmarks | where: "type", "more" | sort: "addedDate" | reverse %}
{% include bookmark-list.html items=filtered empty="No items yet." %}
