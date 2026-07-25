# Feature Specification: Journey Timeline and List Search

**Feature Branch**: `004-journey-and-search`

**Created**: 2026-07-25

**Status**: Implemented

**Input**: User description: "Rename about to journey and build a visual horizontal timeline of career milestones from the CV with company logos and country flags, no years. Add type-to-filter search to stories and bookmarks. Let one story carry several keywords. Update research and contact content."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Journey Timeline (Priority: P1)

A visitor opens the journey page and sees a portrait, a one-line introduction, and a tagline. Below it, a horizontal track runs left to right through career and education milestones, oldest first. Each stop shows the organization's logo in a circle, a country flag, a short label, and the organization name. Circles are colour-coded by category (academia, industry) and grow larger toward the end of the track, while the rail behind them brightens — the visual metaphor for a growing journey. No years appear anywhere.

**Why this priority**: The journey page is the site's biography. It replaces a page that was empty apart from a heading.

**Independent Test**: Load `/journey/`. Verify the track scrolls sideways, all logos load, each stop shows a flag, and no four-digit year appears on the page.

**Acceptance Scenarios**:

1. **Given** a visitor opens `/journey/`, **When** the page loads, **Then** they see the portrait, the introduction with "Ph.D. student", "teaching assistant" and "researcher" emphasized, and the tagline "from industry to academia. continuously improving."
2. **Given** a visitor looks at the track, **When** they scroll it sideways, **Then** stops appear oldest to newest, each with a logo, flag, label and organization.
3. **Given** a visitor scans the track, **When** they compare the first and last stops, **Then** the badges are visibly larger at the end and the rail is brighter.
4. **Given** any stop, **When** the visitor reads it, **Then** no year is shown.

### User Story 2 - Search Within a List (Priority: P1)

A visitor on stories or bookmarks types into a search box at the top right of the filter row. The list narrows as they type, matching against everything visible in each entry. Clearing the box restores the full list. Search combines with the existing filter pills.

**Why this priority**: Both sections are expected to grow; filters alone stop scaling once a category holds many entries.

**Independent Test**: Load `/stories/`, type a word from one story's title, and verify only that story remains. Clear the box and verify all stories return.

**Acceptance Scenarios**:

1. **Given** a visitor is on `/stories/` or `/bookmarks/`, **When** the page loads with JavaScript enabled, **Then** a search box appears at the right of the filter row.
2. **Given** a visitor types text, **When** entries match, **Then** non-matching entries are hidden immediately without a page reload.
3. **Given** a query matches nothing, **When** filtering completes, **Then** a "Nothing matches that search." message appears.
4. **Given** a visitor has JavaScript disabled, **When** the page loads, **Then** the search box is not shown and the full list renders normally.
5. **Given** a visitor is on a filtered page such as `/stories/leadership/`, **When** they search, **Then** only entries within that filter are searched.

### User Story 3 - Multiple Keywords per Story (Priority: P2)

A story can belong to more than one filter. A story about leadership in instructional design appears under both the leadership and ISD filters.

**Why this priority**: The previous single-value `category` field forced an artificial choice between equally accurate filters.

**Independent Test**: Give a story two keywords, then confirm it appears on both filter pages.

**Acceptance Scenarios**:

1. **Given** a story with `keywords: [leadership, isd]`, **When** a visitor opens `/stories/leadership/` or `/stories/isd/`, **Then** the story appears on both.
2. **Given** a story page, **When** a visitor views its keywords, **Then** each links to its filter page.

### Edge Cases

- Search runs only over entries rendered on the current page; it is not a site-wide index.
- A milestone without a logo file falls back to initials in the circle.
- Brand logos are dark ink on transparency; logo badges use a light face so they stay legible on the dark theme.
- The full-bleed track could push the page sideways where scrollbars occupy width; `overflow-x: hidden` on `body` guards against it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The about page MUST be renamed to journey and served at `/journey/`, with nav and home page links updated.
- **FR-002**: Journey milestones MUST be stored as data, not markup, and render oldest first.
- **FR-003**: Each milestone MUST show a logo (or initials fallback), a country flag, a short label, and an organization name.
- **FR-004**: Milestone years MUST NOT be displayed. **Superseded**: the author
  later chose to show a year range on the track in place of the organisation
  name. See the note in `specs/005-journey-storytelling/spec.md`.
- **FR-005**: Badge size and rail brightness MUST increase along the track and MUST be derived from position, so adding or removing milestones re-spaces them automatically.
- **FR-006**: Logo files MUST be committed to the repository; the page MUST NOT request assets from external hosts.
- **FR-007**: Stories MUST support a list of keywords, and filter pages MUST match on membership in that list.
- **FR-008**: Stories and bookmarks MUST provide a search box that filters the rendered list as the visitor types.
- **FR-009**: The search box MUST be hidden unless its script runs, so it never appears as a non-functional control.
- **FR-010**: Filter pill rows and list markup MUST come from shared includes driven by data files, not be duplicated per page.

### Key Entities

- **Milestone**: one stop on the journey track — category, label, organization, logo, flag, place.
- **Story keyword**: a filter slug with a display label; stories reference slugs.
- **Bookmark type**: a filter slug with a display label and empty-state message.

## Success Criteria *(mandatory)*

- **SC-001**: The journey page renders every milestone with its logo, loaded from the repository, with no year visible.
- **SC-002**: Typing in the search box narrows the list without a page reload.
- **SC-003**: A story with two keywords appears on both corresponding filter pages.
- **SC-004**: Adding a filter requires editing one data file plus one thin page, not editing markup in every filter page.
- **SC-005**: The site builds with no Liquid errors and every page returns HTTP 200 locally.

## Assumptions

- Milestone descriptions were drafted from the CV and are the author's to correct; `title` and `note` fields hold longer text that the track does not display.
- The Chevron milestone was supplied directly by the author and is not in the CV; its `note` was deliberately left empty rather than invented.
- Logos were taken from Wikimedia Commons and the companies' own sites for identification purposes.
