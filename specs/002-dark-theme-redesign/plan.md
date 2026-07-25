# Implementation Plan: Dark Theme Redesign

**Branch**: `002-dark-theme-redesign` | **Date**: 2026-07-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-dark-theme-redesign/spec.md`

## Summary

Redesign the existing personal website with a dark, techy aesthetic by rewriting the CSS stylesheet and making minimal layout/include adjustments. No structural, content, or JavaScript changes. The result is a single fixed dark theme with monospace developer typography, one consistent accent color (`#58a6ff`), and WCAG AA accessible contrast.

## Technical Context

**Language/Version**: CSS3, HTML5 (Liquid template adjustments only for class names if needed)

**Primary Dependencies**: None new — existing Jekyll site, system font stacks

**Storage**: N/A (CSS-only change)

**Testing**: Visual inspection via `bundle exec jekyll serve`; WCAG contrast checker for color validation

**Target Platform**: GitHub Pages (static hosting, all browsers)

**Project Type**: Static website (visual-only change)

**Performance Goals**: No regression — pages still load under 3 seconds on mobile

**Constraints**: No JavaScript, no external CSS frameworks, no custom font files, no prebuilt themes

**Scale/Scope**: Single CSS file rewrite + minor layout/include markup adjustments

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity & Maintainability | ✅ Pass | Single CSS file, system font stacks, no new dependencies |
| II. Content as Data | ✅ Pass | No content changes — purely visual |
| III. GitHub Pages Compatibility | ✅ Pass | No new plugins, build tools, or dependencies |
| IV. Performance & Accessibility | ✅ Pass | WCAG AA contrast required; responsive layout preserved; no JS |
| V. Minimal JavaScript | ✅ Pass | Zero JavaScript — CSS-only theme |

No violations. No complexity justifications needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-dark-theme-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output (color/typography decisions)
├── quickstart.md        # Phase 1 output (validation guide)
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

No data-model.md or contracts/ — not applicable for a CSS-only visual redesign.

### Files Modified (repository root)

```text
assets/css/style.css     # Full rewrite — dark palette, typography, code blocks
_includes/head.html      # Add meta theme-color for mobile browsers
```

No new files created. No files deleted. No structural changes.

**Structure Decision**: This feature modifies existing files only. The CSS file (`assets/css/style.css`) is fully rewritten with the dark theme. The `head.html` include gets a `<meta name="theme-color">` tag. Layout and include files retain their existing HTML structure and behavior.
