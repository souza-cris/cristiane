---
layout: page
title: "research"
permalink: /research/
---

<section class="research-section">
  <h2>research interests</h2>
  <p>{{ site.data.research.interests }}</p>
</section>

{% include study-callout.html variant="full" %}

<section class="research-section">
  <h2>publications</h2>
  {% for pub in site.data.research.publications %}
  <div class="publication">
    <p class="publication__title">{% if pub.link != "" %}<a href="{{ pub.link }}">{{ pub.title }}</a>{% else %}{{ pub.title }}{% endif %}</p>
    <p class="publication__authors">{{ pub.authors }}</p>
    {% if pub.venue != "" %}<p class="publication__venue">{{ pub.venue }}</p>{% endif %}
  </div>
  {% endfor %}
</section>
