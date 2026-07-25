# Feature Specification: Home Page Updates Widget

**Feature Branch**: `006-home-updates-widget`

**Created**: 2026-07-25

**Status**: Implemented

**Input**: User description: "Add a widget on the home page that shows the main updates: a new publication, a new story, and a new bookmark, from a single curated data file that I edit by hand. The call for participants lives on the research page (feature 007); the home widget should also surface that same study while it is active, so recruiting gets more reach, without duplicating its content."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See what is new at a glance (Priority: P1)

A visitor lands on the home page and, below the hero, sees a short "what's new" area listing the latest updates the author has chosen to feature: a recent publication, a recent story, a recent bookmark. Each update shows a small type label, a title that links to the relevant place, a one-line blurb, and its date. The list is short and scannable, newest first.

**Why this priority**: The home page is currently a hero and four navigation links with nothing that changes over time. A concise updates area gives returning visitors a reason to come back and a quick sense of what the author is doing right now.

**Independent Test**: Add three entries of different types to the updates data file, load the home page, and confirm all three appear below the hero with the correct label, title, link, blurb, and date, ordered newest first.

**Acceptance Scenarios**:

1. **Given** the updates data file has entries, **When** the home page loads, **Then** an updates area appears below the hero showing each active entry with its type label, title, blurb, and date.
2. **Given** an entry has a link, **When** a visitor selects its title, **Then** they are taken to that link (an internal page such as a story or research, or an external URL).
3. **Given** several entries, **When** the area renders, **Then** they are ordered newest first by date, with any pinned entry shown first.
4. **Given** more entries than the display limit, **When** the area renders, **Then** only the most recent up-to-the-limit entries are shown.

---

### User Story 2 - Surface the active call for participants (Priority: P1)

The author is recruiting for a research study defined on the research page (feature 007). While that study is active, the home widget also shows it, with distinct callout treatment separate from the plain update rows, a short description, and a clear action that links to the research page's call for participants (or directly to the recruitment form). When the author turns the study off on the research page, it disappears from the home page too, because both read the same source.

**Why this priority**: A recruiting call reaches more people when it is on the landing page, not only on a subpage. Sourcing it from the study's single data file means the author manages it in one place and the home page stays in sync automatically.

**Independent Test**: With the study's active flag on in its data file, load the home page and confirm a distinct callout appears with an action link. Turn the flag off, reload, and confirm the callout is gone from the home page.

**Acceptance Scenarios**:

1. **Given** the study data file has its active flag on, **When** the home page loads, **Then** a distinct call for participants callout appears with a title, short description, and an action link.
2. **Given** the study's active flag is off, **When** the home page loads, **Then** no call for participants callout appears on the home page.
3. **Given** a study with a deadline, **When** the home callout renders, **Then** the deadline is shown.
4. **Given** the home callout, **When** a visitor selects its action, **Then** they are taken to the research page's call for participants or the recruitment link.

---

### User Story 3 - Control what appears, in what order, from one file (Priority: P2)

The author edits a single data file to manage the publication, story, and bookmark updates. Each update is one entry with a type, title, date, link, and blurb. The author can turn any entry on or off without deleting it, pin an entry to the top, and rely on a display limit so old entries fall off the home page automatically as new ones are added. The call for participants is not edited here; it is managed with the study on the research page.

**Why this priority**: The author chose curated control over automatic aggregation, so the editing experience must be simple, in one place, and not require touching layout or logic files.

**Independent Test**: Add, reorder, pin, and deactivate entries in the updates data file and confirm each change is reflected on the home page after a rebuild, with no edits to any template.

**Acceptance Scenarios**:

1. **Given** the updates data file, **When** the author adds an entry, **Then** it appears on the home page on the next build with no template change.
2. **Given** an entry with its active flag off, **When** the home page builds, **Then** that entry is omitted.
3. **Given** an entry marked pinned, **When** the widget renders, **Then** that entry appears first regardless of its date.
4. **Given** more active entries than the limit, **When** the widget renders, **Then** the oldest beyond the limit are not shown.

---

### Edge Cases

