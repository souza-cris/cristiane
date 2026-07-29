# Tasks: Search Discoverability Remediation

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

**Eleven of twelve stories.** US9 (analytics) is excluded — it breaches Principles IV and V and
the constitution has not been amended. See research decision 8. Nothing below touches it.

## Format: `[ID] [P?] [Story] Description`

- **[P]** — can run in parallel with other [P] tasks (different files, no shared dependency)
- **[Story]** — the user story this serves

## Path Conventions

Static Jekyll site at the repository root. Data in `_data/`, templates in `_includes/`, filter
pages in `stories/` and `bookmarks/`, and `sitemap.xml` / `feed.xml` at the root so they publish
to the site root.

---

## Phase 1: Setup

- [X] T001 Record a baseline before changing anything: crawl every internal href in `_site` and save the status codes, and measure LCP on `/journey/` and the story page. Several tasks below are verified as "no worse than before", which needs a before

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T002 In `_includes/head.html`, add a `page_robots` value computed once alongside the existing title and description, so later stories emit a robots directive from one place rather than three. Empty filter page or 404 → `noindex, follow`; everything else → nothing emitted

**Checkpoint**: the head has somewhere to put a robots directive. No page behaves differently yet.

---

## Phase 3: User Story 2 — Every internal link resolves in one hop (Priority: P1) 🎯 MVP

**Goal**: No internal click costs a redirect.

**Independent Test**: Crawl every internal href and assert HTTP 200 with zero redirects.

> **These two tasks must land in the same commit.** Slashed data with the template's existing
> `append` produces `/journey//`, which matches no page — every page renders correctly and no
> section is ever marked current, with no error anywhere. See research decision 1.

- [X] T003 [US2] In `_data/sections.yml`, change each `url` to its canonical form with a trailing slash — `/journey/`, `/stories/`, `/research/`, `/bookmarks/`, `/contact/`
- [X] T004 [US2] In `_includes/section-links.html`, delete the `append: '/'` and compare `page.url` to `section.url` directly, for both the `exact` and `prefix` cases
- [X] T005 [P] [US2] In `_includes/bookmark-filters.html`, append a trailing slash to the filter href so it emits `/bookmarks/paper/` rather than `/bookmarks/paper`
- [X] T006 [P] [US2] In `_includes/story-filters.html`, the same for story keyword links — **and in `_layouts/story.html`**, which renders a story's own keyword links and was not in the original task list; it was the last two bare links
- [X] T007 [US2] Verify zero redirects across every internal href, **and** verify the current-section marking still works on `/journey/`, `/stories/` and `/stories/ai/` — the second check is what catches the trap in T003/T004
- [X] T008 [US2] Run quickstart Scenario 1

**Checkpoint**: 100% of internal navigation resolves directly. Shippable alone, and the cheapest win in this feature.

---

## Phase 4: User Story 4 — Empty taxonomy pages stop competing (Priority: P1)

**Goal**: Nothing empty is offered to a search engine, and the rule maintains itself.

**Independent Test**: No sitemap URL renders an empty state; adding the first item to a term moves it in on the next build with no source edit.

- [X] T009 [US4] In `sitemap.xml`, exclude a filter page whose item count is zero, counting `_data/bookmarks.yml` by `page.type` and `site.posts` by `page.keyword`. No hand-maintained term list (FR-006)
- [X] T010 [US4] In `_includes/head.html`, feed the same count into T002's `page_robots` so an empty filter page emits `noindex, follow` — `follow` because its links still lead to real content
- [X] T011 [US4] In `sitemap.xml`, exclude `feed.xml` and confirm the 404 is still excluded
- [X] T012 [US4] Verify the seven currently-empty terms are absent from the sitemap and carry `noindex`: `/bookmarks/{book,dataset,more,talk}/` and `/stories/{ai,conference,short}/`
- [X] T013 [US4] Verify each still loads and still shows its empty-state line for a human following a filter (FR-004)
- [X] T014 [US4] Add one bookmark of type `talk`, rebuild, confirm `/bookmarks/talk/` is now in the sitemap and no longer `noindex`; remove it, rebuild, confirm it drops back out. This is the FR-006 test and it must pass in both directions
- [X] T015 [US4] Run quickstart Scenario 2

