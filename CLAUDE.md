# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Cristiane — a Jekyll static site hosted on GitHub Pages. Five sections: Home, Portfolio, Projects, Blog, and Curation. This is a **project repo** (not a user site), so `baseurl` is set to `/cristiane` in `_config.yml`.

## Build & Test

```bash
bundle install            # Install dependencies
bundle exec jekyll serve  # Local server at http://localhost:4000/cristiane/
```

Always test locally before pushing. The site deploys automatically via GitHub Pages on push to `main`.

## Architecture

- **Layouts** (`_layouts/`): `default.html` (base), `page.html`, `post.html`, `project.html`
- **Includes** (`_includes/`): `head.html`, `nav.html`, `footer.html`
- **Content**:
  - Blog posts: `_posts/YYYY-MM-DD-title.md` (Markdown with front matter)
  - Projects: `_projects/*.md` (Jekyll collection, each file = one project page)
  - Curation: `_data/curation.yml` (YAML, items grouped by category)
  - Pages: `index.md`, `blog.md`, `projects.md`, `portfolio.md`, `curation.md`, `404.md`
- **Config**: `_config.yml` holds site metadata, social links, collection settings
- **Styles**: Single file at `assets/css/style.css` (plain CSS, no preprocessor)

## Key Conventions

- All content lives in Markdown or YAML data files, never hardcoded in HTML templates.
- No JavaScript unless clearly justified. Mobile nav uses CSS-only `<details>`/`<summary>`.
- Only GitHub Pages-supported plugins. No custom build tools or npm.
- Use `| relative_url` filter for all internal links (required because of `baseurl`).
- Explain changes in plain language — the project owner is new to web development.

## Spec Kit

The `.specify/` directory contains Spec Kit configuration. Use slash commands (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`) for the feature workflow. Constitution at `.specify/memory/constitution.md`.
