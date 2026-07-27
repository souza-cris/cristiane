# Research: Search Visibility and Domain Migration

**Date**: 2026-07-26 | **Feature**: [spec.md](spec.md)

Seven questions had to be settled before design. All are resolved. Two of them changed what
the plan has to do, and one is an unknown that cannot be closed until the domain exists —
recorded here with the mitigation that makes it safe.

---

## 1. Plugins, or write the tags by hand

**Decision**: no new gems. The head tags, the structured data and the sitemap are all written
by hand in Liquid. `jekyll-seo-tag` and `jekyll-sitemap` were both considered and rejected.

**Rationale**: three things point the same way.

The site has **no plugins at all** today, and its templates are hand-written and readable.
The owner is new to web development; twenty lines of Liquid in `head.html` that she can read
and change beats a tag that expands into thirty lines of meta she cannot see the source of.
That is Principle I's "clear over clever" applied to the person who maintains this.

`jekyll-seo-tag` cannot produce what FR-017 requires. Its structured data covers websites and
blog posts; it has no notion of scholarly work. Publications would need hand-written JSON-LD
regardless, so the plugin would cover part of the job and still leave the custom part.

The sitemap is small. Twenty pages, two collections. A hand-written sitemap is about fifteen
lines and gives exact control over the 404 exclusion FR-008 requires.

**What would reverse this**: if the site grows several collections, or if pages start needing
per-page image and type overrides that the hand-written block cannot express cleanly, the
balance tips. Both plugins are on GitHub Pages' supported list and the site builds through
its own Action, so adopting either later is a Gemfile line and a config line — nothing about
this decision makes it harder.

**Alternatives considered**:

- *`jekyll-seo-tag` for the head, hand-written JSON-LD for publications* — the closest call.
  Rejected because the result is two mechanisms doing one job, and the plugin's output would
  still need auditing against FR-011 to confirm its canonical and its OG URL agree.
- *`jekyll-sitemap` alone* — genuinely good, and it handles `lastmod` better than a hand-
  written loop. Rejected only because it is one dependency for fifteen lines on a twenty-page
  site. This is the weakest of the three rejections and the first to revisit.

---

## 2. The build command overrides the config — this breaks the migration

**Finding**: `.github/workflows/pages.yml` builds with an explicit flag:

```
bundle exec jekyll build --baseurl "/cristiane"
```

A command-line flag beats `_config.yml`. So the base path is currently declared in **two**
places, and the one that wins is the one in the workflow.

**Why it matters**: FR-019 requires the migration to be one edit. As things stand, changing
`baseurl` in `_config.yml` would do nothing — the build would keep forcing `/cristiane`, and
every canonical, preview and sitemap address would be wrong in a way that is invisible until
the site is live on the new domain.

**Decision**: remove the flag from the workflow and let `_config.yml` be the only place the
base path is written. The workflow builds with plain `bundle exec jekyll build`.

**Rationale**: this is what makes FR-019 true rather than aspirational. It also removes a
duplicated value, which is the same argument the constitution makes about lists — two copies
of one fact, and the forgotten one goes stale.

**Alternatives considered**:

- *Leave the flag and change both at migration* — works, if remembered. Rejected: the whole
  point of FR-019 is not having to remember.
- *Drive the flag from a workflow variable* — moves the duplication rather than removing it.
  Rejected.

---

## 3. Building every absolute address from one value

**Decision**: every canonical, preview and structured-data address is built with Jekyll's
`absolute_url` filter, which prefixes `site.url` and `site.baseurl`. Phase 1 sets
`url: "https://souza-cris.github.io"` and keeps `baseurl: "/cristiane"`.

**Rationale**: it makes the address base a single value, which is the entity FR-019 depends
on. At migration, `url` changes to the new domain and `baseurl` becomes empty; nothing else
in any template moves. It also guarantees FR-011 for free — canonical, OG and JSON-LD cannot
disagree, because they are the same filter applied to the same page.

**Note on `relative_url`**: the site already uses it everywhere for links and assets, and it
stays. `relative_url` is right for internal navigation; `absolute_url` is right for anything
a search engine or another site quotes. Both read from the same two config values.

---

## 4. Whether old addresses will redirect after the move — MOOT as of 27 July 2026

> **Closed by sequencing, not by an answer.** The author bought crissouza.org before the site
> was ever indexed. Connecting the domain before publishing any search work means no address
> is ever advertised under the GitHub Pages host, so nothing ever needs to redirect away from
> it. The question below is left intact because it is the reason the sequence was chosen, and
> because it becomes live again if the domain is ever moved a second time.

