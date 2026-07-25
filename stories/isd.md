---
layout: page
title: "stories"
permalink: /stories/isd/
---

<ul class="filter-pills">
  <li><a href="{{ '/stories' | relative_url }}">all</a></li>
  <li><a href="{{ '/stories/short' | relative_url }}">short</a></li>
  <li><a href="{{ '/stories/long' | relative_url }}">long</a></li>
  <li><a href="{{ '/stories/ai' | relative_url }}">AI</a></li>
  <li><a href="{{ '/stories/leadership' | relative_url }}">Leadership</a></li>
  <li><a href="{{ '/stories/conference' | relative_url }}">Conference</a></li>
  <li><a href="{{ '/stories/isd' | relative_url }}" aria-current="page">ISD</a></li>
</ul>

{% assign filtered = site.posts | where: "category", "ISD" %}
{% if filtered.size == 0 %}
<p class="empty-state">No ISD stories yet.</p>
{% else %}
<ul class="story-list">
  {% for post in filtered %}
  <li class="story-item">
    <div class="story-item__meta">
      <time class="story-item__date" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
      {% if post.category %}<span class="story-item__category">{{ post.category }}</span>{% endif %}
    </div>
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    {% if post.tags.size > 0 %}
    <ul class="story-item__tags">
      {% for tag in post.tags %}<li>{{ tag }}</li>{% endfor %}
    </ul>
    {% endif %}
    {% if post.tldr %}<p class="story-item__tldr">{{ post.tldr }}</p>{% endif %}
  </li>
  {% endfor %}
</ul>
{% endif %}
