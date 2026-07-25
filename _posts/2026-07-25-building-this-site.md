---
layout: post
title: "Building this site with Jekyll"
date: 2026-07-25
---

I built this site using Jekyll, a static site generator that turns Markdown files into a website. Here's a quick look at how it works.

## How Jekyll works

Jekyll reads your Markdown files and applies layouts written in Liquid templates. The result is a folder of plain HTML files that you can host anywhere — no server needed.

> Jekyll does what you tell it to do — no more, no less. It doesn't try to outsmart users by making bold assumptions, nor does it burden them with needless complexity and configuration.

The basic command to build and serve the site locally is:

```bash
bundle exec jekyll serve
```

This starts a local server at `http://localhost:4000/cristiane/` where you can preview changes.

## Adding a blog post

To add a new post, create a file in `_posts/` with this naming format:

```
YYYY-MM-DD-title-slug.md
```

Each post starts with front matter — a small block of metadata:

```yaml
---
layout: post
title: "Your Post Title"
date: 2026-07-25
---
```

Then write the rest in Markdown. Jekyll handles the rest.

## What I learned

- Markdown is a simple way to write content without worrying about HTML
- Jekyll's `_layouts` and `_includes` system keeps things organized
- Deploying to GitHub Pages is as simple as `git push`
