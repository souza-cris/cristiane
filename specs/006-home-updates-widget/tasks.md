---

description: "Task list for Home Page Updates Widget"
---

# Tasks: Home Page Updates Widget

**Input**: Design documents from `specs/006-home-updates-widget/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: No automated test tasks. The spec does not request TDD and the site has no test harness — validation is the build and browser checks in [quickstart.md](quickstart.md), referenced from the tasks below.

**Organization**: Tasks are grouped by user story so each can be implemented and verified on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel — different file, no dependency on unfinished work
- **[Story]**: Which user story the task serves (US1–US3)

## Path Conventions

Static Jekyll site, no application source tree. Tasks touch these files:

- `_data/updates.yml` — **new**, the curated entries
- `_includes/updates-widget.html` — **new**, the whole widget
- `index.md` — renders the widget below the hero
- `assets/css/style.css` — widget styling
- `_config.yml` — the `updates_limit` setting
- `README.md`, `CLAUDE.md` — author documentation

> **Feature 007 is a dependency, not a target.** This feature reads `_data/study.yml` and calls `_includes/study-callout.html`. It must not edit either — see the dependency contract in [contracts/update-record.md](contracts/update-record.md).

---

## Phase 1: Setup

**Purpose**: Establish a known-good baseline

- [X] T001 Confirm a clean baseline: run `bundle exec jekyll build`, verify no Liquid errors, then serve and confirm `http://127.0.0.1:4000/cristiane/` returns 200
- [X] T002 [P] Record the current home page output for later comparison, saving it outside the repository, so the hero regression check in T027 has something to compare against

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The data file, the ordering pipeline, and the limit setting — before anything renders

**⚠️ CRITICAL**: All three user stories depend on this phase.

- [X] T003 Create `_data/updates.yml` as a plain top-level list per [contracts/update-record.md](contracts/update-record.md), with header comments documenting every field. Seed it with a few entries **sourced from content that already exists on this site** — a publication from `_data/research.yml`, a story from `_posts/`, a bookmark from `_data/bookmarks.yml` — reusing their existing titles, dates and wording. **Do not invent titles, claims, or blurbs**: every seeded value must be traceable to a file already in the repository
- [X] T004 Create `_includes/updates-widget.html` implementing the ordering pipeline in [plan.md](plan.md): drop entries with an explicit `active: false`, sort by `date` newest first, promote `pinned: true` entries ahead of the rest, then take the first `site.updates_limit` entries defaulting to `4`. Assign the result to a variable; render no markup yet
- [X] T005 In `_config.yml`, add `updates_limit: 4` with a comment noting that Jekyll reads this file only at startup, so changing it locally needs a server restart rather than just a rebuild

**Checkpoint**: The site builds. The ordering pipeline resolves to a correct list, rendering nothing.

---

## Phase 3: User Story 1 — See what is new at a glance (Priority: P1) 🎯 MVP

**Goal**: The home page shows a short, scannable list of the author's chosen updates below the hero.

**Independent Test**: With three entries of different types in the data file, load the home page and confirm all three appear below the hero with the correct label, title, link, blurb and date, ordered newest first.

- [X] T006 [US1] In `_includes/updates-widget.html`, render a `<section class="updates" aria-labelledby="updates-heading">` with an `<h2 id="updates-heading">` so the area is a named region, emitted only when the visible entry list is non-empty
- [X] T007 [US1] In `_includes/updates-widget.html`, render each entry inside a `<ul class="updates__list">`, with the entry's `type` string as its own pill label plus a `updates__type--{type}` modifier class, so an unfamiliar type still renders with the base style
- [X] T008 [US1] In `_includes/updates-widget.html`, render the entry title with link handling per decision 5 in [research.md](research.md): a `link` containing `://` renders as written with `target="_blank" rel="noopener"`; any other `link` is passed through `relative_url`; no `link` renders the title as plain text
- [X] T009 [US1] In `_includes/updates-widget.html`, render `blurb` when present and omitted entirely when empty, and render `date` in a `<time>` element with a machine-readable `datetime` attribute alongside its human-readable form
- [X] T010 [US1] In `index.md`, include the widget immediately below the hero section, leaving the hero's eyebrow, headline, subheadline and link row untouched
- [X] T011 [US1] In `assets/css/style.css`, style the widget to sit under the hero without competing with it — a quiet heading, scannable rows, type pills reusing the site's existing pill language, and muted date and blurb text
- [X] T012 [US1] In `assets/css/style.css`, add a visible focus indicator for entry links consistent with the existing focus treatment across the site
- [X] T013 [US1] Run quickstart Scenario 1, confirming internal links resolve under the site's base path rather than 404ing

**Checkpoint**: US1 is complete and independently shippable — the home page has something that changes over time.

---

## Phase 4: User Story 2 — Surface the active call for participants (Priority: P1)

**Goal**: While a study is recruiting, the widget also shows it, sourced entirely from feature 007's record.

**Independent Test**: With the study's `active` flag on, load the home page and confirm a distinct callout appears with an action link. Turn the flag off, rebuild, and confirm the callout is gone from the home page.

