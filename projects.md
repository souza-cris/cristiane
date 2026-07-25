---
layout: page
title: Projects
permalink: /projects/
---

{% assign sorted_projects = site.projects | sort: 'date' | reverse %}
{% if sorted_projects.size > 0 %}
<ul class="project-list">
  {% for project in sorted_projects %}
  <li class="project-list__item">
    <h2><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h2>
    <p>{{ project.description }}</p>
  </li>
  {% endfor %}
</ul>
{% else %}
<p>No projects yet — check back soon!</p>
{% endif %}
