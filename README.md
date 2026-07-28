# Cristiane

Personal website built with [Jekyll](https://jekyllrb.com) and hosted on [GitHub Pages](https://pages.github.com).

Six sections: **home**, **journey**, **stories**, **research**, **bookmarks**, **contact**.

## Run locally

You need Ruby and Bundler installed.

```bash
bundle install
bundle exec jekyll serve
```

Open [http://localhost:4000/](http://localhost:4000/) in your browser.

`Gemfile.lock` is committed, so `bundle install` gives you gem versions known to work. If a build ever fails with `undefined method 'tainted?'`, the `liquid` gem is too old for your Ruby — run `bundle update liquid`.

## Deploy to GitHub Pages

Pushing to `main` triggers [.github/workflows/pages.yml](.github/workflows/pages.yml), which builds the site and deploys it. The workflow pins Ruby 3.3.

The site is at <https://crissouza.org>.

## Adding content

### Start from a template, then check your work

Two helpers live in `tools/`. They run on your machine, are not part of the site, and need nothing installed beyond the Ruby you already have for Jekyll.

**Templates** — copy one, paste it in, fill it out. Each field is explained inline.

| To add | Copy | Into |
|---|---|---|
| a bookmark | `tools/templates/bookmark.yml` | the end of `_data/bookmarks.yml` |
| a story | `tools/templates/story.md` | a new file in `_posts/` |
| a journey milestone | `tools/templates/journey.yml` | the right position in `_data/journey.yml` |
| a home page update | `tools/templates/update.yml` | `_data/updates.yml` |

Paste them exactly as they are. The indentation is already correct, and YAML cares about it.

**The checker** — run this before you push:

```bash
ruby tools/check-data.rb
```

It reads every content file and tells you what is wrong and how to fix it. It never edits anything.

```
_data/bookmarks.yml
  x "Attention Is All You Need": type "papers" is not a known slug
    -> use one of: paper, book, talk, tool, dataset, more — did you mean "paper"?

_data/journey.yml
  x "Chevron": `label` is missing
    -> add `label:` — leaving it out is not the same as leaving it empty
```

**Run it automatically before every commit** — once per clone:

```bash
git config core.hooksPath tools/git-hooks
```

From then on, committing a change to `_data/` or `_posts/` runs the checker on just those files and stops the commit if something is wrong. Files you are not touching are not checked, so an unrelated problem never blocks you. To commit anyway — a half-finished draft, say — use `git commit --no-verify`.

This exists because `bundle exec jekyll build` will *not* catch these. A missing field is still valid YAML — the page just renders a blank line, and a mistyped filter slug makes an entry vanish from its filter page with no warning at all.

Two habits that prevent most of it:

- **Empty a field, never delete it.** `note: ""` renders nothing, cleanly. A deleted `label` renders a blank space and no error.
- **Never leave a placeholder** like `.` or `tbd`. Those render. An empty string is the safe way to say "nothing here".

### Story

Create `_posts/YYYY-MM-DD-title.md`:

```markdown
---
layout: story
title: "Your Story Title"
date: 2026-07-25
keywords: [short, ai]
tags: [optional, free-form]
tldr: "One or two sentences shown in the list."
---

Write your story here in Markdown.
```

`keywords` decides which filters the story appears under, and a story can carry several. Valid slugs live in `_data/story_keywords.yml`.

**Two optional fields, on any page or story:**

```yaml
description: "One sentence, 140-160 characters, plain text."
image: "/assets/og/something.png"
```

`description` is what a search engine shows and what a shared link's preview card says. Leave it out and a story falls back to its `tldr`, and anything else to the site description — so it is never blank, and no existing story needs editing. `image` overrides the default preview picture for that page.

**Adding pictures.** Put them in `assets/img/stories/<story-slug>/`, resized to about 1200 pixels wide before committing. Then in the story:

```html
<figure class="story-figure">
  <img src="{{ '/assets/img/stories/my-story/screenshot.png' | relative_url }}"
       alt="What the picture shows, for someone who cannot see it."
       width="1200" height="573" loading="lazy">
  <figcaption>An optional caption.</figcaption>
</figure>
```

Add `story-figure--light` for artwork drawn on a white background, so it sits on a white panel instead of glaring against the dark page.

**An aside to the reader.** For a remark that steps out of the flow:

```html
<aside class="tbh"><p><strong>#tbh</strong> – what you really think.</p></aside>
```

Write it as HTML, not Markdown. A line starting with `#` in Markdown becomes a giant heading, which is not what `#tbh` means.

### Bookmark

Add an entry to `_data/bookmarks.yml`:

```yaml
- title: "Item Title"
  type: "paper"          # a slug from _data/bookmark_types.yml
  topicTags: ["AI"]
  whyItMatters: "Why this is worth someone's time."
  keyTakeaway: "The one thing to remember."
  link: "https://example.com"
  addedDate: "2026-07-25"
  source: "arXiv"
```

Current types: `paper`, `report`, `project`, `tool`, `course`, `organization`, `book`, `talk`, `dataset`, `more`.

**Adding a new type is two edits, not one.** Put the slug in `_data/bookmark_types.yml`, then copy an existing page in `bookmarks/` and change the slug in its permalink, its `type`, and its empty-state message. With only the first edit the filter pill appears and leads to a 404 — Jekyll cannot generate a page from a data file without a plugin.

### Journey milestone

Add a block to `_data/journey.yml`, positioned where it belongs in the story — the file's order is the page's order, oldest first.

```yaml
- category: industry       # or: academia — sets the badge ring colour and style
  label: "Short label"     # what shows on the track
  org: "Organization"      # shown when the stop is opened
  short: "OR"              # initials, shown until a logo is set
  logo: "dell.svg"         # a file in assets/img/logos/, or "" for initials
  url: "https://…"         # optional — makes the logo link to their site
  flag: "🇧🇷"
  place: "City, Country"
  period: "2019–2022"      # shown on the track, and again when opened
  title: "Full role title" # shown only when the stop is opened
  note: "The longer story." # shown only when the stop is opened
```

Three things to know:

- **Select a stop to open it.** `title` and `note` are hidden until then, and only one stop is open at a time. That is the browser's own behaviour, not a script.
- **The words "academia" and "industry" never appear on a stop.** The category shows as the badge's ring colour and style, explained once by the legend above the track.
- **Logos are committed files, sized small.** Drop a new one in `assets/img/logos/` and resize it first — the badge renders it at about 42 pixels, so a 200-pixel image is already generous.

### Publication

Add a block to `_data/research.yml`. Set `link: ""` to render the title as plain text instead of a link.

### Home page update

Add an entry to `_data/updates.yml`. The four most recent appear on the home page:

```yaml
- type: publication          # also the label — any word works
  title: "What it is called"
  date: 2026-07-25           # orders the list, newest first
  link: "/research/"         # site-rooted internal path, or a full https:// URL
  blurb: "One line of context."
  active: false              # optional — hides it without deleting it
  pinned: true               # optional — puts it first regardless of date
```

Three things to know:

- **Write internal links site-rooted** — `/stories/…`, with a leading slash and no domain.
- **This list is curated by hand.** It does not read from `_posts/` or the bookmarks, so featuring something here does not create it, and editing a story does not update its entry.
- **The limit lives in `_config.yml`** as `updates_limit`. Change it and restart the local server — Jekyll reads that file only at startup.

### Call for participants

Edit `_data/study.yml`. `active` is the only switch:

```yaml
active: true                                  # false hides it everywhere, keeps the text
title: "Study name"
description: "What the study is about."
summary: "One short line for the home page."  # optional, falls back to description
eligibility: "Who can take part."
involves: "Time, format, compensation."
action_label: "Sign up"
action_url: "https://forms.example.com/…"     # or "mailto:you@example.com"
deadline: "15 March 2027"                     # optional, shown as written
```

Two things to know:

- **`action_url` must be complete**, including `https://` or `mailto:`. An address on its own won't work as a link — nothing is guessed for you.
- **A passed deadline does not hide the callout.** The site rebuilds when you push, not on a schedule, so `active: false` is the only thing that closes recruitment.

Write the content yourself — for human-subjects research, use your IRB-approved wording verbatim.

### Social link in the footer

Edit `_data/social.yml`. Reordering or removing is that file alone; the footer follows its order.

```yaml
- label: "LinkedIn"       # read aloud by screen readers
  url: "https://www.linkedin.com/in/souzacris/"
  icon: "linkedin"        # which icon to draw: linkedin, scholar, github
```

Adding a *new* service also needs its icon drawing added to `_includes/footer.html`, because the drawings are not content and do not belong in a data file.

### New section in the menus

Add a block to `_data/sections.yml`, then create the page. All three places the sections appear — the top menu, the side menu, and the links on the home page — pick it up. There is no template to edit.

```yaml
- label: "talks"
  url: "/talks"      # site-rooted, leading slash, no domain
  match: "exact"     # or "prefix" if the section will have pages beneath it
```

`match` decides when the link highlights as the section you are in. Use `exact` for a single page, and `prefix` if it will have child pages — that is why reading one story still highlights "stories".

### Changing the site icon

Replace `assets/img/icon.svg`, then regenerate the two files made from it:

```bash
rsvg-convert -w 180 -h 180 assets/img/icon.svg -o assets/img/apple-touch-icon.png
rsvg-convert -w 256 -h 256 assets/img/icon.svg -o /tmp/_ico.png
python3 -c "
from PIL import Image
Image.open('/tmp/_ico.png').convert('RGBA').save('favicon.ico', sizes=[(32,32),(16,16)])
Image.open('assets/img/apple-touch-icon.png').convert('RGB').save('assets/img/apple-touch-icon.png', optimize=True)"
```

Three things to know:

- **`favicon.ico` lives at the top of the repository**, not in `assets/`. That is what puts it at the site's own root, where browsers expect to find it.
- **The touch icon has no transparency on purpose.** iOS puts its own rounded corners on it and fills any see-through part with black.
- **The home page mark is a separate file** (`assets/img/logo.svg`) and will not change with the icon. That is deliberate — the icon can be adjusted for tiny sizes without touching the home page.

1. Add the `slug` and `label` to `_data/story_keywords.yml` or `_data/bookmark_types.yml`.
2. Copy an existing page in `stories/` or `bookmarks/` and change the slug in its permalink, its front matter, and its empty-state message.

Both steps are needed because Jekyll cannot generate pages from data files without a plugin, and GitHub Pages does not run custom plugins.

## Structure

```
_config.yml                # Site settings, social links, post permalink
_layouts/                  # default, page, story
_includes/                 # head, nav, side-nav, section-links, footer
                           # story-filters, story-list
                           # bookmark-filters, bookmark-list
                           # search-box, journey-timeline
                           # updates-widget, study-callout
_posts/                    # Stories (Markdown)
_data/sections.yml         # Navigation sections, shared by both menus
_data/social.yml           # Footer links (LinkedIn, Scholar, GitHub)
_data/journey.yml          # Journey milestones
_data/story_keywords.yml   # Story filter slugs
_data/bookmarks.yml        # Bookmarks
_data/bookmark_types.yml   # Bookmark filter slugs
_data/research.yml         # Research interests and publications
_data/updates.yml          # Home page "what's new" entries
_data/study.yml            # Call for participants (one study, one switch)
stories/                   # One thin page per story filter
bookmarks/                 # One thin page per bookmark filter
assets/css/style.css       # All styles, plain CSS
assets/js/search.js        # List filtering, the site's only script
favicon.ico                # Browser tab icon (root on purpose — see below)
assets/img/icon.svg        # Site icon source; the .ico and touch icon come from it
assets/img/apple-touch-icon.png  # iOS home screen tile, 180x180
assets/img/logo.svg        # Site mark, shown on the home page only
assets/img/                # Portrait and organization logos
specs/                     # Spec Kit feature specs
.specify/                  # Spec Kit config and constitution
.github/workflows/         # Deploy workflow
```

## Feature specs

Work on this site is specified before it is built, using [Spec Kit](https://github.com/github/spec-kit). Each feature has a spec, a plan, a data model, a contract and a quickstart under `specs/`:

| | Feature |
|---|---|
| 001 | Personal site |
| 002 | Dark theme redesign |
| 003 | Content restructure |
| 004 | Journey timeline and list search |
| 005 | Journey storytelling and usability |
| 006 | Home page updates widget |
| 007 | Research page call for participants |
| 008 | Side navigation and uninterrupted home |
| 009 | Site icon and brand mark |
| 010 | Search visibility |

Work that is specified but not scheduled lives in [BACKLOG.md](BACKLOG.md), and its spec is marked **Backlog** rather than Implemented so the two cannot disagree.

The project constitution is at `.specify/memory/constitution.md`. Its five principles — simplicity, content as data, GitHub Pages compatibility, performance and accessibility, and minimal JavaScript — are checked in every feature's plan.

Feature 008 was written up after it was built rather than before, and its spec says so.

Nothing is currently backlogged — [BACKLOG.md](BACKLOG.md) holds only unspecified ideas.

The constitution is at version 2.0.0. The jump from 1.x came from tightening "content as data" to cover repeated structure, not just prose: the navigation list now lives in `_data/sections.yml` and both menus render from it. That amendment also added a rule worth knowing about — a principle is never loosened to make existing code compliant. Either the code changes, or the principle changes on its own merits.

## Conventions

- Content lives in Markdown and YAML, never hardcoded in templates.
- Internal links use the `| relative_url` filter. The site now sits at the root of crissouza.org, so `baseurl` is empty — but the filter stays, because it is what makes moving the site a one-line change.
- JavaScript is avoided. The one exception is the list search, justified in [specs/004-journey-and-search/plan.md](specs/004-journey-and-search/plan.md); the mobile nav is CSS-only.
- Images are committed to the repo — no external hosts.
