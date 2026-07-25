---

description: "Task list for Journey Storytelling and Usability"
---

# Tasks: Journey Storytelling and Usability

**Input**: Design documents from `specs/005-journey-storytelling/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: No automated test tasks. The spec does not request TDD, and this is a static site with no test harness — validation is the browser and build checks in [quickstart.md](quickstart.md), referenced from the tasks below.

**Organization**: Tasks are grouped by user story so each can be implemented and verified on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel — different file, no dependency on unfinished work
- **[Story]**: Which user story the task serves (US1–US5)

## Path Conventions

This is a static Jekyll site with no application source tree. Every task touches one of four real files:

- `_includes/journey-timeline.html` — the track markup
- `assets/css/style.css` — the journey section of the stylesheet
- `journey.md` — the page and its framing copy
- `_data/journey.yml` — the milestone records

> **On parallelism**: most work lands in the include and the stylesheet, so genuine `[P]` opportunities are few. Tasks are marked `[P]` only when they touch a different file and nothing unfinished depends on them. Do not parallelise two tasks that edit the same file.

---

## Phase 1: Setup

**Purpose**: Establish a known-good baseline to compare against

- [X] T001 Confirm a clean baseline: run `bundle exec jekyll build` and verify it completes with no Liquid errors, then serve the site and confirm `http://127.0.0.1:4000/cristiane/journey/` returns 200
- [X] T002 [P] Capture a baseline reference of the current journey page for before/after comparison, saving it outside the repository *(adapted: captured the rendered HTML and stylesheet rather than screenshots — no browser screenshot tool available in this environment; visual comparison at 375px/1280px remains for the author)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Convert each stop into a native disclosure without changing how the collapsed track looks

**⚠️ CRITICAL**: US1 and US4 cannot begin until this phase is complete. The collapsed track must look identical to the baseline when this phase ends.

- [X] T003 In `_includes/journey-timeline.html`, wrap each stop's existing badge, flag, label and org in a `<summary>`, inside a `<details name="journey">` element per the rendering shape in [plan.md](plan.md); add an empty detail container after the summary. Keep the `journey__stop` class and its category modifier on the `<details>` so existing styling still applies
- [X] T004 In `assets/css/style.css`, hide the default disclosure triangle (`summary::-webkit-details-marker` and `list-style: none`), set `cursor: pointer` on the summary, and confirm the collapsed track renders pixel-identically to the T002 screenshots
- [X] T005 In `assets/css/style.css`, add a visible focus indicator for `summary:focus-visible` consistent with the existing focus treatment elsewhere in the stylesheet

**Checkpoint**: The track looks unchanged when collapsed. Activating a stop opens an empty panel and closes any other open stop.

---

## Phase 3: User Story 1 — Read the story behind each milestone (Priority: P1) 🎯 MVP

**Goal**: Expanding a stop reveals the full title and description already recorded for that milestone.

**Independent Test**: Load the journey page, activate any stop, confirm its full title and description appear and match the data file; activate a second stop and confirm the first collapses; activate the Chevron stop (empty description) and confirm it expands cleanly.

- [X] T006 [US1] In `_includes/journey-timeline.html`, render `milestone.title` inside the detail container, omitting the element entirely when the field is empty
- [X] T007 [US1] In `_includes/journey-timeline.html`, render `milestone.place` and `milestone.note` inside the detail container, each omitted entirely when empty, per the empty-field rules in [data-model.md](data-model.md)
- [X] T008 [US1] In `assets/css/style.css`, style the detail panel: readable measure, muted body colour, spacing that separates it from the summary without shifting the badge
- [X] T009 [US1] In `assets/css/style.css`, widen an open stop's column to a readable width on wide screens via `details[open]`, per decision 3 in [research.md](research.md); confirm closed stops keep their current narrow width
- [X] T010 [US1] Verify the whole page still does not scroll sideways with a stop open at any width — the spec's horizontal-overflow edge case
- [X] T011 [US1] Run quickstart Scenario 1 (read the story) and Scenario 2 (works with JavaScript disabled)

**Checkpoint**: US1 is complete and independently shippable. The page is already more useful than before, with no other story done.

---

## Phase 4: User Story 2 — Use the timeline on any device (Priority: P1)

**Goal**: Vertical and page-scrolled on phones; horizontal with a live edge affordance on wide screens.

**Independent Test**: At a narrow width the timeline stacks vertically and scrolls with the page; at a wide width it runs horizontally with an edge shadow that appears only while stops remain past the edge.

