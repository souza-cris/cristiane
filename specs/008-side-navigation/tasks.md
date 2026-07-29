# Tasks: Side Navigation and Uninterrupted Home

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

**Note**: this feature shipped before it was specified. The tasks below are
recorded from the work as it was actually done, which is why they are all
complete. They are written so the feature could be rebuilt from them.

## Format: `[ID] [P?] [Story] Description`

- **[P]** — can run in parallel with other [P] tasks (different files, no shared dependency)
- **[Story]** — the user story this serves

## Path Conventions

Static Jekyll site at the repository root. Templates in `_includes/` and `_layouts/`, styles in `assets/css/style.css`.

---

## Phase 1: Setup

- [X] T001 Confirm the content column's maximum width in `assets/css/style.css` (44rem) and derive the breakpoint at which a fixed menu can no longer sit beside it, per decision 2 in [research.md](research.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T002 In `_layouts/default.html`, add a body class derived from `page.url` — `is-home` on the home page, `is-interior` elsewhere. Both later stories depend on this

**Checkpoint**: every page names itself in its markup; nothing visible has changed yet.

---

## Phase 3: User Story 1 — Move between sections without returning to the top (Priority: P1) 🎯 MVP

**Goal**: A persistent section menu beside the content on every page except home.

**Independent Test**: From the bottom of `/bookmarks/`, reach any other section without scrolling up.

- [X] T003 [US1] Create `_data/sections.yml` with a `label`, `url` and `match` per section, and `_includes/section-links.html` to render it — one `<ul>` whose class the caller supplies, per [contracts/side-nav-include.md](contracts/side-nav-include.md)
- [X] T004 [US1] Create `_includes/side-nav.html` — a `<nav class="side-nav" aria-label="Section navigation">` wrapping `section-links.html`. Point `_includes/nav.html` at the same include so both navigations render one list (FR-008), and confirm each entry's `match` value drives `aria-current` correctly, including child pages (FR-003)
- [X] T005 [US1] In `_layouts/default.html`, include the side nav on every page except home, placed inside `<body>` and outside `<main>`
- [X] T006 [US1] In `assets/css/style.css`, position the menu fixed at the right edge and vertically centered, and style the links in the site's mono face
- [X] T007 [US1] In `assets/css/style.css`, style the current link with a color change **and** a right border, so the state is not color-only (FR-007)
- [X] T008 [US1] In `assets/css/style.css`, keep the site's standard focus ring on the links
- [X] T009 [US1] Run quickstart Scenarios 1 and 2

**Checkpoint**: the menu works on every page including home, which is wrong — Phase 4 fixes it.

---

## Phase 4: User Story 2 — A home page with nothing beside it (Priority: P2)

**Goal**: Home shows no menu and no rules boxing the content.

**Independent Test**: Home has neither the menu markup nor the rules; every other page has both.

- [X] T010 [US2] Confirm T005's condition excludes home, and that the markup is absent from the built home page rather than hidden — a hidden-but-focusable menu is an accessibility bug, per decision 4 in [research.md](research.md)
- [X] T011 [US2] In `assets/css/style.css`, remove the rule below the top navigation and above the footer under `.is-home` only
- [X] T012 [US2] Run quickstart Scenario 3

**Checkpoint**: home reads as one uninterrupted page.

---

## Phase 5: User Story 3 — No second menu where there is no room (Priority: P2)

**Goal**: The menu yields entirely on narrow screens.

**Independent Test**: Below 1000px the menu is gone, nothing overlaps, nothing scrolls sideways.

- [X] T013 [US3] In `assets/css/style.css`, hide `.side-nav` below the T001 breakpoint with `display: none`, so it is neither visible nor focusable
- [X] T014 [US3] Sweep the width from 1100px to 900px and confirm no overlap on the way down and no horizontal scrollbar (FR-004)
- [X] T015 [US3] Run quickstart Scenarios 4 and 5

**Checkpoint**: all three stories complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T016 [P] Regression check: all six pages render, the mobile top nav still works below 600px, and the journey track is not covered at any width
- [X] T017 [P] Confirm no JavaScript was added — `search.js` remains the only script (FR-010)
- [X] T018 [P] Update `README.md` — add the side nav to the structure block and this feature to the spec index
- [X] T019 [P] Update `CLAUDE.md` with the include, the second breakpoint and the rule that the layout owns the home exclusion
- [X] T020 Confirm the Constitution Check in [plan.md](plan.md) holds on all five principles

---

## Phase 7: Correction — the link list belongs in data (after implementation)

This feature first shipped with its links written as markup, duplicating
`_includes/nav.html`, and the plan recorded that as an accepted Principle II
deviation. The owner rejected the deviation: content is data, not markup. The
correction is recorded here rather than edited into the phases above.

- [X] T021 Create `_data/sections.yml` — `label`, `url` and `match` per section, with the file's header comment explaining `exact` vs `prefix`
- [X] T022 Create `_includes/section-links.html`, rendering the list from that data and taking the `<ul>` class as a parameter so both navigations can share it
- [X] T023 Rewrite `_includes/side-nav.html` and `_includes/nav.html` to render through it, removing both hand-written lists
- [X] T024 Verify the built HTML is unchanged from before the extraction — same five links in both navigations on every page, same single `aria-current`, child pages still marking their parent section, base path intact
- [X] T025 Amend the Constitution Check in [plan.md](plan.md) to Pass, and record why the original argument was wrong
- [X] T026 Propagate to [spec.md](spec.md) (FR-008, Key Entities), [data-model.md](data-model.md), [contracts/side-nav-include.md](contracts/side-nav-include.md) and `CLAUDE.md`

