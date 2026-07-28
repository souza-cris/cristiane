# Research: Search Discoverability Remediation

**Date**: 2026-07-28 | **Feature**: [spec.md](spec.md)

Eight questions had to be settled before design. All are resolved. One of them removes a whole
category of work from this plan; another is a trap that would have broken navigation.

---

## 1. Fixing the trailing slashes without breaking the current-page marking

**The trap**: the obvious fix is to add a trailing slash to each `url` in `_data/sections.yml`.
That alone **breaks navigation highlighting**, and silently. `section-links.html` computes
`exact_url = section.url | append: '/'`, so slashed data produces `/journey//`, which matches no
page. Simulated before deciding:

| data `url` | `match` | page | template computes | matches |
|---|---|---|---|---|
| `/journey/` | exact | `/journey/` | `/journey//` | ❌ |
| `/stories/` | prefix | `/stories/ai/` | `/stories//` | ❌ |

**Decision**: change the data **and** the template together, in one commit. `_data/sections.yml`
holds the canonical form — `/journey/`, `/stories/` — and `section-links.html` drops its
`append` and compares `page.url == section.url` directly.

**Rationale**: the data should hold the address the site actually publishes, not a form that
needs fixing up at render. It also makes the template simpler, and removes the discrepancy that
caused the redirect in the first place. The alternative — leave the data and append at render —
works too, but leaves the data saying something the site does not mean.

**The filter links are a separate instance of the same bug.** `bookmark-filters.html` and
`story-filters.html` build `'/bookmarks/' | append: entry.slug`, producing `/bookmarks/paper`
while the page's permalink is `/bookmarks/paper/`. Same fix, three files total.

**Alternatives considered**:

- *Change the permalinks to drop the trailing slash* — would also remove the redirect, but it
  changes every canonical URL on the site, which the spec puts out of scope and which would
  require a redirect map. Rejected.
- *Leave it; a 301 is cheap* — it is not free at crawl time, it affects 100% of navigation, and
  the fix costs three small edits. Rejected.

---

## 2. Deciding which taxonomy pages are empty, at build time

**Decision**: derive it from the page's own front matter. Every filter page already declares
what it filters on — `type: paper` for bookmarks, `keyword: ai` for stories — so the sitemap
and the robots directive can both count the matching items and act on the result. No list of
terms is maintained anywhere.

**Rationale**: this is what makes FR-006 true rather than aspirational. Adding the first item to
an empty term moves that page into the sitemap on the next build with no source edit, and
removing the last item moves it back out. A hand-maintained exclusion list would drift the first
time the author added a bookmark.

**Why the count has to happen twice**: the sitemap template needs it to decide inclusion, and
`head.html` needs it to decide the robots directive. That is a duplicated expression, not a
duplicated fact, and the alternative — a precomputed data file — would need regenerating
whenever content changed, which is exactly the drift this avoids.

---

## 3. Unique titles, and the heading they also change

**Decision**: give each filter page a term-specific `title` in its front matter — "papers",
"AI stories" — and let that flow to both the `<title>` and the visible `<h1>`.

**Rationale**: the audit asks for this explicitly (US3, scenario 5: "both name the specific term
rather than only the parent section"). It is worth stating that this **changes what a visitor
sees**: eleven pages currently headed "bookmarks" will be headed by their term. That is the
point — a page headed "bookmarks" that lists only papers is misleading to a reader as well as to
a crawler.

**Descriptions are content, not markup.** No post carries a `description` today, and the
mechanism to use one already exists — feature 010 built the fallback chain
`page.description` → `page.tldr` → site default. So US3 and US6 are largely an authoring task,
not a template one. The template change is small; the writing is the author's.

**Alternatives considered**:

- *A separate `seo_title` distinct from the visible heading* — avoids changing the page, but
  means two titles per page that can disagree, and leaves the misleading heading in place.
  Rejected: the heading is wrong for a human too.

---

## 4. The feed, without a plugin

**Decision**: hand-write an Atom feed, consistent with feature 010's decision 1. No
`jekyll-feed`.

**Rationale**: the same argument that settled the sitemap. The site has one gem and no plugins;
a feed is about twenty lines of Liquid over `site.posts`; and adding a dependency for that,
having just argued against two others, would be inconsistent without being better. Atom over
RSS because it requires absolute dates and IDs, which are the things a hand-written feed most
often gets wrong.

**What would reverse it**: if the site grows several post collections that each need a feed,
`jekyll-feed` earns its place. One collection does not.

---

## 5. The ProfilePage can be derived — no new data

**Finding**: `_data/journey.yml` already holds everything the audit's US5 asks for. All eleven
milestones carry `org`, `period` and `category`; four are `academia`. So education history,
employment history and current affiliation can be generated from the data that already renders
the journey track.

**Decision**: derive the `ProfilePage` and its `Person` from `_data/journey.yml` and
`_data/social.yml`. Add no new data file and no duplicated facts.

**Rationale**: it satisfies the constitution's Content-as-Data principle rather than straining
it, and it means the structured data cannot drift from the visible page — a requirement the
audit states directly (US5, scenario 6: "every claim in the markup is also visible to a human
reading the page"). If a milestone changes, both change together.

**Consequence**: the `Person` on the home page and the one on `/journey/` must agree (FR-022).
Deriving both from the same two data files is what guarantees that, rather than a review step.

---

## 6. The LCP images

**Decision**: remove `loading="lazy"` from the story's lead figure and the journey portrait, and
mark both `fetchpriority="high"`. Every other image keeps lazy loading.

**Rationale**: straight from Chrome's LCP guidance, which the audit cites. Both images are the
largest above-the-fold element on their page and both are currently deferred, which is the one
thing that guidance says not to do.

**Scope note**: only two images qualify. The audit is right that the ceiling here is modest —
total page weight is already small — so this is a correctness fix rather than a performance
project. Intrinsic `width` and `height` stay on every image, so nothing shifts.

---

## 7. Checking links at build time

**Decision**: extend `tools/check-data.rb` with a link check that reads the **built** site, and
leave the pre-commit hook as it is.

**Rationale**: the author already has one command to run and one hook that runs it. A second
mechanism would be a second thing to remember. The check has to read `_site` rather than source,
because only the built output shows what a link actually resolved to.

**Why not the pre-commit hook**: the hook runs on staged source files and is deliberately fast.
Building the site inside a commit hook would make every commit slow, and the failure mode —
committing a link that redirects — is not urgent enough to justify that. The link check belongs
in the checker, run before pushing.

---

## 8. Analytics is not in this plan

**Decision**: this plan covers eleven of the twelve user stories. **US9 and FR-036 to FR-048 are
excluded**, not deferred vaguely but excluded with a named condition.

**Rationale**: analytics breaches Principles IV and V, and the constitution has not been
amended. The constitution's own rule is explicit — "a principle MUST NOT be loosened in order to
make existing code compliant" — and its corollary is that code must not be written against a
principle that has not yet been changed. The amendment is a prerequisite, and it belongs to
feature 011, which owns the consent gate that now governs the tag.

**What this leaves**: eleven stories that breach nothing and can ship immediately. That is the
larger and more valuable half — the redirects, the duplicate titles, the empty pages in the
sitemap and the missing feed are all indexation defects that no amount of analytics would fix.

**Alternatives considered**:

- *Plan all twelve and note the block* — tempting, because the analytics work is well specified.
  Rejected: a plan that includes work which cannot legally start under the project's own rules
  invites someone to start it. Excluding it is unambiguous.
