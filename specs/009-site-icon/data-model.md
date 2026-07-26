# Data Model: Site Icon and Brand Mark

**Date**: 2026-07-26 | **Feature**: [spec.md](spec.md)

## Changes at a glance

| Change | Entity | Detail |
|--------|--------|--------|
| New committed assets | Icon file | Three files: an SVG, an ICO, and a touch-icon PNG |
| New declarations | Page head | `<link>` elements naming those files, on every page |
| No data file | — | Nothing in `_data/`. The set is fixed and structural, not authored content |
| No front matter | — | No page gains a setting; the icon is identical everywhere |

Nothing a visitor reads changes, and no existing file's meaning changes.

## Entities

### Icon file

One committed image serving one purpose. Not a data record — these are binary and vector
assets, listed here so the set is documented in one place.

| File | Format | Size | Serves | Generated from |
|------|--------|------|--------|----------------|
| `assets/img/icon.svg` | SVG | any | modern browsers | authored (the artwork) |
| `favicon.ico` | ICO | 32×32 + 16×16 | older browsers; bare-root requests | `icon.svg` |
| `assets/img/apple-touch-icon.png` | PNG | 180×180 | iOS / iPadOS home screens | `icon.svg` |

**Validation rules**

- `icon.svg` is the source of truth for the other two. If the artwork changes, both
  generated files MUST be regenerated from it — see [quickstart.md](quickstart.md) for the
  exact commands.
- `favicon.ico` MUST sit at the repository root so it publishes to `/cristiane/favicon.ico`,
  this site's own root. The domain root is a different repository and is out of scope —
  see decision 1 in [research.md](research.md).
- The touch icon MUST be fully opaque and fill its square. iOS applies its own rounding and
  does not honour transparency; a transparent PNG renders on black.
- No file may carry an embedded colour profile. The source artwork is plain hex fills, so
  this is a matter of not introducing one during generation.
- Every file MUST be committed. Nothing is fetched or generated at deploy time.

**Relationship to the home page mark**

`assets/img/logo.svg` (feature 009, already shipped) holds the same artwork and is **not**
the same file. The two are deliberately independent so the icon can be tuned for small sizes
without changing the home page — see decision 3 in [research.md](research.md). They are
expected to diverge; until they do, a change to the drawing means changing both.

### Page head declaration

What every page tells the browser. Emitted by `_includes/head.html`, identical on all pages.

| Declaration | Points at | Purpose |
|-------------|-----------|---------|
| `icon`, type `image/svg+xml` | `assets/img/icon.svg` | preferred by modern browsers |
| `icon`, type `image/x-icon` | `/cristiane/favicon.ico` | fallback for older browsers |
| `apple-touch-icon` | `assets/img/apple-touch-icon.png` | iOS home screen tile |

**Validation rules**

- Every `href` MUST pass through `relative_url`. The site is served from `/cristiane`; a
  bare path resolves to the domain root, which is a different site.
- The declarations MUST be identical on every page including the 404 — the icon does not
  vary by section (FR-003).
- `theme-color` MUST remain `#0d1117`, the site's actual background. It is not changed to
  the brand teal; see decision 5 in [research.md](research.md).

## Relationships

```
the artwork ──authored──▶ assets/img/icon.svg
                          │
                          ├──generated──▶ favicon.ico (32+16)
                          └──generated──▶ assets/img/apple-touch-icon.png (180)

_includes/head.html ──declares all three──▶ every page, identically

assets/img/logo.svg ──same drawing, separate file──▶ home page mark only
                        (free to diverge; not generated from icon.svg)
```

## Changing the artwork later

1. Replace `assets/img/icon.svg` with the new drawing.
2. Regenerate the two raster files with the commands in [quickstart.md](quickstart.md).
3. Decide whether the home page mark (`assets/img/logo.svg`) should change to match. It is a
   separate file by design and will not follow automatically.

No template changes at any step.
