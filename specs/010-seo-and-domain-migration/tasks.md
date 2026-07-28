# Tasks: Search Visibility

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

**One phase, not two.** The migration half of this feature was deleted when the domain was
bought before the site was ever indexed. Every address is `crissouza.org` from the start.

**Already done, before these tasks begin**: the domain is connected and serving over HTTPS
(FR-027), `_config.yml` holds `url: "https://crissouza.org"` and `baseurl: ""`, the `CNAME`
file is committed, and the `--baseurl` flag is out of the deploy workflow so the config is the
only place the address is declared.

## Format: `[ID] [P?] [Story] Description`

- **[P]** — can run in parallel with other [P] tasks (different files, no shared dependency)
- **[Story]** — the user story this serves

## Path Conventions

Static Jekyll site at the repository root. Metadata in `_includes/head.html`; `sitemap.xml`,
`robots.txt` and `CNAME` at the repository root so they publish to the site root.

---

## Phase 1: Setup

- [X] T001 Confirm the address base is correct and singular: `_config.yml` has `url: "https://crissouza.org"` and `baseurl: ""`, and `.github/workflows/pages.yml` passes no `--baseurl`. Every absolute address in this feature derives from those two values (FR-019)
- [X] T002 In `_config.yml`, set `title: "Cris Souza"` (FR-001) and replace `description:` with the author's supplied wording (FR-004). Note this changes the browser tab text on every page — the one visible change the feature makes

**Checkpoint**: the site knows its own name and address. Nothing is declared to a search engine yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T003 Generate `assets/og/default.png` at 1200×630 from `assets/img/icon.svg` plus the site name and a short line of description, using the same local tooling as the site icons. Commit it; nothing is generated at deploy time (FR-013, FR-026)
- [X] T004 Verify the preview image is legible at the size a preview card actually renders, and that it carries no colour profile bloat

**Checkpoint**: the default preview image exists. No page references it yet.

---

## Phase 3: User Story 1 — Be found by someone searching for her (Priority: P1) 🎯 MVP

**Goal**: Every page carries a title naming the author and a description, and the site offers a crawlable list of its pages.

**Independent Test**: Inspect any page's title and description; fetch the sitemap and robots file and confirm both resolve and that every listed address resolves.

- [X] T005 [US1] In `_includes/head.html`, build the page title as the page's own title plus " | Cris Souza", and the site name alone on home (FR-002)
- [X] T006 [US1] In `_includes/head.html`, build the description with the fallback chain `page.description` → `page.tldr` → `site.description`, so existing stories get a real description with no editing (FR-003, FR-005)
- [X] T007 [US1] Create `sitemap.xml` at the repository root, deriving the page list from the site's own pages and posts. Exclude the 404 explicitly and visibly in the template, not via hidden front matter (FR-006, FR-008)
- [X] T008 [US1] Create `robots.txt` at the repository root, allowing crawling and naming the sitemap by absolute address so it survives any later move (FR-007)
- [X] T009 [US1] Verify every address in the sitemap is absolute, names `crissouza.org`, and resolves; and that the 404 appears nowhere in it (SC-003, SC-004)
- [X] T010 [US1] Run quickstart Scenarios 1 and 3

**Checkpoint**: a search engine can crawl the whole site and knows what each page is. Shippable alone.

---

## Phase 4: User Story 2 — A shared link shows a real preview (Priority: P1)

**Goal**: A link to any page unfurls into a card with a title, description and image.

**Independent Test**: Paste a page address into a link-preview checker and confirm all three parts appear; confirm a page with no image of its own still gets one.

- [X] T011 [US2] In `_includes/head.html`, emit the Open Graph tags — title, description, url, type, image — reusing the exact title and description expressions from T005 and T006 (FR-012)
- [X] T012 [US2] In `_includes/head.html`, emit the Twitter card tags, because the common services do not all read the same vocabulary (FR-014)
- [X] T013 [US2] In `_includes/head.html`, use `page.image` when a page supplies one and the site default otherwise, made absolute in both cases (FR-013)
- [X] T014 [US2] Verify a shared link produces a card with all three parts, and that the preview address is character-for-character the canonical from US3 (FR-011)
- [X] T015 [US2] Run quickstart Scenario 4

**Checkpoint**: links stop unfurling as bare addresses.

---

## Phase 5: User Story 3 — One authoritative address per page (Priority: P2)

**Goal**: Every indexable page declares exactly one canonical address, and every other address on the page agrees with it.

**Independent Test**: Inspect several pages; confirm one canonical each, matching the page's real location, and identical to the preview and structured addresses.

