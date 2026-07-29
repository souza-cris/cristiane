# Contract: Icon Declaration

**Date**: 2026-07-26 | **Feature**: [../spec.md](../spec.md)

Two contracts. The **head contract** is between `_includes/head.html` and every browser
that loads a page. The **asset contract** is between this feature and the deployed site:
which files must exist, at which published paths.

---

## 1. Head contract — what every page declares

Emitted by `_includes/head.html`, identically on every page:

```html
<link rel="icon" type="image/svg+xml" href="{{ '/assets/img/icon.svg' | relative_url }}">
<link rel="icon" type="image/x-icon" href="{{ '/favicon.ico' | relative_url }}">
<link rel="apple-touch-icon" href="{{ '/assets/img/apple-touch-icon.png' | relative_url }}">
```

### Guarantees

- All three appear on **every** page, including `404.html`. The icon never varies by
  section (FR-003).
- Every `href` is resolved through `relative_url`, so each becomes `/cristiane/…`. A bare
  path would resolve to the domain root, which belongs to a different repository.
- No other icon-related element is emitted — no manifest link, no Microsoft tile meta, no
  `msapplication-*`. Those are out of scope and would be dead weight.
- `theme-color` stays `#0d1117` and is **not** part of this contract's changes.

### What a browser does with them

| Browser | Uses | Notes |
|---------|------|-------|
| Modern Chrome, Firefox, Safari, Edge | `icon.svg` | SVG is preferred when declared |
| Older browsers without SVG icon support | `favicon.ico` | falls through to the second `link` |
| iOS / iPadOS "Add to Home Screen" | `apple-touch-icon.png` | ignores the other two |
| Anything requesting `/cristiane/favicon.ico` directly | the committed `.ico` | no page context needed |

Because the icons are **declared**, no browser needs to probe for a root `/favicon.ico`.
The declaration is what makes decision 1 in [../research.md](../research.md) a non-issue in
practice.

---

## 2. Asset contract — what must exist where

| Repository path | Published URL | Must be |
|-----------------|---------------|---------|
| `assets/img/icon.svg` | `/cristiane/assets/img/icon.svg` | the artwork, as supplied |
| `favicon.ico` | `/cristiane/favicon.ico` | 32×32 and 16×16 in one file |
| `assets/img/apple-touch-icon.png` | `/cristiane/assets/img/apple-touch-icon.png` | 180×180, fully opaque |

### Guarantees

- All three are committed to this repository and served from it. Nothing is fetched from an
  external host, and nothing is generated at deploy time (FR-007, FR-010).
- `favicon.ico` sits at the **repository root**, not under `assets/`, so that it publishes
  to this site's root path where a bare request expects it.
- The `.ico` and the PNG are generated from `icon.svg` and are reproducible — see
  [../quickstart.md](../quickstart.md).
- The touch icon is opaque. iOS composites it on black and applies its own mask; a
  transparent PNG would show a black square behind the book.

### Explicitly not promised

- **The domain root.** `https://souza-cris.github.io/favicon.ico` is served by the author's
  user-site repository, not this one, and this feature does not and cannot change it. FR-006
  is satisfied for this site's own root only.

---

## What would break these contracts

- Writing an `href` without `relative_url` — the icon would 404 under `/cristiane`.
- Moving `favicon.ico` into `assets/` — the bare-root request would stop resolving.
- Making the touch icon transparent, or shrinking it below 180×180 — iOS would render it on
  black, or upscale it.
- Editing `assets/img/icon.svg` without regenerating the `.ico` and the PNG — the tab would
  show new artwork while the home screen showed old.
- Adding a web manifest without revisiting the spec — it changes which icon Android uses and
  brings install behavior the spec puts out of scope.
- Assuming `assets/img/logo.svg` (the home page mark) tracks this artwork. It is a separate
  file by design and does not follow.
