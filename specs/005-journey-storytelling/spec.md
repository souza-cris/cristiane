# Feature Specification: Journey Storytelling and Usability

**Feature Branch**: `005-journey-storytelling`

**Created**: 2026-07-25

**Status**: Draft

**Input**: User description: "Improve the journey page: surface the milestone notes that are currently stored but never shown, using an expandable detail view; add time back only inside that detail view while keeping the track itself year free; make the timeline usable on phones and discoverable on desktop; add a framing line that connects the industry to academia arc to the research; lean into the geography of the path; keep badges legible instead of implying importance by size; and strengthen accessibility."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read the story behind each milestone (Priority: P1)

A visitor on the journey page sees the same clean track of stops as today. When they select a stop (click, tap, or keyboard), it expands to reveal the longer description already written for that milestone: the role in full, the scope, and the outcome. Selecting another stop, or closing the open one, collapses the detail. The default view stays minimal; the depth is available on demand.

**Why this priority**: Every milestone already carries a full title and a description with the substance of the story (awards, portfolio scope, the pull toward research), and none of it is rendered. Surfacing it is the single change that turns a decorative strip into something a recruiter or academic actually reads. It reuses content that already exists.

**Independent Test**: Load the journey page, select any stop, and confirm its full title and description appear. Select a second stop and confirm the first collapses. Confirm the text matches what is recorded for that milestone.

**Acceptance Scenarios**:

1. **Given** a visitor is on `/journey/`, **When** the page loads, **Then** each stop shows only the badge, flag, label, and organization, exactly as before.
2. **Given** a visitor selects a stop, **When** it expands, **Then** the milestone's full title and note become visible.
3. **Given** a stop is expanded, **When** the visitor selects a different stop, **Then** the previously open stop collapses.
4. **Given** a milestone whose description is empty (for example, Chevron), **When** its stop is expanded, **Then** the detail area shows the title and place without an empty or broken block.
5. **Given** a visitor with JavaScript disabled, **When** they select a stop, **Then** the detail still expands.

---

### User Story 2 - Use the timeline on any device (Priority: P1)

A visitor on a phone reads the journey as a vertical list they scroll normally, top to bottom, oldest to newest. A visitor on a wide screen sees the horizontal track, with a clear visual signal that more stops continue past the right edge, so they never assume the last visible stop is the end.

**Why this priority**: A horizontal only track is easy to miss and awkward on touch and with a mouse wheel. On small screens it competes with the page's own scroll. Making the layout adapt removes the largest usability risk on the page without changing its content.

**Independent Test**: Open `/journey/` at a narrow width and confirm the timeline stacks vertically and scrolls with the page. Open it at a wide width and confirm the track runs horizontally with a visible fade or marker at the right edge while more stops remain.

**Acceptance Scenarios**:

1. **Given** a viewport narrower than the small-screen breakpoint, **When** the journey renders, **Then** stops stack vertically in order and scroll with the normal page scroll.
2. **Given** a wide viewport with stops extending past the right edge, **When** the page loads, **Then** a visual affordance (such as an edge fade) signals that the track continues.
3. **Given** the horizontal track has focus, **When** the visitor presses the arrow keys, **Then** the track scrolls sideways.
4. **Given** either layout, **When** the visitor reaches the newest stop, **Then** no affordance suggests further content beyond it.

---

### User Story 3 - Understand the arc at a glance (Priority: P2)

Above the track, a short framing states the throughline of the journey: a career spent helping people and teams work well with technology, now the subject of the author's research. The geography of the path (Brazil, Italy, Germany, Brazil, United States) is named rather than left implicit in the flags.

**Why this priority**: The current tagline, "from industry to academia. continuously improving.", is accurate but generic. Naming the throughline connects this page to the research page and gives the pivot meaning. Naming the geography reinforces the traveler identity the site already claims. This is copy, not mechanism, so it ranks below the two structural stories.

**Independent Test**: Load `/journey/` and confirm a framing sentence names the people-and-technology throughline, and a short line or grouping references the countries or continents crossed.

**Acceptance Scenarios**:

1. **Given** a visitor opens `/journey/`, **When** they read the area above the track, **Then** a sentence connects the industry-to-academia arc to the author's research focus.
2. **Given** the same area, **When** they read on, **Then** the multi-country path is stated (for example, a line such as "four countries, three continents").
3. **Given** the framing copy, **When** it renders, **Then** it lives in a content or data file, not hardcoded inside a layout or include.

---

### User Story 4 - Anchor each milestone in time without dating the track (Priority: P2)

When a visitor expands a stop, the detail view shows when that milestone happened (a year or a range). The always-visible track stays free of years, preserving the "the order is the story" design, while people who need temporal context can get it on demand.

**Status**: structure only in this feature. Per the decision recorded in Assumptions, the period field and its slot are built but left empty, so nothing dated renders yet. This story is complete when a supplied period would display correctly; populating real dates is a later content edit.

**Why this priority**: The two audiences most likely to view this page, hiring managers and academics, are disoriented by a complete absence of time; they cannot tell whether the arc spans eight years or twenty. Showing time only in the expanded detail resolves that without compromising the year-free surface. It depends on User Story 1's detail view, so it shares that structure but is separately testable.

**Independent Test**: Supply a period to one milestone, expand its stop, and confirm the period appears in the detail. Expand a milestone with no period and confirm no empty date element renders. Scan the collapsed track and confirm no four-digit year is visible anywhere.

**Acceptance Scenarios**:

1. **Given** a milestone with a supplied time period, **When** its stop is expanded, **Then** the period is shown in the detail area.
2. **Given** the collapsed track, **When** a visitor scans every stop, **Then** no year appears on the always-visible surface.
3. **Given** a milestone without a supplied period, **When** its stop is expanded, **Then** the detail renders without an empty date element.

