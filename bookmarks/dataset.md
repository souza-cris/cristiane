---
layout: page
title: "datasets"
permalink: /bookmarks/dataset/
type: dataset
---

<div class="list-controls">
  {% include bookmark-filters.html %}
  {% include search-box.html target=".bookmark-list" label="search bookmarks" %}
</div>

{% assign filtered = site.data.bookmarks | where: "type", "dataset" | sort: "addedDate" | reverse %}
{% include bookmark-list.html items=filtered empty="No datasets yet." %}
