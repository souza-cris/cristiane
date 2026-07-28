# Feature Specification: Search Discoverability Remediation

**Feature Branch**: `012-seo-remediation`

**Created**: 2026-07-28

**Status**: Draft — ready for planning. The analytics conflict is resolved: consent gates the
tag (see below), so US9 is amended and feature 011 stands.

**Input**: The author supplied a completed audit of the live site ("SEO has been implemented on
crissouza.org. Audit the live site and specify everything still missing or wrong"), written as
a spec with 12 user stories and 48 requirements. It is adopted here substantially as written.
This document records what was **verified**, what was **corrected**, and the one **conflict**
that has to be settled before planning.

## Verification of the supplied audit

The audit was checked against the live site and this repository before being adopted. It is
accurate. Every claim below was confirmed independently rather than taken on trust:

| Audit claim | Verified |
|---|---|
| 5 of 5 section links return 301 | ✅ `/journey` `/stories` `/research` `/bookmarks` `/contact` all 301 |
| 11 pages titled `bookmarks \| Cris Souza` | ✅ exactly 11 |
| 6 pages titled `stories \| Cris Souza` | ✅ exactly 6 |
| Nearly every page carries the site-default description | ✅ 22 of 23 built pages |
| 7 empty taxonomy pages in the sitemap | ✅ exactly 7 — `/bookmarks/{book,dataset,more,talk}/`, `/stories/{ai,conference,short}/` |
| No feed at any conventional path | ✅ `/feed.xml` `/rss.xml` `/atom.xml` `/index.xml` `/feed/` all 404 |
| 404 emits no robots directive | ✅ none present |
| 404 `og:url` points at `/404.html` | ✅ confirmed |
| No analytics tag anywhere | ✅ confirmed |

**The audit's own open question is now answered.** It could not reach the repository and asked
whether `jekyll-seo-tag`, `jekyll-sitemap` or `jekyll-feed` were in use. They are not: the
`Gemfile` contains exactly one gem, `jekyll` itself, and `_config.yml` has no `plugins:` key.
All head metadata, the sitemap and the robots file are hand-written Liquid — a decision argued
in feature 010, research decision 1. Its second uncertainty is also resolved: section links do
come from a single data file, `_data/sections.yml`, rendered through one shared include, so
the trailing-slash fix in User Story 2 is a one-place change.

**One correction.** The audit reports "21 of 22" pages carrying the default description; the
true figure is 22 of 23 built pages. The difference is the 404, which is not in the sitemap.
The substance is unchanged.

## The analytics conflict, and how it was settled

**Feature 011, specified earlier today, contradicts User Story 9 of this audit.**

| | Feature 011 | This audit, US9 |
|---|---|---|
| Analytics | Google Analytics 4 | Google Analytics 4 — same property |
| Consent | Iubenda banner; GA4 **must not load** until the visitor consents | **No consent gate**, deliberately; the tag loads for every visitor on first page view |

Both could not ship. They were not different emphases of one plan; they were opposite answers to
whether a visitor is asked before being measured. FR-013 of feature 011 says the tracker "MUST
NOT load, and MUST NOT set any cookie or send any request, until the visitor has consented".
US9 of this audit said it loads unconditionally.

### Resolved, 28 July 2026 — the consent gate stands

The author chose the gate. **Feature 011 stands as written; User Story 9 of this audit is
amended to require it.** Google Analytics must not load, set a cookie, or send a request until
the visitor has consented, and refusing must mean it never loads.

The reasoning that decided it: the author is in the United States, but her audience is
substantially European and Brazilian — her journey covers Italy, Germany and Brazil, and her
collaborators publish at European conferences. GDPR and the LGPD attach to where the *visitor*
is, not where the site is.

The cost is accepted rather than hidden: visitors who refuse are not measured at all, which in
European traffic is commonly a fifth to a half of them. Every analytics figure this site
produces is therefore a floor, not a total — on top of the bot filtering and blocker losses the
audit already records.

US9's own wording — "The tag loads on every production page view without a consent gate. This is
a deliberate decision by the site owner" — is **superseded**, not deleted. It is left in
[audit.md](audit.md) because it is the position that was argued against, and removing it would
hide that the question was ever open.

## Clarifications

### Session 2026-07-28

- Q: How should non-empty filter pages be treated for indexation (FR-005's open either/or)? → A: Self-canonical and indexable, with the unique title and description US3 already requires.
- Q: Should the 15 filter-page descriptions be author-written or derived? → A: Derived from a pattern using the term, so they are unique and self-maintaining.
- Q: What direct channel should the contact page offer (FR-033), given FR-034 forbids a harvestable address? → A: ORCID and institutional page; no email address.
- Q: Keep Bing Webmaster Tools in scope (FR-002)? → A: Yes. It also feeds ChatGPT search and Copilot, and can import the verified Google property directly.
- Q: What is the author's ORCID, needed for the contact page (FR-A06)? → A: `0009-0004-0716-4507`, verified as resolving and registered to her.

## User Scenarios & Testing *(mandatory)*

The twelve stories from the supplied audit are adopted as written and are not restated here in
full; see the audit text, which is preserved verbatim in [audit.md](audit.md). They are:

| # | Story | Priority |
|---|---|---|
| US1 | Search engines can find, verify and trust the site | P1 |
| US2 | Every internal link resolves in one hop | P1 |
| US3 | Every indexable page has a title and description that describe *that* page | P1 |
| US4 | Empty and near-duplicate taxonomy pages stop competing for indexation | P1 |
| US5 | The journey page is machine-readable as a person profile | P2 |
| US6 | Each story presents a written summary and its own image when shared | P2 |
| US7 | The main image of a page starts downloading immediately | P2 |
| US8 | Readers can subscribe to new stories | P2 |
| US9 | Traffic is measured on every page | P2 — **amended: consent-gated** |
| US10 | Section and story pages expose their place in the site hierarchy | P3 |
| US11 | The not-found page cannot be mistaken for content | P3 |
| US12 | The contact page gives someone a real way to make contact | P3 |

### The strongest of these, and why

**US2 is the cheapest real win.** Every internal link on the site currently costs a redirect,
because links are written `/journey` while canonicals end `/journey/`. It affects 100% of
navigation, and it is one edit to one data file.

**US3 and US4 are the same defect seen twice.** Seventeen pages share two titles between them,
and seven of the twenty-two submitted URLs render nothing but "No talks yet." Both come from
taxonomy pages being generated without regard to whether they have anything on them. Fixing the
generation rule fixes both permanently, rather than page by page.

**US1 is already partly done.** Search Console is verified and the sitemap submitted — that
happened earlier today under feature 010. What remains of US1 is Bing, and the off-site profile
links.

## Requirements *(mandatory)*

The 48 functional requirements of the supplied audit (FR-001 to FR-048) are adopted as written
and preserved in [audit.md](audit.md). Three amendments follow from the verification above.

- **FR-A01**: FR-001's verification requirement is **already satisfied**. Google Search Console
  is verified by DNS TXT record and the sitemap is submitted, done under feature 010. What
  remains of FR-001 and FR-002 is Bing Webmaster Tools only.
- **FR-A02**: FR-009 requires the build to fail or warn on a redirecting or 404 internal link.
  This site already has a content checker (`tools/check-data.rb`) and a pre-commit hook; the
  link check belongs there rather than in a new mechanism, so that the author has one command
  to run rather than two.
- **FR-A08**: FR-019's `sameAs` list is extended from three profiles to four, adding the ORCID.
  How it reaches the page is a planning decision with a visible consequence: `sameAs` is
  currently derived from `_data/social.yml`, which also renders the footer icons, so adding it
  there would put an ORCID icon in the footer of every page. That may be wanted or not, and it
  needs an icon drawing either way. The alternative is to carry the ORCID separately from the
  footer list. Neither is decided here.

- **FR-A07**: FR-002's Bing half stays **in scope**. Bing Webmaster Tools can import a verified
  Google Search Console property directly, so this is a short one-off task rather than a second
  verification. It matters more than Bing's own search share suggests, because the same index
  feeds ChatGPT search and Microsoft Copilot — increasingly how research work gets surfaced.

  Like Search Console before it, this is the author's to perform: it needs her account.

- **FR-A06**: FR-033 is satisfied by an **ORCID identifier and an institutional page**, not an
  email address. Both are the channels a reviewer, editor or program committee actually looks
  for, both are permanent, and neither can be scraped.

  This makes **FR-034 moot**: with no address published, there is nothing to obfuscate, and the
  accessibility risk that obfuscation carries — screen readers reading mangled text aloud — does
  not arise. FR-034 is retained as a rule for any address published later rather than deleted.

  **The ORCID is `0009-0004-0716-4507`** — <https://orcid.org/0009-0004-0716-4507>. Supplied by
  the author and verified: the identifier resolves and its public record is registered to her.

  It belongs in two places, not one. On the contact page as a visible channel, and in the
  `Person` structured data's `sameAs` — ORCID is *the* durable identifier for a researcher, and
  omitting it from a profile that already lists LinkedIn and Google Scholar would be a strange
  gap. FR-019's `sameAs` list is therefore extended to include it.

- **FR-A05**: Filter-page descriptions are **derived from the term**, not author-written. The
  template composes them so that every one is unique, correct on the day a term is added, and
  never goes stale. FR-011's uniqueness requirement is satisfied structurally rather than by
  someone remembering to write fifteen sentences and keep them current.

  This changes what US3 costs: for filter pages it becomes a template change, not an authoring
  task. Story and page descriptions (FR-014, US6) remain author-written — those carry the
  author's voice and a machine cannot supply it.

- **FR-A04**: FR-005's either/or is **settled: self-canonical**. A filter page with at least one
  item declares itself canonical and is indexable, carrying the term-specific title and
  description required by FR-013. It does **not** canonicalise to its parent listing.

  The reasoning: these are genuinely distinct pages over real subsets, and the parent listing
  already carries everything, so canonicalising to it would surrender eight useful landing pages
  and gain nothing. The duplicate-content risk that option guards against is answered instead by
  the unique titles and descriptions, which US3 requires regardless.

- **FR-A03**: The analytics requirements FR-036 to FR-048 are adopted **subject to the consent
  gate**. FR-036's "on every production page" now means every production page *where consent has
  been given*. Feature 011's FR-013 governs the gate itself; this feature governs what happens
  once consent exists. Neither ships without the other.

### Constitution

This feature, like feature 011, cannot be built as the constitution stands. Analytics of any
kind breaches **Principle IV** (no external hosts) and **Principle V** (no JavaScript without a
documented need). Whichever way the consent question is decided, one amendment covers both
features and should be made once rather than twice.

The rest of this spec — US1 to US8 and US10 to US12 — breaches nothing. It can proceed
immediately and independently of the analytics decision.

## Success Criteria *(mandatory)*

The audit's SC-001 to SC-015 are adopted as written. SC-011 to SC-015 concern analytics and are
suspended alongside FR-036 to FR-048.

Two are already met or partly met, and are recorded so they are not re-done:

- **SC-004** — Google Search Console is verified with the sitemap read. Bing remains.
- **SC-009** — publishing a story already propagates title, taxonomy and image to the head, the
  structured data and the sitemap with no manual step. Description does not yet, which is
  exactly the defect US6 names.

## Assumptions

- The audit's own assumptions are adopted, with its two uncertainties resolved above: no
  plugins are in use, and section links come from one shared data file.
- **Restructuring URLs is out of scope.** No permalink changes, so no redirect map is needed.
  The trailing-slash work aligns *links* to existing canonicals, not the reverse.
- **Visual design is out of scope.** Where this spec touches content — contact page depth,
  taxonomy headings — it specifies substance, not layout.
- The story's own illustration already exists in the repository at
  `assets/img/stories/old-wine/old-new-bottle.jpg`, so US6 needs no new artwork.
- Search Console verification survives the analytics decision, because it was done by DNS
  record rather than by the analytics tag — which is what the audit's FR-001 asks for.

## Dependencies

- **Feature 011.** The analytics half of this feature (US9, FR-036 to FR-048) cannot ship
  without the consent banner it now depends on. The other eleven stories are independent.
- A constitution amendment to Principles IV and V, before any analytics ships. One amendment
  covers both features; make it once.
- Bing Webmaster Tools access (FR-A07), and the author's LinkedIn, Google Scholar and GitHub
  profiles for the off-site links in US1. Both are hers to perform.
- Author-written descriptions for **stories and pages** (US6). Filter-page descriptions are
  derived and need no writing — see FR-A05.
- ~~The author's ORCID identifier~~ — **supplied and verified**: `0009-0004-0716-4507`.

## Out of Scope

- Changing any existing URL.
- Visual redesign of any page.
- Server-side or log-based analytics.
- Varying behaviour by inferred visitor location.
- Custom event design beyond site search, should analytics proceed.

## Resolved Question

**Does consent gate the analytics?** Yes. Decided by the author on 28 July 2026, resolving a
direct contradiction between this audit's User Story 9 and feature 011. Feature 011 stands; US9
is amended. See the section above for the reasoning and the accepted cost.

This also means the two features must ship together or not at all: the banner alone measures
nothing, and the tag alone measures without asking.
