# Quickstart: Side Navigation and Uninterrupted Home

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

Manual verification. Run `bundle exec jekyll serve` and open <http://localhost:4000/cristiane/>.

## Build check

```bash
bundle exec jekyll build
```

**Passes when**: the build completes with no Liquid error.

## Scenario 1 — The menu is there and it stays there (User Story 1, FR-001)

1. Open `/bookmarks/` in a window at least 1100px wide.
2. Confirm a vertical list of five links sits at the right edge, vertically centered.
3. Scroll to the bottom of the page. The menu has not moved.
4. Confirm the content column has not shifted left or narrowed compared with the home page.

**Passes when**: the menu stays put while the page scrolls and the content is untouched.

## Scenario 2 — The current section is marked (FR-003, FR-007)

1. On `/bookmarks/`, confirm "bookmarks" is marked as current — a color change **and** a border on the right edge of the link.
2. Open a bookmark filter page, such as `/bookmarks/papers/`. Confirm "bookmarks" is still marked.
3. Open an individual story from `/stories/`. Confirm "stories" is marked, not "journey" or anything else.
4. Open `/contact/`. Confirm "contact" is marked and "stories" is not.

**Passes when**: exactly one link is marked on each page, and section pages mark their parent section.

> **Why the border matters**: a visitor who cannot distinguish the two colors must still be able to tell which section they are in. Check by taking a greyscale screenshot — the marked link should still be obvious.

## Scenario 3 — Home is clean (User Story 2, FR-005, FR-006)

1. Open the home page at a wide width. Confirm **no** side menu appears.
2. View source, or use the browser inspector, and confirm the `side-nav` markup is not present at all — not merely hidden.
3. Confirm there is no horizontal rule beneath the top navigation and none above the footer.
4. Open any other page and confirm those rules are back.

**Passes when**: home has neither the menu nor the rules, and other pages have both.

## Scenario 4 — Narrow screens yield entirely (User Story 3, FR-004)

1. On `/stories/`, narrow the window slowly from 1100px down to 900px.
2. Confirm the menu disappears at 1000px and never overlaps the text on the way there.
3. At 900px, confirm no horizontal scrollbar appears.
4. Confirm the top navigation still works and reaches every section.
5. Press Tab through the page at 900px and confirm focus never lands on a hidden side-nav link.

**Passes when**: the menu is gone below 1000px, nothing overlaps, nothing scrolls sideways, and no invisible link can be focused.

## Scenario 5 — Keyboard and screen reader (FR-007)

1. From the top of `/research/`, press Tab repeatedly. Focus reaches the side-nav links with a visible ring.
2. Press Enter on one. It navigates.
3. With a screen reader, confirm the region is announced as navigation named "Section navigation", distinct from the top navigation.

**Passes when**: every link is keyboard-operable with a visible focus indicator and the region is properly named.

## Scenario 9 — One menu at a time, and never none

1. On an interior page at 1300px, confirm the section links appear **only** at the right
   edge. The top bar shows "main" and nothing else.
2. Narrow to 900px. The side menu goes; the section links appear in the top bar instead.
   Confirm they are actually drawn on screen, not merely present in the markup.
3. Narrow to 500px. The top links go and the menu button appears.
4. Repeat all three widths on the **home page**. Home has no side menu, so its top links
   must stay visible at every width down to 600px.
5. At no width should both menus list the sections at once, and at no width should neither.

**Passes when**: exactly one menu is visible at every width on both page types.

> **Check this by looking, not by measuring.** The links live inside a `<details>`, and a
> closed `<details>` hides its content in a way that still reports element geometry. Asking
> the page whether a link "has a box" will answer yes even when nothing is drawn. Take a
> screenshot, or look at the screen.

## Regression checks

1. `/journey/`, `/stories/`, `/research/`, `/bookmarks/` and `/contact/` all render normally with the menu present.
2. The mobile top navigation still opens and closes below 600px.
3. The journey track still scrolls sideways and is not covered by the menu at any width.
4. No new script is loaded — `search.js` remains the only one.
