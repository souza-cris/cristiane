---
layout: page
title: Curation
permalink: /curation/
---

Things I find valuable — articles, tools, books, and links worth sharing.

{% for group in site.data.curation %}
## {{ group.category }}

<ul>
  {% for item in group.items %}
  <li>
    <a href="{{ item.url }}" target="_blank" rel="noopener">{{ item.title }}</a>
    — {{ item.note }}
  </li>
  {% endfor %}
</ul>
{% endfor %}
