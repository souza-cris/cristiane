---

description: "Task list for Research Page Call for Participants"
---

# Tasks: Research Page Call for Participants

**Input**: Design documents from `specs/007-research-call-for-participants/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: No automated test tasks. The spec does not request TDD and the site has no test harness — validation is the build and browser checks in [quickstart.md](quickstart.md), referenced from the tasks below.

**Organization**: Tasks are grouped by user story so each can be implemented and verified on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel — different file, no dependency on unfinished work
- **[Story]**: Which user story the task serves (US1–US3)

## Path Conventions

Static Jekyll site, no application source tree. Tasks touch these files:

- `_data/study.yml` — **new**, the single study record
- `_includes/study-callout.html` — **new**, one include, two variants
- `research.md` — renders the full callout
- `assets/css/style.css` — callout styling
- `README.md`, `CLAUDE.md` — author documentation

> **Content dependency**: the real study text is not yet available. Every task below is buildable and verifiable with the study switched off. Nothing invents study content — see T003.

---

## Phase 1: Setup

**Purpose**: Establish a known-good baseline

- [X] T001 Confirm a clean baseline: run `bundle exec jekyll build`, verify no Liquid errors, then serve and confirm `http://127.0.0.1:4000/cristiane/research/` returns 200
- [X] T002 [P] Record the current research page output for later comparison, saving it outside the repository, so the regression check in T028 has something to compare against

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The study record and the include's plumbing, before any variant renders

**⚠️ CRITICAL**: All three user stories depend on this phase.

- [X] T003 Create `_data/study.yml` with every field from [contracts/study-record.md](contracts/study-record.md) — `active`, `title`, `description`, `summary`, `eligibility`, `involves`, `action_label`, `action_url`, `deadline` — with `active: false` and the content fields left **empty**. Add header comments naming what each field is for. **Do not write study text**: no title, eligibility, or claims may be invented, and the author supplies the real content (which for human-subjects research is the IRB-approved wording). The empty scaffold is structure, not placeholder prose
- [X] T004 Create `_includes/study-callout.html` accepting a `variant` parameter that defaults to `full`, emitting a single `<section class="study-callout study-callout--{variant}">` with `aria-labelledby="study-callout-{variant}"` per the render shape in [plan.md](plan.md); no fields rendered yet
- [X] T005 In `_includes/study-callout.html`, render the eyebrow ("call for participants") and the `title` as an `<h2>` carrying the variant-scoped id, so the section has an accessible name matching its visible heading

**Checkpoint**: The site builds. The include exists and produces a named, empty section when called.

---

## Phase 3: User Story 1 — Learn about the study and take part (Priority: P1) 🎯 MVP

**Goal**: With an active study, the research page shows a call for participants a visitor can read and act on.

**Independent Test**: Temporarily set `active: true` with sample content, load the research page, and confirm the callout shows title, description, eligibility, what's involved, the deadline when set, and a working action link — visually distinct from the interests and publications.

- [X] T006 [US1] In `_includes/study-callout.html`, render `description` for the full variant
- [X] T007 [US1] In `_includes/study-callout.html`, render `eligibility` and `involves` as a definition list, full variant only, each omitted when empty
- [X] T008 [US1] In `_includes/study-callout.html`, render `deadline` when present and omit the element entirely when absent, per the empty-field rules in [data-model.md](data-model.md)
- [X] T009 [US1] In `_includes/study-callout.html`, render the action as `action_label` linking to `action_url` used exactly as written — no scheme inferred, per decision 4 in [research.md](research.md). Add `target="_blank" rel="noopener"` only for `http`/`https` destinations, matching the bookmarks treatment; `mailto:` links get neither
- [X] T010 [US1] In `research.md`, include the callout with `variant="full"`, positioned after the research interests and before the publications
- [X] T011 [US1] In `assets/css/style.css`, style the callout so it reads as an invitation rather than another list item — distinct surface, clear heading, prominent action — using the site's existing dark-theme variables and no colour-only meaning
- [X] T012 [US1] In `assets/css/style.css`, add a visible focus indicator for the action link consistent with the existing focus treatment
- [X] T013 [US1] Run quickstart Scenario 1, using temporary sample content with `active: true`, then set `active: false` and clear the sample content again

**Checkpoint**: US1 is complete. The research page can host a real call for participants the moment content and the toggle arrive.

---

## Phase 4: User Story 2 — Open and close recruitment with one toggle (Priority: P1)

**Goal**: `active` is the single control, and the site behaves correctly when the study is off or the record is missing entirely.

**Independent Test**: Toggle `active` on and off, rebuilding each time, and confirm the callout appears and disappears with no template edits and no content loss. Rename the data file away and confirm the site still builds.