**Checkpoint**: the sitemap contains only pages with something on them, permanently.

---

## Phase 5: User Story 3 — Every page describes itself (Priority: P1)

**Goal**: No two pages share a title or a description.

**Independent Test**: Crawl every indexable page; duplicate titles and duplicate descriptions both count zero.

- [X] T016 [US3] In `_includes/head.html`, derive a filter page's description from its term — one composed sentence per page, unique by construction (FR-A05). No authoring step, and a new term arrives already described
- [X] T017 [P] [US3] In the ten `bookmarks/*.md` files, change `title` from `"bookmarks"` to the term — "papers", "reports", "courses", "organizations", "projects", "tools", "books", "talks", "datasets", "more". This changes the visible `<h1>` too, which is intended: a page headed "bookmarks" that lists only papers misleads a reader as much as a crawler
- [X] T018 [P] [US3] In the five `stories/*.md` files, the same — "AI stories", "conference stories", and so on
- [X] T019 [US3] In `index.md` or `_config.yml`, give the home page title a role descriptor beyond the bare name (FR-012)
- [X] T020 [US3] Verify zero duplicate titles and zero duplicate descriptions across every indexable page — confirmed, 15 indexable pages, no duplicates of either, and none left on the site default. **Six section-page descriptions were drafted rather than author-written** (index, journey, stories, research, bookmarks, contact); they are factual rather than voiced and are the author's to edit
- [X] T021 [US3] Run quickstart Scenario 3

**Checkpoint**: seventeen pages stop being indistinguishable.

---

## Phase 6: User Story 1 — Search engines can find and trust the site (Priority: P1)

**Goal**: The site is registered where it needs to be, and the profiles that already rank point at it.

**Independent Test**: Bing reports the property verified with the sitemap read; each external profile shows a public link to crissouza.org.

