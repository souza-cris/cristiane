# Feature Specification: Research Page Call for Participants

**Feature Branch**: `007-research-call-for-participants`

**Created**: 2026-07-25

**Status**: Implemented

**Input**: User description: "Put the call for participants in the research section. It should describe the study, who can take part, and what is involved, with a clear way to sign up, and I should be able to turn it on and off when recruitment opens and closes. This same study should be the single source that the home page widget also surfaces."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Learn about the study and take part (Priority: P1)

A visitor on the research page sees a clearly marked call for participants: what the study is about, who is eligible, roughly what taking part involves, and a clear action to sign up or express interest. It reads as an invitation, distinct from the research interests and the publication list around it.

**Why this priority**: Recruiting participants is the concrete goal of this feature. A visitor must understand the study and be able to act on it in one place.

**Independent Test**: With an active study in the data file, load the research page and confirm the callout shows the study title, description, eligibility, what is involved, and a working action link to the sign-up destination.

**Acceptance Scenarios**:

1. **Given** an active study, **When** a visitor opens the research page, **Then** a call for participants callout appears, visually distinct from the research interests and publications.
2. **Given** the callout, **When** the visitor reads it, **Then** it states what the study is about, who can take part, and what is involved.
3. **Given** the callout, **When** the visitor selects the action, **Then** they are taken to the recruitment or consent destination (an external form or an email).
4. **Given** a study with a deadline, **When** the callout renders, **Then** the deadline or closing date is shown.

---

### User Story 2 - Open and close recruitment with one toggle (Priority: P1)

The author opens recruitment by turning the study on, and closes it by turning it off, editing a single data file. When it is off, the research page shows no call for participants and reads normally.

**Why this priority**: Studies recruit for a fixed window. The author must switch the invitation on and off without deleting the content or editing templates.

**Independent Test**: Toggle the study's active flag on and off in the data file, rebuild, and confirm the callout appears and disappears on the research page accordingly, with no template edits.

**Acceptance Scenarios**:

1. **Given** the study's active flag is on, **When** the research page builds, **Then** the callout appears.
2. **Given** the study's active flag is off, **When** the research page builds, **Then** no callout appears and the page renders normally.
3. **Given** the study content stays in the file while inactive, **When** the author turns it back on, **Then** the same content reappears without being rewritten.

---

### User Story 3 - One study, surfaced in both places (Priority: P2)

The study is defined once. The research page shows the full call for participants, and the home page widget (feature 006) surfaces the same study while it is active. Editing the study in its single data file updates both places.

**Why this priority**: A single source of truth prevents the home page and research page from drifting out of sync and keeps the author's work to one edit.

**Independent Test**: Change the study's title or turn it off in the data file, rebuild, and confirm both the research page and the home page reflect the change.

**Acceptance Scenarios**:

1. **Given** the shared study data file, **When** the author edits the study title, **Then** both the research page and the home widget show the new title after a rebuild.
2. **Given** the study is turned off, **When** the site builds, **Then** neither the research page nor the home page shows the call for participants.

---

### Edge Cases

- When no study is active, the research page must render its interests and publications normally, with no empty callout container.
- A study with no deadline must render without an empty date element.
- A study whose action is an email rather than a form must produce a working contact action.
- A deadline in the past does not auto-hide the callout, because the site is rebuilt when the author publishes changes rather than on a schedule; the active toggle is the reliable control, and this limitation must be documented for the author.
- The callout must not disrupt the existing research interests and publications sections or their order in a way that hides them.
- Long study descriptions must wrap and remain readable on small screens.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The research page MUST display a call for participants callout when a study is active, sourced from a single shared study record.
- **FR-002**: The study data MUST support a title, a description, an eligibility statement, a "what is involved" statement, an action link, an action label, an active toggle, and an optional deadline.
- **FR-003**: The callout MUST be visually distinct from the research interests and publications, reading as an invitation rather than a list item.
- **FR-004**: The study MUST have an active toggle; when off, the research page MUST show no callout while retaining the content in the file.
- **FR-005**: The action MUST link to a recruitment or consent destination, which MAY be an external form URL or an email contact.
- **FR-006**: A deadline, when present, MUST be shown in the callout.
- **FR-007**: The study MUST be the single source of truth, readable by both the research page and the home widget (feature 006), with no duplicated study content elsewhere.
- **FR-008**: The callout MUST render without requiring scripting, per the Minimal JavaScript principle.
- **FR-009**: All study content MUST live in the shared study record, and the callout MUST be defined once and reusable in both places it appears, per the Content as Data principle.
- **FR-010**: The callout MUST be responsive and accessible, using semantic markup (for example a labeled region or aside) and a clearly described action, with sufficient contrast.
- **FR-011**: The feature MUST deploy on the site's existing static hosting with no additional build step and no assets requested from external hosts.

### Key Entities

- **Study call**: the current call for participants. Attributes: active toggle, title, description, eligibility, what is involved, action link, action label, optional deadline. Held in a single shared study record.
- **Call for participants presentation**: a single reusable rendering of the study callout, used in full on the research page and surfaced by the home widget.

## Success Criteria *(mandatory)*

- **SC-001**: With an active study, the research page shows a distinct callout describing the study, eligibility, and what is involved, with a working sign-up action.
- **SC-002**: Turning the study off in the data file removes the callout from the research page on the next build, and the page still renders its interests and publications.
- **SC-003**: Editing the study in its single data file updates both the research page and the home widget after a rebuild.
- **SC-004**: The research page renders correctly on a phone-width and a desktop-width viewport, with the callout wrapping cleanly and not hiding the interests or publications.
- **SC-005**: The site builds without errors and the research page loads successfully when previewed locally.

## Assumptions

- **Decided**: the study record ships with the author's real content, not placeholder text. No study details, eligibility, or claims are invented — a call for participants describing a study that does not exist as written would be a fabrication, and the sign-up destination cannot be guessed. [NEEDS CLARIFICATION: awaiting author-supplied content — study title, eligibility, what taking part involves, sign-up destination, and deadline if any. This is a content dependency, not a design question; the mechanism can be planned and built in full while it is outstanding, with the study switched off until the content arrives.]
- The sign-up destination is provided by the author (an external survey or consent form, or an email); this feature does not build a form or collect data itself, in keeping with the site's static-hosting constraint.
- The active toggle is the primary control; the deadline is informational and does not auto-expire the callout between deploys.
- The callout is placed within the research section in a position the author can adjust; a reasonable default is above the publications, near the research interests.
- This feature owns the study record; feature 006 only reads it.
- No participant data is stored, processed, or transmitted by the site itself, so this feature introduces no new privacy handling beyond linking out to the author's chosen sign-up destination.
