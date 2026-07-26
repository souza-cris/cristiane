# Quickstart: Site Icon and Brand Mark

**Date**: 2026-07-26 | **Feature**: [spec.md](spec.md)

Manual verification. Run `bundle exec jekyll serve` and open <http://localhost:4000/cristiane/>.

## Regenerating the icon files

The `.ico` and the touch icon are generated from `assets/img/icon.svg` and committed. Run
these after any change to the artwork. They need `rsvg-convert` (`brew install librsvg`)
and Pillow — both already present on the author's machine, and neither is a site build
dependency.

```bash
# 180x180 touch icon for iOS
rsvg-convert -w 180 -h 180 assets/img/icon.svg -o assets/img/apple-touch-icon.png

# favicon.ico carrying 32x32 and 16x16, written to the repository root
rsvg-convert -w 256 -h 256 assets/img/icon.svg -o /tmp/_ico-src.png
python3 - <<'PY'
from PIL import Image
Image.open("/tmp/_ico-src.png").convert("RGBA").save(
    "favicon.ico", sizes=[(32, 32), (16, 16)])
# iOS ignores transparency and composites on black, so flatten the touch icon
Image.open("assets/img/apple-touch-icon.png").convert("RGB").save(
    "assets/img/apple-touch-icon.png", optimize=True)
PY
rm /tmp/_ico-src.png
```

**Passes when**: `favicon.ico` is about 2KB, `apple-touch-icon.png` is 180×180 in RGB (no
alpha channel), and both show the book on its teal tile.

## Build check

```bash
bundle exec jekyll build
```

**Passes when**: the build completes with no Liquid error.

## Scenario 1 — The tab carries the mark (User Story 1, FR-001)

1. Open the site. Look at the browser tab: the mark appears in place of the blank
   placeholder.
2. Open several other tabs alongside it and confirm this one is identifiable without
   reading the titles.
3. Bookmark the page, then open the bookmarks list. The mark identifies the entry.
4. Open `/journey/`, `/stories/`, `/contact/` and a single story. The same mark appears on
   every one — it does not change between sections (FR-003).
5. Open a URL that does not exist, so the 404 renders. The mark is there too.

**Passes when**: every page shows the same mark in the tab, and no page shows the blank
placeholder.

## Scenario 2 — The files are actually served (FR-006, FR-007)

```bash
for p in assets/img/icon.svg favicon.ico assets/img/apple-touch-icon.png; do
  curl -s -o /dev/null -w "%{http_code}  $p\n" "http://localhost:4000/cristiane/$p"
done
```

**Passes when**: all three return 200.

Then confirm the declarations point at those paths and carry the base path:

```bash
curl -s http://localhost:4000/cristiane/ | grep -E 'rel="icon"|apple-touch-icon'
```

**Passes when**: every `href` begins `/cristiane/`. A bare `/favicon.ico` would resolve to
the domain root, which is a different site.

> **On the domain root**: `https://souza-cris.github.io/favicon.ico` is served by the
> author's *user-site* repository, not this one, and stays a 404 as far as this project is
> concerned. It does not matter, because the icons are declared and a browser given a
> declaration never probes the root. See decision 1 in [research.md](research.md).

## Scenario 3 — Phone home screen (User Story 2, FR-004)

1. Open the site on an iPhone or iPad, then Share → Add to Home Screen.
2. Confirm the suggested icon is the mark on its tile, not a screenshot of the page.
3. Add it, and confirm the home screen tile shows the book with no black corners and no
   part of the book clipped by iOS's rounding.

**Passes when**: the tile is the mark, fully opaque, uncropped.

> If the corners come out black, the touch icon kept an alpha channel. Re-run the
> regeneration step above, which flattens it to RGB.

## Scenario 4 — Legible small, on light and dark chrome (User Story 3, FR-005)

1. View the tab in a light-themed browser, then a dark-themed one. The mark is
   distinguishable against both — the teal tile carries its own background, so it never
   relies on the toolbar behind it.
2. Zoom the tab to its smallest rendered size, or view `favicon.ico` at 16×16. The
   open-book shape is still readable as a shape rather than a teal blob.

**Passes when**: the mark holds up in both themes and stays readable at 16px.

## Scenario 5 — Nothing depends on seeing it (FR-008)

1. Confirm no page's meaning or navigation changes if images fail to load.
2. Confirm the head declarations add no visible content to any page.

**Passes when**: the icon is purely decoration — its absence costs nothing but recognition.

## Regression checks

1. The home page mark still renders at the top of the home page, and still nowhere else.
   It is a separate file (`assets/img/logo.svg`) and is unaffected by this feature.
2. `theme-color` is still `#0d1117`. It is deliberately not the brand teal — see decision 5
   in [research.md](research.md).
3. No request goes to an external host.
4. `search.js` is still the only script.
