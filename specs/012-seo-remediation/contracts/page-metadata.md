# Contract: Page Metadata, Extended

**Date**: 2026-07-28 | **Feature**: [../spec.md](../spec.md)

Feature 010 established the head contract. This feature extends it. Only the changes are stated
here; everything in [010's contract](../../010-seo-and-domain-migration/contracts/page-metadata.md)
still holds unless contradicted below.

---

## 1. Head contract — what changes

| Declaration | Before | After |
|-------------|--------|-------|
| title | page title + site name | unchanged in shape; filter pages now supply a **term-specific** title |
| description | page → tldr → site default | unchanged in shape; pages now supply their own, so the default is a genuine fallback rather than the norm |
| canonical | every page except 404 | unchanged |
| robots | not emitted | **new** — `noindex, follow` on an empty filter page and on the 404 |
| og:image | site default | the story's own image where one is set |
| og:image:alt, width, height | not emitted | **new**, accompanying every image |
| feed link | none | **new** — an alternate link advertising the Atom feed, on every page |
| structured data | Person / BlogPosting / CollectionPage | **plus** ProfilePage on `/journey/`, BreadcrumbList on stories and sections |

### New guarantees

- **A robots directive appears only where indexation should stop**: an empty filter page, and
  the 404. Never on a page with content.
- **`noindex, follow` rather than `noindex, nofollow`** on empty filter pages: the page still
  links to real content, and those links should still be followed.
- **The 404 emits no `og:url`.** Today it advertises `/404.html` as a shareable address, which
  is the opposite of what a 404 is for.
- **Breadcrumbs never appear on the home page.** A trail from the home page to itself says
  nothing.
- **Every structured-data claim is derived from data that also renders visibly.** No statement
  is made in markup that a reader cannot see on the page.

---

## 2. Link contract — new, and the point of US2

**Every internal link the site emits MUST be in canonical form: with the trailing slash.**

| Source | Emits today | Must emit |
|--------|-------------|-----------|
| `_data/sections.yml` via `section-links.html` | `/journey` | `/journey/` |
| `bookmark-filters.html` | `/bookmarks/paper` | `/bookmarks/paper/` |
| `story-filters.html` | `/stories/ai` | `/stories/ai/` |

### Guarantees

- Every internal href resolves **HTTP 200 with zero redirects**.
- The canonical URLs themselves do not change. This contract aligns links to the existing
  canonicals, never the reverse.
- The current-page marking survives: `section-links.html` compares `page.url` to the section
  `url` **directly**, with no appended slash.

### What would break this contract

- Adding a slash to `_data/sections.yml` without removing the `append` in the template. That
  produces `/journey//`, matches no page, and silently removes the current-page marking from
  every navigation surface. **The data and the template must change in the same commit.**
- Writing a new internal link without the trailing slash. The link check exists to catch this.
- Changing a permalink to match a link, rather than a link to match its permalink.

---

## 3. Sitemap contract — what changes

| Rule | Before | After |
|------|--------|-------|
| 404 excluded | yes | yes |
| Empty filter pages excluded | **no — 7 were listed** | yes, by item count |
| Feed excluded | n/a | yes |
| Membership decided by | page type | page type **and item count** |

### Guarantees

- A term with zero items is absent from the sitemap and carries `noindex`.
- Adding its first item puts it in the sitemap on the next build, with no source edit beyond the
  item itself. Removing the last item takes it out again.
- No list of terms is maintained anywhere. The count is derived from the content.

---

## 4. Feed contract — new

| Path | Contains |
|------|----------|
| `/feed.xml` | every published story: title, absolute link, publication date, author, summary |

### Guarantees

- Valid Atom, with absolute URLs and ISO 8601 dates.
- Advertised from every page, so a reader can subscribe given only `https://crissouza.org/`.
- Excluded from the sitemap — it is a feed, not a page.
- A new story appears in it on rebuild, with no manual step.
