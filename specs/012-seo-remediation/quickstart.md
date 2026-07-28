# Quickstart: Search Discoverability Remediation

**Date**: 2026-07-28 | **Feature**: [spec.md](spec.md)

Run `bundle exec jekyll serve` and open <http://localhost:4000/>.

## Build check

```bash
bundle exec jekyll build && ruby tools/check-data.rb
```

**Passes when**: the build completes with no Liquid error and the checker reports no problems.

## Scenario 1 — Every internal link resolves in one hop (US2)

```bash
# every internal href in the built site, checked for redirects
python3 - <<'PY'
import re, glob, subprocess
hrefs = {h for f in glob.glob("_site/**/*.html", recursive=True)
           for h in re.findall(r'href="(/[^"#?]*)"', open(f).read())}
for h in sorted(hrefs):
    code = subprocess.run(["curl","-s","-o","/dev/null","-w","%{http_code}",
                           f"http://localhost:4000{h}"], capture_output=True, text=True).stdout
    if code != "200": print(f"  {code}  {h}")
print(f"  checked {len(hrefs)} internal links")
PY
```

**Passes when**: nothing is printed above the count. Any `301` is a link still written without
its trailing slash.

> **Then check the thing the fix can break.** Open `/journey/` and confirm "journey" is still
> marked as the current section, and `/stories/ai/` still marks "stories". If the data gained a
> slash but the template kept its `append`, every page will look right and no section will be
> highlighted — see the link contract.

## Scenario 2 — No empty page is offered to a search engine (US4)

1. Confirm `/bookmarks/talk/` and `/stories/ai/` are **absent** from `/sitemap.xml`.
2. Confirm each still loads in a browser and still shows its empty-state line.
3. Confirm each emits `noindex, follow`.
4. Add one bookmark of type `talk`, rebuild, and confirm `/bookmarks/talk/` is now **in** the
   sitemap and no longer carries `noindex` — with no edit to any template or list.
5. Remove it, rebuild, confirm it drops back out.

**Passes when**: sitemap membership follows the content automatically in both directions.

## Scenario 3 — Every page describes itself (US3, US6)

```bash
python3 - <<'PY'
import re, glob, collections
t, d = collections.Counter(), collections.Counter()
for f in glob.glob("_site/**/*.html", recursive=True):
    h = open(f).read()
    mt = re.search(r'<title>([^<]*)</title>', h)
    md = re.search(r'name="description" content="([^"]*)"', h)
    if mt: t[mt.group(1)] += 1
    if md: d[md.group(1)] += 1
print("  duplicate titles:", [k for k,v in t.items() if v > 1] or "none")
print("  duplicate descriptions:", [k[:50] for k,v in d.items() if v > 1] or "none")
PY
```

**Passes when**: both lists are empty. Today the first has two entries covering 17 pages.

Then confirm the story's description is a complete sentence, does not end in `...`, and that its
`og:image` is the story's own illustration rather than the site default.

## Scenario 4 — The journey page is a profile (US5)

1. Run `/journey/` through a structured-data validator: a `ProfilePage` whose `mainEntity` is a
   `Person`, zero errors.
2. Confirm education, employment and current affiliation appear as properties, and that each
   corresponds to a milestone visible on the page.
3. Compare the `Person` on `/` and on `/journey/` — name, URL and `sameAs` must agree.
4. Change one milestone in `_data/journey.yml`, rebuild, and confirm both the visible track and
   the structured data changed. They are derived from the same file and must not drift.

## Scenario 5 — Readers can subscribe (US8)

```bash
curl -s -o /dev/null -w "  feed %{http_code} %{content_type}\n" http://localhost:4000/feed.xml
curl -s http://localhost:4000/ | grep -o 'rel="alternate"[^>]*'
```

**Passes when**: the feed returns 200 as an Atom document, every page advertises it, and it is
absent from the sitemap. Then add a story, rebuild, and confirm it appears with no manual step.

## Scenario 6 — The lead images load eagerly (US7)

1. Confirm the story's lead figure and the journey portrait carry **no** `loading="lazy"` and
   **do** carry `fetchpriority="high"`.
2. Confirm every other image still carries `loading="lazy"`.
3. Confirm every image still carries `width` and `height`, so nothing shifts.
4. Measure LCP on both pages before and after; it must be no worse.

## Scenario 7 — The 404 cannot be mistaken for content (US11)

**Passes when**: it returns 404, emits `noindex`, emits no canonical, emits no `og:url`, and is
absent from the sitemap.

## Regression checks

1. All six sections, the story, every filter page and the 404 still render.
2. Exactly one section menu is visible at each width, and the current section is marked.
3. Canonical still equals `og:url` on every page — feature 010's guarantee must survive.
4. `search.js` is still the only script; no request goes to an external host.
5. `ruby tools/check-data.rb` passes.

## Not covered here

Analytics. US9 and FR-036 to FR-048 are excluded from this plan pending a constitution
amendment — see research decision 8.
