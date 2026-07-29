# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Cristiane — a Jekyll static site hosted on GitHub Pages. Sections: Home, Journey, Stories, Research, Bookmarks, Contact. Served at **https://crissouza.org**, at the domain root, so `baseurl` is `""` in `_config.yml`. It is still a project repo, so the custom domain is held by the `CNAME` file — do not delete it, and never pass `--baseurl` in the deploy workflow (a flag overrides the config, invisibly).

## Build & Test

```bash
bundle install            # Install dependencies
bundle exec jekyll serve  # Local server at http://localhost:4000/
bundle exec jekyll build  # Build only — use this to check for Liquid errors
```

Always test locally before pushing. Pushing to `main` triggers `.github/workflows/pages.yml`, which builds and deploys.

`Gemfile.lock` is committed. A build failing with `undefined method 'tainted?'` means `liquid` is older than 4.0.4 — run `bundle update liquid`.

## Architecture

- **Layouts** (`_layouts/`): `default.html` (base), `page.html`, `story.html`
- **Includes** (`_includes/`):
  - `section-links.html` — the section link list, rendered from
    `_data/sections.yml`. Both `nav.html` and `side-nav.html` render through
    it, passing only a `class`. Never write a nav link directly into either
    one; add it to the data file
  - `side-nav.html` — the vertical section menu. Unlike `study-callout.html` it
    does NOT self-gate: `default.html` decides which pages get it, because
    "not on home" is a layout decision, not a property of the component
  - `head.html`, `nav.html`, `footer.html`
  - `story-filters.html`, `story-list.html` — shared by `stories.md` and every page in `stories/`
  - `bookmark-filters.html`, `bookmark-list.html` — shared by `bookmarks.md` and every page in `bookmarks/`
  - `search-box.html` — the search input, plus the `<script>` tag that loads `search.js`
  - `study-callout.html` — the call for participants. Self-gating: renders
    nothing when the study is inactive or absent, so callers need no condition
  - `journey-timeline.html` — the journey track. Each stop is a native
    `<details name="journey">` disclosure, so the browser handles
    one-open-at-a-time with no script. Keep it that way.
- **Content**:
  - Stories: `_posts/YYYY-MM-DD-title.md`, front matter carries `keywords` (a list) and `tldr`
  - Journey: `_data/journey.yml`
  - Bookmarks: `_data/bookmarks.yml`, filter slugs in `_data/bookmark_types.yml`.
    Adding a type is TWO edits: the slug here, and a matching page in
    `bookmarks/`. With only the slug the filter pill renders and leads to a
    404, because Jekyll cannot generate a page from a data file without a
    plugin. Same rule for story keywords and `stories/`
  - Story filters: `_data/story_keywords.yml`
  - Research: `_data/research.yml`
  - Sections: `_data/sections.yml` — the navigation list, with a `match` of
    `exact` or `prefix` per entry deciding whether child pages mark it as
    current. Adding a section is one edit here; no template changes
  - Identity: `_data/profile.yml` — name, role, affiliation and ORCID, read by
    the structured data on BOTH the home page and the journey page. Two pages
    make machine-readable claims about the same person and a search engine
    merges them only if they agree exactly, so they are never typed twice. The
    ORCID lives here rather than in `social.yml` by decision: everything in
    `social.yml` draws a footer icon, and this identifier is for search engines
    and citation, not for every page
  - Social links: `_data/social.yml` — footer links. The icon *drawings* stay
    in `footer.html`, selected by each entry's `icon` value; a drawing is not
    content. These used to sit unread in `_config.yml` while the footer
    hardcoded its own copy — do not put content back in `_config.yml`
  - Home updates: `_data/updates.yml` — hand-curated, rendered by
    `_includes/updates-widget.html`. It never aggregates from `_posts/` or
    bookmarks, and it reads feature 007's study record without owning it
  - Call for participants: `_data/study.yml` — a single study record with an
    `active` toggle, rendered by `_includes/study-callout.html` in two variants
    (`full` on research, `compact` on home). It is the single source for both
    surfaces; never copy study text anywhere else
  - Pages: `index.md`, `journey.md`, `stories.md`, `research.md`, `bookmarks.md`, `contact.md`, `404.md`
  - Filter pages: `stories/*.md` and `bookmarks/*.md` — thin wrappers over the shared includes
- **Config**: `_config.yml` holds site metadata, `updates_limit`, and the post permalink (`/stories/:year/:month/:day/:title/`). Content does not live here — Jekyll reads this file only at startup, so a rebuild will not pick up changes
- **Styles**: Single file at `assets/css/style.css` (plain CSS, no preprocessor)
- **Scripts**: `assets/js/search.js` — the only JavaScript on the site

## Key Conventions

