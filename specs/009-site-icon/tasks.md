# Tasks: Site Icon and Brand Mark

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

**Note on what is already done**: User Story 4 (the mark on the home page) shipped ahead of
this plan, in commits `35e0c9a` and `969d3b9`. Its tasks are listed in Phase 6 and marked
complete so the record is whole. Everything else is outstanding.

## Format: `[ID] [P?] [Story] Description`

- **[P]** — can run in parallel with other [P] tasks (different files, no shared dependency)
- **[Story]** — the user story this serves

## Path Conventions

Static Jekyll site at the repository root. Assets in `assets/img/`, with `favicon.ico` at the
repository root by necessity. Head declarations in `_includes/head.html`.

---

## Phase 1: Setup

- [X] T001 Place the author's icon artwork at `assets/img/icon.svg`, using her supplied file as-is — no redrawing, recolouring or re-cropping (FR-002). It is a file of its own, not a copy of the home mark, per decision 3 in [research.md](research.md)
- [X] T002 Confirm `rsvg-convert` and Pillow are available locally, per the regeneration section of [quickstart.md](quickstart.md). Neither is a site dependency — they author the raster files and are not needed to build or serve

**Checkpoint**: the source artwork is in the repository; nothing is declared yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T003 Generate `assets/img/apple-touch-icon.png` at 180×180 from `assets/img/icon.svg`, flattened to RGB so it carries no alpha — iOS composites on black and would otherwise show black corners (see data-model validation rules)
- [X] T004 Generate `favicon.ico` carrying 32×32 and 16×16, written to the **repository root** so it publishes to `/cristiane/favicon.ico`. It must not live under `assets/`, or a bare-root request stops resolving
- [X] T005 Confirm no generated file carries an embedded colour profile, and that both are small — the `.ico` around 2KB, the PNG a few KB

**Checkpoint**: all three files exist and are committed. Still nothing declared, so no browser uses them yet.

---

## Phase 3: User Story 1 — Recognise the site among many open tabs (Priority: P1) 🎯 MVP

**Goal**: Every page offers the mark to the browser, so tabs, bookmarks and history stop showing the blank placeholder.

**Independent Test**: Open the site beside several other tabs and confirm this one is identifiable without reading titles. Bookmark it and confirm the bookmark shows the mark.

- [X] T006 [US1] In `_includes/head.html`, declare the SVG icon — `rel="icon"` with `type="image/svg+xml"` pointing at `assets/img/icon.svg`, through `relative_url`, per the head contract in [contracts/icon-declaration.md](contracts/icon-declaration.md)
- [X] T007 [US1] In `_includes/head.html`, declare the `.ico` fallback for browsers without SVG icon support, also through `relative_url`
- [X] T008 [US1] Verify every declared `href` resolves under `/cristiane/` in the built HTML. A bare path would point at the domain root, which is a different site
- [X] T009 [US1] Verify the declarations appear on every built page including `404.html`, and that the icon does not vary by section (FR-003)
- [X] T010 [US1] Run quickstart Scenarios 1 and 2

**Checkpoint**: the tab carries the mark everywhere. This alone is worth shipping.

---

## Phase 4: User Story 2 — Save the site to a phone home screen (Priority: P2)

**Goal**: An iOS home-screen shortcut shows the mark on its tile rather than a screenshot.

**Independent Test**: Add the site to an iPhone home screen and confirm the tile is the mark, opaque and uncropped.

- [X] T011 [US2] In `_includes/head.html`, declare `rel="apple-touch-icon"` pointing at `assets/img/apple-touch-icon.png` through `relative_url`
- [ ] T012 [US2] *(needs a physical device)* On a real iOS or iPadOS device, add the site to the home screen and confirm the tile shows the book with no black corners and nothing clipped by the system's rounding
- [ ] T013 [US2] *(needs a physical device)* Run quickstart Scenario 3

**Checkpoint**: the home-screen shortcut looks deliberate rather than unfinished.

---

## Phase 5: User Story 3 — Stay legible wherever it is shown (Priority: P3)

**Goal**: The mark holds up at 16px and against both light and dark browser chrome.

