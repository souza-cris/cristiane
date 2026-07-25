# Cristiane

Personal website built with [Jekyll](https://jekyllrb.com) and hosted on [GitHub Pages](https://pages.github.com).

Five sections: **home**, **journey**, **stories**, **research**, **bookmarks**, **contact**.

## Run locally

You need Ruby and Bundler installed.

```bash
bundle install
bundle exec jekyll serve
```

Open [http://localhost:4000/cristiane/](http://localhost:4000/cristiane/) in your browser.

`Gemfile.lock` is committed, so `bundle install` gives you gem versions known to work. If a build ever fails with `undefined method 'tainted?'`, the `liquid` gem is too old for your Ruby — run `bundle update liquid`.

## Deploy to GitHub Pages

Pushing to `main` triggers [.github/workflows/pages.yml](.github/workflows/pages.yml), which builds the site and deploys it. The workflow pins Ruby 3.3.

The site is at <https://souza-cris.github.io/cristiane/>.

## Adding content

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

### Journey milestone

Add a block to `_data/journey.yml`, positioned where it belongs in the story — the file's order is the page's order, oldest first. Years are deliberately not shown.

```yaml
- category: industry       # or: academia
  label: "Short label"     # what shows on the track
  org: "Organization"
  short: "OR"              # initials, shown until a logo is set
  logo: "dell.svg"         # a file in assets/img/logos/, or "" for initials
  flag: "🇧🇷"
  place: "City, Country"
```

### Publication

Add a block to `_data/research.yml`. Set `link: ""` to render the title as plain text instead of a link.

### New filter

1. Add the `slug` and `label` to `_data/story_keywords.yml` or `_data/bookmark_types.yml`.
2. Copy an existing page in `stories/` or `bookmarks/` and change the slug in its permalink, its front matter, and its empty-state message.

Both steps are needed because Jekyll cannot generate pages from data files without a plugin, and GitHub Pages does not run custom plugins.

## Structure

```
_config.yml                # Site settings, social links, post permalink
_layouts/                  # default, page, story
_includes/                 # head, nav, footer
                           # story-filters, story-list
                           # bookmark-filters, bookmark-list
                           # search-box, journey-timeline
_posts/                    # Stories (Markdown)
_data/journey.yml          # Journey milestones
_data/story_keywords.yml   # Story filter slugs
_data/bookmarks.yml        # Bookmarks
_data/bookmark_types.yml   # Bookmark filter slugs
_data/research.yml         # Research interests and publications
stories/                   # One thin page per story filter
bookmarks/                 # One thin page per bookmark filter
assets/css/style.css       # All styles, plain CSS
assets/js/search.js        # List filtering, the site's only script
assets/img/                # Portrait and organization logos
specs/                     # Spec Kit feature specs
.specify/                  # Spec Kit config and constitution
.github/workflows/         # Deploy workflow
```

## Conventions

- Content lives in Markdown and YAML, never hardcoded in templates.
- Internal links use the `| relative_url` filter — required because `baseurl` is `/cristiane`.
- JavaScript is avoided. The one exception is the list search, justified in [specs/004-journey-and-search/plan.md](specs/004-journey-and-search/plan.md); the mobile nav is CSS-only.
- Images are committed to the repo — no external hosts.