- All content lives in Markdown or YAML data files, never hardcoded in HTML templates. If you find yourself pasting the same markup into several pages, extract an include driven by a data file.
- No JavaScript unless clearly justified, and any exception must be recorded in the relevant spec. Mobile nav is CSS-only `<details>`/`<summary>`; the list search is the one script, justified in `specs/004-journey-and-search/plan.md`.
- Only GitHub Pages-supported plugins. No custom build tools or npm. This is why filter pages are written by hand rather than generated from data.
- Use `| relative_url` filter for all internal links (required because of `baseurl`).
- Section `url` values in `_data/sections.yml` are canonical **with a trailing
  slash** (`/journey/`), and `section-links.html` compares `page.url` to them
  directly. Do not append a slash in the template — that produces `/journey//`
  and silently stops the current section being marked. A link without the
  trailing slash still resolves, but only through a redirect.
- An empty filter page is `noindex, follow` — computed in `head.html` from the
  page's own item count, so a term that gains its first entry becomes indexable
  on the next build with no edit. It is also dropped from `sitemap.xml`.
- The journey page's `ProfilePage` markup is DERIVED from `_data/journey.yml`
  (schools from the `academia` stops, current affiliation from the most recent
  one), so it cannot drift from the visible track. The `industry` stops are
  deliberately not emitted: schema.org's only employment field is `worksFor`,
  which means where someone works *now*, and deriving it would claim she works
  at seven companies at once.
- `feed.xml` is hand-written Atom, not `jekyll-feed`. Every plugin is one more
  thing that can change under the site without a commit. It is advertised in
  `head.html` on every page and excluded from the sitemap via `sitemap: false`.
- Images are committed to the repo and sized for the web — never hotlink an external host, and resize large originals before committing.
- The journey page deliberately shows no years on the track. A milestone's
  optional `period` renders only inside an opened stop. Note that detail text
  is in the HTML even while collapsed, so grepping the page for years gives
  false matches — check the `<summary>` markup instead.
- A journey stop never names its category in words. `academia` / `industry` are
  shown by the badge ring style (solid / dashed) plus the legend above the
  track, which is the only place those words appear. This satisfies the
  color-independence requirement without repeating the label on every stop.
- A milestone's optional `url` turns its badge logo into a link to that
  organization's site. The link sits inside the `<summary>`, which is safe:
  the anchor handles its own click, so following it does not toggle the stop.
  Do not add script to "fix" this.
- The site has two breakpoints and they are not interchangeable. 600px is where
  the top nav collapses; 1000px is where the side nav hides, because below that
  it would overlap the 44rem content column. Do not consolidate them.
- Exactly one section menu is visible at a time: side nav above 1000px, top nav
  list from 600–999px, hamburger below 600px.
- Home has **no top navigation and no side navigation**. Its hero links are its
  navigation, and `default.html` leaves the whole header out of home rather
  than hiding it. Do not "restore" a menu there — a menu directly above the
  hero links shows the same five destinations twice.
- The section list renders in three places — top nav, side nav, and the home
  hero — and is written in exactly one: `_data/sections.yml`. All three go
  through `section-links.html`. The hero was a third hand-written copy until
  spec 008 Phase 9; do not reintroduce one in page content.
- **Do not delete `.site-nav__menu::details-content { content-visibility: visible }`.**
  It looks redundant next to the `display: flex` on the list, and it is not. The
  list sits inside a closed `<details>`, whose content browsers now hide via
  `::details-content`; `display` does not override that. Without this rule the
  top nav links compute as `flex`, report a layout box, and never paint —
  leaving no navigation at all between 600px and 999px.
- Element geometry lies about visibility inside a closed `<details>`.
  `getBoundingClientRect` returns non-zero boxes for content that is not
  painted. To check whether nav links are visible, screenshot the page — do not
  ask the DOM.
- `default.html` puts `is-home` or `is-interior` on `<body>`. That class drops
  the rules above and below the content on home; reuse it for anything else
  that differs between home and interior pages rather than adding a new flag.
- Story pictures live in `assets/img/stories/<story-slug>/`, resized to ~1200px
  before committing, and are wrapped in `<figure class="story-figure">` with
  real `alt` text. `story-figure--light` puts artwork drawn on white onto a
  white panel so it does not glare against the dark page.
- `#tbh` asides are the author's recurring device — an honest aside stepping out
  of the walkthrough — styled by `.tbh`. They MUST be written as HTML, not
  Markdown: a line beginning `#` becomes an `<h1>`, which is emphatically not
  what `#tbh` means. Preserve her wording exactly; it is her voice.
- The site icon is three files: `assets/img/icon.svg` (the source),
  `favicon.ico`, and `assets/img/apple-touch-icon.png`. The two raster files are
  **generated** from the SVG — regenerate them together, never hand-edit one.
  Commands are in the README and spec 009's quickstart.