- [X] T012 [US2] In `assets/css/style.css`, add a small-screen media query that switches `.journey__track` to a column, drops the full-bleed margins and horizontal scrolling, and re-orients the rail to run vertically; reuse the site's existing breakpoint rather than introducing a new one
- [X] T013 [US2] In `assets/css/style.css`, confirm an open stop in the vertical layout expands in flow beneath its summary and does not inherit the widened-column rule from T009
- [X] T014 [US2] In `assets/css/style.css`, add CSS scroll shadows to the horizontal track using paired gradients with `background-attachment: local, scroll`, per decision 2 in [research.md](research.md), so the affordance disappears on its own at each end
- [X] T015 [US2] Verify keyboard operation end to end: the track container is reachable and scrolls with arrow keys, each summary is reachable and toggles with Enter/Space, and focus stays on the activated summary
- [X] T016 [US2] Run quickstart Scenario 3 (any device) and Scenario 4 (keyboard only)

**Checkpoint**: US1 and US2 both work independently. This is the sensible stopping point for a first release.

---

## Phase 5: User Story 3 — Understand the arc at a glance (Priority: P2)

**Goal**: Framing copy names the throughline and the multi-country path.

**Independent Test**: Reading above the track, a visitor can state the throughline connecting the career to the research, and can see that the path crossed several countries.

- [X] T017 [P] [US3] In `journey.md`, add the throughline sentence connecting the industry-to-academia arc to the research focus (human-computer interaction, human-AI collaboration, the human side of information security), keeping the author's voice and the existing lowercase tagline
- [X] T018 [US3] In `journey.md`, add the geography line with the country count derived from the distinct `flag` values in `site.data.journey` rather than typed as a literal, per decision 5 in [research.md](research.md)
- [X] T019 [US3] In `assets/css/style.css`, style the framing copy so it reads as a lead-in without competing with the page heading or the tagline
- [X] T020 [US3] Run quickstart Scenario 5, including the drift check: temporarily add a milestone with an unused flag, rebuild, confirm the count rises by one, then remove it

**Checkpoint**: The page explains itself before the visitor touches anything.

---

## Phase 6: User Story 4 — Anchor each milestone in time (Priority: P2)

**Goal**: The period slot exists and renders correctly when a period is supplied. Structure only — no dates are populated in this feature, per the decision recorded in Assumptions.

**Independent Test**: Supply a period to one milestone and confirm it appears in that stop's detail and nowhere on the collapsed track; confirm a milestone without a period renders no empty date element.

- [X] T021 [P] [US4] In `_data/journey.yml`, document the optional `period` field in the header comment block alongside the existing field documentation; do not add values to any milestone
- [X] T022 [US4] In `_includes/journey-timeline.html`, render `milestone.period` inside the detail container only, omitting the element entirely when empty
- [X] T023 [US4] Confirm no `period` value can reach the collapsed surface: check the `<summary>` markup, not the whole page — detail content is present in the HTML even while collapsed, so a page-wide grep for years would report false matches
- [X] T024 [US4] Run quickstart Scenario 6, adding a temporary period to one milestone and removing it afterwards

**Checkpoint**: Dates can be added later as a pure content edit, with no template change.

---

## Phase 7: User Story 5 — Legible, consistent badges (Priority: P3)

**Goal**: Uniform badge sizes, with category distinguishable without colour.

**Independent Test**: First and last badges are the same size, the rail still brightens across the track, and academia and industry are tellable apart in a greyscale screenshot.

- [X] T025 [US5] In `_includes/journey-timeline.html`, remove the `--badge` size interpolation and the `style` attribute it feeds, and delete the now-unused `last`/`grow`/`badge` Liquid assignments
- [X] T026 [US5] In `assets/css/style.css`, set a single badge diameter chosen so every logo — including the wordmarks for Alabama and FGV — stays legible, and confirm the rail gradient still runs from muted to accent
- [X] T027 [US5] In `assets/css/style.css`, give each category a distinct ring style in addition to its colour (solid for academia, dashed for industry) and mirror the same styles in the legend, per decision 4 in [research.md](research.md)
- [X] T028 [US5] In `_includes/journey-timeline.html`, name the milestone's category in words inside the detail container, so the distinction is available as text and to screen readers
- [X] T029 [US5] Run quickstart Scenario 7, including the greyscale check