### The original finding, retained

**The question**: FR-020 requires that addresses working before the move lead to their new
equivalents. For a GitHub Pages *project* site given a custom domain, does
`souza-cris.github.io/cristiane/journey/` redirect to `newdomain.com/journey/`?

**What was checked**: GitHub's own documentation on custom domains, on two pages. Neither
states what happens to the default project URL after a custom domain is set. The only
redirect behaviour documented is between apex and `www` variants of the *same* custom domain.

**Status**: unverified. It is widely reported that GitHub does issue this redirect, and it is
the behaviour the migration would like, but it is not documented and cannot be tested without
owning the domain. **It is not treated as a promise.**

**Decision**: do not build the migration on an assumed redirect. Rely on the canonical
address, which is entirely under the site's control, and verify the redirect at migration
time as an explicit step.

**Why the canonical is the real protection**: the risk the redirect guards against is the
same page being indexed twice, under the old address and the new. FR-011 already prevents
that: once every page declares the new domain as authoritative, a search engine reaching the
old address is told where the real one is, and credits that. The redirect is a convenience
for humans following old links; the canonical is the mechanism that protects the indexing.

**Mitigation, in order**:

1. Flip the canonical to the new domain before announcing anything. This alone satisfies
   FR-011 and closes the duplication risk.
2. Test several old addresses immediately after the move and record what actually happens.
3. If they do redirect: FR-020 is satisfied, nothing more to do.
4. If they do not: use Search Console's change-of-address notification, and accept that old
   links may break for humans. Note this outcome in the spec rather than hiding it.

**A consequence of the root-domain answer** (FR-025): because the site moves to the domain
root, old and new addresses differ in **both** host and path — `/cristiane/journey/` becomes
`/journey/`. Any redirect that only swapped the host would land on a path that does not
exist. This makes step 2 more important, not less.

---

## 5. Publications are data, not pages

**Finding**: publications live as entries in `_data/research.yml` and render as a list on
`/research/`. They are not individual pages and have no addresses of their own; each links
out to Google Scholar.

**Decision**: describe the research page as carrying a list of scholarly works, with each
work's own `url` pointing at its external record. Do not invent per-publication pages.

**Rationale**: FR-017 asks that publications be described as scholarly work, distinct from
stories. That is satisfiable from the one page that holds them. Giving each publication its
own page would be a content-architecture change, which FR-023 forbids and the brief did not
ask for.

**Consequence for FR-009**: only pages declare authoritative addresses. A publication is not
a page, so it does not get one — its `url` is the external record it points to. This is worth
stating because it is the one place the "every item has one address" idea does not apply.

**Alternatives considered**:

- *A page per publication* — better for search, since each work could rank on its own. But it
  restructures the research section, which is explicitly out of scope. Recorded as a possible
  future feature rather than smuggled into this one.

---

## 6. The default preview image

**Decision**: generate a 1200×630 image from the site's existing mark and name — the teal
book on the site's own background, "Cris Souza" beneath it, and a short line of description —
and commit it. Generated the same way the icons are, with the same tools.

**Verified**: rendered at full size during research and inspected. The site's monospace stack
renders correctly, the mark scales cleanly, and the text is legible at the size a preview card
actually displays.

**Rationale**: FR-026, chosen by the author. It needs no new artwork, matches the icon that
already ships, and adds no dependency — the tools are the ones already used for the favicon.

**Alternatives considered**:

- *Crop the existing portrait* — faces draw clicks, and the photo is already in the
  repository. Rejected by the author in favour of the mark.
- *Generate a per-page image with the page title on it* — richer previews, but needs an image
  built per page at deploy time, which is a build step. Rejected on Principle III.

---

## 7. Keeping the 404 out of the index

**Decision**: the 404 page is excluded from the sitemap by name, declares no canonical
address, and is the only page treated this way.

**Rationale**: FR-008 and SC-004. A 404 page that is indexed competes with real pages and
appears in results as a dead end. It is a single, well-known exception, so the hand-written
sitemap can simply skip it — one condition, no configuration needed.

**Note**: because the sitemap is hand-written, the exclusion is a visible line in the template
rather than a `sitemap: false` flag hidden in front matter. That is easier to see and harder
to lose, which suits a site maintained by one person.
