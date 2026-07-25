# Quickstart: Research Page Call for Participants

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

How to run and validate this feature. Each scenario maps to a user story.

## Prerequisites

```bash
bundle install
bundle exec jekyll serve
```

The research page is at <http://localhost:4000/cristiane/research/>.

Reference: field-by-field behaviour is in [data-model.md](data-model.md); the authoring and include contracts are in [contracts/study-record.md](contracts/study-record.md).

## Build check

```bash
bundle exec jekyll build      # must finish with no Liquid errors
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4000/cristiane/research/
```

Expected: `200`.

## Scenario 1 — The callout invites someone to take part (User Story 1)

With `active: true` in the study record:

1. Load the research page. A call for participants appears, visually distinct from the research interests and the publication list.
2. Confirm it states what the study is about, who can take part, and what is involved.
3. Confirm the deadline appears when one is set.
4. Select the action and confirm it reaches the sign-up destination — an external form in a new tab, or a mail client for a `mailto:` destination.

**Passes when**: a visitor could read the callout and know whether they qualify and how to sign up.

## Scenario 2 — The toggle opens and closes recruitment (User Story 2)

This is the heart of the feature. Run it in both directions.

1. Set `active: false` and rebuild. The research page shows **no** callout, and its interests and publications render normally.
2. Confirm the study's content is still in the file — closing recruitment must not require deleting anything.
3. Set `active: true` and rebuild. The same callout returns, unchanged.

**Passes when**: recruitment opens and closes by editing one word, with no template edits and no content loss.

## Scenario 3 — Single source, ready for the home page (User Story 3, partial)

> **Scope**: only half of this story can be verified here. Rendering on the home page is feature 006's call site.

1. Confirm the study's words appear in exactly one file — nothing is copied into the research page or anywhere else.
2. Edit the title, rebuild, and confirm the research page picks up the change.
3. Confirm the include accepts `variant="compact"` and renders the shorter form (title, summary or description, deadline, action — no eligibility, no what's involved).

**Passes when**: the record is single-source and the compact variant is ready for feature 006 to call.

## Scenario 4 — Empty and missing cases

1. Remove `deadline` and rebuild. No empty date element, no dangling label.
2. Remove `summary` and render the compact variant. It falls back to `description`.
3. Rename `_data/study.yml` temporarily so it is absent, and rebuild. **The site still builds** and the research page renders normally. Restore the file afterwards.

**Passes when**: every optional field can be absent without leaving a broken fragment behind.

## Scenario 5 — Responsive and accessible

1. Narrow the window to phone width. The callout wraps cleanly and does not hide the interests or the publications.
2. Tab to the action link. The focus indicator is clearly visible and the link text says what it does — not "click here".
3. Confirm the callout is announced as a named region by a screen reader, taking its name from the visible heading.
4. Confirm nothing in the callout depends on colour alone to be understood.

**Passes when**: the callout is usable at any width, by keyboard, and with assistive technology.

## Regression checks

- The research interests paragraph and all five publications still render, in their existing order.
- The home page, stories, bookmarks, journey and contact pages are unchanged — this feature does not touch them.
- No request goes to an external host; the callout adds no images, fonts or scripts.

## Before going live

- [ ] The study content is the author's own — for human-subjects research, the IRB-approved recruitment text, verbatim.
- [ ] `action_url` is complete and correct, and has been opened once to confirm it works.
- [ ] `active: true` is set only when recruitment is genuinely open. The deadline will not close it automatically.
