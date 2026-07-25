# Implementation Plan: Personal Website

**Branch**: `001-personal-site` | **Date**: 2026-07-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-personal-site/spec.md`

## Summary

Build a five-section personal website for Cristiane (Home, Portfolio, Projects, Blog, Curation) as a Jekyll static site deployed on GitHub Pages. All content lives in Markdown files or YAML data files. The site uses a custom minimal layout with plain CSS, no JavaScript, and no third-party theme gems.

## Technical Context

**Language/Version**: Ruby (Jekyll runtime), HTML5, CSS3, Liquid templating, Markdown, YAML

**Primary Dependencies**: Jekyll (via `github-pages` gem), Bundler

**Storage**: Filesystem — Markdown files (`_posts/`, `_projects/`), YAML data files (`_data/`), static assets (`assets/`)

**Testing**: `bundle exec jekyll serve` for local preview; manual browser testing across viewports

**Target Platform**: GitHub Pages (static hosting, free tier)

**Project Type**: Static website

**Performance Goals**: All pages load in under 3 seconds on a standard mobile connection

**Constraints**: GitHub Pages-supported plugins only; no JavaScript build tools; no npm dependencies; no server-side processing

**Scale/Scope**: Single-author personal site; ~5 static pages + growing blog posts and project pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity & Maintainability | ✅ Pass | Custom minimal layout from scratch; no theme gem; no abstractions beyond what Jekyll provides |
| II. Content as Data | ✅ Pass | Blog posts as `_posts/*.md`; projects as `_projects/*.md` collection; curation as `_data/curation.yml`; profile links in `_config.yml` |
| III. GitHub Pages Compatibility | ✅ Pass | Uses `github-pages` gem; no custom plugins; deploys via `git push` |
| IV. Performance & Accessibility | ✅ Pass | Plain CSS responsive layout; semantic HTML; no JS for layout/navigation; alt text on images |
| V. Minimal JavaScript | ✅ Pass | Zero JavaScript planned; mobile navigation uses CSS-only approach (checkbox/details hack or stacked layout) |

No violations. No complexity justifications needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-site/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
_config.yml              # Jekyll configuration, site metadata, profile links
_layouts/
├── default.html         # Base layout (head, nav, footer)
├── page.html            # Standard page layout
├── post.html            # Blog post layout
└── project.html         # Project detail layout

_includes/
├── nav.html             # Navigation bar (shared across all pages)
├── footer.html          # Footer (shared across all pages)
└── head.html            # HTML <head> with meta tags

_posts/                  # Blog posts (Markdown, one file per post)
_projects/               # Project pages (Markdown collection, one file per project)

_data/
├── curation.yml         # Curation items grouped by category
└── navigation.yml       # Navigation links (optional, can use _config.yml)

assets/
├── css/
│   └── style.css        # All site styles (single file)
├── images/              # Profile photo, project images
└── files/               # Resume PDF and other downloadable files

index.md                 # Home page
blog.md                  # Blog index page
projects.md              # Projects index page
portfolio.md             # Portfolio / resume page
curation.md              # Curation page
404.md                   # Custom 404 page

Gemfile                  # Ruby dependencies (github-pages gem)
```

**Structure Decision**: Standard Jekyll site structure at the repository root. Uses Jekyll collections (`_projects`) for project pages, built-in `_posts` for blog, and `_data` for structured YAML content. No subdirectory nesting beyond what Jekyll conventions require.
