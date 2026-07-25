# Research: Research Page Call for Participants

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

Six questions had to be settled before design. All are resolved; none remain marked NEEDS CLARIFICATION.

---

## 1. Where the study lives, and how recruitment is toggled

**Decision**: One data file, `_data/study.yml`, holding a single study record with an `active: true|false` boolean.

**Rationale**: The site is recruiting for one study at a time. A single record is the simplest thing that satisfies FR-004 and keeps the toggle to editing one word. Content stays in the file while inactive, which is exactly what FR-004 requires — nothing is deleted to close recruitment. It also gives feature 006 an unambiguous single source to read (FR-007).

**Alternatives considered**:

- *A list of studies with one marked active* — supports multiple or historical studies, but nothing in the spec asks for that and it introduces "which one wins" logic. Rejected as YAGNI, per Principle I. If a second concurrent study ever appears, converting a single record into a list is a small change.
- *A Jekyll collection with one document per study* — gives each study its own page and front matter, but a collection for a single record is heavy, and it would put study prose in a Markdown body rather than in structured fields the compact variant can pick from. Rejected.
- *Front matter on `research.md`* — avoids a new file, but then the home page could not read the study without duplicating it, breaking FR-007's single source. Rejected.
- *An automatic date-based toggle* — attractive, but the site rebuilds when the author publishes, not on a schedule, so a passed deadline would not take the callout down on its own. The spec already names this; the boolean is the honest control. Rejected as the primary mechanism.

---

## 2. Serving two pages from one definition

**Decision**: One include, `_includes/study-callout.html`, taking a `variant` parameter — `full` for the research page, `compact` for the home page.

**Rationale**: FR-009 requires the callout be defined once and reusable in both places. A parameter is how Jekyll includes take input, and the two surfaces genuinely differ: the research page is where someone decides whether they qualify, so it needs eligibility and what's involved; the home page is a pointer, so it needs a line and an action. One include with a variant keeps a single definition while letting each surface show what it should.

**Alternatives considered**:

- *Two separate includes* — simpler to read individually, but the study's structure would then be described in two files, so a field change means two edits. That is the duplication FR-009 exists to prevent. Rejected.
- *One include rendering everything, hidden with CSS on the home page* — a single template, but it ships the full study text into the home page and hides it, which wastes payload and leaves the text audible to screen readers unless carefully hidden. Rejected.
- *The home page linking to the research page with no callout of its own* — the simplest possible option, but User Story 2 of feature 006 explicitly wants the recruiting call visible on the landing page. Rejected as not meeting the requirement.

---

## 3. Accessible markup for the callout

**Decision**: A `<section>` with `aria-labelledby` pointing at the callout's own heading, where the heading's id is scoped by variant (`study-callout-full`, `study-callout-compact`).

**Rationale**: A `<section>` with an accessible name becomes a navigable landmark, so a screen-reader user can jump to the call for participants rather than hearing it only in reading order. Naming it from the visible heading keeps the announced name and the visible name identical. Scoping the id by variant means the markup stays valid even if both variants ever appeared on one page — duplicate ids are the classic failure of a parameterised include, and this costs nothing to avoid.

**Alternatives considered**:

- *`<aside>`* — semantically "tangentially related" content. That fits the home page, but on the research page the call for participants is primary content, not an aside. Using one element for both keeps the include simple, and `<section>` is the honest choice for the more important surface. Rejected.
- *`aria-label` with a hardcoded string* — sidesteps id collisions, but the announced name would then be a string that can drift from the visible heading. Rejected.
- *A bare `<div>`* — no landmark, no name, nothing for assistive tech to anchor to. Rejected; FR-010 asks for semantic markup.

---

## 4. An action that may be a form URL or an email

**Decision**: The author writes the complete destination in the record, including the `mailto:` scheme when it is an email. The template renders it as given and adds `target="_blank" rel="noopener"` only for external `http(s)` destinations, matching how bookmarks already behave.

**Rationale**: FR-005 allows either kind of destination. Detecting "this looks like an email, so I will prefix `mailto:`" is guesswork that fails on edge cases and hides what the link will do from the person writing it. Writing the full destination is one extra word for the author and removes a whole class of silent breakage.

**Alternatives considered**:

- *Sniffing for an `@` and no `://`, then prefixing `mailto:`* — convenient, but it would mangle any destination that contains an `@` for another reason, and the author cannot see what the rendered link will be from reading the data file. Rejected as magic.
- *Two separate fields, `action_url` and `action_email`* — explicit, but then the template needs precedence rules for when both are set, and the author has to remember which to fill. Rejected as more surface for no gain.

---

## 5. Storing and showing the deadline

**Decision**: An author-formatted string, rendered verbatim. `deadline: "15 March 2027"` appears exactly as written.

**Rationale**: The deadline is a single human-facing phrase, and the author may reasonably want "15 March 2027", "end of March", or "rolling until filled". A parsed date type would force one machine format and reopen timezone questions for a field that is never sorted or compared. The site already stores author-formatted strings in the publications' `venue` field for the same reason.

**Alternatives considered**:

- *A YAML date, formatted with a date filter* — gives consistent formatting and would allow a future automatic expiry, but the expiry cannot work on a static site that rebuilds on push (see decision 1), so the main benefit does not materialise. Rejected.
- *Separate day/month/year fields* — verbose, and still cannot express "rolling until filled". Rejected.

---

## 6. What the compact home variant shows

**Decision**: The compact variant renders an optional `summary` field, falling back to `description` when `summary` is absent.

**Rationale**: Feature 006's User Story 2 asks for "a short description" on the home page. The research page's `description` is written to help someone decide whether to take part and may run several sentences; dropping that whole paragraph onto the landing page would swamp the hero. An optional `summary` lets the author write one tight line for the home page, and the fallback means the feature works correctly before they bother. This is the only field added beyond FR-002's list, and it is optional.

**Alternatives considered**:

- *Reusing `description` on both surfaces* — no new field, but the home page inherits whatever length the research description happens to be, which is exactly the layout risk feature 006's edge cases warn about. Rejected.
- *Truncating `description` to a fixed length* — automatic and needs no new field, but it cuts sentences mid-clause and produces awkward text on a landing page. Rejected; truncation is a poor substitute for the author's own summary.
- *Making `summary` required* — guarantees a good home line, but forces a second piece of writing before the research page can go live at all. Rejected in favour of optional-with-fallback.
