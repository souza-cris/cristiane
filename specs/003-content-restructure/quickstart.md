# Quickstart: Content Restructure

**Date**: 2026-07-25

## Prerequisites

- Ruby 3.1–3.3 and Bundler installed
- Existing site builds successfully

## Setup

```bash
bundle exec jekyll serve
```

Open `http://localhost:4000/cristiane/` in a browser.

## Validation Scenarios

### 1. Home Page — Hero Only

1. Open `http://localhost:4000/cristiane/`
2. Verify: "Hello, my name is" appears as small eyebrow text
3. Verify: "Cris" appears as a large headline
4. Verify: Subheadline appears below
5. Verify: CTA links to stories, research, bookmarks, contact are present
6. Verify: **No additional content** appears below the CTAs

### 2. Navigation

1. On any page, verify the nav shows lowercase links: about, stories, research, bookmarks, contact
2. Click each link — verify it navigates to the correct page
3. Verify the old nav links (Home, Portfolio, Projects, Blog, Curation) are gone

### 3. Footer

1. Scroll to the bottom of any page
2. Verify: LinkedIn, Google Scholar, and GitHub icon links are present
3. Click each — verify it opens the correct external URL in a new tab

### 4. About Page

1. Navigate to `/about`
2. Verify: Page title "about" is shown (lowercase)
3. Verify: No body content appears

### 5. Stories — Index and Filters

1. Navigate to `/stories`
2. Verify: Stories are listed newest first with title, date, category, tags, TL;DR
3. Verify: Filter pills for length (all, short, long) and category (all, AI, Leadership, Conference, ISD) are visible
4. Click "short" — verify URL changes to `/stories/short` and only short stories appear
5. Click "AI" — verify URL changes to `/stories/ai` and only AI stories appear
6. Click "all" — verify it returns to the full stories index
7. Click a story title — verify the full story page loads with all fields

### 6. Add a New Story

1. Create `_posts/2026-07-25-test-story.md` with:
   ```yaml
   ---
   layout: story
   title: "Test Story"
   date: 2026-07-25
   length: short
   category: AI
   tags: [test]
   tldr: "This is a test story to validate the content model."
   ---
   Body content here.
   ```
2. Restart `bundle exec jekyll serve`
3. Verify: "Test Story" appears on the stories index and on `/stories/short` and `/stories/ai`
4. Verify: No other file changes were needed

### 7. Research Page

1. Navigate to `/research`
2. Verify: Research interests section with bullet list
3. Verify: Publications section grouped by status
4. Verify: Methods & tools section with list

### 8. Bookmarks — Index and Filters

1. Navigate to `/bookmarks`
2. Verify: Items displayed sorted by date (newest first) with title, type, tags, "why it matters", key takeaway, link
3. Verify: Type filter pills (all, paper, book, talk, tool, dataset, more) are visible
4. Click "paper" — verify only papers appear
5. Click "all" — verify all bookmarks return

### 9. Add a New Bookmark

1. Edit `_data/bookmarks.yml` and add a new entry
2. Restart `bundle exec jekyll serve`
3. Verify: New bookmark appears on the index and on its type filter page
4. Verify: No other file changes were needed

### 10. Contact Page

1. Navigate to `/contact`
2. Verify: Email link (mailto:) is present
3. Verify: LinkedIn link is present

### 11. Old Pages Removed

1. Navigate to `/blog` — verify 404
2. Navigate to `/portfolio` — verify 404
3. Navigate to `/projects` — verify 404
4. Navigate to `/curation` — verify 404

### 12. Mobile Responsiveness

1. Resize to 320px width
2. Verify: Hero, nav, filter pills, story items, bookmark items all render correctly
3. Verify: Filter pills wrap to multiple lines if needed
4. Verify: Mobile menu still works
