---
layout: page
title: "bookmarks"
permalink: /bookmarks/
description: "Papers, reports, tools and courses Cris Souza has found worth keeping, each with a note on why it matters and what to take from it."
---

<div class="list-controls">
  {% include bookmark-filters.html %}
  {% include search-box.html target=".bookmark-list" label="search bookmarks" %}
</div>

{% assign sorted_bookmarks = site.data.bookmarks | sort: "addedDate" | reverse %}
{% include bookmark-list.html items=sorted_bookmarks empty="No bookmarks yet. Check back soon!" %}
