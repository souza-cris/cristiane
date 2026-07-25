# Research: Home Page Updates Widget

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

Six questions had to be settled before design. All are resolved; none remain marked NEEDS CLARIFICATION.

---

## 1. Ordering with pinning

**Decision**: Filter out switched-off entries, sort by `date`, reverse to newest-first, then partition — pinned entries first, everything else after — and take the first `limit`.

**Rationale**: FR-005 wants newest-first with pinned entries promoted. Liquid has no stable multi-key sort, but partitioning after a single sort gives exactly the required order and keeps date ordering intact *within* each group. Dates are written in year-month-day form, which sorts correctly as plain strings, so no date parsing is needed for ordering — only for display.

**Alternatives considered**:

- *A numeric `order` field the author maintains* — total control, but the author would have to renumber entries every time one is added. The spec asks for date ordering with a pin, not manual sequencing. Rejected.
- *Sorting on a computed key that folds `pinned` into the date* (e.g. prefixing pinned dates with a high value) — one sort instead of a partition, but it is a trick that the next reader has to decode, and it breaks if a date format ever changes. Rejected as cleverness over clarity, per Principle I.
- *Relying on file order* — simplest of all, but then adding a new entry at the bottom would put it last, which is the opposite of what anyone would expect. Rejected.

---

## 2. Where the display limit lives

**Decision**: `site.updates_limit`, read from `_config.yml`, with the include defaulting to `4` when the setting is absent.

**Rationale**: The limit is a site-wide setting, not content, so configuration is its natural home — and it satisfies "adjustable in one place" (FR-006). Defaulting inside the include means the widget works correctly before anyone adds the setting, so the config entry is an override rather than a requirement.

**Alternatives considered**:

- *A `limit` key inside `_data/updates.yml`* — keeps everything in one file, but it forces the data file into a map with the entries nested under an `items:` key. Every other data file on this site (`journey.yml`, `bookmarks.yml`, `story_keywords.yml`) is a plain top-level list, and adding an entry should not mean remembering to nest it. Rejected for consistency.
- *A parameter passed at the call site* (`{% include updates-widget.html limit=4 %}`) — explicit and visible, but it puts a tuning value in the page rather than in configuration, and it would have to be repeated anywhere else the widget appears. Rejected.

> **Worth knowing**: Jekyll reads `_config.yml` only at startup, so changing the limit locally requires restarting the server, not just a rebuild. That is a Jekyll behaviour, not a flaw in this design, but the author should be told — it will be documented alongside the setting.

---

## 3. Type labels, including unfamiliar ones

**Decision**: The type string **is** the label. `type: publication` renders a pill reading "publication". Styling hangs off a modifier class per type, and any type without its own rule falls back to the base pill style.

**Rationale**: FR-003 requires an unrecognized type to render with a sensible default rather than failing the build. Using the string itself makes that automatic — there is no lookup to miss, and a new type the author invents works immediately with no configuration. It also matches the site's existing lowercase pill language on stories and bookmarks.

**Alternatives considered**:

- *A label lookup map in a data file* — allows prettier labels ("Publication" or "New paper"), but introduces a second file to keep in sync and a failure mode where a type has no entry. The spec's own examples are already the words the author would want to display. Rejected as unnecessary indirection.
- *Capitalising the type in the template* — cosmetic, and it fights the site's deliberate all-lowercase style. Rejected.

---

## 4. What `active` means when omitted

**Decision**: An entry is shown unless it carries an explicit `active: false`. Omitting the key means the entry is live.

**Rationale**: FR-004 requires a toggle that hides an entry without deleting it, which this satisfies. Making the *presence* of the key mandatory would mean every new entry needs a flag before it appears, and a forgotten flag would silently hide content the author thought they had published. Failing toward visible is the safer default for a curated list the author controls.

**Alternatives considered**:

- *Requiring `active: true` explicitly* — unambiguous, but the first time the author forgets it they will wonder why their new entry never appeared. Silent invisibility is a worse failure than an entry appearing when expected. Rejected.
- *Treating a missing key as an error* — surfaces the mistake loudly, but Liquid cannot fail a build gracefully, and a broken site is not a good error message. Rejected.

---

## 5. Internal versus external links

**Decision**: A link containing `://` is external — rendered as written, opening in a new tab with `rel="noopener"`. Anything else is treated as an internal path and passed through `relative_url`. A missing link renders the title as plain text.

**Rationale**: This is the same rule feature 007 uses for its action destination, so the site behaves consistently and the author learns one convention. The `relative_url` step is essential here and absent in 007: this site is served under `/cristiane`, so an internal path written as `/stories` would 404 without it.

**Alternatives considered**:

- *Requiring the author to write full URLs for everything* — removes the branch entirely, but internal links would then hardcode the `/cristiane` base path, which breaks if the site ever moves to a different repository or a custom domain. Rejected.
- *A separate `external: true` field* — explicit, but it is a second thing to remember that the link itself already tells us. Rejected.

---

## 6. Hiding the widget entirely

**Decision**: Resolve both the visible entry list and the study's active state **before** emitting anything. If both are empty, the include renders nothing — no `<section>`, no heading, no container.

**Rationale**: FR-010 is explicit that an empty widget must leave no trace, and a stray "what's new" heading over nothing would look broken. Computing both inputs first is the only way to know whether the heading is warranted, since the study callout is self-gating and cannot report back after the fact.

**Alternatives considered**:

- *Rendering the heading and letting each part hide itself* — much simpler control flow, but produces exactly the empty heading FR-010 forbids. Rejected.
- *Hiding the empty widget with CSS* (`:empty`) — no Liquid logic needed, but the markup would still be in the document and announced as an empty region by assistive technology. Rejected; absent is better than hidden.
