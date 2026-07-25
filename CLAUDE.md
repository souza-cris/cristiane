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
  - `side-nav.html` — the vertical section menu. Unlike `study-callout.html` it
    does NOT self-gate: `default.html` decides which pages get it, because
    "not on home" is a layout decision, not a property of the component.
    Its link list duplicates `nav.html` on purpose — see spec 008
  - `head.html`, `nav.html`, `footer.html`
  - `story-filters.html`, `story-list.html` — shared by `stories.md` and every page in `stories/`
  - `bookmark-filters.html`, `bookmark-list.html` — shared by `bookmarks.md` and every page in `bookmarks/`
  - `search-box.html` — the search input, plus the `<script>` tag that loads `search.js`
  - `study-callout.html` — the call for participants. Self-gating: renders
    nothing when the study is inactive or absent, so callers need no condition
  - `journey-timeline.html` — the journey track. Each stop is a native
    `<details name="journey">` disclosure, so the browser handles
    one-open-at-a-time with no script. Keep it that way.
- **Content**:
  - Stories: `_posts/YYYY-MM-DD-title.md`, front matter carries `keywords` (a list) and `tldr`
  - Journey: `_data/journey.yml`
  - Bookmarks: `_data/bookmarks.yml`, filter slugs in `_data/bookmark_types.yml`
  - Story filters: `_data/story_keywords.yml`
  - Research: `_data/research.yml`
  - Home updates: `_data/updates.yml` — hand-curated, rendered by
    `_includes/updates-widget.html`. It never aggregates from `_posts/` or
    bookmarks, and it reads feature 007's study record without owning it
  - Call for participants: `_data/study.yml` — a single study record with an
    `active` toggle, rendered by `_includes/study-callout.html` in two variants
    (`full` on research, `compact` on home). It is the single source for both
    surfaces; never copy study text anywhere else
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
- The journey page deliberately shows no years on the track. A milestone's
  optional `period` renders only inside an opened stop. Note that detail text
  is in the HTML even while collapsed, so grepping the page for years gives
  false matches — check the `<summary>` markup instead.
- A journey stop never names its category in words. `academia` / `industry` are
  shown by the badge ring style (solid / dashed) plus the legend above the
  track, which is the only place those words appear. This satisfies the
  colour-independence requirement without repeating the label on every stop.
- A milestone's optional `url` turns its badge logo into a link to that
  organisation's site. The link sits inside the `<summary>`, which is safe:
  the anchor handles its own click, so following it does not toggle the stop.
  Do not add script to "fix" this.
- The site has two breakpoints and they are not interchangeable. 600px is where
  the top nav collapses; 1000px is where the side nav hides, because below that
  it would overlap the 44rem content column. Do not consolidate them.
- `default.html` puts `is-home` or `is-interior` on `<body>`. That class drops
  the rules above and below the content on home; reuse it for anything else
  that differs between home and interior pages rather than adding a new flag.
- Study and recruitment content is author-supplied and MUST NOT be generated or
  paraphrased. For human-subjects research it is IRB-approved wording. The site
  links out to a recruitment destination and never collects participant data.
- Explain changes in plain language — the project owner is new to web development.

## Spec Kit

The `.specify/` directory contains Spec Kit configuration. Use slash commands (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`) for the feature workflow. Constitution at `.specify/memory/constitution.md`; features documented under `specs/`.
