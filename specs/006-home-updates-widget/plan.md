# Implementation Plan: Home Page Updates Widget

**Branch**: `006-home-updates-widget` | **Date**: 2026-07-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/006-home-updates-widget/spec.md`

## Summary

Add a "what's new" area below the home page hero, populated from a hand-curated `_data/updates.yml`. Each entry carries a type, title, date, optional link and optional blurb; entries can be switched off or pinned, and the widget shows the four most recent. When a study is recruiting, the widget also surfaces it by calling feature 007's existing `study-callout.html` with `variant="compact"` — reading the shared record rather than duplicating a word of it. The whole area hides itself when nothing is active.

## Technical Context

**Language/Version**: HTML5, CSS3, Liquid templating, Markdown, YAML

**Primary Dependencies**: Jekyll 4.4 (existing), liquid 4.0.4; feature 007's `study-callout.html` include

**Storage**: Filesystem — one new data file, `_data/updates.yml`; reads `_data/study.yml` (owned by 007)

**Testing**: `bundle exec jekyll build` for Liquid errors, HTTP checks against the local server, ordering and limit checks by manipulating the data file, manual browser checks at phone and desktop widths

**Target Platform**: GitHub Pages via GitHub Actions; modern evergreen browsers

**Project Type**: Static website — one new data file, one new include, the home page, one stylesheet section

**Performance Goals**: No new network requests, no images, no script; at most four entries plus one callout

**Constraints**: No build step, no npm, no plugins; must not disturb the hero or the navigation

**Scale/Scope**: Four visible entries out of an unbounded curated list

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity & Maintainability | ✅ Pass | Ordering, filtering and the limit are stock Liquid filters. No type-label lookup table — the type string is the label, so an unfamiliar type needs no configuration |
| II. Content as Data | ✅ Pass | Entries live in `_data/updates.yml`; the study is read from 007's record and never copied. The include holds structure only |
| III. GitHub Pages Compatibility | ✅ Pass | Stock Liquid, YAML and CSS; no plugins, no build step |
| IV. Performance & Accessibility | ✅ Pass | A real heading and a list, semantic markup, link text that says where it goes, and no colour-only meaning. Nothing to download |
| V. Minimal JavaScript | ✅ Pass | None added. Sorting, filtering and truncation happen at build time |

**Post-design re-check**: still passing. No script, no dependency, no plugin.

*No violations — Complexity Tracking omitted.*

### Note on the curation tradeoff

The author chose a hand-curated file over automatic aggregation, accepting that a featured story or bookmark is written twice — once in its own file and once here. The spec records this as deliberate, in exchange for control over wording and what gets featured. The design does not try to soften it with partial automation, which would give neither full control nor full automation.

## Project Structure

### Documentation (this feature)

```text
specs/006-home-updates-widget/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── update-record.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Created by /speckit-tasks, not here
```

### Source Code (repository root)

```text
_data/updates.yml                # NEW — the curated update entries
_includes/updates-widget.html    # NEW — the whole widget
index.md                         # Renders the widget below the hero
assets/css/style.css             # Widget styling
_config.yml                      # Optional `updates_limit` override
```

**Structure Decision**: Static Jekyll site, no application source tree — matching features 003–005 and 007. This feature **reads** `_data/study.yml` and **calls** `_includes/study-callout.html`, both owned by feature 007. It changes neither.

## Phase 0: Research

See [research.md](research.md). Six questions were open; all are resolved:

1. How entries are ordered with pinning → sort by date, reverse, partition pinned first, then slice
2. Where the display limit lives → `site.updates_limit`, defaulting to four inside the include
3. How type labels handle an unfamiliar type → the type string is the label; styling degrades to a base pill
4. What "active" means when the author omits it → entries are shown unless explicitly switched off
5. How internal and external links are told apart → the same rule 007 uses, plus `relative_url` for internal paths
6. How the widget hides itself entirely → both the entry list and the study state are resolved before any heading is emitted

## Phase 1: Design

- **[data-model.md](data-model.md)** — the update entry, the limit, and the borrowed study record.
- **[contracts/update-record.md](contracts/update-record.md)** — the authoring contract, plus the dependency this feature takes on 007's include.
- **[quickstart.md](quickstart.md)** — validation scenarios covering ordering, pinning, the limit, the empty state and the study integration.

### Render shape

```text
<section class="updates" aria-labelledby="updates-heading">   ← only when something is active
  <h2 id="updates-heading">what's new
  <ul class="updates__list">                                  ← only when entries are active
    <li class="updates__item">
      <span class="updates__type">publication
      <h3><a>title</a></h3>                                   ← plain text when no link
      <p class="updates__blurb">                              ← omitted when empty
      <time class="updates__date">
  {% include study-callout.html variant="compact" %}          ← self-gating, from 007
</section>
```

### Ordering pipeline

```text
all entries
  → drop those explicitly switched off
  → sort by date, newest first
  → pinned entries first, remainder after
  → take the first `updates_limit` (default 4)
```

## Phase 2: Validation

- Build completes with no Liquid errors; the home page loads locally.
- Three entries of different types render below the hero, newest first, each linking correctly.
- A pinned entry appears first regardless of its date.
- With more than four active entries, only four appear.
- An entry switched off is omitted; an entry with no link renders as plain text; an entry with no blurb renders no empty element.
- With no active entries and no active study, the widget renders nothing at all — no heading, no empty container — and the hero and navigation are untouched.
- With entries inactive but the study active, only the callout shows; and the reverse.

### Dependency note

This feature completes the half of feature 007's User Story 3 that 007 could not verify: editing the study once and seeing it change on both the research page and the home page. That end-to-end check belongs to this feature's validation and is included in [quickstart.md](quickstart.md).