- [X] T014 [US2] In `_includes/study-callout.html`, gate the whole render on the study record existing **and** `active` being true, so the include emits nothing at all when either is false
- [X] T015 [US2] Verify the absent-file case: temporarily rename `_data/study.yml`, rebuild, and confirm the site builds and the research page renders its interests and publications normally; restore the file
- [X] T016 [US2] Confirm the include is self-gating from the caller's perspective — `research.md` needs no surrounding condition, per the include contract in [contracts/study-record.md](contracts/study-record.md)
- [X] T017 [US2] In `_data/study.yml`, add a comment for the author stating that `active` is the only reliable control and a passed `deadline` does **not** hide the callout, because the site rebuilds when changes are published rather than on a schedule
- [X] T018 [US2] Run quickstart Scenario 2 in both directions, confirming the study's content survives being switched off

**Checkpoint**: US1 and US2 both work. This is the shippable set — the mechanism is complete and safe to merge with the study switched off.

---

## Phase 5: User Story 3 — One study, surfaced in both places (Priority: P2)

**Goal**: The compact variant is ready for feature 006 to call, and the study's words exist in exactly one file.

**Independent Test**: Render the include with `variant="compact"` and confirm it shows title, summary (or description), deadline and action — and does not show eligibility or what's involved. Edit the title once and confirm the change flows to every render.

> **Scope**: this story is only half-verifiable here. Rendering on the home page is feature 006's call site; the end-to-end "edit once, both pages change" check belongs to 006.

- [X] T019 [US3] In `_includes/study-callout.html`, make the compact variant render `summary` when present and fall back to `description` when absent, per decision 6 in [research.md](research.md)
- [X] T020 [US3] In `_includes/study-callout.html`, ensure the compact variant omits `eligibility` and `involves` entirely, keeping title, body, deadline and action
- [X] T021 [US3] In `assets/css/style.css`, style `study-callout--compact` as a tighter block suitable for sitting under the home page hero, without duplicating the full variant's rules
- [X] T022 [US3] Verify the include contract feature 006 depends on: one root element, self-gating, variant-scoped heading id, class root `study-callout`. Confirm each guarantee in [contracts/study-record.md](contracts/study-record.md) holds
- [X] T023 [US3] Confirm the study's words appear in exactly one file — nothing copied into `research.md`, the include, or the stylesheet
- [X] T024 [US3] Run quickstart Scenario 3, noting in the result that the home page half is deferred to feature 006

**Checkpoint**: All three stories complete to the extent this feature can deliver them.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T025 Run quickstart Scenario 4 — remove `deadline`, remove `summary`, and remove the whole data file in turn, confirming each renders no broken fragment and the build never fails
- [X] T026 Run quickstart Scenario 5 — narrow to phone width and confirm the callout wraps cleanly without hiding the interests or publications; tab to the action and confirm the focus indicator and link text; confirm the section is announced as a named region
- [X] T027 [P] In `README.md`, document `_data/study.yml` under "Adding content": the fields, that `action_url` must be complete including `mailto:`, and that `active` is the switch
- [X] T028 [P] In `CLAUDE.md`, note that the study record is the single source read by both the research page and the home widget, and that study content is author-supplied and never generated
- [X] T029 [P] Regression check: `/`, `/stories/`, `/bookmarks/`, `/journey/` and `/contact/` are unchanged, and the research page still shows its interests paragraph and all five publications in order
- [X] T030 Confirm the Constitution Check in [plan.md](plan.md) still holds after implementation: no JavaScript added, no plugin, no build step, no external asset, and no participant data touched by the site
- [X] T031 Leave the study switched off and record in the completion notes that going live still requires the author's content and the pre-launch checklist at the end of [quickstart.md](quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Setup — **blocks all three stories**
- **US1 (Phase 3)**: depends on Foundational
- **US2 (Phase 4)**: depends on Foundational; independent of US1, though easiest to verify once US1 renders something
- **US3 (Phase 5)**: depends on Foundational and on US1's field rendering (T006–T009), since the compact variant reuses those fields
- **Polish (Phase 6)**: depends on every story you intend to ship

### User Story Dependencies

- **US1 (P1)**: independent once Foundational is done
- **US2 (P1)**: independent once Foundational is done — the gate is its own concern
- **US3 (P2)**: depends on US1; also has an external dependency on feature 006 for its home page half, which is out of scope here

### Parallel Opportunities

- T002 (baseline capture) runs alongside nothing else — it is the only Setup task with a `[P]`
- T027, T028 and T029 in Polish touch three different files and can run together
- Not parallelisable: everything in Phases 2–5 funnels through `_includes/study-callout.html` or `assets/css/style.css`. Two tasks editing the same file must run in sequence

---

## Implementation Strategy

**MVP**: Phases 1–3 (13 tasks). The research page can host a complete call for participants.

**Recommended merge point**: MVP plus Phase 4 (US2). Without the toggle, the only way to close recruitment is to delete content — which is exactly what the spec set out to avoid. These two P1 stories belong together, and the pair is safe to merge because the study ships switched off.

**Then**: US3, which is preparation for feature 006 rather than something a visitor sees today.

**Before going live**: the study content is still outstanding. The pre-launch checklist at the end of [quickstart.md](quickstart.md) is the gate — real content, a verified `action_url`, and `active: true` set only when recruitment is genuinely open.