- [X] T022 [US1] *(the author's — needs her accounts)* Verify `crissouza.org` in Bing Webmaster Tools, importing the already-verified Google property, and submit `https://crissouza.org/sitemap.xml` (FR-A07). Google Search Console is already done under feature 010
- [X] T023 [P] [US1] *(the author's)* Set the website field on her LinkedIn, Google Scholar and GitHub profiles to `https://crissouza.org/` (FR-035)
- [X] T024 [US1] Verify each of the three profile links is publicly visible without signing in — GitHub (`blog` field) and Google Scholar confirmed independently while signed out; LinkedIn returns 301 to unauthenticated requests, so it is confirmed by the author rather than measured

**Checkpoint**: the site is discoverable from the places that already rank for her name.

---

## Phase 7: User Story 6 — Stories read well when shared (Priority: P2)

**Goal**: A story's summary is written prose and its share image is its own.

**Independent Test**: Each story's description is a complete sentence not ending in an ellipsis, and its social image is story-specific.

- [X] T025 [US6] In `_posts/2026-07-26-old-wine-in-a-new-bottle.md`, add an author-written `description` — the current one is a machine truncation ending "and a lot ..." (FR-014). The author supplies the sentence
- [X] T026 [US6] In the same file, add `image: /assets/img/stories/old-wine/old-new-bottle.jpg`. The illustration already exists; no new artwork
- [x] T027 [US6] In `_includes/head.html`, emit `og:image:alt`, `og:image:width` and `og:image:height` alongside the image (FR-015)
- [x] T028 [US6] In `_includes/structured-data.html`, make `BlogPosting` use the story's own image and add `dateModified` and `publisher` (FR-023)
- [x] T029 [US6] In `tools/check-data.rb`, warn when a post has no `description`, so the fallback to a truncated `tldr` is surfaced rather than silent (FR-A02 sibling; US6 scenario 6)
- [x] T030 [US6] Run quickstart Scenario 3's second half

**Checkpoint**: a shared story shows a written sentence and its own picture.

---

## Phase 8: User Story 5 — The journey page is a person profile (Priority: P2)

**Goal**: An engine can extract who she is, where she studied and where she has worked.

**Independent Test**: `/journey/` validates as a `ProfilePage` with a `Person` main entity, zero errors.

- [x] T031 [US5] Decide where the ORCID lives so both `Person` entities read it from one place — `_data/social.yml` puts an icon in the footer and needs a drawing; carrying it separately does not. FR-A08 leaves this open deliberately; settle it here
- [x] T032 [US5] In `_includes/structured-data.html`, emit a `ProfilePage` on `/journey/` whose `mainEntity` is a `Person` with `name`, `description`, `image` and `sameAs` (FR-018, FR-019)
- [x] T033 [US5] Derive education from `_data/journey.yml` entries where `category: academia`, employment from `industry`, and current affiliation from the most recent `academia` entry (FR-020). Derive — do not restate — so the markup cannot drift from the visible track
- [x] T034 [US5] Add `dateModified` in ISO 8601 to the `ProfilePage` (FR-021)
- [x] T035 [US5] Extend the home page `Person`'s `sameAs` to include the ORCID, from the same source as T031, and verify both `Person` entities agree on name, URL and `sameAs` (FR-022)
- [x] T036 [US5] Validate `/journey/` and `/` with an external structured-data validator; zero errors. Confirm every claim corresponds to something visible on the page (FR-026)
- [x] T037 [US5] Run quickstart Scenario 4

**Checkpoint**: the richest page on the site is machine-readable.

---

## Phase 9: User Story 8 — Readers can subscribe (Priority: P2)

**Goal**: A feed reader can subscribe given only the site's address.

**Independent Test**: The feed validates, and subscribing works from the home page URL alone.

- [x] T038 [US8] Create `feed.xml` at the repository root — hand-written Atom over `site.posts`, with absolute links and ISO 8601 dates (FR-031, research decision 4). No `jekyll-feed`
- [x] T039 [US8] In `_includes/head.html`, advertise the feed with an alternate link on every page so a reader can auto-discover it (FR-032)
- [x] T040 [US8] Verify the feed validates, contains the published story with title, absolute link, date, author and summary, and is absent from the sitemap
- [x] T041 [US8] Run quickstart Scenario 5

**Checkpoint**: the site is subscribable.

---

## Phase 10: User Story 7 — Lead images load eagerly (Priority: P2)

**Goal**: The largest above-the-fold image on each page starts downloading immediately.

**Independent Test**: The LCP element carries no deferred loading, and LCP is no worse than the T001 baseline.

- [x] T042 [P] [US7] In `_posts/2026-07-26-old-wine-in-a-new-bottle.md`, remove `loading="lazy"` from the **first** figure only and add `fetchpriority="high"` (FR-027, FR-028)
- [x] T043 [P] [US7] In `journey.md`, the same for the portrait — it currently has neither attribute, so only `fetchpriority` is added
- [x] T044 [US7] Verify every other image still carries `loading="lazy"`, and that every image on the site still carries `width` and `height` so nothing shifts (FR-029, FR-030)
- [x] T045 [US7] Measure LCP on both pages against the T001 baseline; it must be no worse (SC-007)
- [x] T046 [US7] Run quickstart Scenario 6

---

## Phase 11: User Story 10 — Breadcrumbs (Priority: P3)

- [x] T047 [US10] In `_includes/structured-data.html`, emit a `BreadcrumbList` on story and section pages, and **not** on the home page (FR-024)
- [x] T048 [US10] Verify every breadcrumb item's URL resolves 200 in one hop — which depends on US2 having shipped first (FR-025)

---

## Phase 12: User Story 11 — The 404 (Priority: P3)

- [x] T049 [US11] In `_includes/head.html`, emit `noindex` on the 404 via T002's `page_robots`, and stop emitting `og:url` there — it currently advertises `/404.html` as a shareable address (FR-017)
- [x] T050 [US11] Verify the 404 returns 404, carries `noindex`, emits no canonical and no `og:url`, and is absent from the sitemap
- [x] T051 [US11] Run quickstart Scenario 7

---

## Phase 13: User Story 12 — The contact page (Priority: P3)

- [x] T052 [US12] In `contact.md`, add the ORCID `0009-0004-0716-4507` as a linked identifier and a link to her University of Alabama page, alongside the existing LinkedIn link (FR-A06). **No email address** — with nothing published to harvest, FR-034's obfuscation requirement does not arise
- [x] T053 [US12] Give `contact.md` the unique title and description US3 requires (FR-A06, FR-047 sibling)

---

## Phase 14: Polish & Cross-Cutting Concerns

- [x] T054 In `tools/check-data.rb`, add a link check over the **built** site asserting every internal href resolves 200 in one hop (FR-009, FR-A02). It reads `_site`, so it belongs in the checker rather than the pre-commit hook, which stays fast
- [x] T055 [P] Verify feature 010's guarantee survives: canonical still equals `og:url` on every page
- [x] T056 [P] Verify no request goes to an external host at page load and `search.js` is still the only script
- [x] T057 [P] Update `README.md`: filter pages now carry a term-specific title, descriptions are derived, and the feed exists
- [x] T058 [P] Update `CLAUDE.md`: section `url` values are canonical with a trailing slash and `section-links.html` must not append one; empty filter pages are `noindex` by item count; the ProfilePage is derived from `_data/journey.yml`
- [x] T059 Mark spec 012 Implemented and record that US9 remains excluded pending the constitution amendment
- [x] T060 Run the full [quickstart.md](quickstart.md) end to end, including every regression check

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup → Foundational → the stories.** T002 must precede US4 and US11, which both emit robots directives through it
- **US2 (Phase 3)** is the MVP and blocks nothing except US10, whose breadcrumb URLs must resolve in one hop
- **US4 (Phase 4)** and **US3 (Phase 5)** are the same defect seen twice and are best done together, but neither needs the other
- **US1 (Phase 6)** is entirely off-site and can run at any time, in parallel with everything
- **US5 (Phase 8)** needs T031's ORCID decision before T032 and T035
- **US10 (Phase 11)** depends on US2
- **Polish** last; T054's link check is most useful once US2 has shipped

### Parallel Opportunities

- **T003 and T004 are NOT parallel and must be one commit.** This is the trap in research decision 1
- T005 and T006 are different files — parallel with each other, and with T003/T004
- T017 and T018 touch fifteen separate content files — fully parallel
- T042 and T043 are different files — parallel
- T055 to T058 in Polish are four separate files
- **US1 (T022–T024) is off-site entirely** and parallel with all code work

Not parallelisable: anything in `_includes/head.html`. T002, T010, T016, T027, T039 and T049 all
edit it and must be sequenced. As in feature 010, they are best done as one considered pass
rather than six separate edits.

---

## Implementation Strategy

**MVP**: Setup → Foundational → US2. Eight tasks, and every internal click on the site stops
costing a redirect. It is the cheapest change here and the only one that affects 100% of
navigation.

**Recommended first release**: MVP plus US4 and US3. Those three are the indexation defects —
redirects, seven empty pages in the sitemap, and seventeen pages sharing two titles. Together
they are the whole reason the audit was commissioned.

**Then, in any order**: US1 whenever the author has ten minutes (it is off-site and blocks
nothing), US6 when she has written the story description, US5, US8, US7.

**Last**: US10, US11, US12 — real but small.

**Not in this list**: US9. Analytics needs Principles IV and V amended first, and it belongs
with feature 011 which owns the consent gate. Do not start it from here.

**Two tasks are the author's**, not the implementer's: T022 (Bing) and T023 (profile links).
T025 needs a sentence from her. Everything else is repository work.
