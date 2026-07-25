---
layout: page
title: "bookmarks"
permalink: /bookmarks/talk/
---

<ul class="filter-pills">
  <li><a href="{{ '/bookmarks' | relative_url }}">all</a></li>
  <li><a href="{{ '/bookmarks/paper' | relative_url }}">paper</a></li>
  <li><a href="{{ '/bookmarks/book' | relative_url }}">book</a></li>
  <li><a href="{{ '/bookmarks/talk' | relative_url }}" aria-current="page">talk</a></li>
  <li><a href="{{ '/bookmarks/tool' | relative_url }}">tool</a></li>
  <li><a href="{{ '/bookmarks/dataset' | relative_url }}">dataset</a></li>
  <li><a href="{{ '/bookmarks/more' | relative_url }}">more</a></li>
</ul>

{% assign filtered = site.data.bookmarks | where: "type", "talk" | sort: "addedDate" | reverse %}
{% if filtered.size == 0 %}
<p class="empty-state">No talks yet.</p>
{% else %}
<ul class="bookmark-list">
  {% for item in filtered %}
  <li class="bookmark-item">
    <div class="bookmark-item__header">
      <h3><a href="{{ item.link }}" target="_blank" rel="noopener">{{ item.title }}</a></h3>
      <span class="bookmark-item__type">{{ item.type }}</span>
    </div>
    {% if item.topicTags.size > 0 %}
    <ul class="bookmark-item__tags">
      {% for tag in item.topicTags %}<li>{{ tag }}</li>{% endfor %}
    </ul>
    {% endif %}
    <p class="bookmark-item__why">{{ item.whyItMatters }}</p>
    <p class="bookmark-item__takeaway">{{ item.keyTakeaway }}</p>
  </li>
  {% endfor %}
</ul>
{% endif %}