- When no updates are active and no study is active, the widget must hide itself cleanly rather than render an empty heading.
- When updates are inactive but the study is active, the home page shows only the call for participants callout, and vice versa.
- An entry with no link must render as plain text (title and blurb) without a broken or empty link.
- An entry with no blurb must render without an empty blurb element.
- A study deadline in the past does not auto-hide the callout, because the site is rebuilt when the author publishes changes rather than on a schedule; the study's active toggle is the reliable control, and this limitation is documented in feature 007.
- The widget must not push the layout sideways or break the existing hero and navigation on small screens.
- Type labels must degrade gracefully: an unrecognized type still renders with a sensible default label rather than failing the build.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page MUST display an updates widget below the hero, populated from a single curated updates record set.
- **FR-002**: Each update entry MUST support a type, a title, a date, an optional link, and an optional blurb.
- **FR-003**: The widget MUST support the update types publication, story, and bookmark, and MUST render an unrecognized type with a default label rather than erroring.
- **FR-004**: Each entry MUST have an active toggle; entries with the toggle off MUST be omitted from the home page without being deleted.
- **FR-005**: The widget MUST order active entries newest first by date, with any entry marked pinned shown before the rest.
- **FR-006**: The widget MUST cap how many entries it shows via a display limit, defaulting to four, so older entries fall off automatically as new ones are added. The limit MUST be adjustable in one place.
- **FR-007**: The widget MUST surface the active call for participants from the shared study record defined in feature 007, rendered as a distinct callout with a description and an action link, and MUST NOT define or duplicate the study content among the updates.
- **FR-008**: When the study is not active, the home page MUST NOT show a call for participants callout; the study's active state is controlled in one place and read by both the research page and the home widget.
- **FR-009**: A study deadline, when present in the shared study data, MUST be shown in the home callout.
- **FR-010**: When neither any update entry nor the study is active, the widget MUST hide itself entirely, rendering no heading or empty container.
- **FR-011**: An entry without a link MUST render as plain text, and an entry without a blurb MUST render without an empty blurb element.
- **FR-012**: The widget MUST render without requiring scripting, per the Minimal JavaScript principle.
- **FR-013**: All widget content MUST live in data files, and the widget presentation MUST be defined once and reusable rather than hardcoded into the home page, per the Content as Data principle.
- **FR-014**: The widget MUST be responsive and MUST NOT break the existing hero or navigation at any width.
- **FR-015**: The feature MUST deploy on the site's existing static hosting with no additional build step and no assets requested from external hosts.

### Key Entities

- **Update**: one featured item in the widget. Attributes: type (publication, story, bookmark, or other), title, date, link (internal or external, optional), blurb (optional), active (on/off), pinned (optional). Held in the curated updates data file.
- **Study call**: the current call for participants, defined in feature 007 and held in a single shared study record. The home widget reads it but does not own it.
- **Widget settings**: the display limit controlling how many active update entries appear, held alongside the updates content or in site configuration.

## Success Criteria *(mandatory)*

- **SC-001**: With three entries of different types in the updates data file, the home page shows all three below the hero, newest first, each linking correctly. With more than four active entries, only the four most recent appear.
- **SC-002**: With the study active, its callout appears on the home page with a working action link; turning the study off on the research page removes it from the home page on the next build.
- **SC-003**: Adding, reordering, pinning, or deactivating an update requires editing only the updates data file, and the study is never edited from the home page.
- **SC-004**: When every update and the study are inactive, the home page shows no updates area at all, and the hero and navigation remain intact.
- **SC-005**: The home page renders correctly on a phone-width and a desktop-width viewport, with the widget stacking cleanly.
- **SC-006**: The site builds without errors and the home page loads successfully when previewed locally.

## Assumptions

- The author chose a single curated updates file for the publication, story, and bookmark updates, accepting that a featured story or bookmark is written by hand and therefore duplicates the entry that also lives with the site's stories or bookmarks. The tradeoff is deliberate, in exchange for full control over wording and what is featured.
- The call for participants is defined once by feature 007; this feature only reads and surfaces it, so there is a single source of truth for the study.
- The updates widget is additive to the home page and does not change the hero, the navigation, or any other page.
- **Decided**: the widget shows the **four** most recent active update entries by default. The limit is adjustable in one place, so the author can change it without touching layout or logic.
- Type labels reuse the site's existing visual language (small labels similar to the filter pills on stories and bookmarks) so the widget feels native to the site.
- Dates in the updates file follow the site's existing year-month-day convention used by bookmarks.
