# Implementation Plan: Side Navigation and Uninterrupted Home

**Branch**: `008-side-navigation` | **Date**: 2026-07-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/008-side-navigation/spec.md`

## Summary

Add a vertical section menu pinned to the right edge and vertically centred, rendered on every page except home. Both it and the top navigation render the same list from `_data/sections.yml` through a shared include, so nothing is lost when the side menu hides and the two can never disagree. It hides below 1000px — the width at which it can no longer sit beside the 44rem content column without overlapping. The layout adds a body class naming the page as home or interior, which also drives dropping the rules above and below the content on home. No script, no new dependency.

## Technical Context

**Language/Version**: HTML5, CSS3, Liquid templating

**Primary Dependencies**: Jekyll 4.4 (existing); no new dependencies

**Storage**: Filesystem — one new data file, `_data/sections.yml`

**Testing**: `bundle exec jekyll build` for Liquid errors, HTTP checks against the local server, keyboard traversal, and manual width checks either side of the breakpoint

**Target Platform**: GitHub Pages via GitHub Actions; modern evergreen browsers

**Project Type**: Static website — one new include, one layout edited, one stylesheet section

**Performance Goals**: No new network requests, no images, no script; roughly half a kilobyte of markup per page

**Constraints**: No build step, no npm, no plugins; must not overlap content or introduce horizontal scrolling at any width

**Scale/Scope**: Five links, six pages, one breakpoint

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity & Maintainability | ✅ Pass | One data file, one shared include, one layout line, one stylesheet section. `position: fixed` and a media query — no scroll listener, no observer, nothing to keep in sync |
| II. Content as Data | ✅ Pass | The section list lives in `_data/sections.yml` and both navigations render it through `section-links.html`. The list is written once and appears twice |
| III. GitHub Pages Compatibility | ✅ Pass | Stock Liquid and CSS; no plugins, no build step |
| IV. Performance & Accessibility | ✅ Pass | A real `<nav>` with an accessible name and a `<ul>` of ordinary links. `aria-current="page"` marks the section, backed by a border as well as colour, so it is not colour-only. Focus ring preserved. Nothing to download |
| V. Minimal JavaScript | ✅ Pass | None added. Position, visibility and current-page marking are all CSS or build-time Liquid |

**Post-design re-check**: passing on all five.

### Note: the link list, and a correction

This feature first shipped with its five links written as markup in `_includes/side-nav.html`, duplicating the list already in `_includes/nav.html`. The plan recorded that as an accepted deviation from Principle II, arguing that a per-link "current section" rule was logic and did not belong in a data file.

That argument was wrong, and the owner rejected it. The per-link rule is a *value* — `exact` or `prefix` — describing how each entry behaves. Putting that value in the data file and letting one include act on it keeps the knowledge with the list, which is exactly what Principle II asks for. The list is now written once in `_data/sections.yml` and rendered twice through `section-links.html`.

The constitution was amended in the same pass (v2.0.0) to say this outright: repeated structure is covered by Principle II, a per-entry difference belongs in the data as a value, and a principle must never be loosened to make existing code compliant. That last rule exists because loosening it is what was attempted here first.

*No violations — Complexity Tracking omitted.*

## Project Structure

### Documentation

```
specs/008-side-navigation/
├── spec.md
├── plan.md              # this file
├── research.md          # positioning, the breakpoint, marking the current page
├── data-model.md        # no new data; records the link list and match rules
├── quickstart.md        # manual verification
├── tasks.md
├── contracts/
│   └── side-nav-include.md
└── checklists/
    └── requirements.md
```

### Source

```
_data/sections.yml            # NEW — the section list: label, url, match
_includes/section-links.html  # NEW — renders that list; shared by both navs
_includes/side-nav.html       # NEW — the nav element; no links of its own
_includes/nav.html            # top nav, now rendering the same shared list
_layouts/default.html         # body class, and the include on non-home pages
assets/css/style.css          # side-nav section; is-home rules
```

## Complexity Tracking

None. The one deviation this feature originally carried — the link list as markup — was removed rather than justified; see the note in the Constitution Check above.
