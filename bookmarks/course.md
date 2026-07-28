---
layout: page
title: "courses"
permalink: /bookmarks/course/
type: course
---

<div class="list-controls">
  {% include bookmark-filters.html %}
  {% include search-box.html target=".bookmark-list" label="search bookmarks" %}
</div>

{% assign filtered = site.data.bookmarks | where: "type", "course" | sort: "addedDate" | reverse %}
{% include bookmark-list.html items=filtered empty="No courses yet." %}
