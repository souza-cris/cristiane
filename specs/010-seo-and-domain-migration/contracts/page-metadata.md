# Contract: Page Metadata

**Date**: 2026-07-26 | **Feature**: [../spec.md](../spec.md)

Three contracts. The **head contract** is between `_includes/head.html` and every search
engine and preview service. The **authoring contract** is between the author and the site:
what she may write in a page's front matter and what she gets for it. The **published-files
contract** is what must exist at fixed addresses.

---

## 1. Head contract — what every page declares

Emitted by `_includes/head.html`, on every page.

| Declaration | Value |
|-------------|-------|
| title | page title + " | Cris Souza"; on home, "Cris Souza" alone |
| description | `page.description` → `page.tldr` → `site.description` |
| canonical | `absolute_url` of this page's path |
| preview title, description | the same title and description as above |
| preview address | the canonical, character for character |
| preview image | `page.image` made absolute, else the site default |
| preview card type | large-image summary |
| structured description | person on home, article on a story, scholarly list on research |

### Guarantees

- **One canonical per page.** Never zero, never two.
- **The canonical, the preview address and the structured address are the same string.** They
  are the same filter applied to the same page, so they cannot drift (FR-011).
- **Every absolute address derives from `site.url` + `site.baseurl`.** No address is written
  out literally anywhere in any template.
- **Two preview vocabularies are emitted**, because the common services do not all read the
  same one (FR-014).
- **The 404 page declares no canonical** and is not described as an article.
- **Nothing is fetched at page load.** Structured data and preview tags name addresses; they
  do not load anything. FR-024 holds.

### What the head contract does not do

- It does not set per-page indexing rules. Everything except the 404 is meant to be found.
- It does not describe publications. Those come from the research page's own block, because
  they are data rather than pages.

---

## 2. Authoring contract — front matter the author may write

```yaml
---
title: "The page or story title"
description: "One sentence, 140-160 characters, plain text."   # optional
image: "/assets/og/something.png"                              # optional
---
```

### Guarantees

**`description`**

- Used as the page's search description and its preview description.
- Optional everywhere. Omitted on a story, the story's existing `tldr` is used instead — so no
  existing story needs editing to get a real description.
- Omitted on a page with no `tldr`, the site default is used. Never blank.
- Plain text only. Markup is not rendered here and would appear literally in search results.

**`image`**

- A path within this site, written site-rooted (`/assets/…`). It is made absolute at render.
- Omitted, the site default preview image is used. A shared link is never imageless.

**What the author never has to do**

- Write a canonical address. It is derived.
- Repeat the site name in a page title. It is appended.
- Add anything to a sitemap. It is derived.
- Touch a template to give a page its own description.

---

## 3. Published-files contract — what exists at fixed addresses

| Path | Contains |
|------|----------|
| `/sitemap.xml` | every indexable page, as absolute addresses |
| `/robots.txt` | crawling permission, and the sitemap's absolute address |
| `/assets/og/default.png` | the default preview image, 1200×630 |

*(paths shown relative to the site root — `/cristiane/…` in Phase 1, the domain root after)*

### Guarantees

- Both files resolve rather than returning an error (SC-002).
- Every address in the sitemap is absolute, and equals that page's canonical (SC-003, SC-007).
- The 404 page appears in neither (SC-004).
- The sitemap is derived from the site, never hand-maintained (FR-006).
- `robots.txt` names the sitemap by absolute address, so it stays correct after the migration.
- The preview image is committed, not generated at deploy time (FR-024).

---

## What would break these contracts

- **Passing `--baseurl` on the build command.** It overrides the config, so the address base
  would no longer be in one place and the migration would silently produce wrong addresses.
  This is why Phase 1 removes it.
- Writing any absolute address literally in a template — it would survive the migration
  unchanged and point at the old domain forever.
- Giving the 404 page a canonical, or letting it into the sitemap.
- Using `relative_url` where an absolute address is required. Internal links want
  `relative_url`; anything a search engine or another site quotes wants `absolute_url`.
- Adding a page-level image that lives outside the site — FR-024 forbids external assets.
- Letting the preview address and the canonical be produced by two different expressions. They
  must be the same expression, or they will eventually disagree.
