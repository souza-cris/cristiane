# Research: Side Navigation and Uninterrupted Home

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

Four questions had to be settled. All are resolved; none remain marked NEEDS CLARIFICATION.

---

## 1. Keeping the menu in view while the page scrolls

**Decision**: `position: fixed` on the right edge, `top: 50%` with a `translateY(-50%)` to center it vertically.

**Rationale**: Fixed positioning takes the menu out of flow entirely, so it cannot affect the content column's width or position — which is what makes FR-004's "no layout shift" free rather than something to defend. Vertical centring means the menu is never near the top or bottom edge, where it would collide with the header or footer at short viewport heights. It costs four declarations and no script.

**Alternatives considered**:

- *`position: sticky` inside a flex sidebar* — keeps the menu in normal flow, which is tidier conceptually, but it requires the page to become a two-column layout. Every existing page assumes one centered column, so this would touch far more than the navigation. Rejected as disproportionate.
- *A scroll listener repositioning the menu* — needs script for something CSS does natively. Rejected on Principle V.
- *Duplicating the top nav at the bottom of each page* — no positioning problem at all, but it only helps a visitor who has already scrolled to the end. Rejected: it does not solve the stated problem.

---

## 2. Where the menu hides

**Decision**: hidden below 1000px, using `display: none` in a `max-width: 999px` media query.

**Rationale**: The content column is capped at 44rem (704px) and centered. For the menu to sit beside it without overlapping, the viewport needs the column plus roughly 150px of menu and gutter on each side — about 1000px. Below that the menu would sit on top of the text, which is FR-004's failure case. The site's existing 600px breakpoint is the wrong one to reuse here: it marks where the top navigation collapses, not where a 44rem column stops having room beside it. Two different layout facts deserve two numbers.

**Note**: this is the site's second breakpoint, which is worth being deliberate about. It is justified because it describes a different constraint, and it is recorded here so the next person does not "tidy" it into 600px and cause overlap.

**Alternatives considered**:

- *Reusing the 600px breakpoint* — one fewer number to remember, but between 600px and 1000px the menu overlaps the text. Rejected: it fails FR-004 across a 400px band of common laptop and tablet widths.
- *A container query* — arguably the more correct tool, since the question is about the container's room, but the menu is `position: fixed` and therefore not inside the container it needs to measure. Rejected as not applicable here.

---

## 3. Marking the visitor's current section

**Decision**: `aria-current="page"` written at build time by comparing `page.url`, with an exact match for single pages and a `contains` match for sections that have child pages. Styled with both a color change and a right border.

**Rationale**: `aria-current` is the attribute the platform provides for exactly this, so screen readers announce it without any extra authoring. Doing the comparison in Liquid means it is correct in the delivered HTML rather than applied after load. Stories and bookmarks have child pages — an individual story, a filter page — and a visitor reading one is still in that section, so those match by prefix while `/research/` and `/contact/` match exactly. The border matters: color alone would fail the same accessibility bar the journey categories are held to.

**Alternatives considered**:

- *Color alone for the current link* — simplest, but conveys the state only to visitors who can distinguish the two colors. Rejected for the same reason FR-013 exists in feature 005.
- *Marking the current page by matching the label against the page title* — avoids the URL rules, but breaks the moment a page's title and its section label differ, which is already true of individual stories. Rejected as fragile.

---

## 4. Excluding home, and the rules around the content

**Decision**: the layout sets a body class — `is-home` or `is-interior` — and includes the side navigation only when the page is not home. The same class removes the rule under the top navigation and above the footer on home.

**Rationale**: One condition in the layout drives both behaviors, and the class makes the page's identity available to CSS for anything similar later. Excluding home from the menu is a judgement about that one page, not a property of pages in general, so a per-page front-matter switch would be a setting nobody would ever change — a stored value with one possible answer. Deciding it in the layout keeps the pages themselves free of presentation flags.

**Alternatives considered**:

- *A `side_nav: false` front-matter flag on `index.md`* — explicit and greppable, but it invites the question of which other pages should set it, and the answer is none. Rejected as structure without a purpose.
- *Hiding the menu on home with CSS only* — the markup would still ship on every home page load and still be reachable by screen readers and keyboard while invisible. Rejected: hiding something from sight but not from assistive technology is an accessibility bug, not a layout choice.
