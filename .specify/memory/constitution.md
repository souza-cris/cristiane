<!--
Sync Impact Report
- Version change: 0.0.0 (template) → 1.0.0
- Added principles:
  - I. Simplicity & Maintainability
  - II. Content as Data
  - III. GitHub Pages Compatibility
  - IV. Performance & Accessibility
  - V. Minimal JavaScript
- Added sections:
  - Technology Constraints
  - Development Workflow
  - Governance
- Removed sections: none (initial adoption)
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no changes needed (Constitution Check is generic)
  - .specify/templates/spec-template.md — ✅ no changes needed
  - .specify/templates/tasks-template.md — ✅ no changes needed
- Follow-up TODOs: none
-->

# Cristiane Constitution

## Core Principles

### I. Simplicity & Maintainability

- All code MUST prefer clear, conventional patterns over clever solutions.
- Every change MUST be the simplest approach that solves the problem.
- YAGNI: features, abstractions, and configuration MUST NOT be added
  until there is a concrete, immediate need.
- Rationale: this is a personal site maintained by one person; complexity
  is the primary risk.

### II. Content as Data

- All user-facing content (blog posts, project descriptions, curation
  items) MUST live in Markdown files or Jekyll data files (`_data/`).
- Content MUST NOT be hardcoded in HTML templates or includes.
- Adding or editing content MUST NOT require touching layout or logic
  files.
- Rationale: the owner edits content frequently and must be able to do
  so without understanding HTML or Liquid internals.

### III. GitHub Pages Compatibility

- The site MUST build and deploy with standard GitHub Pages (Jekyll).
- Only GitHub Pages-supported plugins MUST be used unless there is an
  explicit, justified exception with a custom build workflow.
- No external build tools, bundlers, or CI pipelines are required for
  the default deploy path.
- Rationale: free hosting, zero-ops deployment, and a simple `git push`
  workflow.

### IV. Performance & Accessibility

- Pages MUST be fast-loading, mobile-friendly, and meet basic
  accessibility standards (semantic HTML, alt text, sufficient contrast).
- Layouts MUST be responsive without relying on JavaScript for core
  layout or navigation.
- Images MUST be appropriately sized and use descriptive alt attributes.
- Rationale: the site serves a broad audience on varying devices and
  connections.

### V. Minimal JavaScript

- JavaScript MUST NOT be added unless there is a clear, documented need
  that cannot be met with HTML and CSS alone.
- When JavaScript is used, it MUST be small, inline or in a single file,
  and MUST NOT require a build step or npm dependencies.
- Rationale: every script adds maintenance burden and potential
  accessibility or performance issues.

## Technology Constraints

- **Static site generator**: Jekyll (GitHub Pages default version).
- **Hosting**: GitHub Pages (free tier).
- **Templating**: Liquid.
- **Styling**: Plain CSS (no preprocessor required unless complexity
  justifies it).
- **Content format**: Markdown (posts, pages) and YAML (`_data/` files).
- **Local testing**: `bundle exec jekyll serve`.

## Development Workflow

- Always test locally with `bundle exec jekyll serve` before pushing.
- Commits SHOULD be small and focused on a single change.
- Explain what was changed and why in commit messages and when
  communicating changes, using plain language — the project owner is new
  to web development.
- When making changes, describe the purpose and effect of each
  modification so the owner can learn as the project evolves.

## Governance

- This constitution supersedes ad-hoc decisions. All changes to the site
  MUST be checked against these principles.
- Amendments to this constitution require updating this file, bumping
  the version, and noting the rationale.
- Complexity that violates a principle MUST be justified in writing
  before implementation.

**Version**: 1.0.0 | **Ratified**: 2026-07-25 | **Last Amended**: 2026-07-25
