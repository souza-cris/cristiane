# Implementation Plan: Journey Timeline and List Search

**Branch**: `004-journey-and-search` | **Date**: 2026-07-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-journey-and-search/spec.md`

## Summary

Rename the about page to journey and fill it with a horizontal, logo-driven timeline built from `_data/journey.yml`. Add a type-to-filter search box to stories and bookmarks. Replace the single-value story `category` with a `keywords` list so one story can appear under several filters. Collapse the duplicated filter-page markup into shared includes driven by data files.

## Technical Context

**Language/Version**: HTML5, CSS3, Liquid templating, Markdown, YAML, a single vanilla JavaScript file

**Primary Dependencies**: Jekyll 4.4 (existing); `liquid` pinned to 4.0.4 so the site builds on Ruby 3.2+

**Storage**: Filesystem — `_data/journey.yml`, `_data/story_keywords.yml`, `_data/bookmark_types.yml`, `_posts/`, committed logo files under `assets/img/logos/`

**Testing**: `bundle exec jekyll build` plus HTTP checks against the local server; the search logic is exercised by a Node script against a fake DOM

**Target Platform**: GitHub Pages via GitHub Actions

**Project Type**: Static website

**Performance Goals**: No external requests; portrait and logo assets together under ~260 KB

**Constraints**: GitHub Pages compatible, no build step, no npm

**Scale/Scope**: 1 new page layout on an existing template, 11 milestones, 2 searchable sections, 12 filter pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity & Maintainability | ✅ Pass | Shared includes replace the same markup copy-pasted across 13 filter pages; badge sizing is computed in Liquid from loop position rather than hand-tuned |

> **Superseded**: the growing badge sizes described here were replaced by uniform badges in feature 005, on the grounds that size implied later-equals-more-important. The brightening rail remains the progression cue. See `specs/005-journey-storytelling/spec.md` User Story 5.
| II. Content as Data | ✅ Pass | Milestones, story keywords and bookmark types all live in `_data/`; pages carry no hardcoded entries |
| III. GitHub Pages Compatibility | ✅ Pass | No plugins, no build step; the script is a plain file served as-is |
| IV. Performance & Accessibility | ✅ Pass | Logos committed locally so no external hosts; portrait resized 17 MB → 135 KB; flags carry `aria-label`; the scroll container is focusable and keyboard-scrollable; highlighted phrases use `<strong>` so emphasis is conveyed, not just coloured |
| V. Minimal JavaScript | ⚠️ Justified | See "Complexity Tracking" — live text search cannot be expressed in HTML or CSS |

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| JavaScript for search (`assets/js/search.js`, ~25 lines) | Filtering a list against text typed by the visitor requires reacting to input; CSS has no selector that matches on typed content | A form submit per query needs a server the site does not have; a prebuilt search index needs a plugin GitHub Pages will not run. The script has no dependencies, no build step, and is loaded only on the two pages that use it. The box is hidden in the HTML and revealed by the script, so with JavaScript off the visitor sees the ordinary list rather than a dead control — layout and navigation remain script-free per Principle IV. |

## Project Structure

### Documentation

```
specs/004-journey-and-search/
├── spec.md
├── plan.md
├── data-model.md
└── quickstart.md
```

### Source

```
_data/journey.yml              # Milestones, oldest first
_data/story_keywords.yml       # Story filter slugs and labels
_data/bookmark_types.yml       # Bookmark filter slugs, labels, empty states
_includes/journey-timeline.html
_includes/story-filters.html
_includes/story-list.html
_includes/bookmark-filters.html
_includes/bookmark-list.html
_includes/search-box.html
assets/js/search.js
assets/img/cris.jpg            # Portrait, resized for the web
assets/img/logos/              # Organization logos
journey.md                     # Renamed from about.md
stories.md, stories/*.md       # Thin pages over shared includes
bookmarks.md, bookmarks/*.md   # Thin pages over shared includes
```

## Phase 0: Research

Decisions recorded during implementation:

1. **Flags as emoji, logos as files.** Country flags render from emoji on every platform with no assets to manage. Brand logos have no such source, so they are committed files.
2. **Logo sourcing.** Wikimedia Commons for eight organizations; HelloFresh and Getnet are not on Commons, so their marks come from the companies' own sites. Each file was rendered and visually checked before use — early search results included a photograph of ADP's headquarters and a picture of an FGV building rather than logos.
3. **Light face for logo badges.** Most brand marks are dark ink drawn for white paper and disappear on the dark theme, so a badge holding a logo uses a light background while initials badges keep the dark surface.
4. **CSS cropping for the portrait.** The stored image is the full portrait; `object-fit` and `object-position` frame it to a circle, so re-framing is a one-value change rather than a re-crop.
5. **Post permalinks.** Removing `category` from front matter would have changed post URLs anyway, since Jekyll's default permalink embeds the category. Posts moved to `/stories/:year/:month/:day/:title/`, which also makes the nav highlight "stories" while reading one.

## Phase 1: Design

- **Journey**: `journey.md` renders profile, tagline, legend, then `journey-timeline.html`, which loops `_data/journey.yml` and computes each badge size from its index.
- **Filters**: each filter page declares its slug in front matter (`keyword:` for stories, `type:` for bookmarks) and includes the shared filter row and list.
- **Search**: `search-box.html` emits a hidden form whose input names its target list via `data-search-list`; `search.js` reveals the box, then shows or hides list children by matching their text.

## Phase 2: Validation

- `bundle exec jekyll build` completes with no Liquid errors.
- Every page and asset returns HTTP 200 from the local server.
- The built journey page contains no four-digit year.
- The search logic passes 8 assertions against a fake DOM covering case-insensitivity, the empty-result state, and clearing the query.
