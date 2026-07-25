---
layout: page
title: "research"
permalink: /research/
---

<section class="research-section">
  <h2>research interests</h2>
  <ul>
    {% for interest in site.data.research.interests %}
    <li>{{ interest }}</li>
    {% endfor %}
  </ul>
</section>

<section class="research-section">
  <h2>publications</h2>
  {% assign published = site.data.research.publications | where: "status", "published" %}
  {% assign in_progress = site.data.research.publications | where: "status", "in progress" %}
  {% assign under_review = site.data.research.publications | where: "status", "under review" %}

  {% if published.size > 0 %}
  <div class="publication-group">
    <h3>published</h3>
    {% for pub in published %}
    <div class="publication">
      <p class="publication__title">{% if pub.link != "" %}<a href="{{ pub.link }}">{{ pub.title }}</a>{% else %}{{ pub.title }}{% endif %}</p>
      <p class="publication__authors">{{ pub.authors }}</p>
      {% if pub.venue != "" %}<p class="publication__venue">{{ pub.venue }} ({{ pub.year }})</p>{% endif %}
    </div>
    {% endfor %}
  </div>
  {% endif %}

  {% if in_progress.size > 0 %}
  <div class="publication-group">
    <h3>in progress</h3>
    {% for pub in in_progress %}
    <div class="publication">
      <p class="publication__title">{% if pub.link != "" %}<a href="{{ pub.link }}">{{ pub.title }}</a>{% else %}{{ pub.title }}{% endif %}</p>
      <p class="publication__authors">{{ pub.authors }}</p>
      {% if pub.venue != "" %}<p class="publication__venue">{{ pub.venue }} ({{ pub.year }})</p>{% endif %}
    </div>
    {% endfor %}
  </div>
  {% endif %}

  {% if under_review.size > 0 %}
  <div class="publication-group">
    <h3>under review</h3>
    {% for pub in under_review %}
    <div class="publication">
      <p class="publication__title">{% if pub.link != "" %}<a href="{{ pub.link }}">{{ pub.title }}</a>{% else %}{{ pub.title }}{% endif %}</p>
      <p class="publication__authors">{{ pub.authors }}</p>
      {% if pub.venue != "" %}<p class="publication__venue">{{ pub.venue }} ({{ pub.year }})</p>{% endif %}
    </div>
    {% endfor %}
  </div>
  {% endif %}
</section>

<section class="research-section">
  <h2>methods & tools</h2>
  <ul>
    {% for method in site.data.research.methods %}
    <li>{{ method }}</li>
    {% endfor %}
  </ul>
</section>
