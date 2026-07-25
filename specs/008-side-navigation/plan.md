# Implementation Plan: Side Navigation and Uninterrupted Home

**Branch**: `008-side-navigation` | **Date**: 2026-07-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/008-side-navigation/spec.md`

## Summary

Add a vertical section menu pinned to the right edge and vertically centred, rendered on every page except home from a single include. It repeats the top navigation's links so nothing is lost when it hides, and it hides below 1000px — the width at which it can no longer sit beside the 44rem content column without overlapping. The layout adds a body class naming the page as home or interior, which also drives dropping the rules above and below the content on home. No script, no data file, no new dependency.

## Technical Context

**Language/Version**: HTML5, CSS3, Liquid templating

**Primary Dependencies**: Jekyll 4.4 (existing); no new dependencies

**Storage**: None — no data file is introduced

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
| I. Simplicity & Maintainability | ✅ Pass | One include, one layout line, one stylesheet section. `position: fixed` and a media query — no scroll listener, no observer, nothing to keep in sync |
| II. Content as Data | ⚠️ Deviation | The five links are markup in the include, not a data file. Justified below |
| III. GitHub Pages Compatibility | ✅ Pass | Stock Liquid and CSS; no plugins, no build step |
| IV. Performance & Accessibility | ✅ Pass | A real `<nav>` with an accessible name and a `<ul>` of ordinary links. `aria-current="page"` marks the section, backed by a border as well as colour, so it is not colour-only. Focus ring preserved. Nothing to download |
| V. Minimal JavaScript | ✅ Pass | None added. Position, visibility and current-page marking are all CSS or build-time Liquid |

**Post-design re-check**: still passing, with the one recorded deviation. The design added no script, no dependency and no plugin.

### Deviation: link list as markup

Principle II asks that repeated content live in a data file. These five links are held as markup in `_includes/side-nav.html` instead.

**Why**: the site navigation already exists as markup in `_includes/nav.html`, and a data file would have to serve both or be duplicated. More importantly the "current section" test differs per link — `/stories/` matches by prefix so a single story still marks its section, while `/research/` matches exactly — so a data file would have to encode a matching rule per entry, not just a label and a href. That is more structure than five links justify, and it would put logic in the data file, which is worse than markup in an include.

**Cost if this grows**: the moment a third surface needs the same list, extract `_data/sections.yml` with a `label`, `url` and `match` per entry, and drive both navigations from it. Until then this is YAGNI, and Principle I outranks the duplication here.

*One recorded deviation — Complexity Tracking omitted as it is argued in place.*

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
_includes/side-nav.html     # NEW — the nav element and its five links
_layouts/default.html       # body class, and the include on non-home pages
assets/css/style.css        # side-nav section; is-home rules
```

## Complexity Tracking

The single deviation is argued in the Constitution Check above, with the trigger that would reverse it.
