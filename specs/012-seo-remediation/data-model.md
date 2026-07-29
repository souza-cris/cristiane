# Data Model: Search Discoverability Remediation

**Date**: 2026-07-28 | **Feature**: [spec.md](spec.md)

## Changes at a glance

| Change | Entity | Detail |
|--------|--------|--------|
| Changed values | Section | `url` in `_data/sections.yml` gains a trailing slash — the canonical form |
| New front matter | Filter page | a term-specific `title`, and a `description` |
| New front matter | Story | an author-written `description`, and an `image` |
| New derived value | Filter page | item count, deciding sitemap membership and robots |
| New derived data | Journey | `ProfilePage` + `Person`, generated from existing milestones |
| New file | Site | an Atom feed |

No new data file is introduced. Everything the ProfilePage needs already exists.

## Entities

### Section

`_data/sections.yml`. One change, and it is not cosmetic.

| Field | Before | After |
|-------|--------|-------|
| `url` | `/journey` | `/journey/` |

**Validation rules**

- `url` MUST be the canonical form, with a trailing slash, matching the page's permalink exactly.
- `section-links.html` MUST compare `page.url` to `url` **directly**. It must not append a
  slash: with slashed data that produces `/journey//`, which matches nothing and silently kills
  the current-page marking on every page. The data and the template change together or not at all.
- The checker's rule that a section `url` starts with `/` is unaffected.

### Filter page

A page in `stories/` or `bookmarks/`. Already declares what it filters on; now also declares how
it describes itself.

| Field | Required | Description |
|-------|----------|-------------|
| `type` / `keyword` | Yes, existing | the term this page filters on — also the key for counting |
| `title` | Yes, changed | the **term**, not the parent section. Renders as `<title>` and as the visible `<h1>` |
| `description` | Derived | composed by the template from the term; not written by hand |
| `permalink` | Yes, existing | unchanged |

**Validation rules**

- `title` MUST be unique across the site. Eleven pages currently share `bookmarks`.
- `description` MUST be unique and MUST NOT equal the site default. It is **derived from the
  term**, so uniqueness holds by construction rather than by review, and a newly added term
  arrives with a correct description and no authoring step.
- The item count is **derived at build time** by matching `type` or `keyword` against
  `_data/bookmarks.yml` or `site.posts`. No term list is maintained.
- Count zero → excluded from the sitemap, and served with a robots directive preventing
  indexation. Count above zero → included, indexable.
- The page MUST remain reachable and usable by a human at every count, including zero. Only its
  indexation changes.

### Story

| Field | Required | Description |
|-------|----------|-------------|
| `description` | Yes, new | author-written, complete prose, 140–160 characters. Never a truncated excerpt |
| `image` | No, new | the story's own illustration; falls back to the site default |

**Validation rules**

- `description` MUST be a complete sentence and MUST NOT end in an ellipsis. The current story's
  description is a machine truncation ending "and a lot ...", which is the defect.
- Where `image` is set it MUST drive `og:image`, `twitter:image` and the `BlogPosting` image
  together — never one without the others.
- The checker SHOULD warn when a post has no `description`, rather than the build silently
  falling back to a truncated `tldr`.

### Derived profile

Generated from `_data/journey.yml` and `_data/social.yml`. **No new data.**

| Statement | Source |
|-----------|--------|
| education history | milestones where `category: academia` |
| employment history | milestones where `category: industry` |
| current affiliation | the most recent `academia` milestone |
| `sameAs` | every `url` in `_data/social.yml`, **plus the ORCID** `0009-0004-0716-4507` |
| `name`, `image` | site title, the existing portrait |

**Validation rules**

- Every claim in the markup MUST correspond to something visible on the page. Deriving it from
  the data that renders the page is what guarantees this rather than a review step.
- The `Person` on `/` and on `/journey/` MUST agree on name, URL and `sameAs`. They are built
  from the same source, so they cannot diverge — which is why the ORCID must be added in one
  place that both read, not written into each separately.
- `dateModified` MUST be ISO 8601.

## Relationships

```
_data/sections.yml ──url (canonical, slashed)──▶ every nav link, no redirect
                                               ──▶ compared directly to page.url

filter page front matter ──type / keyword──▶ item count ──▶ sitemap membership
                                                          ──▶ robots directive
                         ──title───────────▶ <title> AND the visible <h1>
                         ──description─────▶ meta description, preview card

_data/journey.yml  ──academia──▶ education      ┐
                   ──industry──▶ employment     ├─▶ ProfilePage / Person on /journey/
_data/social.yml   ──url──────▶ sameAs          ┘   and the Person on /

site.posts ──▶ the Atom feed, and the sitemap
```

## Out of this model

The analytics entities — property, data stream, consent state — belong to feature 011 and are
not modeled here. See research decision 8.
