# Feature Specification: Side Navigation and Uninterrupted Home

**Feature Branch**: `008-side-navigation`

**Created**: 2026-07-25

**Status**: Implemented

**Note on sequence**: this feature was built before it was specified. The spec is
written from the shipped behaviour rather than ahead of it, so it records what
exists and why. Everything here is verifiable against the live site — nothing is
aspirational. Future changes to the side navigation go through the normal flow.

**Input**: Author's description, reconstructed: "Add a vertical menu down the right side of every page except home, so the sections are reachable without going back to the top. Home should stay clean — no menu beside it and no rules boxing the content in."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Move between sections without returning to the top (Priority: P1)

A visitor part-way down a long page — a story, the bookmarks list — wants another section. Instead of scrolling back to the top navigation, they use a vertical menu pinned beside the content, always in view.

**Why this priority**: This is the whole point of the feature. The stories and bookmarks pages are long, and on those the top navigation scrolls away entirely.

**Independent Test**: Open `/bookmarks/` on a desktop-width window, scroll to the bottom, and confirm the section links are still visible and usable without scrolling up.

**Acceptance Scenarios**:

1. **Given** a wide viewport, **When** a visitor opens any page except home, **Then** a vertical list of section links appears pinned beside the content.
2. **Given** that menu, **When** the visitor scrolls the page, **Then** the menu stays in view.
3. **Given** the menu, **When** the visitor selects a link, **Then** they arrive at that section.
4. **Given** the visitor is on one of the listed sections, **When** the menu renders, **Then** that section is marked as the current one.

---

### User Story 2 - A home page with nothing beside it (Priority: P2)

A visitor landing on the home page sees the introduction with no menu alongside it and no horizontal rules above or below the content. The page reads as a single uninterrupted whole.

**Why this priority**: The home page is short and already carries the top navigation; a second menu beside it is redundant, and the rules made a brief page look boxed in. This is presentation, so it ranks below the navigation itself.

**Independent Test**: Open the home page at desktop width and confirm no side menu appears and no rule sits above or below the content.

**Acceptance Scenarios**:

1. **Given** a visitor opens the home page, **When** it renders, **Then** no side navigation appears at any width.
2. **Given** the home page, **When** it renders, **Then** no rule appears beneath the top navigation or above the footer.
3. **Given** any other page, **When** it renders, **Then** those rules remain.

---

### User Story 3 - No second menu where there is no room (Priority: P2)

A visitor on a phone or a narrow window sees only the existing top navigation. The side menu does not appear, does not overlap the text, and does not push the content sideways.

**Why this priority**: A menu pinned to the edge of a narrow screen would sit on top of the words. The top navigation already covers small screens, so the correct behaviour is to yield entirely.

**Independent Test**: Narrow the window below the point where the content column and the menu can both fit, and confirm the side menu disappears with no layout shift or horizontal scrollbar.

**Acceptance Scenarios**:

1. **Given** a viewport too narrow to hold the content column and the menu side by side, **When** any page renders, **Then** the side menu is not shown.
2. **Given** that narrow viewport, **When** the page renders, **Then** no horizontal scrollbar appears and the content is not covered.
3. **Given** a viewport wide enough, **When** the page renders, **Then** the menu appears without moving the content column.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A vertical section navigation MUST appear on every page except home, positioned beside the content and remaining in view while the page scrolls.
- **FR-002**: The side navigation MUST link to the same sections as the top navigation, excluding home, and MUST use the same lowercase labels.
- **FR-003**: The side navigation MUST indicate the visitor's current section, including when they are on a page within that section (a single story, a filter page).
- **FR-004**: The side navigation MUST be hidden below the width at which it cannot sit beside the content column without overlapping it. It MUST NOT cause horizontal scrolling at any width.
- **FR-005**: The home page MUST NOT show the side navigation at any width.
- **FR-006**: The home page MUST NOT show a rule below the top navigation or above the footer; every other page MUST keep them.
- **FR-007**: The navigation MUST be reachable and operable by keyboard, with a visible focus indicator, and MUST be announced as navigation to assistive technology.
- **FR-008**: The link list MUST live in one include used by every page, so adding or renaming a section is a single edit.
- **FR-009**: Internal links MUST use the site's relative-URL filter, because the site is served from a base path.
- **FR-010**: The feature MUST add no JavaScript and MUST deploy on the existing static hosting with no new build step.

### Key Entities

- **Section link**: one entry in the side navigation — a label and a destination, with a rule for when it counts as current. Held as markup in a single include, not a data file; see the note in [research.md](research.md).

## Success Criteria *(mandatory)*

- **SC-001**: From the bottom of the longest page on the site, a visitor can reach any other section without scrolling up.
- **SC-002**: The side navigation is present on all six non-home pages and absent on home.
- **SC-003**: At no viewport width does the page scroll horizontally or the menu overlap the content.
- **SC-004**: Every link is reachable by keyboard with a visible focus ring, and the current section is conveyed by more than colour.
- **SC-005**: The site's JavaScript footprint is unchanged — the list search remains the only script.

## Assumptions

- The top navigation stays as it is. The side navigation repeats it rather than replacing it, so a visitor who scrolls to the top still finds what they expect, and narrow screens lose nothing.
- Home is excluded by page identity, not by a per-page switch. There is one home page and no reason to expect a second, so a stored flag would be structure without a purpose.
- The breakpoint is a layout fact — the width at which the content column and the menu stop fitting side by side — rather than a device category.

## Out of Scope

- Scroll-spy highlighting of sub-sections within a page. That needs script, which Principle V does not permit here for a convenience.
- Replacing or restyling the top navigation.
- Showing the side navigation on phones in any form.
