---
layout: page
title: "bookmarks"
permalink: /bookmarks/
---

<div class="list-controls">
  {% include bookmark-filters.html %}
  {% include search-box.html target=".bookmark-list" label="search bookmarks" %}
</div>

{% assign sorted_bookmarks = site.data.bookmarks | sort: "addedDate" | reverse %}
{% include bookmark-list.html items=sorted_bookmarks empty="No bookmarks yet. Check back soon!" %}
