# Implementation Plan: Site Icon and Brand Mark

**Branch**: `009-site-icon` | **Date**: 2026-07-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/009-site-icon/spec.md`

## Summary

Give the site an icon so its tab, bookmarks and home-screen shortcuts stop showing the
browser's blank placeholder. Three committed files — an SVG for modern browsers, a
`favicon.ico` at the site root for older ones and bare-root requests, and a 180×180 PNG for
iOS — declared in `head.html` so every page offers the same mark. The `.ico` and the PNG are
generated from the SVG on the author's machine and committed; nothing is generated at deploy
time.

The home page mark shipped earlier in this feature and is untouched here. It stays a
separate file so the icon can be tuned for 16px without changing the page.

## Technical Context

**Language/Version**: HTML5, Liquid templating; SVG, ICO and PNG assets

**Primary Dependencies**: Jekyll 4.4 (existing); no new site dependency. Authoring the raster
files uses `librsvg` and Pillow locally — neither is needed to build or serve the site

**Storage**: Filesystem — three committed image files

**Testing**: `bundle exec jekyll build` for Liquid errors; HTTP checks that each file is
served under the base path; visual checks of the tab in a light and a dark browser; a real
iOS "Add to Home Screen"

**Target Platform**: GitHub Pages via GitHub Actions; modern evergreen browsers plus iOS
and iPadOS home screens

**Project Type**: Static website — three assets, one include edited

**Performance Goals**: One small request per page at most, and only when the browser wants
an icon. The SVG is well under 1KB; the `.ico` about 2KB

**Constraints**: No build step, no npm, no plugins. No external hosts. The conventional
domain-root icon path belongs to a different repository and cannot be served from here

**Scale/Scope**: Three files, one include, every page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity & Maintainability | ✅ Pass | Three files, not the twenty a generator would emit. Each one has a named reader; anything without one was rejected in decision 2 |
| II. Content as Data | ✅ Pass | Not applicable in the usual sense — an icon is an asset, not authored content, and the set is fixed and structural. No list is duplicated: the declarations live in one include and appear on every page through it |
| III. GitHub Pages Compatibility | ✅ Pass | Stock Liquid and static files. The raster files are generated once locally and committed, exactly as the journey logos already are. No plugin, no deploy-time step |
| IV. Performance & Accessibility | ✅ Pass | Kilobytes, fetched only when the browser wants an icon. The icon is decorative and carries no meaning (FR-008). The solid tile stays distinguishable on light and dark chrome, so recognition never depends on the toolbar behind it |
| V. Minimal JavaScript | ✅ Pass | None added. Declarations are static markup |

**Post-design re-check**: passing on all five. Phase 1 added no script, no dependency and no
plugin, and reduced the file count from the first sketch rather than growing it.

### Note on the author's file-separation decision

Decision 3 in [research.md](research.md) keeps `assets/img/icon.svg` separate from the home
page mark at `assets/img/logo.svg`, at the author's direction, though they hold the same
artwork today. This is duplication of an asset, and the cost is recorded there: until the
icon is tuned for small sizes, a change to the drawing means changing both files.

It is **not** a Principle II deviation. That principle governs the content an author edits —
words, lists, records — and names `_data/` as their home. A drawing is neither. This is a
Principle I judgement about two copies of one asset, and the reasoning behind it is sound:
the two roles have genuinely different constraints at 16px versus 40px, and the split is
what lets the icon be tuned without disturbing the page.

*No violations — Complexity Tracking omitted.*

## Project Structure

### Documentation (this feature)

```text
specs/009-site-icon/
├── spec.md
├── plan.md                        # this file
├── research.md                    # the root-path finding, file set, separation, theme-color
├── data-model.md                  # the three files and the head declarations
├── quickstart.md                  # regeneration commands and manual verification
├── contracts/
│   └── icon-declaration.md        # head contract and asset contract
├── checklists/
│   └── requirements.md
└── tasks.md                       # /speckit-tasks output — not created here
```

### Source

```text
assets/img/icon.svg                # NEW — the artwork, source of the two below
favicon.ico                        # NEW — repository root, so it publishes to /cristiane/
assets/img/apple-touch-icon.png    # NEW — 180x180, opaque
_includes/head.html                # three <link> declarations added
```

**Structure Decision**: assets sit beside the existing images in `assets/img/`, with the one
exception of `favicon.ico`, which must live at the repository root so it publishes to this
site's root path where a bare request expects it. The declarations go in `head.html`, the
single include every page already loads, so no page or layout changes.

## Complexity Tracking

No constitution violations. The one judgement worth flagging — two copies of the artwork —
is argued in the Constitution Check above and in decision 3 of [research.md](research.md),
with the condition that would collapse them back into one.
