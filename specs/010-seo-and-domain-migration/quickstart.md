# Quickstart: Search Visibility and Domain Migration

**Date**: 2026-07-26 | **Feature**: [spec.md](spec.md)

Verification for Phase 1, then the Phase 2 migration procedure. Run
`bundle exec jekyll serve` and open <http://localhost:4000/cristiane/>.

## Build check

```bash
bundle exec jekyll build
```

**Passes when**: the build completes with no Liquid error.

## Scenario 1 — Every page identifies itself (User Story 1, FR-001 to FR-003)

```bash
curl -s http://localhost:4000/cristiane/journey/ | grep -E '<title>|name="description"'
```

1. Confirm the title ends with "Cris Souza".
2. Confirm the home page's title is "Cris Souza" alone, not doubled.
3. Open a story and confirm its description is that story's own `tldr`, not the site default.
4. Open `/contact/`, which has no `tldr`, and confirm it falls back to the site description.

**Passes when**: every page has a title naming the author and a description that is not empty.

## Scenario 2 — One address, everywhere (User Story 3, FR-009 to FR-011)

```bash
curl -s http://localhost:4000/cristiane/stories/ | grep -oE '(canonical|og:url)[^>]*'
```

**Passes when**: exactly one canonical is present, and the preview address is the same string.
Repeat on the home page, a story, and a filter page.

> **The check that matters most**: canonical and preview address must be *character for
> character* identical. If they ever differ, a search engine has to guess which page it is
> looking at, and the whole migration rests on this being right.

## Scenario 3 — The sitemap and robots file (FR-006 to FR-008)

```bash
curl -s -o /dev/null -w "%{http_code} sitemap\n" http://localhost:4000/cristiane/sitemap.xml
curl -s -o /dev/null -w "%{http_code} robots\n"  http://localhost:4000/cristiane/robots.txt
curl -s http://localhost:4000/cristiane/robots.txt
```

Then confirm every listed address resolves, and that the 404 is absent:

```bash
curl -s http://localhost:4000/cristiane/sitemap.xml | grep -o '<loc>[^<]*' | sed 's/<loc>//' \
  | while read u; do printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' "$u")" "$u"; done
curl -s http://localhost:4000/cristiane/sitemap.xml | grep -c '404'
```

**Passes when**: both files return 200, robots names the sitemap by absolute address, every
listed address returns 200, and the 404 count is zero.

## Scenario 4 — A shared link previews properly (User Story 2, FR-012 to FR-014)

1. Confirm each page carries a preview title, description, address and image, in both
   vocabularies.
2. Confirm the default image resolves and is 1200×630.
3. Paste a live page address into a preview checker, or into a chat that unfurls links, and
   confirm a card appears with all three parts.

**Passes when**: a link produces a card, and a page with no image of its own still gets one.

> Preview services cache aggressively. If a card looks stale after a change, that is the
> service's cache, not the site — most offer a "scrape again" button.

## Scenario 5 — Machine-readable data (User Story 5, FR-015 to FR-018)

1. Run the home page, a story and `/research/` through a structured-data validator.
2. Confirm the home page describes a person named Cris Souza.
3. Confirm the story is described as an article with a title and date.
4. Confirm the research page describes scholarly works, distinct from stories.
5. Confirm every address inside matches that page's canonical — except a publication's own
   `url`, which points at its external record.

**Passes when**: all three validate with zero errors.

## Scenario 6 — Nothing looks different (FR-023, SC-012)

1. Compare the home page and journey against how they looked before this feature. Layout,
   spacing, the "what's new" format and the journey track are unchanged.
2. The only visible difference anywhere is the browser tab, now reading "Cris Souza".

**Passes when**: no visitor-facing change except the tab text.

## Regression checks

1. All six section pages, a story, a filter page and the 404 still render.
2. The site mark still appears on the home page and nowhere else.
3. No request goes to an external host; `search.js` is still the only script.
4. `ruby tools/check-data.rb` still passes.

---

## Phase 2 — the migration procedure

Do not begin until the domain is bought, DNS points at GitHub Pages, and HTTPS is on
(FR-022). Until then, none of this can be verified and attempting it points every address on
the site at nothing.

### Before

1. Confirm `https://<the new domain>/` serves the site over HTTPS.
2. Record a handful of current addresses to re-check afterwards — the home page, a section, a
   story, a filter page.

### The change

In `_config.yml` only:

```yaml
url: "https://<the new domain>"
baseurl: ""
```

That is the whole edit. Everything absolute derives from those two values.

> If a `--baseurl` flag has crept back into `.github/workflows/pages.yml`, it will override
> this and the change will appear to do nothing. Removing it is a Phase 1 task for exactly
> this reason — check before assuming the edit failed.

### After

1. Rebuild and confirm canonical, preview and structured addresses all name the new domain.
2. Confirm `/sitemap.xml` and `/robots.txt` resolve at the new domain and name new addresses
   only.
3. **Request each old address recorded earlier.** Note what actually happens — a redirect to
   the new address, or an error. This is unverified behaviour; see decision 4 in
   [research.md](research.md).
4. If old addresses redirect: FR-020 is satisfied.
5. If they do not: use Search Console's change-of-address notification, and record the
   outcome in the spec rather than leaving FR-020 looking satisfied when it is not.
6. Add the new domain as a Search Console property and submit the new sitemap.
7. Watch for duplicate-canonical warnings over the following weeks.

**Passes when**: every address on the site names the new domain, the sitemap and robots file
are correct there, and the fate of the old addresses is known and written down.
