# Research: Content Restructure

**Date**: 2026-07-25

## Summary

No NEEDS CLARIFICATION items in the technical context. Research focused on best approaches for static filter pages, data modeling for bookmarks/research, and the stories-to-posts mapping.

## Decisions

### 1. Stories Using `_posts/` Directory

- **Decision**: Reuse Jekyll's built-in `_posts/` directory for stories with enriched front matter (length, category, tags, tldr)
- **Rationale**: `_posts/` gives us date-based naming, automatic reverse-chronological sorting, and permalink generation for free. The new front matter fields (length, category, tags, tldr) are simply additional YAML — Jekyll passes them through without issue.
- **Alternatives considered**: A custom `_stories` collection — viable but adds config complexity and loses the built-in `_posts` features (date parsing, sorting). Since stories replace blog posts 1:1, reusing `_posts` is simpler.

### 2. Static Filter Pages for Stories

- **Decision**: One Markdown page per filter value under `stories/` directory. Each page uses Liquid to loop over `site.posts` and filter by the relevant front matter field.
- **Rationale**: Zero JavaScript. Each filter page is a standalone page with a Liquid `where` filter (e.g., `{% assign filtered = site.posts | where: "category", "AI" %}`). The stories index (`stories.md`) links to each filter page as pill-styled navigation.
- **Alternatives considered**: JavaScript filtering — rejected per constitution. Jekyll plugin for auto-generating filter pages — rejected because custom plugins break GitHub Pages compatibility.

### 3. Static Filter Pages for Bookmarks

- **Decision**: One Markdown page per type filter under `bookmarks/` directory. Each page uses Liquid to loop over `site.data.bookmarks` and filter by type.
- **Rationale**: Same pattern as stories filters. Consistent UX. YAML data files are easy to filter with Liquid's `where` filter.
- **Alternatives considered**: Tag-based filter pages — deferred. Tags are multi-value and would require a page per tag, which could grow large. For v1, type-only filtering is sufficient.

### 4. Research Page Data Source

- **Decision**: Use `_data/research.yml` for structured data (interests, publications with status grouping, methods) and render via Liquid on `research.md`
- **Rationale**: Research content has clear structure (lists, grouped items) that maps well to YAML. Editing research entries means editing a data file, not touching the page layout — consistent with content-as-data principle.
- **Alternatives considered**: Pure Markdown page — viable for a first pass but makes it harder to group publications by status programmatically. Data file is cleaner.

### 5. Bookmarks Data File

- **Decision**: Use `_data/bookmarks.yml` as a flat list of entries, each with title, type, topicTags, whyItMatters, keyTakeaway, link, addedDate, and optional source
- **Rationale**: YAML is the right fit for structured, uniform entries. Liquid can sort by `addedDate` and filter by `type`. Adding a bookmark = adding a YAML entry.
- **Alternatives considered**: Individual Markdown files per bookmark — rejected because bookmarks are short structured entries, not long-form content requiring Markdown bodies.

### 6. Footer Icons

- **Decision**: Use inline SVG icons for LinkedIn, Google Scholar, and GitHub in the footer. Small, self-contained, no external icon library.
- **Rationale**: Inline SVG adds ~1KB total, loads instantly, scales to any size, matches the dark theme colors via CSS `fill`. No external requests, no icon font dependencies.
- **Alternatives considered**: Text-only labels — functional but less polished. Icon font library (Font Awesome) — rejected per simplicity principle (adds large dependency for 3 icons).

### 7. Filter UI Pattern

- **Decision**: Filter pills rendered as a row of links at the top of the stories and bookmarks pages. The current page's filter is highlighted with the accent color. "all" links back to the main index.
- **Rationale**: Simple, accessible, no JavaScript. Each pill is an `<a>` tag linking to the corresponding filter page. `aria-current="page"` marks the active filter.
- **Alternatives considered**: Dropdown select — requires JavaScript to navigate on change. Tabs — semantically appropriate but adds complexity for a static site.

### 8. Story Layout vs Post Layout

- **Decision**: Create a new `story.html` layout that extends `default.html`. It displays title, date, category, tags, TL;DR block, body, optional citation, and "what I'm exploring next" section. Remove the old `post.html` layout.
- **Rationale**: The story layout has more fields than a simple blog post (TL;DR, citation, exploring next). A dedicated layout keeps the template clean.
- **Alternatives considered**: Extend the existing `post.html` — viable but the field set is different enough to warrant a clean layout rather than conditional blocks.