- [X] T014 [US2] In `_includes/updates-widget.html`, resolve the study's active state from `site.data.study` and widen the section gate so the widget renders when **either** visible entries exist **or** the study is active, and renders nothing at all when neither is true, per decision 6 in [research.md](research.md)
- [X] T015 [US2] In `_includes/updates-widget.html`, call `{% include study-callout.html variant="compact" %}` inside the section, after the entry list. Call it unconditionally — it gates itself — and do not copy any study field into this widget
- [X] T016 [US2] In `assets/css/style.css`, add only the spacing needed to seat the compact callout inside the widget; its internal styling belongs to feature 007 and must not be overridden
- [X] T017 [US2] Run quickstart Scenario 2, confirming the home callout shows the study's `summary` rather than the full `description`, and shows no eligibility or what's-involved
- [X] T018 [US2] Run quickstart Scenario 3, the end-to-end check feature 007 could not complete: edit the study title once and confirm both the research page and the home page change, then turn the study off and confirm it disappears from both

**Checkpoint**: US1 and US2 both work, and the single-source-of-truth claim in feature 007 is finally proven end to end.

---

## Phase 5: User Story 3 — Control what appears, in what order, from one file (Priority: P2)

**Goal**: Adding, hiding, pinning and limiting entries all happen in the data file, with no template edits.

**Independent Test**: Add, deactivate and pin entries in the data file and confirm each change is reflected after a rebuild, with no edits to any template.

- [X] T019 [US3] Verify author control from `_data/updates.yml` alone: add an entry and confirm it appears; set `active: false` on another and confirm it disappears while staying in the file; set `pinned: true` on an older entry and confirm it moves to the top despite its date
- [X] T020 [US3] Verify the limit: add enough active entries to exceed four and confirm only the four most recent appear. Then change `updates_limit` in `_config.yml`, **restart** the server, and confirm the new limit takes effect
- [X] T021 [US3] Verify an entry with an unfamiliar `type` — for example `talk` — renders that word as its label with the base pill style and does not fail the build
- [X] T022 [US3] Run quickstart Scenario 4, then remove any temporary entries added during verification

**Checkpoint**: All three stories complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T023 Run quickstart Scenario 5 — every entry off and the study inactive produces **no** updates area at all, no heading and no empty container; then entries off with study on, and entries on with study off; plus an entry with no link and an entry with no blurb
- [X] T024 Run quickstart Scenario 6 — narrow to phone width and confirm the widget stacks cleanly without pushing the page sideways; tab through and confirm focus indicators and link text; confirm the area is announced as a named region and that type labels do not rely on colour alone
- [X] T025 [P] In `README.md`, document `_data/updates.yml` under "Adding content": the fields, that internal links are written as site-root paths, that `active: false` hides an entry, that `pinned` promotes one, and where the limit lives
- [X] T026 [P] In `CLAUDE.md`, note that the updates widget is hand-curated and never aggregates from `_posts/` or bookmarks, and that it reads feature 007's study record without owning it
- [X] T027 [P] Regression check: the hero — eyebrow, headline, subheadline and all five links — is unchanged against the T002 baseline, and `/journey/`, `/stories/`, `/research/`, `/bookmarks/` and `/contact/` still return 200 with the research page's own callout behaving as feature 007 left it
- [X] T028 Confirm `_data/study.yml` and `_includes/study-callout.html` were not modified by this feature, per the dependency contract in [contracts/update-record.md](contracts/update-record.md)
- [X] T029 Confirm the Constitution Check in [plan.md](plan.md) still holds after implementation: no JavaScript added, no plugin, no build step, no external asset
- [X] T030 Leave the study switched off and the data file holding only entries traceable to existing site content, then record in the completion notes what the author still needs to curate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Setup — **blocks all three stories**
- **US1 (Phase 3)**: depends on Foundational
- **US2 (Phase 4)**: depends on Foundational and on US1's section markup (T006), which it widens; also depends on feature 007 already being in place
- **US3 (Phase 5)**: depends on Foundational and on US1 rendering something observable to verify against
- **Polish (Phase 6)**: depends on every story you intend to ship

### User Story Dependencies

- **US1 (P1)**: independent once Foundational is done
- **US2 (P1)**: depends on US1's section existing, and on feature 007 (already implemented and verified)
- **US3 (P2)**: depends on US1 — it verifies author control over what US1 renders, so it needs something rendered to observe

### Parallel Opportunities

- T002 in Setup
- T025, T026 and T027 in Polish touch three different files
- Not parallelisable: everything in Phases 2–5 funnels through `_includes/updates-widget.html` or `assets/css/style.css`, and the verification tasks in US3 all manipulate the same data file. Run them in sequence

---

## Implementation Strategy

**MVP**: Phases 1–3 (13 tasks). The home page gains a "what's new" area — the thing the spec says the page has been missing, since it is currently a hero and a row of links with nothing that changes.

**Recommended first release**: MVP plus Phase 4 (US2). Both are P1, and Phase 4 is small — it widens one gate and adds one include call, because feature 007 already did the hard part. It also closes out 007's unverified User Story 3.

**Then**: US3, which is verification of author control rather than new rendering, so it adds confidence rather than visible capability.

**A note on seeded content**: T003 seeds the file from entries that already exist elsewhere in the repository. Nothing is invented. What the author still owes is curation — deciding which items deserve the home page and writing blurbs in their own voice.
