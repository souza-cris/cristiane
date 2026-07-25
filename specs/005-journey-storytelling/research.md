# Research: Journey Storytelling and Usability

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

Five questions had to be settled before design. All are resolved; none remain marked NEEDS CLARIFICATION.

---

## 1. Expanding a stop, one at a time, without script

**Decision**: Use `<details>` with a shared `name` attribute — `<details name="journey">` on every stop.

**Rationale**: The `name` attribute groups disclosures so that opening one closes the others, which is exactly FR-003, with no script at all. `<details>`/`<summary>` is also keyboard-operable and announced by screen readers without any ARIA authoring, which serves FR-002 and Principle IV directly. MDN confirms the behaviour: "This attribute enables multiple `<details>` elements to be connected, with only one open at a time. This allows developers to easily create UI features such as accordions without scripting."

**Degradation**: `<details>` itself has been baseline since January 2020; the `name` attribute is newer. A browser that does not recognise it ignores it, and each stop then opens independently. The page still works — the only loss is exclusivity, which is a preference, not a function. Nothing breaks and no fallback script is warranted.

**Alternatives considered**:

- *Radio-button/checkbox hack* — a hidden `<input type="radio">` per stop gives exclusivity in every browser, but it hijacks a form control for presentation, is announced as a radio button by screen readers, and once one is selected the visitor cannot close them all. Rejected: worse accessibility than the native element, and more markup.
- *`:target` with anchor links* — exclusive by nature and universally supported, but each toggle writes a history entry, so the back button walks through every stop the visitor opened, and it steals focus by jumping the viewport. Rejected.
- *A few lines of JavaScript* — would work, but Principle V requires a documented need that HTML and CSS cannot meet, and here they can. Rejected on principle, correctly.

---

## 2. Signalling that the track continues past the edge

**Decision**: CSS scroll shadows — a pair of gradients pinned with `background-attachment: local, scroll` on the scroll container.

**Rationale**: This is the established CSS-only technique for the problem. Because one layer scrolls with the content and the other stays fixed to the container, the shadow is painted only while there is content beyond that edge, and disappears on its own at the end of the scroll. That is FR-006 in both directions — show while more remains, hide at the end — with no script and no scroll listener.

**Alternatives considered**:

- *A permanently visible fade* — simpler, but it lies at the end of the track, telling the visitor there is more when there is not. Rejected: fails the second half of FR-006.
- *An arrow button* — needs script to know whether to show itself, and adds a control to maintain. Rejected.
- *`scrollbar-color` styling to make the scrollbar obvious* — helps on desktop, does nothing on touch where scrollbars are hidden until scrolled. Kept as a complement, not the mechanism.

---

## 3. How an expanded stop occupies space in a horizontal track

**Decision**: The open stop's column widens to a readable measure; the detail renders inside that column, beneath the summary. Closed stops keep their current narrow width.

**Rationale**: The description text needs roughly 20rem to read comfortably; the current column is 9.5rem. Because only one stop is open at a time (FR-003), at most one column is ever wide, so the track's total width stays predictable. The browser keeps focus on the `<summary>` that was activated, so the keyboard user does not lose their place even though later stops shift right — which satisfies the spec's edge case on focus.

**Alternatives considered**:

- *A shared detail panel below the track* — reads better and shifts nothing, but nothing in HTML or CSS can route "which stop was opened" to a panel elsewhere in the document. It needs script or `:target`. Rejected: costs the Principle V win that makes this whole feature clean.
- *Detail overlaying neighbouring stops* — absolute positioning avoids reflow, but it covers adjacent content, escapes the scroll container awkwardly, and risks the horizontal overflow the spec explicitly warns about. Rejected.
- *Keeping the column narrow and letting text wrap* — a 9.5rem measure is roughly four words per line; the description would run to twenty-plus lines. Rejected as unreadable.

---

## 4. Distinguishing academia from industry without colour

**Decision**: Two cues in addition to colour — the badge ring style differs (solid for academia, dashed for industry), and the category is named in words inside the expanded detail. The legend carries the same ring styles.

**Rationale**: FR-013 asks for more than colour. Ring style is visible at a glance on the collapsed track, where the distinction actually matters, and it costs one CSS declaration. The named category in the detail gives an unambiguous text answer for anyone who wants certainty, and it is read by screen readers.

> **Amended (after implementation)**: the per-stop category word was removed from
> both surfaces — the pill that had been added to the track, and the line in the
> expanded detail. Ring style remains, and the legend above the track still names
> both categories against matching rings. FR-013 is met by ring style plus that
> legend; the words now appear once as a key rather than eleven times as a label.
> This lands closer to the "text label under every stop" alternative rejected
> below, and for the same reason: the author wanted less text per stop.

**Alternatives considered**:

- *Icons per category* (mortarboard, briefcase) — expressive, but every stop already carries a logo inside the circle; a second glyph competes with it. Rejected as visual noise.
- *Text label under every stop* — unambiguous but adds a line of text to every stop, working against the "less text" direction the author asked for in feature 004. Rejected.
- *Different badge shapes* (circle vs square) — strong signal, but fights the established circular-logo treatment across the site. Rejected.

---

## 5. Where framing copy lives, and keeping the country count honest

**Decision**: The throughline and geography lines live in the body of `journey.md`. The number of countries is derived at build time from the distinct flags in the milestone data, not typed as a literal.

**Rationale**: `journey.md` is a content file, so FR-009's "sourced from data or content rather than hardcoded in a layout" is satisfied without inventing a new data file for two sentences — Principle I's YAGNI. Deriving the count closes the spec's drift edge case at the source: add or remove a milestone in a new country and the sentence corrects itself. Continent count cannot be derived from the existing fields and would need a new per-milestone field, so the copy names countries only.

**Alternatives considered**:

- *A `_data/journey_intro.yml` file* — consistent with other data-driven copy, but it is two sentences that belong to exactly one page. Rejected as premature structure.
- *Hardcoding "four countries, three continents"* — simplest, and wrong the moment the list changes. Rejected; it is the exact failure the spec's edge case names.
- *Adding a `continent` field to every milestone* — would make "three continents" derivable too, but adds a field to eleven records to support one clause. Rejected as not worth it; revisit if the copy needs it.
