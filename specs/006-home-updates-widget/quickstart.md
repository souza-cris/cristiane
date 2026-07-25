# Quickstart: Home Page Updates Widget

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

How to run and validate this feature. Each scenario maps to a user story.

## Prerequisites

```bash
bundle install
bundle exec jekyll serve
```

The home page is at <http://localhost:4000/cristiane/>.

Reference: field behaviour is in [data-model.md](data-model.md); the authoring and dependency contracts are in [contracts/update-record.md](contracts/update-record.md).

> **Restart, don't just rebuild**, if you change `updates_limit` — Jekyll reads `_config.yml` only at startup.

## Build check

```bash
bundle exec jekyll build      # must finish with no Liquid errors
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4000/cristiane/
```

Expected: `200`.

## Scenario 1 — See what's new at a glance (User Story 1)

With three entries of different types in the updates file:

1. Load the home page. An updates area appears **below** the hero, not above it.
2. Each entry shows its type label, title, blurb and date.
3. Entries are ordered newest first.
4. Select a title with an internal link and confirm it lands on the right page — not a 404 from a missing base path.
5. Select a title with an external link and confirm it opens in a new tab.

**Passes when**: all three entries render correctly and every link goes where it says.

## Scenario 2 — Surface the active call for participants (User Story 2)

> Requires feature 007, which is already in place.

1. Set the study's `active` to `true` in its record and rebuild. A callout appears in the widget, distinct from the plain update rows, with a title, a short description, the deadline when set, and an action.
2. Confirm the home callout shows the study's `summary` rather than the full `description` — and no eligibility or what's-involved.
3. Set `active` back to `false` and rebuild. The callout disappears from the home page.

**Passes when**: the callout follows the study's toggle without the home page defining any study content.

## Scenario 3 — One study, both pages (completes feature 007's User Story 3)

This is the end-to-end check feature 007 could not finish on its own.

1. With the study active, edit its **title** in the study record and rebuild.
2. Confirm both the research page and the home page show the new title.
3. Turn the study off and confirm it disappears from **both** pages at once.

**Passes when**: one edit changes both surfaces, proving there is a single source of truth.

## Scenario 4 — Control order and visibility (User Story 3)

1. **Add**: add an entry and confirm it appears after a rebuild, with no template edit.
2. **Deactivate**: set `active: false` on one entry and confirm it disappears while staying in the file.
3. **Pin**: set `pinned: true` on an older entry and confirm it moves to the top despite its date.
4. **Limit**: add enough entries to exceed the limit and confirm only the most recent four appear.

**Passes when**: every ordering and visibility rule can be exercised from the data file alone.

## Scenario 5 — Empty and partial states

1. Switch **every** entry off and set the study inactive. Rebuild. The home page shows **no** updates area at all — no heading, no empty box — and the hero and navigation are untouched.
2. Entries off, study **on**: only the callout shows.
3. Entries on, study **off**: only the entry list shows.
4. An entry with no `link` renders as plain text, not a dead link.
5. An entry with no `blurb` renders no empty element.
6. An entry with an unfamiliar `type` (e.g. `talk`) renders with that word as its label and does not fail the build.

**Passes when**: every combination degrades cleanly, especially the fully-empty case.

## Scenario 6 — Responsive and accessible

1. Narrow the window to phone width. The widget stacks cleanly and does not push the page sideways.
2. Confirm the hero and navigation are unchanged at every width.
3. Tab through the widget. Focus indicators are visible and link text says where each link goes.
4. Confirm the updates area is announced as a named region, taking its name from the visible heading.
5. Confirm type labels are readable without relying on colour alone.

**Passes when**: the widget is usable at any width, by keyboard, and with assistive technology.

## Regression checks

- The hero — eyebrow, headline, subheadline and the five links — is unchanged.
- The journey, stories, research, bookmarks and contact pages are untouched.
- The research page's own call for participants still behaves exactly as feature 007 left it.
- No request goes to an external host; the widget adds no images, fonts or scripts.
