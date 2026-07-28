---
layout: page
title: "papers"
permalink: /bookmarks/paper/
type: paper
---

<div class="list-controls">
  {% include bookmark-filters.html %}
  {% include search-box.html target=".bookmark-list" label="search bookmarks" %}
</div>

{% assign filtered = site.data.bookmarks | where: "type", "paper" | sort: "addedDate" | reverse %}
{% include bookmark-list.html items=filtered empty="No papers yet." %}