**Checkpoint**: the section list exists once, in `_data/sections.yml`.

---

## Phase 8: Correction — one menu at a time, and a navigation blackout (after implementation)

Adding the side navigation put two menus on screen at once above 1000px, and in chasing
that, a pre-existing defect surfaced: **the top navigation's links had stopped painting at
any width of 600px or more.** Between 600px and 999px — where the menu button is hidden and
the side navigation has not appeared — the site had no visible navigation at all. The
desktop home page, which never gets a side navigation, had none either.

**Cause**: `.site-nav__links` sits inside `<details class="site-nav__menu">`. Browsers now
wrap the content of a closed `<details>` in `::details-content` with
`content-visibility: hidden`. The existing `display: flex` on the list computes as `flex`
and reports a layout box, but nothing paints. No code change caused this; a browser change
did, which is why it went unnoticed.

**A note on how this was nearly missed**: an early check counted link bounding boxes and
reported the links as visible, which contradicted the screenshots and led to the concern
being wrongly withdrawn. `getBoundingClientRect` returns non-zero boxes for
content-visibility-hidden descendants — the parent `<ul>` measured 0×0 while its children
claimed boxes extending past the nav's own right edge. Visibility here can only be settled
by what is painted. The fix was verified by counting rendered pixels, not by measuring
boxes.

- [X] T027 In `assets/css/style.css`, hide the top navigation's section list above 1000px on interior pages only, so exactly one menu shows (FR-011). Home is exempt — it has no side navigation and would otherwise be left with nothing
- [X] T028 In `assets/css/style.css`, reveal `::details-content` at 600px and above so the top navigation's links paint, closing the 600–999px blackout and restoring the desktop home navigation (FR-012)
- [X] T029 Verify by rendered pixels, not by element geometry, at 1300px, 800px and 500px on both home and an interior page: exactly one menu visible, and never zero
- [X] T030 Record the browser-behavior trap in `CLAUDE.md` so the `::details-content` rule is not removed as redundant

**Checkpoint**: one menu at every width, and no width without navigation.

---

## Phase 9: Correction — home carries no top menu (after implementation)

Reported by the author: home should not have a menu at the top. It was showing one
directly above the hero's own five section links — the same five destinations twice,
a few centimetres apart.

Phase 8 had made this worse rather than better. It added an explicit carve-out keeping
home's top list visible at every width, on the reasoning that home has no side navigation
and would otherwise be left with nothing. That premise was wrong: home's hero links were
already its navigation and always had been. The carve-out protected against a problem that
did not exist, and preserved the duplication.

Removing the menu also exposed that the hero links were a **third** hand-written copy of
the section list, in `index.md` — surviving the Principle II work only because that pass
looked at includes and never at page content.

- [X] T031 In `index.md`, replace the hand-written hero list with `section-links.html`, wrapped in a labeled `<nav>` so home's navigation is a proper landmark (FR-014)
- [X] T032 In `_layouts/default.html`, leave the header and top navigation out of home entirely, rather than hiding them, so home has no empty navigation landmark (FR-013)
- [X] T033 In `assets/css/style.css`, drop the `.is-interior` qualifier now that no top nav exists on home, and remove the now-dead `.is-home .site-nav` border rule
- [X] T034 Verify by rendered pixels at 1300px, 800px and 500px that home's top strip holds only the site mark, and that its five hero links still render and still reach every section
- [X] T035 Correct FR-011's home exception, and update `CLAUDE.md`, which had recorded the carve-out as "load bearing"

**Checkpoint**: the section list exists once in data and renders in three places; home has
one set of links, not two.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** → **Phase 2** → everything else
- **US1 (Phase 3)** is the MVP and blocks nothing
- **US2 (Phase 4)** depends on T005 existing, since it constrains that condition
- **US3 (Phase 5)** depends on T006, since it hides what that positions
- **Polish** last

### Parallel Opportunities

Limited — the stylesheet and the include carry most of the work. Real opportunities:

- T016, T017, T018 and T019 in Polish are four separate files
- T003 (`_includes/side-nav.html`) and T011 (`assets/css/style.css`) touch different files once T002 is done

Not parallelisable: any two tasks both editing `assets/css/style.css`.

---

## Implementation Strategy

**MVP**: Phase 1 → Phase 2 → Phase 3. Nine tasks, and the menu works — but it also appears on home and overlaps text on narrow screens, so this is not shippable alone.

**Minimum shippable**: MVP plus Phases 4 and 5. The exclusion and the breakpoint are corrections to US1's behavior, not enhancements, so all three stories belong in the first release.

**A note on the breakpoint**: this introduces the site's second breakpoint, at 1000px, alongside the existing 600px. That is deliberate — they describe different constraints — and decision 2 in [research.md](research.md) records why, so it is not later "tidied" into one number.
