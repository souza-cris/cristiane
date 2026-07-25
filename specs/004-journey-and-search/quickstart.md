# Quickstart: Journey Timeline and List Search

**Date**: 2026-07-25

## Run the site

```bash
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000/cristiane/journey/>.

If the build fails with `undefined method 'tainted?'`, the `liquid` gem is older than 4.0.4. Run `bundle update liquid`. `Gemfile.lock` is committed, so a fresh `bundle install` already has the fix.

## Add a milestone to the journey

Edit `_data/journey.yml` and add a block in the position you want it to appear — the file's order is the page's order, oldest first:

```yaml
- category: industry          # or: academia
  title: "Longer form, not displayed"
  label: "Short label"        # this is what shows on the track
  org: "Organization"
  short: "OR"                 # initials, used until a logo is set
  logo: ""                    # e.g. "dell.svg" once a file exists
  flag: "🇧🇷"
  place: "City, Country"
  note: ""
```

Badge sizes re-space themselves across the track automatically. Do not add years — the order carries the chronology.

## Add a logo

1. Put a square-ish SVG or PNG in `assets/img/logos/`.
2. Set `logo:` on the milestone to the filename.

The circle switches from initials to the image, and logo badges render on a light face so dark brand marks stay legible.

## Add a story

Create `_posts/YYYY-MM-DD-title.md`:

```markdown
---
layout: story
title: "Your Story Title"
date: 2026-07-25
keywords: [short, ai]
tags: [optional, free-form]
tldr: "One or two sentences."
---

Body in Markdown.
```

List as many `keywords` as apply — the story appears under each one's filter.

## Add a bookmark

Add an entry to `_data/bookmarks.yml` with a `type` matching a slug in `_data/bookmark_types.yml`.

## Add a filter

1. Add `slug` and `label` to `_data/story_keywords.yml` or `_data/bookmark_types.yml`.
2. Copy an existing page from `stories/` or `bookmarks/`, then change the slug in the permalink, the front matter (`keyword:` or `type:`), and the empty-state message.

## Test the search logic

The filtering in `assets/js/search.js` can be exercised without a browser by loading it against a fake DOM — see the checks described in `plan.md` Phase 2. In the browser, verify that typing narrows the list, that an unmatched query shows "Nothing matches that search.", and that clearing the box restores everything.

## Before pushing

```bash
bundle exec jekyll build     # must finish with no Liquid errors
```

Check the journey page for stray years:

```bash
grep -oE '\b(19|20)[0-9]{2}\b' _site/journey/index.html   # expect no output
```