**Checkpoint**: All five stories complete.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T030 Review the legend and the "scroll →" hint in `journey.md` — the hint is misleading in the vertical layout and should be hidden below the breakpoint or reworded
- [X] T031 [P] Regression check: `/stories/`, `/bookmarks/`, `/research/` and `/contact/` are unchanged, all eleven logos still load, and no request goes to an external host
- [X] T032 [P] Update `specs/004-journey-and-search/plan.md` with a short note that FR-005's badge growth is superseded by this feature, so the two specs do not contradict each other
- [X] T033 [P] Update `CLAUDE.md` if any convention changed — in particular that the journey track is a native disclosure and must stay script-free
- [X] T034 Run the full [quickstart.md](quickstart.md) end to end, including the build check and the regression checks
- [X] T035 Confirm the Constitution Check in [plan.md](plan.md) still holds after implementation: no JavaScript added, no plugin, no external asset

---

## Phase 9: Follow-on — Organisation logos and links (after implementation)

Requested by the author once the feature was live. Recorded here rather than
edited into the phases above, so the original run stays readable as history.

- [X] T036 Replace the Alabama, Tetra Pak, HelloFresh, ADP, FGV, Sicredi and Getnet logo files with author-supplied artwork; resize to the rendered badge size and strip the colour profiles the source files carried. `fgv.png`→`fgv.svg`, `tetrapak.svg`→`tetrapak.png`, `alabama.svg`→`alabama.png`
- [X] T037 Make the Tetra Pak source's white JPEG background transparent and trim its margin, so it does not show as a white square inside the dark circular badge
- [X] T038 Add an optional `url` field to each milestone in `_data/journey.yml`, documented in the file's header comment
- [X] T039 In `_includes/journey-timeline.html`, wrap the badge logo in a link to `url` when one is set, and the org name in the detail likewise; both `target="_blank" rel="noopener"`. Keep the no-`url` path rendering plain content
- [X] T040 In `assets/css/style.css`, remove `.journey__category` and `.journey__detail-category` and add the badge-link and org-link rules
- [X] T041 In `_includes/journey-timeline.html`, remove the category word from the track pill and from the detail meta line, leaving ring style and the legend as the FR-013 cues
- [X] T042 Verify in a real browser that clicking a badge logo follows the link **without** toggling the stop, and that clicking the label still toggles without navigating — the whole design rests on this, and it must hold with no script
- [X] T043 Record the amendments in [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md) and [quickstart.md](quickstart.md), and update `CLAUDE.md` with the two new conventions

**Checkpoint**: logos are the author's own artwork, each links to its organisation, and no stop names its category.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Setup — **blocks US1 and US4**
- **US1 (Phase 3)**: depends on Foundational
- **US2 (Phase 4)**: depends on Foundational; T013 also depends on T009
- **US3 (Phase 5)**: depends only on Setup — touches `journey.md`, not the track markup
- **US4 (Phase 6)**: depends on Foundational and on US1's detail container (T006–T007)
- **US5 (Phase 7)**: depends only on Setup — independent of the disclosure work
- **Polish (Phase 8)**: depends on every story you intend to ship

### User Story Dependencies

- **US1 (P1)**: independent once Foundational is done
- **US2 (P1)**: independent once Foundational is done; one styling task references US1's open-column rule
- **US3 (P2)**: fully independent — could be done first if you want a quick win
- **US4 (P2)**: depends on US1, since the period renders inside US1's detail container
- **US5 (P3)**: fully independent — could be done at any point

### Parallel Opportunities

Genuine parallelism is limited because the include and the stylesheet carry most of the work. Real opportunities:

- T017 (`journey.md`) and T021 (`_data/journey.yml`) touch neither the include nor the stylesheet
- **US3** and **US5** can proceed alongside the Foundational and US1 work — different files, no shared dependency
- T031, T032, T033 in Polish are three separate files

Not parallelisable: anything in Phase 2, and any two tasks both editing `assets/css/style.css` or `_includes/journey-timeline.html`.

---

## Implementation Strategy

**MVP**: Phase 1 → Phase 2 → Phase 3 (US1). Eleven tasks. This alone delivers the point of the feature — the descriptions already written in the data file become readable — and is shippable on its own.

**Recommended first release**: MVP plus Phase 4 (US2). Adding the detail view without the responsive work would make the page longer while still awkward on a phone, so these two P1 stories belong together.

**Then, in any order**: US3 (framing copy), US5 (badges and colour cue), US4 (period slot, after US1).

**A note before starting Phase 7**: US5 reverses the badge growth built in feature 004, which the author saw and kept at the time. Confirm the change is wanted before doing T025–T026 — the spec records the supersession, but the earlier behaviour was a deliberate choice, not an oversight.
