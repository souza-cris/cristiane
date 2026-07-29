# Implementation Plan: Search Visibility and Domain Migration

**Branch**: `010-seo-and-domain-migration` | **Date**: 2026-07-26 | **Spec**: [spec.md](spec.md)

> **Amended 27 July 2026.** The author bought **crissouza.org**, and the site has never been
> indexed. The two phases collapse into one: connect the domain first, then do the search work
> once against `crissouza.org`. Phase 2 and its migration are deleted, and with them decision
> 4's unresolved redirect question — if nothing is ever indexed under the GitHub Pages host,
> nothing has to redirect away from it. See the amendment in [research.md](research.md).

**Input**: Feature specification from `specs/010-seo-and-domain-migration/spec.md`

## Summary

Make the site findable, and make the later move to a custom domain a one-line change.

Phase 1 gives every page a title naming the author, a description, one authoritative address,
preview information for shared links, and machine-readable statements about who she is and
what her publications are — plus a sitemap and a robots file. All of it is written by hand in
Liquid; no gem is added. Every absolute address derives from two values in `_config.yml`,
which is what makes Phase 2 a config edit rather than a sweep.

Phase 2 changes those two values once the domain exists. Nothing else moves.

Two findings from research change the work: the deploy workflow currently forces the base
path on the command line, which would have silently defeated the migration; and GitHub's
behavior for old project addresses after a custom domain is set is undocumented, so the plan
leans on the canonical address rather than on an assumed redirect.

## Technical Context

**Language/Version**: HTML5, Liquid templating, YAML; JSON-LD for structured data

**Primary Dependencies**: Jekyll 4.4 (existing). **No new gems** — `jekyll-seo-tag` and
`jekyll-sitemap` were considered and rejected in decision 1 of [research.md](research.md)

**Storage**: Filesystem — two generated text files, one committed image, three config values

**Testing**: `bundle exec jekyll build`; HTTP checks that the sitemap and robots file resolve
and that every listed address resolves; string comparison of each canonical against its
preview and structured addresses; an external structured-data validator; a link-preview
checker; an automated site audit for SC-008

**Target Platform**: GitHub Pages via GitHub Actions; search engines and link-preview services

**Project Type**: Static website — one include edited, one added, two generated files, one
image, config

**Performance Goals**: No new request at page load. The added markup is roughly 1–2KB per
page; the preview image is fetched only by a service building a card, never by a visitor

**Constraints**: No build step beyond the existing one, no npm, no plugins. No external asset
at page load. No visible design change. The site sits at a base path in Phase 1 and at a
domain root in Phase 2, so every absolute address must survive both

**Scale/Scope**: ~20 pages, 2 collections, 5 publications, one config file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity & Maintainability | ✅ Pass | One include holds the metadata; two small templates generate the sitemap and the robots file. No gem, no generator, no configuration language. The plugin alternative was rejected partly *because* its output would be unreadable to the person who maintains this site |
| II. Content as Data | ✅ Pass | Descriptions and images are per-page front matter, not template edits (FR-005). The site name, default description and address base are single values in config. The sitemap is derived from the site, never hand-listed. Publications stay in `_data/research.yml` and are described from there |
| III. GitHub Pages Compatibility | ✅ Pass | Stock Liquid and static files; no plugin, no new build step. The preview image is generated locally and committed, exactly as the icons are. The workflow gets *simpler* — a flag is removed |
| IV. Performance & Accessibility | ✅ Pass | Nothing is fetched at page load; the added markup is invisible to a visitor and carries nothing a screen reader must announce. The preview image is requested only by a preview service. No third-party script, no analytics, no tracker — a visitor's reading stays between them and this site |
| V. Minimal JavaScript | ✅ Pass | None added. Structured data is a static block, not a script that runs |

**Post-design re-check**: passing on all five. The Phase 1 design added no script, no
dependency and no plugin, and removed one duplicated value from the deploy workflow.

### Note on Principle IV and third-party measurement

The brief mentions Search Console. That is a registration the author performs against
Google's own service; it needs no code on the site beyond the sitemap that has to exist
anyway, and adds no script to any page. It is therefore not an external asset under FR-024.

Analytics and visitor tracking were deliberately excluded in the spec. They are the usual
companion to SEO work, and each would add a third-party script watching who reads the site.
Nothing in the success criteria needs them.

*No violations — Complexity Tracking omitted.*

## Project Structure

### Documentation (this feature)

```text
specs/010-seo-and-domain-migration/
├── spec.md
├── plan.md                     # this file
├── research.md                 # 7 decisions, incl. the workflow flag and the redirect unknown
├── data-model.md               # address base, site identity, page identity, page list
├── quickstart.md               # Phase 1 verification + the Phase 2 migration procedure
├── contracts/
│   └── page-metadata.md        # head contract, authoring contract, published files
├── checklists/
│   └── requirements.md
└── tasks.md                    # /speckit-tasks output — not created here
```

### Source

```text
_config.yml                     # url, title, description; baseurl unchanged in Phase 1
.github/workflows/pages.yml     # remove --baseurl so config is the only declaration
_includes/head.html             # title, description, canonical, preview tags
_includes/structured-data.html  # NEW — person / article / scholarly statements
sitemap.xml                     # NEW — derived page list, at the site root
robots.txt                      # NEW — crawling instructions naming the sitemap
assets/og/default.png           # NEW — 1200x630, generated from the site mark
_posts/*.md                     # optional `description:` may be added; never required
```

**Structure Decision**: the metadata lives in `head.html`, the one include every page already
loads, so no page or layout changes. The structured data gets its own include because it is a
different kind of thing — a block of statements rather than a list of tags — and separating
it keeps `head.html` readable. `sitemap.xml` and `robots.txt` sit at the repository root so
they publish to the site root, the only place a crawler looks.

## Complexity Tracking

No constitution violations, and nothing here is complex enough to need justifying. The one
judgement worth naming — writing the tags by hand rather than adopting two well-known plugins
— is argued in decision 1 of [research.md](research.md), with the condition that reverses it.