---

### User Story 5 - Legible, consistent badges (Priority: P3)

Badge circles are a consistent, legible size across the track. The sense of a journey that builds is carried by the brightening rail rather than by badges that grow, so early roles are not visually diminished and small logos remain readable.

**Why this priority**: Growing badges imply "later equals more important," which flattens senior early roles, and the smallest badges risk illegible logos. This is a refinement of an existing behavior rather than new capability, so it is the lowest priority here.

**Independent Test**: Load `/journey/` and confirm badges are uniform (or within a narrow, legibility-safe range) and that the rail still brightens from first stop to last.

**Acceptance Scenarios**:

1. **Given** the track renders, **When** a visitor compares the first and last badges, **Then** they are the same size, or close enough that every logo stays legible.
2. **Given** the track renders, **When** a visitor scans from oldest to newest, **Then** the rail still brightens along the way as the progression cue.

---

### Edge Cases

- A milestone with an empty description must expand cleanly with no empty block; the same applies to a missing time period.
- Only one stop should be open at a time on the horizontal layout to avoid the track growing unevenly; the vertical layout may allow one open at a time for consistency.
- The detail view must not reintroduce a horizontal overflow that pushes the whole page sideways.
- Expanding a stop must not shift the positions of other stops so much that a keyboard user loses their place; focus must remain on the toggled stop.
- The framing and geography copy must read correctly if the author later edits the milestone list, so it should not hardcode a country count that can drift out of sync without a note to update it.
- Category color is a cue, not the only cue; a visitor who cannot distinguish the academia and industry colors must still tell them apart.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each journey stop MUST be expandable to reveal that milestone's full title and description, using the milestone content already recorded.
- **FR-002**: The expanded detail MUST remain operable when scripting is unavailable, per the Minimal JavaScript principle.
- **FR-003**: At most one stop MUST be open at a time on the horizontal layout; opening a stop MUST collapse any other open stop.
- **FR-004**: A milestone with an empty description MUST expand without rendering an empty or broken element.
- **FR-005**: On small screens the timeline MUST render as a vertical list that scrolls with the page, in the same oldest-first order.
- **FR-006**: On wide screens the horizontal track MUST show a visual affordance (such as an edge fade) whenever stops extend past the visible edge, and MUST NOT show it once the end is reached.
- **FR-007**: The horizontal track MUST remain operable by keyboard, including sideways scrolling when focused.
- **FR-008**: The page MUST display framing copy that states the people-and-technology throughline connecting the career arc to the author's research.
- **FR-009**: The page MUST state the multi-country path of the journey (a line or grouping referencing the countries or continents), sourced from data or content rather than hardcoded in a layout.
- **FR-010**: The expanded detail MAY show a time period per milestone; when a period is supplied it MUST appear only in the detail view and MUST NOT appear on the always-visible track.
- **FR-011**: A milestone time period, if introduced, MUST be a new optional data field on the milestone, defaulting to hidden when empty.
- **FR-012**: Badge circles MUST be a uniform size, or constrained to a range that keeps every logo legible; the brightening rail MUST remain the primary progression cue.
- **FR-013**: The academia and industry categories MUST be distinguishable by more than color alone (for example an icon, shape, or text label), for colorblind visitors.
- **FR-014**: All milestone content, framing copy, and any new period values MUST live in content or data files, not hardcoded in templates, per the Content as Data principle.
- **FR-015**: The feature MUST deploy on the site's existing static hosting with no additional build step, and MUST NOT request assets from external hosts.

### Key Entities

- **Milestone**: one stop on the journey track. Existing attributes: category, label, organization, logo, flag, place, title, note. New optional attribute: period (a year or range shown only in the expanded detail).
- **Journey framing**: the throughline sentence and the geography line shown above the track, held as content or data.

## Success Criteria *(mandatory)*

- **SC-001**: Expanding any stop reveals the full title and description recorded for it, and collapsing returns the track to its minimal state.
- **SC-002**: With JavaScript disabled, a visitor can still expand and read a stop's detail.
- **SC-003**: At a narrow width the timeline is vertical and scrolls with the page; at a wide width it is horizontal with a visible signal that more stops continue.
- **SC-004**: No four-digit year appears on the collapsed track; when a period is supplied, it appears only after a stop is expanded.
- **SC-005**: A visitor reading above the track can state, in one sentence, the throughline connecting the career to the research, and can name that the path crossed several countries.
- **SC-006**: Every logo is legible at its rendered size, and the academia and industry categories are tellable apart without relying on color.
- **SC-007**: The site builds without errors and every affected page loads successfully when previewed locally.

## Assumptions

- The full title and description text already recorded for each milestone is the author's to correct and is treated as the source for the detail view; no new descriptions are invented.
- The Chevron milestone has an intentionally empty description; the detail view is expected to handle that gracefully rather than prompt for invented content.
- **Decided**: the detail view ships first and time periods are added later. The optional period field and its slot in the detail view are built now but left empty, so no year renders anywhere until the author supplies dates. Filling them in later is a content edit, not a code change.
- The small-screen breakpoint reuses the site's existing responsive breakpoint rather than introducing a new one.
- The people-and-technology throughline reflects the author's stated research interests (human-computer interaction, human-AI collaboration, and the human side of information security) and is subject to the author's wording.
- Reducing badge growth supersedes the earlier behavior in feature 004 where badge size increased along the track; the rail brightening is retained as the progression cue.
- The change is additive to the journey page and does not alter stories, bookmarks, research, or contact.
