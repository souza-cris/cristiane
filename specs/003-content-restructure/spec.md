# Feature Specification: Content Restructure

**Feature Branch**: `003-content-restructure`

**Created**: 2026-07-25

**Status**: Draft

**Input**: User description: "Restructure the site with new navigation (about, stories, research, bookmarks, contact), hero-only home page, stories with filter toggles, research page, annotated bookmarks with filters, and minimal contact page. Lowercase titles throughout."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Home Page Hero and New Navigation (Priority: P1)

A visitor arrives at the site and sees a minimal hero: a small eyebrow tag ("Hello, my name is"), a large headline ("Cris"), and a one-line subheadline. Below the hero are optional CTAs linking to key sections. The navigation bar shows lowercase links: about, stories, research, bookmarks, contact. The footer shows icon links to LinkedIn, Google Scholar, and GitHub. No introductory paragraphs appear — just the hero.

**Why this priority**: The home page and navigation define the site's identity and structure. Every other page depends on the nav being correct.

**Independent Test**: Load the home page. Verify the hero displays the eyebrow, headline, and subheadline. Verify the nav shows all five sections in lowercase. Verify the footer shows LinkedIn, Google Scholar, and GitHub links. Verify no additional text appears below the hero CTAs.

**Acceptance Scenarios**:

1. **Given** a visitor opens the site root, **When** the page loads, **Then** they see "Hello, my name is" as small text, "Cris" as a large headline, and the subheadline "PhD student slash researcher slash tech leader slash traveler slash cat lady".
2. **Given** a visitor looks at the navigation, **When** they scan the top of any page, **Then** they see lowercase links: about, stories, research, bookmarks, contact.
3. **Given** a visitor looks at the footer, **When** they scroll to the bottom of any page, **Then** they see links to LinkedIn, Google Scholar, and GitHub.
4. **Given** a visitor looks below the hero CTAs on the home page, **When** they scroll, **Then** no additional paragraphs or content sections appear.

---

### User Story 2 - Stories Page with Filter Toggles (Priority: P2)

A visitor navigates to the stories page and sees a list of posts. They can filter by length (all, short, long) and by category (all, AI, Leadership, Conference, ISD). Each story item shows its title, date, category, tags, and a TL;DR. Clicking a title opens the full story with body content, optional citation, and "what I'm exploring next" section.

**Why this priority**: Stories is the primary dynamic content section and the most complex page with its filter UI. It replaces the former blog and validates the new content model.

**Independent Test**: Add sample stories with different lengths and categories. Verify all appear by default. Toggle the length filter to "short" — verify only short stories appear. Select a category — verify only that category's stories appear. Click a story title — verify the full post loads with all fields.

**Acceptance Scenarios**:

1. **Given** the stories index page, **When** it loads, **Then** stories are listed with title, date, category, tags, and TL;DR, newest first.
2. **Given** a visitor selects "short" from the length toggle, **When** the filter applies, **Then** only stories with length "short" are shown.
3. **Given** a visitor selects "AI" from the category pills, **When** the filter applies, **Then** only stories with category "AI" are shown.
4. **Given** a visitor clicks a story title, **When** the link activates, **Then** they see the full story with title, date, category, tags, TL;DR, body, optional citation, and "what I'm exploring next" section.
5. **Given** Cris creates a new story file with proper front matter, **When** the site rebuilds, **Then** the new story appears on the index without any other file changes.

---

### User Story 3 - Research Page (Priority: P3)

A visitor navigates to the research page and sees a structured, content-forward page with three sections: research interests (bullet list), publications (grouped by status), and methods & tools (short list). The page is clean and not wordy.

**Why this priority**: Research is the professional credibility page — important for academic visitors but mostly static content.

**Independent Test**: Load the research page and verify all three sections are present with content. Verify publications are grouped by status (e.g., published, in progress).

**Acceptance Scenarios**:

1. **Given** a visitor opens the research page, **When** it loads, **Then** they see sections for research interests, publications, and methods & tools.
2. **Given** the publications section, **When** a visitor reads it, **Then** publications are grouped by status with clear headings.

---

### User Story 4 - Bookmarks Page with Filters (Priority: P4)

A visitor navigates to the bookmarks page and sees an annotated collection of recommended resources. They can filter by type (all, paper, book, talk, tool, dataset, more) and by tags. Items are sorted newest first by default. Each bookmark shows its title, type, topic tags, a "why it matters" note, a key takeaway, and a link to the source.

**Why this priority**: Bookmarks replaces the old curation page with a richer data model and filter UI. It is supplementary but demonstrates the annotated collection pattern.

**Independent Test**: Add sample bookmarks of different types with various tags. Verify all appear by default sorted by date. Filter by "paper" — verify only papers appear. Click a bookmark link — verify it opens the external resource.

**Acceptance Scenarios**:

1. **Given** the bookmarks page, **When** it loads, **Then** items are displayed sorted newest first, each showing title, type, topic tags, "why it matters", key takeaway, and link.
2. **Given** a visitor selects "paper" from the type filter, **When** the filter applies, **Then** only items with type "paper" are shown.
3. **Given** a visitor selects a topic tag, **When** the filter applies, **Then** only items with that tag are shown.
4. **Given** Cris adds a new entry to the bookmarks data file, **When** the site rebuilds, **Then** the new bookmark appears without any other file changes.

