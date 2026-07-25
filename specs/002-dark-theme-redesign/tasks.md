# Tasks: Dark Theme Redesign

**Input**: Design documents from `specs/002-dark-theme-redesign/`

**Prerequisites**: plan.md (required), spec.md (required), research.md (color/typography decisions)

**Tests**: No tests requested — validation is visual inspection per quickstart.md.

**Organization**: Tasks are grouped by user story. Since all changes target the same CSS file, tasks within a story are sequential. Stories build on each other (each adds to the same `style.css`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Prepare the include file for the dark theme

- [x] T001 Add `<meta name="theme-color" content="#0d1117">` to `_includes/head.html`

**Checkpoint**: Head include updated — no visual change yet

---

## Phase 2: User Story 1 — Dark Techy Visual Identity (Priority: P1) 🎯 MVP

**Goal**: Replace the light theme with the dark color palette across all pages

**Independent Test**: Load every page (Home, Portfolio, Projects, Blog, Curation, 404). All should have dark background (#0d1117), off-white text (#e6edf3), accent blue links (#58a6ff), and dark gray borders (#21262d). No remnant of the old light theme.

### Implementation for User Story 1

- [x] T002 [US1] Replace base colors in the Reset & Base section of `assets/css/style.css`: background `#0d1117`, text `#e6edf3`, link color `#58a6ff`, link hover `#79c0ff`
- [x] T003 [US1] Update Navigation styles in `assets/css/style.css`: brand color to `#e6edf3`, nav link color to `#8b949e`, active/hover to `#58a6ff`, border to `#21262d`, summary color to `#8b949e`
- [x] T004 [US1] Update Footer styles in `assets/css/style.css`: border to `#21262d`, text to `#8b949e`, link color to `#8b949e`, link hover to `#58a6ff`
- [x] T005 [US1] Update Home page styles in `assets/css/style.css`: tagline color to `#8b949e`
- [x] T006 [US1] Update Blog post list styles in `assets/css/style.css`: time color to `#8b949e`, excerpt color to `#8b949e`
- [x] T007 [US1] Update Project list and detail styles in `assets/css/style.css`: description color to `#8b949e`, image border to `#21262d`, tool chip background to transparent with `#21262d` border
- [x] T008 [US1] Verify all six pages display the dark palette with no light-theme remnants

**Checkpoint**: All pages show the dark color palette. MVP is visually complete.

---

## Phase 3: User Story 2 — Typography with Developer Feel (Priority: P2)

**Goal**: Apply monospace font to headings, nav, dates, and chips; keep sans-serif for body text

**Independent Test**: On any page, headings are monospace. On the blog index, dates are monospace. On a project page, tool chips are monospace. Body paragraphs remain sans-serif.

### Implementation for User Story 2

- [x] T009 [US2] Add monospace font-family variable/rule to headings (h1–h6) in `assets/css/style.css` using stack: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace`
- [x] T010 [US2] Apply monospace font to `.site-nav__brand`, `.site-nav__links a`, and `.site-nav__menu > summary` in `assets/css/style.css`
- [x] T011 [US2] Apply monospace font to all `time` elements and `.post-list__item time` in `assets/css/style.css`
- [x] T012 [US2] Style `.project__tools li` as bordered pills with monospace font, accent-colored border, rounded corners, and transparent background in `assets/css/style.css`

**Checkpoint**: Developer typography is applied across all pages.

---

## Phase 4: User Story 3 — Accessible Contrast and Focus States (Priority: P3)

**Goal**: Ensure all color combinations pass WCAG AA and keyboard focus is clearly visible

**Independent Test**: Check contrast ratios with a WCAG tool. Tab through all interactive elements and verify accent-colored focus outlines appear.

### Implementation for User Story 3

- [x] T013 [US3] Add global focus style `a:focus-visible { outline: 2px solid #58a6ff; outline-offset: 2px; }` in `assets/css/style.css`
- [x] T014 [US3] Add focus styles for `.site-nav__links a:focus-visible` and `.site-nav__menu > summary:focus-visible` in `assets/css/style.css`
- [x] T015 [US3] Verify contrast ratios: `#e6edf3` on `#0d1117` (≥4.5:1), `#58a6ff` on `#0d1117` (≥4.5:1), `#8b949e` on `#0d1117` (≥4.5:1)

**Checkpoint**: Accessibility validated — all contrast passes AA, focus states visible.

---

## Phase 5: User Story 4 — Styled Code Blocks and Content Elements (Priority: P4)

**Goal**: Style code blocks, inline code, and blockquotes to fit the dark theme

**Independent Test**: View a blog post containing a fenced code block, inline code, and a blockquote. All should look intentional on the dark background.

### Implementation for User Story 4

- [x] T016 [US4] Add `pre` and `code` styles in `assets/css/style.css`: code block background `#1c2128`, border `#21262d`, monospace font, `#e6edf3` text, padding, border-radius, overflow-x auto
- [x] T017 [US4] Add inline `code` styles (not inside `pre`) in `assets/css/style.css`: background `#1c2128`, padding, border-radius, font-size slightly smaller
- [x] T018 [US4] Add `blockquote` styles in `assets/css/style.css`: left border `3px solid #21262d` (or accent), padding-left, italic or muted text color `#8b949e`
- [x] T019 [US4] Add a sample blog post with code block, inline code, and blockquote to `_posts/` to validate styling (can be removed after validation)

**Checkpoint**: All content elements are styled for comfortable reading on the dark background.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency pass and cleanup

- [x] T020 Verify mobile responsiveness at 320px, 768px, 1024px, and 1920px viewports — no layout regressions in `assets/css/style.css`
- [x] T021 Verify mobile `<details>` menu opens/closes correctly with the dark theme
- [x] T022 Run through all validation scenarios in `specs/002-dark-theme-redesign/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **US1 Dark Palette (Phase 2)**: Depends on Phase 1 — establishes all base colors
- **US2 Typography (Phase 3)**: Depends on Phase 2 — adds fonts on top of the dark palette
- **US3 Accessibility (Phase 4)**: Depends on Phase 2 — validates and adds focus states
- **US4 Code Blocks (Phase 5)**: Depends on Phase 2 — adds content element styles
- **Polish (Phase 6)**: Depends on all previous phases

### Within Each User Story

- All tasks modify `assets/css/style.css` — run sequentially within each story
- US2, US3, and US4 can conceptually run in parallel after US1, but since they all modify the same file, sequential execution is recommended

### Parallel Opportunities

- T013 and T016 could be worked simultaneously if editing different sections of `style.css`
- T019 (sample post) can be created in parallel with T016–T018

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (meta tag)
2. Complete Phase 2: Dark palette across all pages
3. **STOP and VALIDATE**: Every page should show the dark theme
4. This is a usable, deployable dark theme even without typography or code block refinements

### Full Delivery

1. Phase 1: Setup → meta tag
2. Phase 2: US1 Dark palette → dark theme on all pages
3. Phase 3: US2 Typography → monospace developer feel
4. Phase 4: US3 Accessibility → focus states and contrast validation
5. Phase 5: US4 Code blocks → styled content elements
6. Phase 6: Polish → final responsive and quickstart validation

---

## Notes

- All tasks modify at most 2 files: `assets/css/style.css` and `_includes/head.html`
- No new files are created (except the optional sample blog post in T019)
- No JavaScript, no external dependencies, no structural changes
- Commit after each phase for clean, reviewable history
