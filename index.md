---
layout: default
---

<section class="home">
  <img src="{{ site.photo | relative_url }}" alt="Photo of {{ site.title }}" class="home__photo">
  <h1>{{ site.title }}</h1>
  <p class="home__tagline">{{ site.description }}</p>

  <ul class="home__links">
    {% for link in site.social %}
    <li><a href="{{ link.url }}" target="_blank" rel="noopener">{{ link.label }}</a></li>
    {% endfor %}
  </ul>
</section>
