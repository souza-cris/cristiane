# Implementation Plan: Content Restructure

**Branch**: `003-content-restructure` | **Date**: 2026-07-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-content-restructure/spec.md`

## Summary

Restructure the site from five sections (Home/Portfolio/Projects/Blog/Curation) to six (home/about/stories/research/bookmarks/contact). Hero-only home page, stories with static filter pages replacing the blog, research page replacing portfolio, annotated bookmarks replacing curation, blank about page, and minimal contact page. Filters implemented as separate static pages per filter value — no JavaScript. All page titles lowercase.

## Technical Context

**Language/Version**: HTML5, CSS3, Liquid templating, Markdown, YAML

**Primary Dependencies**: Jekyll 4.4 (existing), no new dependencies

**Storage**: Filesystem — Markdown files (`_posts/` for stories), YAML data files (`_data/bookmarks.yml`, `_data/research.yml`)

**Testing**: `bundle exec jekyll serve` for local preview, manual browser testing

**Target Platform**: GitHub Pages via GitHub Actions

**Project Type**: Static website (content restructure)

**Performance Goals**: Pages load under 3 seconds on mobile (no regression)

**Constraints**: No JavaScript, no external dependencies, GitHub Pages compatible

**Scale/Scope**: 6 pages + story posts + filter index pages + bookmarks data

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity & Maintainability | ✅ Pass | Reuses Jekyll built-ins (_posts, _data, collections). Filter pages generated via Jekyll pages, not complex tooling |
| II. Content as Data | ✅ Pass | Stories as Markdown with front matter, bookmarks as YAML, research as YAML/Markdown — no hardcoded HTML content |
| III. GitHub Pages Compatibility | ✅ Pass | No new plugins, no custom build tools |
| IV. Performance & Accessibility | ✅ Pass | Static filter pages (no JS), dark theme preserved, responsive layout |
| V. Minimal JavaScript | ✅ Pass | Zero JavaScript — filters are separate static pages |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-content-restructure/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
_config.yml              # Updated: remove projects collection, update nav, site metadata

_layouts/
├── default.html         # Updated: new nav links, new footer with icons
├── page.html            # Existing (unchanged)
├── post.html            # Updated → story layout (renamed conceptually)
├── story.html           # New: story detail layout with TL;DR, citation, exploring next
└── project.html         # REMOVED

_includes/
├── head.html            # Existing (unchanged)
├── nav.html             # Updated: new lowercase nav links
└── footer.html          # Updated: LinkedIn, Google Scholar, GitHub icon links

_posts/                  # Repurposed: stories (same Jekyll convention, new front matter)

_data/
├── bookmarks.yml        # New: annotated bookmarks collection
└── research.yml         # New: research interests, publications, methods

_projects/               # REMOVED (entire directory)

index.md                 # Rewritten: hero-only (eyebrow, headline, subheadline, CTAs)
about.md                 # New: blank placeholder page
stories.md               # New: stories index (replaces blog.md)
stories/                 # New directory: filter pages
├── short.md             # Stories filtered by length: short
├── long.md              # Stories filtered by length: long
├── ai.md                # Stories filtered by category: AI
├── leadership.md        # Stories filtered by category: Leadership
├── conference.md        # Stories filtered by category: Conference
└── isd.md               # Stories filtered by category: ISD
research.md              # New: research page (interests, publications, methods)
bookmarks.md             # New: bookmarks index (replaces curation.md)
bookmarks/               # New directory: filter pages
├── paper.md             # Bookmarks filtered by type: paper
├── book.md              # Bookmarks filtered by type: book
├── talk.md              # Bookmarks filtered by type: talk
├── tool.md              # Bookmarks filtered by type: tool
├── dataset.md           # Bookmarks filtered by type: dataset
└── more.md              # Bookmarks filtered by type: more
contact.md               # New: minimal contact page
404.md                   # Updated: new nav references

assets/css/style.css     # Updated: hero styles, filter pill styles, story/bookmark item styles

blog.md                  # REMOVED
curation.md              # REMOVED
portfolio.md             # REMOVED
projects.md              # REMOVED
```

**Structure Decision**: Standard Jekyll structure at repo root. Stories use `_posts/` with enriched front matter. Bookmarks and research data live in `_data/`. Filter pages are standalone Markdown pages with Liquid loops that filter by front matter values. Old pages (blog.md, curation.md, portfolio.md, projects.md) and the `_projects/` collection are deleted.
