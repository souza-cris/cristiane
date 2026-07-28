---
layout: page
title: "projects"
permalink: /bookmarks/project/
type: project
---

<div class="list-controls">
  {% include bookmark-filters.html %}
  {% include search-box.html target=".bookmark-list" label="search bookmarks" %}
</div>

{% assign filtered = site.data.bookmarks | where: "type", "project" | sort: "addedDate" | reverse %}
{% include bookmark-list.html items=filtered empty="No projects yet." %}
