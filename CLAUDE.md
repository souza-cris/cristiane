# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Cristiane — a Jekyll static site hosted on GitHub Pages. Sections: Home, Journey, Stories, Research, Bookmarks, Contact. This is a **project repo** (not a user site), so `baseurl` is set to `/cristiane` in `_config.yml`.

## Build & Test

```bash
bundle install            # Install dependencies
bundle exec jekyll serve  # Local server at http://localhost:4000/cristiane/
bundle exec jekyll build  # Build only — use this to check for Liquid errors
```

Always test locally before pushing. Pushing to `main` triggers `.github/workflows/pages.yml`, which builds and deploys.

`Gemfile.lock` is committed. A build failing with `undefined method 'tainted?'` means `liquid` is older than 4.0.4 — run `bundle update liquid`.

## Architecture

- **Layouts** (`_layouts/`): `default.html` (base), `page.html`, `story.html`
- **Includes** (`_includes/`):
  - `head.html`, `nav.html`, `footer.html`
  - `story-filters.html`, `story-list.html` — shared by `stories.md` and every page in `stories/`
  - `bookmark-filters.html`, `bookmark-list.html` — shared by `bookmarks.md` and every page in `bookmarks/`
  - `search-box.html` — the search input, plus the `<script>` tag that loads `search.js`
  - `journey-timeline.html` — the horizontal journey track
- **Content**:
  - Stories: `_posts/YYYY-MM-DD-title.md`, front matter carries `keywords` (a list) and `tldr`
  - Journey: `_data/journey.yml`
  - Bookmarks: `_data/bookmarks.yml`, filter slugs in `_data/bookmark_types.yml`
  - Story filters: `_data/story_keywords.yml`
  - Research: `_data/research.yml`
  - Pages: `index.md`, `journey.md`, `stories.md`, `research.md`, `bookmarks.md`, `contact.md`, `404.md`
  - Filter pages: `stories/*.md` and `bookmarks/*.md` — thin wrappers over the shared includes
- **Config**: `_config.yml` holds site metadata, social links, and the post permalink (`/stories/:year/:month/:day/:title/`)
- **Styles**: Single file at `assets/css/style.css` (plain CSS, no preprocessor)
- **Scripts**: `assets/js/search.js` — the only JavaScript on the site

## Key Conventions

- All content lives in Markdown or YAML data files, never hardcoded in HTML templates. If you find yourself pasting the same markup into several pages, extract an include driven by a data file.
- No JavaScript unless clearly justified, and any exception must be recorded in the relevant spec. Mobile nav is CSS-only `<details>`/`<summary>`; the list search is the one script, justified in `specs/004-journey-and-search/plan.md`.
- Only GitHub Pages-supported plugins. No custom build tools or npm. This is why filter pages are written by hand rather than generated from data.
- Use `| relative_url` filter for all internal links (required because of `baseurl`).
- Images are committed to the repo and sized for the web — never hotlink an external host, and resize large originals before committing.
- The journey page deliberately shows no years.
- Explain changes in plain language — the project owner is new to web development.

## Spec Kit

The `.specify/` directory contains Spec Kit configuration. Use slash commands (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`) for the feature workflow. Constitution at `.specify/memory/constitution.md`; features documented under `specs/`.
