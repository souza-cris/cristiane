---
layout: page
title: "publications"
permalink: /publications/
description: "Publications by Cris Souza on human-AI collaboration, the human side of information security, and how people adopt technology, each with a short summary."
---

{% include study-callout.html variant="full" %}

<section class="research-section">
  {% for pub in site.data.research.publications %}
  <div class="publication">
    <p class="publication__title">{% if pub.link != "" %}<a href="{{ pub.link }}">{{ pub.title }}</a>{% else %}{{ pub.title }}{% endif %}</p>
    <p class="publication__authors">{{ pub.authors }}</p>
    {% if pub.venue != "" %}<p class="publication__venue">{{ pub.venue }}</p>{% endif %}
    {% if pub.summary and pub.summary != "" %}<p class="publication__summary">{{ pub.summary }}</p>{% endif %}
    {% if pub.tag %}<p class="publication__tag">{{ pub.tag }}</p>{% endif %}
  </div>
  {% endfor %}
</section>
