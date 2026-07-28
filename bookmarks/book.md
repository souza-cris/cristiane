---
layout: page
title: "books"
permalink: /bookmarks/book/
type: book
---

<div class="list-controls">
  {% include bookmark-filters.html %}
  {% include search-box.html target=".bookmark-list" label="search bookmarks" %}
</div>

{% assign filtered = site.data.bookmarks | where: "type", "book" | sort: "addedDate" | reverse %}
{% include bookmark-list.html items=filtered empty="No books yet." %}
