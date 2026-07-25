# Quickstart: Journey Storytelling and Usability

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

How to run and validate this feature. Each scenario maps to a user story and can be checked independently.

## Prerequisites

```bash
bundle install
bundle exec jekyll serve
```

The journey page is at <http://localhost:4000/cristiane/journey/>.

Reference: the record shape and its guarantees are in [contracts/journey-milestone.md](contracts/journey-milestone.md); field-by-field behaviour is in [data-model.md](data-model.md).

## Build check

```bash
bundle exec jekyll build      # must finish with no Liquid errors
```

Then confirm every affected page still loads:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4000/cristiane/journey/
```

Expected: `200`.

## Scenario 1 — Read the story behind a milestone (User Story 1)

1. Load the journey page. Each stop shows only badge, flag, label and organization — unchanged from before.
2. Activate any stop. Its full title and description appear.
3. Activate a second stop. The first collapses.
4. Activate the Chevron stop, whose description is intentionally empty. It expands showing title and place, with no empty block and no stray label.
5. Confirm the text matches what is recorded for that milestone in the data file.

**Passes when**: detail content matches the data, one stop is open at a time, and the empty-description case renders cleanly.

## Scenario 2 — Works without JavaScript (User Story 1, SC-002)

Disable JavaScript in the browser (DevTools → Settings → Debugger → Disable JavaScript, or a content-blocker) and reload.

**Passes when**: stops still expand and collapse, and only one is open at a time.

> If exclusivity does not hold in an older browser, that is expected degradation, not a failure — see [research.md](research.md) §1. Expanding itself must always work.

## Scenario 3 — Usable on any device (User Story 2)

1. Narrow the window below the small-screen breakpoint. The timeline stacks vertically, oldest at top, and scrolls with the page rather than sideways.
2. Widen it. The track runs horizontally.
3. With stops extending past the right edge, confirm an edge shadow signals more content.
4. Scroll to the newest stop. Confirm the shadow on that edge is gone.

**Passes when**: both layouts render correctly and the affordance appears and disappears at the right moments.

## Scenario 4 — Keyboard only (User Story 2, FR-007)

Without touching the mouse:

1. <kbd>Tab</kbd> to a stop. The focus indicator is clearly visible.
2. <kbd>Enter</kbd> or <kbd>Space</kbd> opens it; the same keys close it.
3. <kbd>Tab</kbd> to the track container and use <kbd>←</kbd>/<kbd>→</kbd> to scroll sideways.
4. After opening a stop, confirm focus is still on that stop and has not jumped.

**Passes when**: every stop is reachable, operable and readable by keyboard alone.

## Scenario 5 — Framing and geography (User Story 3)

Read the area above the track.

**Passes when**: a sentence connects the industry-to-academia arc to the research focus, and a line names the multi-country path.

To verify the count is derived rather than typed: temporarily add a milestone with a flag not already used, rebuild, and confirm the stated number increases by one. Remove it afterwards.

## Scenario 6 — Time appears only in the detail (User Story 4)

This story ships as structure only; periods are empty by decision.

1. Temporarily add `period: "2019–2022"` to one milestone and rebuild.
2. Expand that stop. The period appears in the detail.
3. Scan the collapsed track. No year is visible anywhere.
4. Expand a milestone with no period. No empty date element renders.
5. Remove the temporary period.

> **Checking for years:** detail content is present in the HTML even while collapsed, so grepping the whole page will match text that no visitor sees. Check the summary markup or check visually.

## Scenario 7 — Legible badges and non-colour category cue (User Story 5, FR-013)

1. Compare the first and last badges. They are the same size.
2. Confirm the rail still brightens from oldest to newest.
3. Confirm academia and industry stops differ by ring style, not only colour — a greyscale screenshot is the quickest test.
4. Confirm the legend above the track names both categories against those same ring styles. No individual stop names its category — that word appears only in the legend.

**Passes when**: every logo is legible and the two categories are tellable apart with colour removed.

## Scenario 8 — Organisation links on the logos

1. Click a badge logo. The organisation's own site opens in a new tab.
2. Confirm the stop did **not** open as a result of that click. A link inside a `<summary>` handles its own click, so the disclosure must not toggle — if it does, something has broken, and the fix is in the markup, never a script.
3. Click the same stop's label. It toggles open, and no new tab appears.
4. In the opened detail, confirm the organisation name is a link to the same destination.
5. Remove `url` from one milestone in `_data/journey.yml`. That stop's logo and org name render as plain content, with no empty link.

**Passes when**: logos and org names link out, the toggle still works from everywhere else on the stop, and a milestone with no `url` renders cleanly.

## Regression checks

- The page does not scroll sideways as a whole at any width — only the track scrolls.
- Stories, bookmarks, research and contact pages are unchanged.
- All eleven logos still load; no request goes to an external host.
