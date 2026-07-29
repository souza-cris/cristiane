# Implementation Plan: Research Page Call for Participants

**Branch**: `007-research-call-for-participants` | **Date**: 2026-07-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/007-research-call-for-participants/spec.md`

## Summary

Add a call for participants to the research page, driven by a single study record in `_data/study.yml` with an `active` toggle the author flips to open and close recruitment. The callout markup lives in one parameterised include with two variants — `full` for the research page and `compact` for the home page — so feature 006 surfaces the same study without owning or duplicating it. No form is built and no participant data is handled; the action links out to the author's own recruitment destination.

## Technical Context

**Language/Version**: HTML5, CSS3, Liquid templating, Markdown, YAML

**Primary Dependencies**: Jekyll 4.4 (existing), liquid 4.0.4; no new dependencies

**Storage**: Filesystem — one new data file, `_data/study.yml`

**Testing**: `bundle exec jekyll build` for Liquid errors, HTTP checks against the local server, toggle on/off rebuild checks, manual browser checks at phone and desktop widths

**Target Platform**: GitHub Pages via GitHub Actions; modern evergreen browsers

**Project Type**: Static website — one new data file, one new include, one page edited, one stylesheet section

**Performance Goals**: No new network requests, no images, no script; the callout is a few hundred bytes of markup

**Constraints**: No build step, no npm, no plugins; the site must never collect participant data itself

**Scale/Scope**: One study at a time, two render variants

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity & Maintainability | ✅ Pass | One data file, one include, one toggle. No collection, no plugin, no scheduling machinery — the author flips a boolean |
| II. Content as Data | ✅ Pass | Every word of the study lives in `_data/study.yml`; the include contains structure only. Feature 006 reads the same record rather than copying it |
| III. GitHub Pages Compatibility | ✅ Pass | Stock Liquid, YAML and CSS; no plugins, no build step |
| IV. Performance & Accessibility | ✅ Pass | Semantic `<section>` with an accessible name, a real heading, a descriptive link label, and no color-only meaning. Nothing to download |
| V. Minimal JavaScript | ✅ Pass | None added. Toggling happens at build time |

**Post-design re-check**: still passing. The design added no script, no dependency and no plugin.

*No violations — Complexity Tracking omitted.*

### Note on scope and ethics

This feature links out to a recruitment destination the author supplies; it stores, processes and transmits nothing. That keeps the site clear of participant data entirely, which is the right default for a static site with no backend. The recruitment wording is the author's — for human-subjects research it is normally IRB-approved text and should be used verbatim rather than reworded.

## Project Structure

### Documentation (this feature)

```text
specs/007-research-call-for-participants/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── study-record.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Created by /speckit-tasks, not here
```

### Source Code (repository root)

```text
_data/study.yml                 # NEW — the single study record
_includes/study-callout.html    # NEW — one include, two variants
research.md                     # Renders the full callout
assets/css/style.css            # Callout styling
```

**Structure Decision**: Static Jekyll site with no application source tree, matching features 003–005. The home page is deliberately **not** touched here — feature 006 owns that call site. This feature's job is to make the study record and the callout available for it.

## Phase 0: Research

See [research.md](research.md). Six questions were open; all are resolved:

1. Where the study lives and how recruitment is toggled → a single `_data/study.yml` with an `active` boolean
2. How one callout serves two pages without duplication → one include, a `variant` parameter
3. What markup makes the callout accessible → `<section>` with `aria-labelledby` and a variant-scoped id
4. How an action that may be a form URL or an email is handled → the author writes the complete destination; no guessing
5. How the deadline is stored and shown → an author-formatted string, rendered verbatim
6. What the compact home variant shows → an optional `summary`, falling back to `description`

## Phase 1: Design

- **[data-model.md](data-model.md)** — the study record, every field, and the empty/absent rules.
- **[contracts/study-record.md](contracts/study-record.md)** — the authoring contract and the include's calling contract, which is what feature 006 depends on.
- **[quickstart.md](quickstart.md)** — validation scenarios, including the toggle test that is the heart of User Story 2.

### Render shape

```text
<section class="study-callout study-callout--{variant}" aria-labelledby="study-callout-{variant}">
  <p class="…__eyebrow">call for participants
  <h2 id="study-callout-{variant}">     ← the study title
  <p class="…__description">            ← description (full) or summary (compact)
  <dl class="…__facts">                 ← eligibility + what's involved   (full only)
  <p class="…__deadline">               ← only when a deadline is set
  <a class="…__action">                 ← action label → action destination
</section>
```

### Variants

| | Research page (`full`) | Home page (`compact`, feature 006) |
|---|---|---|
| Title | ✅ | ✅ |
| Body | `description` | `summary`, falling back to `description` |
| Eligibility / what's involved | ✅ | ✗ — the research page holds the detail |
| Deadline | ✅ when set | ✅ when set |
| Action | ✅ | ✅ |

## Phase 2: Validation

- Build completes with no Liquid errors; the research page loads locally.
- With `active: true`, the callout renders with title, description, eligibility, what's involved and a working action.
- With `active: false`, no callout appears and the research page renders its interests and publications normally — the content stays in the file untouched.
- With no `_data/study.yml` at all, the site still builds and the research page renders normally.
- A study with no deadline renders no empty date element.
- The callout wraps cleanly at phone width and does not hide interests or publications.

### Scoping note on User Story 3

US3 ("one study, surfaced in both places") can only be **half** verified here: this feature proves the record is single-source and the include is reusable with a `compact` variant. Actually rendering it on the home page is feature 006's call site, so the end-to-end "edit once, changes both pages" check belongs to 006's validation. The tasks for this feature should not claim otherwise.
