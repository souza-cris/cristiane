# Tasks: Content Restructure

**Input**: Design documents from `specs/003-content-restructure/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Remove old content, update config, create data files

- [x] T001 Remove old pages: blog.md, curation.md, portfolio.md, projects.md
- [x] T002 Remove old layout _layouts/project.html
- [x] T003 Remove old data file _data/curation.yml
- [x] T004 Remove old collection directory _projects/ (entire directory)
- [x] T005 Update _config.yml: remove projects collection, update title to "Cris", update description to "PhD student slash researcher slash tech leader slash traveler slash cat lady", update social links (LinkedIn https://www.linkedin.com/in/souzacris/, Google Scholar https://scholar.google.com/citations?user=Zeajh2IAAAAJ&hl=en, GitHub https://github.com/souza-cris), remove old permalink/defaults for projects
- [x] T006 [P] Create _data/research.yml with interests, publications, and methods per data-model.md
- [x] T007 [P] Create _data/bookmarks.yml with sample bookmarks per data-model.md (at least 3 entries of different types)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update default layout (nav + footer) and CSS that all pages depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Update _includes/nav.html: replace old nav links (Home, Portfolio, Projects, Blog, Curation) with new lowercase links (about, stories, research, bookmarks, contact). Keep CSS-only mobile menu using details/summary. Links must use `| relative_url` filter.
- [x] T009 Update _includes/footer.html: replace text links with inline SVG icon links for LinkedIn (https://www.linkedin.com/in/souzacris/), Google Scholar (https://scholar.google.com/citations?user=Zeajh2IAAAAJ&hl=en), and GitHub (https://github.com/souza-cris). Icons open in new tab with `target="_blank" rel="noopener"`. Use `aria-label` for accessibility.
- [x] T010 Update assets/css/style.css: add hero styles (eyebrow text, large headline, subheadline, CTA links), filter pill styles (row of links, accent color for active, aria-current="page"), story item styles (title, date, category, tags, tldr), bookmark item styles (title, type, tags, why-it-matters, key-takeaway, link), research page styles (section headings, bullet lists, publication groups). Ensure responsive layout for 320px–1920px.

**Checkpoint**: Foundation ready — nav, footer, and CSS support all user stories

---

## Phase 3: User Story 1 — Home Page Hero and New Navigation (Priority: P1) MVP

**Goal**: Hero-only home page with eyebrow, headline, subheadline, and section CTAs

**Independent Test**: Load `/cristiane/`. Verify hero displays correctly. Verify nav shows 5 lowercase links. Verify footer shows 3 icon links. Verify no content below CTAs.

### Implementation for User Story 1

- [x] T011 [US1] Rewrite index.md: layout page, hero-only content with eyebrow "Hello, my name is", headline "Cris", subheadline "PhD student slash researcher slash tech leader slash traveler slash cat lady", and CTA links to stories, research, bookmarks, contact using `| relative_url` filter. Remove all existing content below. No `title` in front matter (or blank) to avoid duplicate heading.
- [x] T012 [US1] Update 404.md: ensure it references new nav structure (verify layout: default still works with updated nav)

**Checkpoint**: Home page hero displays correctly, nav and footer work on all pages

---

## Phase 4: User Story 2 — Stories Page with Filter Toggles (Priority: P2)

**Goal**: Stories index with filter pills, story detail layout, and static filter pages

**Independent Test**: Navigate to `/stories`. Verify stories listed newest first with all fields. Click filter pills — verify filtered pages show correct subset. Click a story — verify full detail page.

### Implementation for User Story 2

- [x] T013 [US2] Create _layouts/story.html: extends default.html. Displays title, date, category, tags, TL;DR block, body content, optional citation, and "what I'm exploring next" section. All fields read from front matter. Use Liquid conditionals for optional sections.
- [x] T014 [US2] Update existing posts in _posts/ to use new front matter schema: add `layout: story`, `length` (short/long), `category` (AI/Leadership/Conference/ISD), `tags`, and `tldr` fields to _posts/2026-07-25-welcome.md and _posts/2026-07-25-building-this-site.md
- [x] T015 [US2] Create stories.md: layout page, title "stories", permalink /stories/. List all site.posts newest first showing title, date, category, tags, tldr. Include filter pill navigation linking to all filter pages (length: all/short/long; category: all/AI/Leadership/Conference/ISD). Show empty state message when no posts exist.
- [x] T016 [P] [US2] Create stories/short.md: layout page, permalink /stories/short/. Filter site.posts where length == "short". Same item display as stories.md. Filter pills with "short" highlighted via aria-current="page".
- [x] T017 [P] [US2] Create stories/long.md: layout page, permalink /stories/long/. Filter site.posts where length == "long". Same item display and filter pills with "long" highlighted.
- [x] T018 [P] [US2] Create stories/ai.md: layout page, permalink /stories/ai/. Filter site.posts where category == "AI". Same item display and filter pills with "AI" highlighted.
- [x] T019 [P] [US2] Create stories/leadership.md: layout page, permalink /stories/leadership/. Filter site.posts where category == "Leadership". Filter pills with "Leadership" highlighted.
- [x] T020 [P] [US2] Create stories/conference.md: layout page, permalink /stories/conference/. Filter site.posts where category == "Conference". Filter pills with "Conference" highlighted.
- [x] T021 [P] [US2] Create stories/isd.md: layout page, permalink /stories/isd/. Filter site.posts where category == "ISD". Filter pills with "ISD" highlighted.
- [x] T022 [US2] Update _config.yml defaults: add default layout "story" for posts scope so new posts automatically use story layout

**Checkpoint**: Stories index, all filter pages, and story detail pages work correctly

---

## Phase 5: User Story 3 — Research Page (Priority: P3)

**Goal**: Research page with interests, publications grouped by status, and methods

**Independent Test**: Navigate to `/research`. Verify all three sections display with content from _data/research.yml.

### Implementation for User Story 3

- [x] T023 [US3] Create research.md: layout page, title "research", permalink /research/. Read from site.data.research. Display interests as bullet list, publications grouped by status (published, in progress, under review) with title/authors/venue/year/link, and methods as bullet list.

**Checkpoint**: Research page displays all sections from data file

---

## Phase 6: User Story 4 — Bookmarks Page with Filters (Priority: P4)

**Goal**: Bookmarks index with type filter pills and static filter pages

**Independent Test**: Navigate to `/bookmarks`. Verify items sorted newest first with all fields. Click type filters — verify correct subset. Click bookmark link — verify external URL opens.

### Implementation for User Story 4

- [x] T024 [US4] Create bookmarks.md: layout page, title "bookmarks", permalink /bookmarks/. Read from site.data.bookmarks sorted by addedDate descending. Display each item with title, type, topicTags, whyItMatters, keyTakeaway, link. Include type filter pills (all/paper/book/talk/tool/dataset/more). Show empty state message when no bookmarks exist.
- [x] T025 [P] [US4] Create bookmarks/paper.md: layout page, permalink /bookmarks/paper/. Filter site.data.bookmarks where type == "paper". Same item display. "paper" pill highlighted.
- [x] T026 [P] [US4] Create bookmarks/book.md: layout page, permalink /bookmarks/book/. Filter where type == "book". "book" pill highlighted.
- [x] T027 [P] [US4] Create bookmarks/talk.md: layout page, permalink /bookmarks/talk/. Filter where type == "talk". "talk" pill highlighted.
- [x] T028 [P] [US4] Create bookmarks/tool.md: layout page, permalink /bookmarks/tool/. Filter where type == "tool". "tool" pill highlighted.
- [x] T029 [P] [US4] Create bookmarks/dataset.md: layout page, permalink /bookmarks/dataset/. Filter where type == "dataset". "dataset" pill highlighted.
- [x] T030 [P] [US4] Create bookmarks/more.md: layout page, permalink /bookmarks/more/. Filter where type == "more". "more" pill highlighted.

**Checkpoint**: Bookmarks index and all type filter pages work correctly

---

## Phase 7: User Story 5 — About and Contact Pages (Priority: P5)

**Goal**: Blank about page and minimal contact page

**Independent Test**: Load `/about` — verify only lowercase title, no body. Load `/contact` — verify email and LinkedIn link present.

### Implementation for User Story 5

- [x] T031 [P] [US5] Create about.md: layout page, title "about", permalink /about/. No body content — just front matter.
- [x] T032 [P] [US5] Create contact.md: layout page, title "contact", permalink /contact/. Body contains email mailto link (cristiane@example.com) and LinkedIn link (https://www.linkedin.com/in/souzacris/).

**Checkpoint**: About and contact pages display correctly

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, and responsive testing

- [x] T033 Verify old URLs return 404: /blog, /portfolio, /projects, /curation
- [x] T034 Verify mobile responsiveness at 320px width: hero, nav, filter pills, story items, bookmark items all render correctly. Filter pills wrap to multiple lines if needed. Mobile menu still works.
- [x] T035 Run full quickstart.md validation (all 12 scenarios)
- [x] T036 Remove _layouts/post.html (replaced by story.html) — only after verifying all posts use story layout

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3–7)**: All depend on Foundational phase completion
  - US1 (home/nav/footer) can proceed first
  - US2–US5 can proceed in parallel after US1, or sequentially in priority order
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Home page hero — Can start after Foundational (Phase 2). No dependencies on other stories.
- **US2 (P2)**: Stories — Can start after Foundational. No dependencies on other stories. Creates story.html layout.
- **US3 (P3)**: Research — Can start after Foundational. No dependencies on other stories. Depends on T006 (research.yml).
- **US4 (P4)**: Bookmarks — Can start after Foundational. No dependencies on other stories. Depends on T007 (bookmarks.yml).
- **US5 (P5)**: About/Contact — Can start after Foundational. No dependencies on other stories.

### Within Each User Story

- Layout files before pages that use them (story.html before stories.md)
- Index page before filter pages (stories.md before stories/short.md)
- Data files before pages that read them (already in Setup phase)

### Parallel Opportunities

- T001–T004 (file removals) can all run in parallel
- T006 and T007 (data files) can run in parallel
- T016–T021 (stories filter pages) can all run in parallel
- T025–T030 (bookmarks filter pages) can all run in parallel
- T031 and T032 (about/contact pages) can run in parallel
- US3, US4, and US5 can run in parallel after Foundational phase

---

## Parallel Example: User Story 2

```text
# After T013 (story layout) and T015 (stories index):
# Launch all filter pages in parallel:
Task T016: stories/short.md
Task T017: stories/long.md
Task T018: stories/ai.md
Task T019: stories/leadership.md
Task T020: stories/conference.md
Task T021: stories/isd.md
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (remove old files, update config, create data files)
2. Complete Phase 2: Foundational (nav, footer, CSS)
3. Complete Phase 3: User Story 1 (home page hero)
4. **STOP and VALIDATE**: Test hero, nav, and footer independently
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (home hero) → Test → Deploy (MVP!)
3. Add US2 (stories + filters) → Test → Deploy
4. Add US3 (research) → Test → Deploy
5. Add US4 (bookmarks + filters) → Test → Deploy
6. Add US5 (about/contact) → Test → Deploy
7. Polish → Final validation → Deploy

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All internal links MUST use `| relative_url` filter (baseurl: "/cristiane")
- No JavaScript — filters are separate static pages with Liquid `where` filters
- Preserve existing dark theme CSS custom properties
