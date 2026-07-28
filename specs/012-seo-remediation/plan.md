# Implementation Plan: Search Discoverability Remediation

**Branch**: `012-seo-remediation` | **Date**: 2026-07-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/012-seo-remediation/spec.md`

## Summary

Fix what the audit found. Eleven of its twelve user stories, all of which breach nothing and can
ship immediately: every internal link stops redirecting, seventeen pages stop sharing two titles
between them, seven empty pages stop being offered to search engines, the journey page becomes
machine-readable as a profile, stories get written descriptions and their own share images, the
two lead images stop being deferred, the site gets a feed, and the 404 stops advertising itself.

**Analytics is excluded from this plan.** US9 and FR-036 to FR-048 breach Principles IV and V,
and the constitution has not been amended. They belong with feature 011, which owns the consent
gate that now governs them. See research decision 8.

Most of the work lands in three places: `_data/sections.yml` with its template, the filter
pages' front matter, and `_includes/head.html`.

## Technical Context

**Language/Version**: HTML5, Liquid templating, YAML; JSON-LD for structured data; Atom for the feed

**Primary Dependencies**: Jekyll 4.4 (existing). **No new gems** — `jekyll-feed` considered and
rejected in research decision 4, on the same grounds that settled the sitemap in feature 010

**Storage**: Filesystem — front matter on existing pages, one new feed template

**Testing**: `bundle exec jekyll build`; a link crawl asserting zero redirects across every
internal href; duplicate-detection across titles and descriptions; sitemap membership checked
before and after adding an item to an empty term; an external structured-data validator; LCP
measured before and after on two pages

**Target Platform**: GitHub Pages via GitHub Actions; search engines, feed readers, link-preview services

**Project Type**: Static website — two data/template pairs, ~17 pages gaining front matter, one
include extended, one new feed file, one checker extended

**Performance Goals**: Two images stop being deferred; LCP no worse. No new request at page load,
and nothing added to the critical path

**Constraints**: No build step beyond the existing one, no npm, no plugins, no external asset at
page load. No permalink changes, so no redirect map. The visible headings on filter pages *do*
change — that is intended, not incidental

**Scale/Scope**: 23 built pages, 17 of them affected by the title work; 3 files carry the link fix

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity & Maintainability | ✅ Pass | The link fix is three files. Sitemap membership is derived from a count already implied by each page's front matter, so no term list exists to maintain. The ProfilePage adds no data file |
| II. Content as Data | ✅ Pass | Titles and descriptions become front matter, which is where content belongs. The ProfilePage is *derived* from `_data/journey.yml` and `_data/social.yml` rather than restated, so the markup cannot drift from the visible page |
| III. GitHub Pages Compatibility | ✅ Pass | Stock Liquid and static files. `jekyll-feed` rejected; the feed is hand-written |
| IV. Performance & Accessibility | ✅ Pass | Two deferred LCP images fixed; intrinsic dimensions kept everywhere so nothing shifts. No external asset added. Robots directives are the only new head output and carry nothing a reader must see |
| V. Minimal JavaScript | ✅ Pass | None added |

**Post-design re-check**: passing on all five, **for the eleven stories in scope**.

### The gate that does not pass, and what was done about it

**US9 and FR-036 to FR-048 fail Principles IV and V.** Analytics means a third-party script on
every page. The constitution forbids both, and it has not been amended.

They are **excluded from this plan** rather than carried as a justified deviation. The
constitution's own rule is that a principle must not be loosened to make code compliant; the
corollary is that code should not be planned against a principle that has not yet changed. The
amendment is a prerequisite owned by feature 011, which also owns the consent gate that now
governs the tag.

This is not a deferral in the vague sense. The condition is named: **amend Principles IV and V,
then plan feature 011 and the analytics half of this one together.**

*No violations in scope — Complexity Tracking omitted.*

## Project Structure

### Documentation (this feature)

```text
specs/012-seo-remediation/
├── spec.md
├── audit.md                    # the author's original audit, verbatim
├── plan.md                     # this file
├── research.md                 # 8 decisions, incl. the trailing-slash trap
├── data-model.md               # sections, filter pages, stories, derived profile
├── quickstart.md               # 7 scenarios + regressions
├── contracts/
│   └── page-metadata.md        # head, link, sitemap and feed contracts
├── checklists/
│   └── requirements.md
└── tasks.md                    # /speckit-tasks output — not created here
```

### Source

```text
_data/sections.yml              # urls gain the trailing slash — canonical form
_includes/section-links.html    # drops its append; compares page.url directly
_includes/bookmark-filters.html # filter links gain the trailing slash
_includes/story-filters.html    # same
bookmarks/*.md                  # 10 pages: term-specific title + description
stories/*.md                    # 5 pages: same
_posts/*.md                     # author-written description; image
_includes/head.html             # robots directive, image alt/dimensions, feed link
_includes/structured-data.html  # ProfilePage on /journey/, BreadcrumbList
sitemap.xml                     # exclude empty terms and the feed
feed.xml                        # NEW — hand-written Atom
journey.md                      # portrait: drop lazy, add fetchpriority
tools/check-data.rb             # NEW check: internal links resolve in one hop
```

**Structure Decision**: no new include is added. The robots directive, the image attributes and
the feed link all belong in `head.html`, which every page already loads, and the new structured
data belongs in `structured-data.html`, which feature 010 created for exactly this. The one new
file is the feed itself, at the repository root so it publishes to the site root.

**The riskiest single change** is `_data/sections.yml` and `section-links.html`, because they
must change **together**. Slashed data with the template's existing `append` produces `/journey//`,
which matches nothing — every page would render correctly with no section marked, and no error
anywhere. Research decision 1 records the simulation; the link contract records the rule.

## Complexity Tracking

No violations among the eleven stories planned. The one gate that fails — analytics — is not
justified as a deviation but excluded, with the condition that would admit it stated in the
Constitution Check above.
