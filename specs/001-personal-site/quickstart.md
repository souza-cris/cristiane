# Quickstart: Personal Website

**Date**: 2026-07-25

## Prerequisites

- Ruby installed (version compatible with GitHub Pages)
- Bundler installed (`gem install bundler`)
- Git configured

## Setup

```bash
# Install dependencies
bundle install

# Start local server
bundle exec jekyll serve
```

Open `http://localhost:4000` in a browser.

## Validation Scenarios

### 1. Home Page and Navigation

1. Open `http://localhost:4000`
2. Verify: Cristiane's name, one-line description, and photo are visible
3. Verify: GitHub and LinkedIn links are present and open in new tabs
4. Verify: Navigation bar shows links to Home, Portfolio, Projects, Blog, Curation
5. Click each nav link — verify it navigates to the correct page
6. Resize browser to mobile width (< 768px) — verify layout is responsive and navigation is accessible

### 2. Blog

1. Navigate to `/blog`
2. Verify: Posts are listed newest first with title, date, and excerpt
3. Click a post title — verify full content loads on its own page
4. **Add a new post**: Create `_posts/2026-07-25-test-post.md` with:
   ```markdown
   ---
   layout: post
   title: "Test Post"
   date: 2026-07-25
   ---
   This is a test post body.
   ```
5. Restart `bundle exec jekyll serve`
6. Verify: "Test Post" appears at the top of the blog index
7. Verify: No other file changes were needed

### 3. Projects

1. Navigate to `/projects`
2. Verify: Projects are listed with titles and descriptions
3. Click a project — verify detail page shows title, description, images, links, and tools/learnings
4. **Add a new project**: Create `_projects/test-project.md` with:
   ```markdown
   ---
   layout: project
   title: "Test Project"
   description: "A test project"
   date: 2026-07-25
   tools:
     - Jekyll
   ---
   Detailed write-up of the test project.
   ```
5. Restart `bundle exec jekyll serve`
6. Verify: "Test Project" appears on the projects index
7. Verify: No other file changes were needed

### 4. Portfolio / Resume

1. Navigate to `/portfolio`
2. Verify: Background, experience, and skills sections are visible
3. Verify: Contact email link is present
4. If `assets/files/resume.pdf` exists: verify download link works
5. If `assets/files/resume.pdf` is missing: verify no broken link is shown

### 5. Curation

1. Navigate to `/curation`
2. Verify: Items are grouped under category headings
3. Click an item link — verify it opens the external resource in a new tab
4. **Add a new item**: Edit `_data/curation.yml` and add an entry to an existing category
5. Restart `bundle exec jekyll serve`
6. Verify: New item appears under the correct category
7. Verify: No other file changes were needed

### 6. 404 Page

1. Navigate to `http://localhost:4000/nonexistent-page`
2. Verify: Custom 404 page is shown
3. Verify: Navigation bar is present for returning to the site

### 7. Empty States

1. Remove all files from `_posts/` — verify blog index shows "No posts yet" message
2. Remove all files from `_projects/` — verify projects index shows empty-state message
3. Remove `assets/files/resume.pdf` — verify portfolio page hides the download link

### 8. Cross-Device Rendering

Test at these viewport widths:
- 320px (small mobile)
- 768px (tablet)
- 1024px (small desktop)
- 1920px (full desktop)

Verify all pages render correctly with readable text, no horizontal overflow, and accessible navigation.