- `favicon.ico` sits at the **repository root** on purpose, so it publishes to
  `/favicon.ico` at the domain root. Moving it under `assets/` breaks the bare-root
  request. The *domain* root (`souza-cris.github.io/favicon.ico`) belongs to a
  different repo and is not ours to serve — that is fine, because the icons are
  declared in `head.html` and a browser given a declaration never probes root.
- The touch icon is deliberately opaque (RGB, no alpha). iOS composites on
  black, so a transparent PNG shows black corners.
- `icon.svg` and `logo.svg` hold the same artwork but are **separate files by
  the author's decision**, so the icon can be tuned for 16px without changing
  the home page. They do not track each other — changing the drawing means
  changing both until they diverge.
- The site mark (`assets/img/logo.svg`) renders on the **home page only**,
  centered above the content, and is decorative — empty alt, `aria-hidden`, not a
  link. It is emitted only on home rather than hidden elsewhere with CSS. The
  artwork is the author's, in her brand teal `#0B7E8A`; use it as supplied and
  never redraw or recolor it. See spec 009.
- `#0B7E8A` measures 3.93:1 on the site background — below the 4.5:1 normal text
  needs. It is fine inside the mark, which carries no text. If teal is ever put
  on the page proper, use `#0FA3B1` (6.21:1) instead.
- The site's address lives in exactly two `_config.yml` values, `url` and
  `baseurl`. Every canonical, preview and structured-data address is built from
  them with `absolute_url`, which is what makes moving the site one edit. Never
  write an absolute address into a template, and never pass `--baseurl` on the
  build — a flag overrides the config invisibly.
- `relative_url` for internal links and assets; `absolute_url` only for
  addresses another site or a search engine quotes. Both read the same config.
- `_includes/head.html` computes the title, description, canonical and preview
  address ONCE and reuses them. They must stay one expression: if the canonical
  and the preview address are ever produced separately they will drift, and a
  search engine then has to guess which page it is looking at.
- The 404 is the one page with no canonical and the one page excluded from
  `sitemap.xml`. The exclusion is visible in the sitemap template on purpose,
  rather than hidden in the page's front matter.
- Study and recruitment content is author-supplied and MUST NOT be generated or
  paraphrased. For human-subjects research it is IRB-approved wording. The site
  links out to a recruitment destination and never collects participant data.
- **American spelling throughout** — color, organization, labeled, optimization,
  behavior. This covers page content, data-file comments, alt text and the specs.
  The one exception is `aria-labelledby`, which is an HTML attribute name and
  must keep its spelling or it stops working.
- Explain changes in plain language — the project owner is new to web development.

Source documents (the Word files a story or a bookmark list is drafted in) live
in `_drafts/_doc/`. Jekyll ignores any directory whose name starts with `_`, so
nothing there is published. Do NOT leave a `.docx` in `bookmarks/`, `stories/`
or any other content directory — Jekyll copies unrecognized files through
verbatim, so the draft becomes a public download at its own URL.

## Authoring tools

`tools/` holds helpers for writing content. It is excluded in `_config.yml`, so
nothing there is published — keep it that way.

- `tools/check-data.rb` — validates every content file: required fields, filter
  slugs against `bookmark_types.yml` / `story_keywords.yml`, date formats,
  complete URLs, logo files that exist, and leftover placeholders like `"."`.
  Run `ruby tools/check-data.rb`. Exit 1 on problems, so it can back a git hook.
  `--links` adds a pass over the **built** site asserting every internal link
  lands on a real file in one hop; it needs a current `_site`, so it is opt-in
  and stays out of the pre-commit hook.
  Written in Ruby on purpose: Jekyll already requires Ruby and YAML ships with
  it, so it adds nothing to install. PyYAML is *not* available here.
- `tools/templates/` — paste-ready entries with the fields explained inline.
- `tools/git-hooks/pre-commit` — runs the checker over staged `_data/*.yml` and
  `_posts/*.md` and blocks the commit on a problem. Enabled per clone with
  `git config core.hooksPath tools/git-hooks`; bypass with `--no-verify`. It
  lives in `tools/` rather than `.git/hooks/` so it is versioned and survives a
  fresh clone. Pass file paths to the checker to scope it; no arguments checks
  everything.

When adding a field to a data file, add it to the checker's required list too,
or the next omission goes unnoticed. `jekyll build` catches none of this: a
missing field is valid YAML and renders as a blank, and a mistyped filter slug
silently drops the entry from its filter page.

## Spec Kit

A spec's `Status` is `Draft`, `Implemented`, or `Backlog`. Anything marked Backlog is also
listed in `BACKLOG.md` with what is done, what is left, and how to resume — keep the two in
step. Do not start building a backlogged feature without being asked.

The `.specify/` directory contains Spec Kit configuration. Use slash commands (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`) for the feature workflow. Constitution at `.specify/memory/constitution.md`; features documented under `specs/`.
