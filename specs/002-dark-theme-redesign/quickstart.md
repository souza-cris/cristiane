# Quickstart: Dark Theme Redesign

**Date**: 2026-07-25

## Prerequisites

- Ruby 3.1–3.3 installed (Jekyll 4.4 requirement)
- Bundler installed
- A WCAG contrast checker (e.g., WebAIM Contrast Checker at webaim.org/resources/contrastchecker/)

## Setup

```bash
bundle exec jekyll serve
```

Open `http://localhost:4000/cristiane/` in a browser.

## Validation Scenarios

### 1. Dark Palette Consistency

1. Visit each page: Home (`/`), Portfolio (`/portfolio`), Projects (`/projects`), Blog (`/blog`), Curation (`/curation`), 404 (`/nonexistent`)
2. Verify: every page has a dark background, off-white text, and blue accent links
3. Verify: no page shows any remnant of the old light theme (white backgrounds, dark text on light)

### 2. Typography

1. On the home page: verify the site title and nav labels are monospace
2. On the blog index: verify dates are monospace, post titles are monospace (headings), and excerpts are sans-serif
3. On a project detail page: verify tool chips are monospace with pill/tag styling
4. On any page: verify body paragraphs are sans-serif and comfortable to read

### 3. WCAG AA Contrast

Test these combinations with a contrast checker:

| Foreground | Background | Expected Ratio | Requirement |
|------------|------------|-----------------|-------------|
| `#e6edf3`  | `#0d1117`  | ~13.5:1         | ≥ 4.5:1 (AA normal text) |
| `#58a6ff`  | `#0d1117`  | ~5.8:1          | ≥ 4.5:1 (AA normal text) |
| `#8b949e`  | `#0d1117`  | ~4.6:1          | ≥ 4.5:1 (AA normal text) |

### 4. Keyboard Focus

1. Open any page and press Tab repeatedly
2. Verify: each link, nav item, and interactive element shows a clearly visible blue outline when focused
3. Verify: focus moves through all nav items, then through page content links

### 5. Code Blocks and Content Elements

1. View a blog post that contains a fenced code block
2. Verify: code block has a visually distinct background from the page
3. Verify: inline code has a subtle background tint
4. If a blockquote exists: verify it has a left border accent

### 6. Mobile Responsiveness

1. Resize browser to 320px width (or use device emulation)
2. Verify: dark theme renders correctly, no horizontal overflow
3. Verify: mobile menu (details/summary) still opens and closes
4. Verify: nav links are readable and tappable on mobile

### 7. Performance

1. Open browser DevTools → Network tab
2. Reload any page
3. Verify: no new external requests (fonts, frameworks, scripts)
4. Verify: total page load is comparable to before the redesign