- [X] T016 [US3] In `_includes/head.html`, emit one canonical address per page, derived with `absolute_url` so it can never disagree with the preview and structured addresses (FR-009, FR-010, FR-011)
- [X] T017 [US3] Ensure the 404 page declares no canonical (edge case; SC-004)
- [X] T018 [US3] Verify across the home page, a section page, a story and a filter page that the canonical, the preview address and the structured address are the same string (SC-007)
- [X] T019 [US3] Run quickstart Scenario 2

**Checkpoint**: the site has one authoritative name for every page.

---

## Phase 6: User Story 5 — Machine-readable identity and publications (Priority: P3)

**Goal**: A search engine can tell the site belongs to a named researcher and that certain entries are scholarly work.

**Independent Test**: Run the home page, a story and `/research/` through a structured-data validator with zero errors.

- [X] T020 [US5] Create `_includes/structured-data.html` and call it from `head.html`, keeping the statements out of the tag list so `head.html` stays readable
- [X] T021 [US5] Describe the author as a person on the home page, with her name and her professional links (FR-015)
- [X] T022 [US5] Describe a story as an article with its title and date (FR-016)
- [X] T023 [US5] On `/research/`, describe the publications as scholarly work, each carrying its own external record as its address. Publications are entries in `_data/research.yml`, not pages, so they get no canonical of their own (FR-017, research decision 5)
- [X] T024 [US5] Validate all three page types with an external structured-data validator; zero errors (FR-018, SC-006)
- [X] T025 [US5] Run quickstart Scenario 5

**Checkpoint**: all four browser-facing stories complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T026 [P] Confirm nothing visible changed except the browser tab text — layout, the home page and the "what's new" format are untouched (FR-023, SC-012)
- [X] T027 [P] Confirm no request goes to an external host at page load and `search.js` is still the only script (FR-024)
- [X] T028 [P] Add `description:` to the story's front matter if its `tldr` reads poorly as a search result; optional, never required
- [X] T029 [P] Update `README.md` with the optional `description:` and `image:` front matter now available on any page
- [X] T030 [P] Update `CLAUDE.md`: the address base lives only in `_config.yml`, every quoted address uses `absolute_url` while internal links keep `relative_url`, and the 404 is the one page excluded from the sitemap
- [X] T031 Run an automated site audit and confirm it scores at least 95 on search optimisation (SC-008)
- [ ] T032 *(the author's to do — needs her Google account)* Register the site in Search Console and submit the sitemap — the author's to do; it needs her account (spec Dependencies)
- [X] T033 Mark spec 010 Implemented, move it out of `BACKLOG.md`, and record in the spec that the migration half was never needed
- [X] T034 Run the full [quickstart.md](quickstart.md) end to end, including the build check and every regression check

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)** → **Phase 2 (Foundational)** → the user stories
- **US1 (Phase 3)** is the MVP and blocks nothing
- **US2 (Phase 4)** needs T003's image from Foundational, and shares `head.html` with US1
- **US3 (Phase 5)** is what US2's preview address must match, so doing US3 first would also be valid — they are two halves of one guarantee
- **US5 (Phase 6)** needs US3's canonical to point its statements at
- **Polish** last

### User Story Dependencies

- **US1 (P1)**: independent once Setup and Foundational are done
- **US2 (P1)**: needs the preview image; its address must equal US3's canonical
- **US3 (P2)**: independent, but US2 and US5 both depend on its canonical
- **US5 (P3)**: depends on US3
- **US4**: deleted — the migration story no longer applies

### Parallel Opportunities

Limited: T005, T006, T011, T012, T013 and T016 all edit `_includes/head.html` and **cannot** be parallelised. Real opportunities:

- T007 (`sitemap.xml`) and T008 (`robots.txt`) are separate files — parallel
- T003 (the image) is independent of every template task
- T026–T030 in Polish are five separate files

### Suggested order within `head.html`

Do the six head tasks in one pass — T005, T006, T016, T011, T012, T013 — rather than as six edits. The canonical, the preview address and the structured address must be the *same expression*, and writing them together is what guarantees that.

---

## Implementation Strategy

**MVP**: Phase 1 → Phase 2 → Phase 3 (US1). Ten tasks, and the site becomes crawlable with a real title and description on every page. This is the whole point of the feature and is shippable alone.

**Recommended first release**: MVP plus US3, then US2. US3 is small and US2 depends on matching it; shipping previews before canonicals risks the two disagreeing, which is the one failure this feature is most concerned with.

**Then**: US5, which is the largest gain for an academic site and the least urgent.

**A note before starting**: nothing here should be published until it is right, because this is the site's first exposure to a search engine. There is no accumulated standing to protect — which is exactly why getting the canonical right the first time costs nothing now and would cost a lot later.
