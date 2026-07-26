# Research: Site Icon and Brand Mark

**Date**: 2026-07-26 | **Feature**: [spec.md](spec.md)

Five questions had to be settled before design. All are resolved; none remain marked
NEEDS CLARIFICATION. One of them changes a requirement in the spec.

---

## 1. The conventional root path is not ours to serve

**Finding**: FR-006 asks that a direct request for the conventional root icon path return
an icon rather than a 404. On this site that is only partly achievable, and the reason is
structural.

This is a **project** site: it is served from `https://souza-cris.github.io/cristiane/`,
and `baseurl` is `/cristiane`. When a browser needs an icon and none is declared, it asks
for `/favicon.ico` at the **domain** root — `https://souza-cris.github.io/favicon.ico` —
which belongs to the author's *user* site, a different repository. Measured:

| URL | Status | Whose repo |
|-----|--------|------------|
| `https://souza-cris.github.io/favicon.ico` | 404 | the user site's — not this one |
| `https://souza-cris.github.io/cristiane/favicon.ico` | 404 | this one |
| `https://souza-cris.github.io/` | 200 | the user site's |

**Decision**: ship `favicon.ico` at **this site's** root (`/cristiane/favicon.ico`), and
declare every icon explicitly in `<head>`. Treat the domain root as out of scope.

**Why this is sufficient in practice**: the implicit `/favicon.ico` request is a *fallback*.
A browser that is given `<link rel="icon">` uses it and never probes the root. So the
declared icons cover every real visitor; the root path matters only to something asking for
the bare URL with no page context.

**Consequence for the spec**: FR-006 must say "the site's own root", not "the conventional
root path". Recorded as an amendment rather than quietly narrowed — the original wording
promised something this repository cannot deliver.

**Alternatives considered**:

- *Add the icon to the user-site repository too* — would make the domain root serve an
  icon, but it means editing a different project to satisfy this one's spec, and it would
  put this site's mark on a site that is not this site. Rejected.
- *A custom domain* — would make this site the domain root and dissolve the problem. Far
  outside the scope of adding an icon. Rejected, worth revisiting only if a domain is
  bought for other reasons.

---

## 2. Which files to ship

**Decision**: three declared files, no more.

| File | Serves |
|------|--------|
| `assets/img/icon.svg` (new) | modern browsers, any size, one file |
| `favicon.ico` (32×32 and 16×16 in one file) | older browsers and the bare-root request |
| `assets/img/apple-touch-icon.png` (180×180) | iOS and iPadOS home screens |

**Rationale**: an SVG icon scales to every size a browser asks for and is the smallest
thing to maintain, so it does the bulk of the work. The `.ico` exists because some browsers
still prefer it and because it is what a root request expects. The 180×180 PNG is what iOS
reads for a home-screen tile; without it iOS screenshots the page instead.

**Alternatives considered**:

- *A generated 20-file "favicon package"* (every legacy Windows tile and Android density) —
  thorough, but most of those files have not been read by a browser in years, and each is
  another committed asset to keep in step with the artwork. Rejected as weight without
  readers, per Principle I.
- *A web app manifest* for Android home screens — Android would then use the manifest's icon
  rather than falling back to the touch icon. But a manifest also invites install prompts
  and standalone display, which the spec puts out of scope. Rejected for now; adding one
  later is a small, isolated change.
- *SVG only* — cleanest, but leaves the root request 404 and gives iOS nothing to use.
  Rejected.

---

## 3. The icon is its own file, not the home mark reused

**Decision**: the browser icon is `assets/img/icon.svg`, a file of its own. The home page
mark stays at `assets/img/logo.svg`. The `.ico` and the touch icon are generated from
`icon.svg`. **Author's decision**, taken over the alternative below.

**Rationale**: the two serve different jobs and are free to diverge. The home mark renders
at 40px inside a designed page; the icon renders as small as 16px in browser furniture the
site does not control, where fine detail collapses and a tighter crop or heavier weight is
often needed. Tying them to one file means tuning the icon for 16px would silently change
the home page, and vice versa. Separate files keep each answerable to its own context.

**The cost, recorded honestly**: today the two files hold the same artwork. Until the icon
is tuned, a change to the drawing means changing both, and the one nobody remembers is the
one that goes stale. That is the standard duplication risk, and it is accepted deliberately
here rather than overlooked.

**Not a Principle II question**: that principle governs *content* — the words and lists an
author edits — and a drawing is neither. This is a Principle I judgement about two copies of
one asset, and the author's call on how her own mark is managed.

**Alternatives considered**:

- *One file serving both roles* — no duplication, one thing to change, and the artwork is
  identical today. This was the original recommendation and the author chose against it, so
  that the icon can be adjusted for small sizes without touching the home page. The
  reasoning is sound: the constraint that forces the split is coming, not hypothetical.
- *Generating the SVG icon from the mark at build time* — would keep one source, but needs a
  build step. Rejected on Principle III.

---

## 4. Producing the raster files without adding a build step

**Decision**: generate the `.ico` and the 180×180 PNG once, locally, and commit the results.

**Rationale**: Principle III forbids a build step for the site, and Principle II wants
assets committed. Generating files on the author's machine and committing the output is not
a site build step — the deployed site serves static files exactly as GitHub Pages already
does. This is the same practice already used for the journey logos, which were resized
locally and committed.

The exact commands are recorded in [quickstart.md](quickstart.md) so the files can be
regenerated identically if the artwork changes, rather than being unreproducible artifacts.

**Alternatives considered**:

- *A GitHub Action that generates icons at deploy time* — removes the committed binaries but
  adds a build step and a dependency to the deploy path. Rejected on Principle III.
- *Hand-drawing the raster sizes* — no. The artwork is the author's and must be used as
  supplied (FR-002); rasterising it mechanically is reproduction, not redrawing.

---

## 5. What colour to declare for the browser's own interface

**Decision**: leave `theme-color` at `#0d1117`, the site's background. Do not change it to
the brand teal.

**Rationale**: FR-011 requires that the colour the site declares for surrounding browser
interface match what the visitor actually sees. The page is dark grey; the teal appears only
inside a 40px mark. Declaring teal would tint a mobile browser's toolbar a colour that
appears nowhere on the page behind it, which is the contradiction FR-011 exists to prevent.

**Note on contrast**: this also keeps `#0B7E8A` — which measures 3.93:1 against the site
background, below the 4.5:1 that text requires — confined to the artwork, where it carries
no text. See FR-012 and FR-015.

**Alternatives considered**:

- *Teal `theme-color`* — visually ties the browser chrome to the icon, and is what a brand
  guideline would suggest. Rejected because the page it frames is not teal.
- *A `prefers-color-scheme` pair of theme colours* — the site has one theme, so there is
  nothing to switch between. Rejected as machinery for a choice that does not exist.
