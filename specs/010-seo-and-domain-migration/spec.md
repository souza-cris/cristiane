# Feature Specification: Search Visibility and Domain Migration

**Feature Branch**: `010-seo-and-domain-migration`

**Created**: 2026-07-26

**Status**: Backlog — specified and planned, not scheduled. Deferred by the author on
26 July 2026. Nothing is built. See [BACKLOG.md](../../BACKLOG.md); resume with
`/speckit-tasks`.

**Input**: The author supplied a two-phase brief: make the site discoverable now, on its
current GitHub Pages address, and migrate cleanly to a custom domain later without losing
what has accumulated. Locked in the brief: **no redesign** — the home page layout and the
"what's new" format stay as they are; the site title becomes "Cris Souza"; and the default
description is "PhD student, AI and IS researcher, tech leader, traveler. Stories,
publications, and projects by Cris Souza."

## Current state

Measured before writing this, so the starting point is recorded rather than assumed:

| | Today |
|---|---|
| Sitemap | none — `/cristiane/sitemap.xml` returns 404 |
| Robots file | none — `/cristiane/robots.txt` returns 404 |
| Authoritative address per page | not declared |
| Social preview (title, description, image) | none — a shared link shows a bare address |
| Machine-readable identity or publications | none |
| Site title | "Cris" |
| Site description | "PhD student slash researcher slash tech leader slash traveler slash cat lady" |

The site is therefore hard for a search engine to crawl completely, and gives it nothing to
distinguish this Cris from any other.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Be found by someone searching for her (Priority: P1)

Someone who heard the author speak, read a paper, or met her at a conference searches her
name. Her site appears, with a title that identifies her and a description that says what she
does — rather than being absent, or listed under a one-word title that could be anyone.

**Why this priority**: Being findable is the point of the feature. Everything else here
either supports this or protects it later.

**Independent Test**: Search for the site's own address in a search engine and confirm pages
are indexed; inspect any page's title and description and confirm they identify the author
and her work.

**Acceptance Scenarios**:

1. **Given** a search engine crawls the site, **When** it looks for a list of pages, **Then**
   it finds one naming every page meant to be indexed.
2. **Given** a search engine reads any page, **When** it takes the title, **Then** the title
   identifies the author by full name.
3. **Given** a page with its own summary, **When** a search engine reads its description,
   **Then** it gets that page's summary rather than the site-wide one.
4. **Given** a page with no summary of its own, **When** a search engine reads its
   description, **Then** it gets the site-wide default rather than nothing.

---

### User Story 2 - A shared link shows a real preview (Priority: P1)

The author shares a story or her research page in a message, a post, or a chat. The link
unfurls into a card with a title, a sentence of description, and an image — not a bare
address that tells the reader nothing.

**Why this priority**: This is how most people will actually meet the site — through a link
someone sent them, not through a search. A bare address loses the click. It ranks alongside
Story 1 rather than below it.

**Independent Test**: Paste a page's address into a link-preview checker, or into a chat that
unfurls links, and confirm a title, description and image appear.

**Acceptance Scenarios**:

1. **Given** any page's address is shared, **When** the receiving service builds a preview,
   **Then** it finds a title, a description and an image.
2. **Given** a story with its own summary, **When** its link is shared, **Then** the preview
   shows that story's title and summary, not the site's.
3. **Given** a page with no image of its own, **When** its link is shared, **Then** a default
   site image is used rather than none.
4. **Given** any preview, **When** the address in it is compared with the page's declared
   authoritative address, **Then** they are the same.

---

### User Story 3 - One authoritative address per page (Priority: P2)

Every page declares which address is the real one. A search engine reaching the same content
by more than one route credits a single address rather than splitting or discarding it.

**Why this priority**: Invisible until it matters, and then hard to undo. It is also the
mechanism the migration in Story 4 depends on, so it must be right before the domain moves
rather than after.

**Independent Test**: Inspect several pages and confirm each declares one authoritative
address, that it matches the page's real location, and that the address used in previews and
machine-readable data is the same one.

**Acceptance Scenarios**:

1. **Given** any indexable page, **When** it is inspected, **Then** it declares exactly one
   authoritative address.
2. **Given** that address, **When** it is compared with the address in the page's preview
   data and machine-readable data, **Then** all three agree.
3. **Given** the site is still on its current address, **When** the authoritative address is
   read, **Then** it points at the current address and not at a domain that does not exist.

---

### User Story 4 - Move to a custom domain without losing ground (Priority: P2)

Later, the author buys a domain. The site moves to it, and the standing built up in the
meantime follows: old addresses lead to new ones, search engines are told where the site
went, and nothing is indexed twice under two names.

**Why this priority**: It cannot happen until a domain exists, so it cannot be first. But the
decisions in Stories 1–3 either make it straightforward or make it painful, which is why it
is specified now rather than improvised later.

