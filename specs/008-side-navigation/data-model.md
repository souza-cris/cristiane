# Data Model: Side Navigation and Uninterrupted Home

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

## Changes at a glance

| Change | Entity | Detail |
|--------|--------|--------|
| No new data file | — | The link list is markup in `_includes/side-nav.html`; see the deviation in [plan.md](plan.md) |
| New derived value | Page | Body class `is-home` or `is-interior`, derived from `page.url` in the layout |
| New derived value | Section link | `aria-current="page"`, derived per link from `page.url` |

Nothing in `_data/` changes, and no front matter is added to any page. This feature is entirely template and stylesheet.

## Entities

### Section link

One entry in the side navigation. Held as a list item in the include, not as data.

| Field | Source | Description |
|-------|--------|-------------|
| Label | Literal in the include | Lowercase section name, matching the top navigation |
| Destination | Literal, passed through `relative_url` | Site-rooted path; the base path is added at build time |
| Current test | Literal Liquid condition | Decides whether this link gets `aria-current="page"` |

**The five links, and how each decides it is current**

| Label | Destination | Current when |
|-------|-------------|--------------|
| journey | `/journey` | `page.url` is exactly `/journey/` |
| stories | `/stories` | `page.url` contains `/stories` — so an individual story and the filter pages also mark it |
| research | `/research` | `page.url` is exactly `/research/` |
| bookmarks | `/bookmarks` | `page.url` contains `/bookmarks` — so the filter pages also mark it |
| contact | `/contact` | `page.url` is exactly `/contact/` |

Home is deliberately absent: the menu does not render on home, and from elsewhere the site brand in the top navigation already returns there.

**Validation rules**

- Exactly one link may be current at a time. The prefix tests must not overlap each other, which holds because no section path is a prefix of another.
- A destination MUST pass through `relative_url`; the site is served from `/cristiane`, so a bare path would 404.
- Adding a section means adding a list item here **and** to `_includes/nav.html`. The two lists are maintained together — that duplication is the accepted cost recorded in the plan.

### Page

| Value | Source | Description |
|-------|--------|-------------|
| Body class | **Derived** | `is-home` when `page.url` is `/`, otherwise `is-interior` |
| Side nav rendered | **Derived** | The include is emitted only when `page.url` is not `/` |

**Derivation**: both come from the same test in `_layouts/default.html`. The class is written on every page; the include is emitted conditionally, so the markup does not exist at all on home rather than being hidden with CSS.

## Relationships

```
page.url  ──is it "/"?──▶  body class is-home | is-interior  ──▶  rules above/below content
          ──is it "/"?──▶  side-nav.html emitted, or not emitted at all
          ──per link────▶  aria-current="page" on at most one link

viewport width  ──below 1000px──▶  .side-nav display: none
```

## Adding a section later

1. Add the list item to `_includes/nav.html`.
2. Add the matching item to `_includes/side-nav.html`, choosing an exact test if the section is a single page, or a `contains` test if it has child pages.

If a third surface ever needs this list, that is the trigger to extract `_data/sections.yml` with a `label`, `url` and `match` per entry — recorded in [plan.md](plan.md).
