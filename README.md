# Cristiane

Personal website built with [Jekyll](https://jekyllrb.com) and hosted on [GitHub Pages](https://pages.github.com).

## Run locally

You need Ruby (3.1–3.3 recommended) and Bundler installed.

```bash
bundle install
bundle exec jekyll serve
```

Open [http://localhost:4000/cristiane/](http://localhost:4000/cristiane/) in your browser.

> **Note:** Jekyll 4.4 does not yet support Ruby 4.0. Use Ruby 3.3 for local development. The GitHub Actions workflow uses Ruby 3.3 automatically.

## Deploy to GitHub Pages

The site deploys automatically via GitHub Actions when you push to `main`.

1. Go to **Settings → Pages** in your GitHub repo.
2. Under **Source**, select **GitHub Actions**.
3. Push to `main` — the workflow builds and deploys the site.

The site will be available at `https://<username>.github.io/cristiane/`.

## Adding content

### Blog post

Create a file in `_posts/` named `YYYY-MM-DD-title.md`:

```markdown
---
layout: post
title: "Your Post Title"
date: 2026-07-25
---

Write your post here in Markdown.
```

### Project

Create a file in `_projects/`:

```markdown
---
layout: project
title: "Project Name"
description: "Short description"
date: 2026-07-25
tools:
  - Tool 1
  - Tool 2
links:
  - label: "GitHub"
    url: "https://github.com/..."
---

Detailed project write-up here.
```

### Curation item

Edit `_data/curation.yml` and add an entry under a category:

```yaml
- category: "Category Name"
  items:
    - title: "Item Title"
      url: "https://example.com"
      note: "Why you recommend it"
```

## Structure

```
_config.yml          # Site settings, profile links
_layouts/            # Page templates (default, page, post, project)
_includes/           # Shared partials (nav, footer, head)
_posts/              # Blog posts (Markdown)
_projects/           # Project pages (Markdown)
_data/curation.yml   # Curation items (YAML)
assets/css/style.css # Styles
assets/images/       # Images (profile photo, project screenshots)
assets/files/        # Downloadable files (resume PDF)
.github/workflows/   # GitHub Actions deploy workflow
```