**Independent Test**: After the move, request several old addresses and confirm each leads to
its new equivalent; confirm the authoritative addresses, previews and machine-readable data
all name the new domain.

**Acceptance Scenarios**:

1. **Given** the domain is live, **When** any page is inspected, **Then** its authoritative
   address, preview address and machine-readable address all name the new domain.
2. **Given** an address that worked before the move, **When** it is requested, **Then** it
   leads to the same content at its new address rather than to an error.
3. **Given** the move is complete, **When** a search engine looks for the list of pages,
   **Then** it finds one at the new domain naming new addresses only.
4. **Given** both addresses exist during the changeover, **When** a search engine reads them,
   **Then** it is told which one is authoritative, so the same page is not indexed twice.

---

### User Story 5 - Machine-readable identity and publications (Priority: P3)

A search engine reading the site can tell that it belongs to a named researcher, and that
certain pages are her published work rather than ordinary posts.

**Why this priority**: A genuine gain for an academic site — it is how a search engine
connects a site to a person and their work — but the site is findable without it. Lowest of
the five.

**Independent Test**: Run the site's pages through a structured-data validator and confirm the
identity, article and publication descriptions are present and error-free.

**Acceptance Scenarios**:

1. **Given** the home page, **When** a validator reads it, **Then** it finds a description of
   a person, with the author's name.
2. **Given** a story page, **When** a validator reads it, **Then** it finds a description of
   an article with a title and a date.
3. **Given** a publication, **When** a validator reads it, **Then** it is described as
   scholarly work rather than as an ordinary post.
4. **Given** any machine-readable description, **When** its address is checked, **Then** it
   matches that page's authoritative address.

---

### Edge Cases

- **A page that should not be indexed** (the 404 page): it MUST NOT appear in the list of
  pages offered to search engines, and MUST NOT claim an authoritative address.
- **A filter page showing a subset of another list** (`/stories/ai/`, `/bookmarks/book/`):
  these are real, useful pages and are indexable, but each MUST declare its own address, so a
  story listed under three filters does not read as three copies.
- **A story with no summary**: the description falls back to the site default rather than
  rendering empty.
- **A shared link to a page with no image**: the default site image is used.
- **The default description is longer than a search engine shows**: it MUST be written to
  survive truncation, with the important words first.
- **The domain is bought but not yet serving**: the migration MUST NOT begin until the new
  address actually works, or every authoritative address on the site points at nothing.
- **A search engine holds old addresses for months after the move**: expected. Old addresses
  must keep leading to new ones rather than being switched off.

## Requirements *(mandatory)*

### Functional Requirements

**Identity and description**

- **FR-001**: The site MUST identify itself as "Cris Souza".
- **FR-002**: Every page MUST have a title that includes the author's name, so a search result
  is attributable without further context.
- **FR-003**: Every page MUST offer a description. A page with its own summary MUST use it; a
  page without MUST fall back to the site-wide default.
- **FR-004**: The site-wide default description MUST be the author's supplied wording: "PhD
  student, AI and IS researcher, tech leader, traveler. Stories, publications, and projects by
  Cris Souza."
- **FR-005**: The author MUST be able to give any page its own description without editing a
  template.

**Crawling**

- **FR-006**: The site MUST publish a list of its indexable pages, kept in step with the site
  automatically rather than maintained by hand.
- **FR-007**: The site MUST publish crawling instructions that point at that list.
- **FR-008**: Pages not meant to be indexed MUST be excluded from the list.

**Authoritative address**

- **FR-009**: Every indexable page MUST declare exactly one authoritative address.
- **FR-010**: That address MUST match the site's real, live location at the time — the current
  address before the move, the new domain after it.
- **FR-011**: The address used in social previews and machine-readable data MUST be the same
  as the declared authoritative address, on every page.

**Sharing**

- **FR-012**: Every page MUST carry enough information for a link preview: a title, a
  description, an address and an image.
- **FR-013**: A default preview image MUST exist for pages that have none of their own.
- **FR-014**: Preview information MUST be readable by the common social and messaging
  services, which do not all read the same format.

**Machine-readable data**

- **FR-015**: The site MUST describe the author as a person, machine-readably.
- **FR-016**: Story pages MUST be described as articles, with a title and a date.
- **FR-017**: Publications MUST be described as scholarly work, distinct from stories.
- **FR-018**: All machine-readable descriptions MUST validate without errors.

**Migration**

- **FR-019**: Moving to a custom domain MUST require changing the address in one place, not
  editing every page or template.
- **FR-020**: After the move, addresses that worked before MUST lead to their new equivalents
  rather than to errors.
- **FR-021**: After the move, the page list and crawling instructions MUST be published at the
  new domain and name only new addresses.
