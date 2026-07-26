# Data Model: Search Visibility and Domain Migration

**Date**: 2026-07-26 | **Feature**: [spec.md](spec.md)

## Changes at a glance

| Change | Entity | Detail |
|--------|--------|--------|
| Changed value | Site identity | `title` becomes "Cris Souza"; `description` becomes the author's supplied line |
| New value | Address base | `url` gains the live host; `baseurl` keeps the path — together the one source for every absolute address |
| Removed duplication | Address base | the `--baseurl` flag leaves the deploy workflow, so config is the only declaration |
| New optional front matter | Page identity | `description` and `image`, per page |
| New generated file | Page list | a sitemap, derived from the site |
| New generated file | Crawling instructions | a robots file pointing at the sitemap |
| New committed asset | Site identity | the default preview image, 1200×630 |

No content is rewritten and no page is restructured.

## Entities

### Address base

The single place the site's live address is recorded. Everything absolute is built from it.

| Field | Phase 1 | Phase 2 (after the move) |
|-------|---------|--------------------------|
| `url` | `https://souza-cris.github.io` | `https://<the new domain>` |
| `baseurl` | `/cristiane` | `""` — the site sits at the root (FR-025) |

**Validation rules**

- `url` MUST have no trailing slash and MUST include the scheme.
- `baseurl` MUST start with `/` and have no trailing slash, or be empty.
- These two values MUST be declared **only** in `_config.yml`. The deploy workflow MUST NOT
  pass `--baseurl`; a command-line flag overrides the config and would silently defeat the
  migration. See decision 2 in [research.md](research.md).
- Every absolute address on the site MUST be derived from these two through `absolute_url`,
  never written out literally. This is what makes FR-019 one edit.

### Site identity

Defaults used wherever a page offers nothing of its own. Lives in `_config.yml`.

| Field | Value |
|-------|-------|
| `title` | `Cris Souza` |
| `description` | `PhD student, AI and IS researcher, tech leader, traveler. Stories, publications, and projects by Cris Souza.` |
| default preview image | `assets/og/default.png` |

**Validation rules**

- `description` MUST lead with the words that matter; search engines truncate it around 160
  characters and previews cut it shorter still.
- The default image MUST be 1200×630 and committed, not generated at deploy time.
- Changing `title` changes the browser tab on every page. That is the one visible change this
  feature makes, and it is intended (see the spec's Assumptions).

### Page identity

What one page says about itself. Mostly derived; two fields are author-supplied.

| Field | Source | Description |
|-------|--------|-------------|
| title | derived | the page's own title with the site name appended; the site name alone on home |
| description | `description` front matter, else `tldr`, else site default | one sentence |
| canonical address | **derived** | `absolute_url` of the page's own path |
| preview image | `image` front matter, else site default | absolute address |
| type | derived | article for a story, website otherwise |

**Validation rules**

- Exactly one canonical address per indexable page.
- The canonical, the preview address and the structured-data address MUST be the same string
  on any given page (FR-011). Deriving all three from one filter is what guarantees this.
- The 404 page MUST declare no canonical address and MUST NOT appear in the page list.
- A page-supplied `description` MUST be plain text, no markup, and SHOULD be 140–160
  characters.
- `image`, when supplied, MUST be a path within the site; it is made absolute at render time.

**Fallback chain for description**

```
page.description  ->  page.tldr  ->  site.description
```

Stories already carry `tldr`, so every existing story gets a real description with no editing.
That is why `tldr` sits in the chain rather than jumping straight to the site default.

### Page list

The machine-readable list of indexable pages, derived from the site at build time.

| Included | Excluded |
|----------|----------|
| the six section pages | the 404 page |
| every story | anything with `sitemap: false` |
| every story and bookmark filter page | non-page assets |

**Validation rules**

- Derived from the site's own pages and posts. MUST NOT be a hand-maintained list.
- Every address in it MUST be absolute and MUST match that page's canonical address.
- MUST be published at the site root, and referenced by the crawling instructions.
- The 404 exclusion MUST be visible in the template rather than hidden in front matter.

### Structured description

Machine-readable statements about what the site and its pages are.

| Page | Describes | Address used |
|------|-----------|--------------|
| home | the author, as a person | the home page's canonical |
| a story | an article, with title and date | that story's canonical |
| research | a list of scholarly works | each work's own external record |

**Validation rules**

- Every address inside a structured description MUST match the canonical of the page carrying
  it — except a publication's own `url`, which points at its external record.
- Publications are **not** pages and do not get canonical addresses of their own. They live as
  entries in `_data/research.yml` and are described from the research page. See decision 5 in
  [research.md](research.md).
- All structured descriptions MUST validate with no errors.

## Relationships

```
_config.yml ──url + baseurl──▶ absolute_url ──▶ canonical address
                                             ──▶ preview address      (always equal)
                                             ──▶ structured address
                                             ──▶ every entry in the page list

page front matter ──description──▶ meta description + preview description
                  ──image───────▶ preview image        (else site default)
                  ──tldr────────▶ description fallback for stories

_data/research.yml ──publications──▶ scholarly descriptions on /research/
                                     (external urls, no canonical of their own)
```

## Migrating later

1. In `_config.yml`, change `url` to the new domain and set `baseurl: ""`.
2. Rebuild. Every canonical, preview, structured address and sitemap entry follows.
3. Verify old addresses, per decision 4 in [research.md](research.md).

Two files change: `_config.yml`, and the workflow once, in Phase 1, to remove the flag that
would otherwise override it.