**Independent Test**: View the tab in a light-themed and a dark-themed browser, and view the icon at its smallest rendered size.

- [X] T014 [US3] Verify the mark is distinguishable against light chrome and against dark chrome. The solid tile should carry its own background, so this is a check that the chosen variant was the tiled one, not the transparent mark
- [X] T015 [US3] Verify the open-book shape is still readable as a shape at 16×16, not a teal blob. If it is not, this is the trigger to tune `icon.svg` for small sizes — which is exactly why it is a separate file from the home mark
- [X] T016 [US3] Run quickstart Scenario 4

**Checkpoint**: all three browser-icon stories complete.

---

## Phase 6: User Story 4 — See the mark on arriving at the site (Priority: P2) — ALREADY SHIPPED

Delivered before this plan existed, in response to a direct request. Recorded for completeness.

- [X] T017 [US4] Add the mark at `assets/img/logo.svg` and render it in `_layouts/default.html`, centred above the content on the home page only
- [X] T018 [US4] Style `.site-logo` in `assets/css/style.css` at 2.5rem, centred
- [X] T019 [US4] Make it decorative — empty `alt`, `aria-hidden`, not a link — and emit it only on home rather than hiding it elsewhere with CSS
- [X] T020 [US4] Verify it renders on home and on no other page, including 404

**Checkpoint**: shipped and deployed.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T021 [P] Confirm `theme-color` is still `#0d1117` and was not changed to the brand teal — the page it frames is not teal (decision 5 in [research.md](research.md))
- [X] T022 [P] Confirm no request goes to an external host and `search.js` is still the only script
- [X] T023 [P] Confirm the home page mark still renders and is unaffected — it is a separate file and must not have been swept into this work
- [X] T024 [P] Update `README.md` with the new asset paths and how to regenerate them
- [X] T025 [P] Update `CLAUDE.md`: `favicon.ico` lives at the repository root on purpose, `icon.svg` and `logo.svg` are deliberately separate files, and the raster files are generated not hand-made
- [X] T026 Update the spec's Status once the browser icon ships, and correct FR-006 to say the site's own root rather than the conventional root path — the domain root belongs to another repository and cannot be served from here (decision 1 in [research.md](research.md))
- [X] T027 Run the full [quickstart.md](quickstart.md) end to end, including the build check and every regression check

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)** → **Phase 2 (Foundational)** → all user stories
- **US1 (Phase 3)** is the MVP and blocks nothing
- **US2 (Phase 4)** needs T003's touch icon from Foundational; otherwise independent of US1
- **US3 (Phase 5)** is verification of what US1 and US2 shipped, so it follows both
- **US4 (Phase 6)** already done, independent of everything here
- **Polish** last

### User Story Dependencies

- **US1 (P1)**: independent once Foundational is done
- **US2 (P2)**: independent once Foundational is done — could ship before US1 if desired
- **US3 (P3)**: depends on US1 and US2 having shipped, since it verifies their output
- **US4 (P2)**: complete, and shares no file with the others except the stylesheet

### Parallel Opportunities

- T003 and T004 both read `icon.svg` and write different files — parallel
- T006/T007 (US1) and T011 (US2) all edit `_includes/head.html` — **not** parallel
- T021–T025 in Polish are five separate files
- US1 and US2 can be worked by different people if the head edits are sequenced

Not parallelisable: any two tasks both editing `_includes/head.html`.

---

## Implementation Strategy

**MVP**: Phase 1 → Phase 2 → Phase 3 (US1). Ten tasks, and the blank tab is gone
everywhere. This is the whole point of the feature and is shippable alone.

**Recommended first release**: MVP plus Phase 4 (US2). The touch icon is generated in
Foundational either way, so declaring it costs one line and closes the iOS case.

**Then**: US3 is verification rather than construction — if it fails, the fix is to tune
`icon.svg`, and the separate-file decision is what makes that safe to do.

**A note before starting**: T001 needs the author's actual icon file. The artwork must be
used as supplied (FR-002); it is not to be traced, re-exported, or approximated from the
home page mark.
