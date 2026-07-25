# Data Model: Side Navigation and Uninterrupted Home

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

## Changes at a glance

| Change | Entity | Detail |
|--------|--------|--------|
| New data file | Section link | `_data/sections.yml` — the section list, rendered by both navigations |
| New derived value | Page | Body class `is-home` or `is-interior`, derived from `page.url` in the layout |
| New derived value | Section link | `aria-current="page"`, derived per link from `page.url` |

No front matter is added to any page. Beyond the new data file, this feature is template and stylesheet.

## Entities

### Section link

One entry in `_data/sections.yml`, in navigation order. Both the top navigation and the side navigation render this list.

| Field | Required | Description |
|-------|----------|-------------|
| `label` | Yes | The link text — lowercase, matching the site's voice |
| `url` | Yes | Site-rooted path, e.g. `/stories`. The base path is added at build time |
| `match` | Yes | `exact` or `prefix` — how this entry decides it is the current section |

**The five entries**

| `label` | `url` | `match` | Current when |
|---------|-------|---------|--------------|
| journey | `/journey` | `exact` | `page.url` is exactly `/journey/` |
| stories | `/stories` | `prefix` | `page.url` contains `/stories` — an individual story and the filter pages also mark it |
| research | `/research` | `exact` | `page.url` is exactly `/research/` |
| bookmarks | `/bookmarks` | `prefix` | `page.url` contains `/bookmarks` — the filter pages also mark it |
| contact | `/contact` | `exact` | `page.url` is exactly `/contact/` |

Home is deliberately absent from the list: the side navigation does not render on home, and the "main" brand link in the top navigation returns there.

**Why `match` is data and not a template condition**

`exact` and `prefix` are properties of the entry, not of the rendering. Stories and bookmarks have child pages and their parent section should stay marked while reading one; research and contact do not. That is knowledge about the list, so it lives with the list. The include reads the value and acts on it — it holds no knowledge of which sections have children. This is what lets one include serve both navigations.

**Validation rules**

- `match` MUST be `exact` or `prefix`. Any other value is treated as `exact`, so a typo under-marks rather than marking every page.
- At most one entry may be current on a page. The `prefix` entries must not overlap, which holds because no section path is a prefix of another. A page in no section — the 404 — marks nothing, and that is not an error.
- `url` MUST be site-rooted and MUST pass through `relative_url` when rendered; the site is served from `/cristiane`, so a bare path would 404.
- Adding a section is **one** edit to this file. Neither navigation is touched.

### Page

| Value | Source | Description |
|-------|--------|-------------|
| Body class | **Derived** | `is-home` when `page.url` is `/`, otherwise `is-interior` |
| Side nav rendered | **Derived** | The include is emitted only when `page.url` is not `/` |

**Derivation**: both come from the same test in `_layouts/default.html`. The class is written on every page; the include is emitted conditionally, so the markup does not exist at all on home rather than being hidden with CSS.

## Relationships

```
_data/sections.yml ──entry order──▶  link order in BOTH navigations
                   ──label────────▶  link text
                   ──url──────────▶  href, through relative_url
                   ──match────────▶  exact or prefix test against page.url

section-links.html ──rendered by──▶  nav.html (top)  +  side-nav.html (side)

page.url  ──is it "/"?──▶  body class is-home | is-interior  ──▶  rules above/below content
          ──is it "/"?──▶  side-nav.html emitted, or not emitted at all
          ──vs match───▶  aria-current="page" on at most one link

viewport width  ──below 1000px──▶  .side-nav display: none
```

## Adding a section later

Add one block to `_data/sections.yml`:

```yaml
- label: "talks"
  url: "/talks"
  match: "exact"     # or "prefix" if it will have child pages
```

Then create the page. Both navigations pick it up with no template change — which is the point of storing the list as data.