---

### User Story 5 - About and Contact Pages (Priority: P5)

A visitor navigates to the about page and sees a blank placeholder (just the page title, no body content). A visitor navigates to the contact page and sees Cris's email and LinkedIn link displayed minimally.

**Why this priority**: These are the simplest pages — about is intentionally blank, contact is minimal static content.

**Independent Test**: Load the about page and verify it shows only the lowercase title with no body content. Load the contact page and verify it shows email and LinkedIn link.

**Acceptance Scenarios**:

1. **Given** a visitor opens the about page, **When** it loads, **Then** they see the page title "about" and no body content.
2. **Given** a visitor opens the contact page, **When** it loads, **Then** they see an email address and a LinkedIn link.

---

### Edge Cases

- What happens when there are no stories yet? The stories index shows a friendly empty-state message.
- What happens when a filter combination yields no results? A message like "No stories match this filter" is shown instead of a blank page.
- What happens when a bookmark has no "source" field? The source line is simply omitted.
- What happens when a visitor accesses a URL that does not exist? The existing custom 404 page is shown.
- What happens on mobile with the filter toggles? Filters stack vertically and remain usable on small screens.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page MUST display only a hero block: eyebrow tag ("Hello, my name is"), headline ("Cris"), subheadline, and optional section CTAs. No additional content below.
- **FR-002**: The navigation MUST show lowercase links: about, stories, research, bookmarks, contact — on every page.
- **FR-003**: The footer MUST show icon links to LinkedIn (`https://www.linkedin.com/in/souzacris/`), Google Scholar (`https://scholar.google.com/citations?user=Zeajh2IAAAAJ&hl=en`), and GitHub (`https://github.com/souza-cris`).
- **FR-004**: The stories page MUST display a filterable list of posts with length toggle (all, short, long) and category pills (all, AI, Leadership, Conference, ISD).
- **FR-005**: Each story index item MUST show title, date, category, tags, and TL;DR.
- **FR-006**: Each story detail page MUST show title, date, category, tags, TL;DR, body, optional citation, and "what I'm exploring next" section.
- **FR-007**: Adding a new story MUST require only creating a file with the specified front matter — no other file changes.
- **FR-008**: The research page MUST display three sections: research interests (bullets), publications (grouped by status), and methods & tools (list).
- **FR-009**: The bookmarks page MUST display an annotated collection filterable by type and tags, sorted newest first.
- **FR-010**: Each bookmark item MUST show title, type, topic tags, "why it matters", key takeaway, and link.
- **FR-011**: Adding a new bookmark MUST require only editing the bookmarks data file — no other file changes.
- **FR-012**: The about page MUST show only the title "about" with no body content.
- **FR-013**: The contact page MUST display an email address and LinkedIn link.
- **FR-014**: All page titles MUST be displayed in lowercase.
- **FR-015**: Filters on stories and bookmarks MUST be implemented as separate static pages (e.g., `/stories/ai/`, `/stories/short/`, `/bookmarks/paper/`). No JavaScript. Each filter value is a link to its own page showing only matching items.

### Key Entities

- **Story**: A post with title, date, length (short/long), category (AI/Leadership/Conference/ISD), tags, TL;DR, body, optional citation, and "what I'm exploring next". Lives as a file with front matter.
- **Bookmark**: An annotated resource with title, type (paper/book/talk/tool/dataset/more), topic tags, "why it matters", key takeaway, link, added date, and optional source. Lives as an entry in a data file.
- **Footer Link**: An external profile link (LinkedIn, Google Scholar, GitHub) with label, URL, and icon.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All five nav sections (about, stories, research, bookmarks, contact) are reachable from any page via navigation within one click.
- **SC-002**: A new story can be published by creating a single file and pushing — no other files need to change.
- **SC-003**: A new bookmark can be added by editing a single data file and pushing — no other files need to change.
- **SC-004**: Filtering stories by length shows only stories matching the selected length value.
- **SC-005**: Filtering stories by category shows only stories matching the selected category.
- **SC-006**: Filtering bookmarks by type shows only bookmarks matching the selected type.
- **SC-007**: All pages render correctly on viewports from 320px to 1920px wide.
- **SC-008**: Every page loads in under 3 seconds on a standard mobile connection.
- **SC-009**: All page titles display in lowercase consistently across the site.

## Assumptions

- This restructure replaces the current site sections (Home, Portfolio, Projects, Blog, Curation) with the new structure (home, about, stories, research, bookmarks, contact). Old pages and collections (_projects, old blog index, old curation page, portfolio page) are removed.
- The dark theme from the previous redesign is preserved — all new pages use the same dark palette, typography, and styling.
- The `_posts` directory is repurposed for stories (Jekyll's built-in post mechanism with the new front matter schema).
- Footer icons are text labels or simple inline SVG — no icon library dependency.
- The research page content (interests, publications, methods) is written as static Markdown or sourced from a data file — the approach is decided during planning.
- Filters are implemented as separate static pages per filter value — no JavaScript needed. Combined filters (e.g., short + AI) are out of scope; each filter dimension operates independently.
- Email on the contact page is displayed as a plain `mailto:` link.
