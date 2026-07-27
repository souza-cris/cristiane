---
layout: page
title: "bookmarks"
permalink: /bookmarks/report/
type: report
---

<div class="list-controls">
  {% include bookmark-filters.html %}
  {% include search-box.html target=".bookmark-list" label="search bookmarks" %}
</div>

{% assign filtered = site.data.bookmarks | where: "type", "report" | sort: "addedDate" | reverse %}
{% include bookmark-list.html items=filtered empty="No reports yet." %}