- **FR-022**: The migration MUST NOT begin until the new domain is confirmed live and secure.

**Constraints carried from the brief**

- **FR-023**: The visible design MUST NOT change. No layout change, no page restructuring, and
  no change to the home page or the "what's new" format.
- **FR-024**: The feature MUST deploy on the existing static hosting with no additional build
  step beyond what the site already runs, and MUST NOT request assets from an external host at
  page load.

**Settled by the author**

- **FR-025**: After the move, the site MUST live at the **root** of the new domain. Every
  page's address therefore loses the `/cristiane` segment as well as changing host, which
  makes FR-020's redirects a path change and not only a host change.
- **FR-026**: The default preview image MUST be built from the site's existing mark and name
  — the teal book on the site's own background, with "Cris Souza" and a short line of
  description — so it is consistent with the site and needs no new artwork. It MUST be
  generated and committed the way the site's icons already are, not fetched at page load.

### Key Entities

- **Page identity**: what one page tells a search engine about itself — its title, its
  description, its authoritative address, and its preview information. Every indexable page has
  exactly one.
- **Site identity**: the name, default description and default preview image used wherever a
  page offers nothing of its own.
- **Address base**: the single place the site's live address is recorded, from which every
  authoritative address, preview address and machine-readable address is built. This is what
  makes the migration one edit rather than a sweep.
- **Page list**: the machine-readable list of indexable pages, derived from the site rather
  than maintained by hand.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of indexable pages declare a title, a description and an authoritative
  address.
- **SC-002**: The page list and the crawling instructions both resolve rather than returning an
  error, and the instructions point at the list.
- **SC-003**: Every page named in the list resolves; no listed address returns an error.
- **SC-004**: The 404 page appears in neither the list nor the indexable set.
- **SC-005**: A link to any page produces a preview with a title, description and image in a
  standard preview checker.
- **SC-006**: Machine-readable data validates with zero errors across the home page, a story
  and a publication.
- **SC-007**: On every page, the authoritative address, the preview address and the
  machine-readable address are identical.
- **SC-008**: An automated site audit scores at least 95 on its search-optimisation measure.
- **SC-009**: The site's pages are present in a search engine's index within a month of
  submission.
- **SC-010**: After the migration, every address that worked before leads to its new
  equivalent, checked across at least one page of each kind.
- **SC-011**: After the migration, no page is reachable as an indexable duplicate under both the
  old and the new address.
- **SC-012**: No page looks different to a visitor than it did before this feature, apart from
  the browser tab text.

## Assumptions

- **The site title changes what a visitor sees in the browser tab.** Today it reads "Cris"; it
  will read "Cris Souza". This is the one visible change the feature makes, and it is taken as
  intended rather than as a breach of FR-023.
- **The current description is not visible on any page.** It is used only as the page's
  description for search engines, so replacing it changes nothing a visitor reads. Checked, not
  assumed — the home page's visible strapline is separate content.
- **Search Console registration is the author's to perform.** It needs ownership of the account
  and, later, of the domain. The site's side is making the list and instructions available;
  submitting and monitoring them is hers.
- **The domain is not yet bought**, so Phase 2 cannot be built or verified yet. It is specified
  now so that Phase 1 does not make it harder.
- **No page-level control over indexing is needed** beyond excluding the 404. Everything else
  on the site is meant to be found.
- **Existing content is not rewritten** for search purposes. Descriptions may be *added* to
  pages that lack them; the author's wording is hers.

## Dependencies

- Phase 2 depends entirely on a purchased domain with working, secure hosting. Nothing in
  Phase 1 depends on it.
- Search Console verification and submission depend on the author's account access; the
  site's side is only making the list and instructions available.
- The default preview image is generated from artwork already in the repository, so it adds
  no external dependency.

## Out of Scope

- Any redesign, restyle or restructuring of pages. Explicitly excluded by the brief.
- Rewriting existing content to rank better.
- Paid search, analytics, visitor tracking, or any third-party measurement script. None is
  needed to be findable, and each would put a visitor's reading in front of a third party.
- Multilingual or region-targeted variants.
- The domain purchase itself.

## Resolved Questions

Both decisions were settled by the author before planning.

1. **Root or subpath after the move?** The **root** of the new domain. This was the author's
   own open question at the end of her brief. It has a consequence worth carrying into the
   plan: because paths lose the `/cristiane` segment as well as changing host, every old
   address differs from its new one in two ways, so the redirects in FR-020 cannot be a
   simple host swap. Recorded as FR-025.
2. **Where does the default preview image come from?** Built from the site's existing mark
   and name rather than supplied separately or cropped from the portrait. Nothing new to
   draw, and it stays consistent with the icon that already ships. Recorded as FR-026.

Neither answer widened the feature; the second removed a dependency on the author supplying
an asset before Story 2 could finish.
