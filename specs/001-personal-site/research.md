# Research: Personal Website

**Date**: 2026-07-25

## Summary

No NEEDS CLARIFICATION items existed in the Technical Context. The technology stack is fully determined by the project constitution (Jekyll, GitHub Pages, plain CSS, no JavaScript). Research focused on confirming best practices for the chosen approach.

## Decisions

### 1. Jekyll Theme Approach

- **Decision**: Build a custom minimal layout from scratch (no theme gem)
- **Rationale**: Theme gems add a dependency and hide layout files, making it harder for a beginner to understand and modify. A custom layout with a few files in `_layouts/` and `_includes/` is simpler and more transparent.
- **Alternatives considered**: Minima (default Jekyll theme) — rejected because overriding its styles requires understanding gem-based theme internals, which conflicts with the simplicity principle.

### 2. Projects as a Jekyll Collection

- **Decision**: Use a Jekyll collection (`_projects`) with individual Markdown files per project
- **Rationale**: Collections are a built-in Jekyll feature. Each project gets its own `.md` file with front matter (title, description, images, links, tools), and Jekyll auto-generates detail pages. Adding a project = adding a file, matching the content-as-data principle.
- **Alternatives considered**: Using `_data/projects.yml` — rejected because YAML entries cannot have rich Markdown body content or auto-generated detail pages without extra templating complexity.

### 3. Curation Items as a Data File

- **Decision**: Use `_data/curation.yml` with items grouped by category
- **Rationale**: Curation items are short (title, URL, note, category) and do not need individual pages. YAML is the right fit — simple to edit, and Liquid can loop and group by category natively.
- **Alternatives considered**: Individual Markdown files — rejected because curation items are too small for individual pages and the overhead of one file per item is unnecessary.

### 4. Mobile Navigation Without JavaScript

- **Decision**: Use a CSS-only responsive navigation pattern
- **Rationale**: Constitution principle V prohibits JavaScript unless HTML/CSS cannot solve the need. CSS-only mobile navigation (using `<details>`/`<summary>` or a checkbox toggle) works in all modern browsers and is accessible.
- **Alternatives considered**: JavaScript hamburger menu — rejected per constitution; always-visible stacked links — viable fallback if CSS-only toggle proves too complex, but `<details>` is simpler.

### 5. Blog Excerpts

- **Decision**: Use Jekyll's built-in excerpt feature (first paragraph of post)
- **Rationale**: Jekyll automatically extracts the first paragraph as `post.excerpt`. No configuration or manual excerpt writing needed. Cristiane just writes the post and the index shows the first paragraph.
- **Alternatives considered**: Manual excerpt in front matter — rejected because it adds friction to the content workflow.

### 6. Profile Links and Site Metadata

- **Decision**: Store in `_config.yml` under custom keys
- **Rationale**: Profile links (GitHub, LinkedIn) and site metadata (name, description, photo path) change rarely. `_config.yml` is the conventional place for site-wide settings in Jekyll.
- **Alternatives considered**: `_data/profile.yml` — viable but adds an extra file for data that naturally belongs in site config.

### 7. Styling Approach

- **Decision**: Single plain CSS file (`assets/css/style.css`)
- **Rationale**: Constitution mandates plain CSS. A single file is sufficient for a 5-page personal site and avoids the complexity of preprocessors, multiple files, or CSS frameworks.
- **Alternatives considered**: Sass (Jekyll supports it natively) — acceptable but unnecessary complexity for this scope; CSS framework (Bootstrap, Tailwind) — rejected per simplicity principle.
