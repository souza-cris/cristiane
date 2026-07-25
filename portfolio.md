---
layout: page
title: Portfolio
permalink: /portfolio/
---

## Background

Write a short introduction about yourself here.

## Experience

Describe your professional experience, education, or relevant background.

## Skills

List your key skills and areas of expertise.

## Contact

Feel free to reach out at [{{ site.email }}](mailto:{{ site.email }}).

{% capture resume_path %}{{ '/assets/files/resume.pdf' | relative_url }}{% endcapture %}
{% assign resume_file = site.static_files | where: 'path', '/assets/files/resume.pdf' | first %}
{% if resume_file %}
[Download my resume (PDF)]({{ resume_path }})
{% endif %}
