<!--
Sync Impact Report
- Version change: 1.0.0 → 2.0.0
- Bump rationale: MAJOR. Principle II is broadened from "user-facing content" to
  cover any repeated structure, including navigation. Markup that was compliant
  under 1.0.0 is not compliant under 2.0.0, which is a backward-incompatible
  redefinition. The site was brought into compliance in the same change rather
  than carrying a deviation.
- Modified principles (no renames):
  - II. Content as Data — extended to repeated structure; a per-entry rule now
    belongs in the data file as a value, not as branching in a template
  - IV. Performance & Accessibility — meaning must not rest on colour alone;
    visually hidden content must be hidden from assistive technology too;
    assets must be self-hosted
  - V. Minimal JavaScript — prefer native elements over scripted equivalents;
    verify native behaviour in a real browser rather than assuming it
- Added sections:
  - Governance → Specifying before building
  - Governance → Amending a shipped decision
  - Governance → Taste is not a requirement
  - Governance → Recording a deviation
- Removed sections: none
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no changes needed (Constitution Check
    delegates gates to this file; Complexity Tracking already covers deviations)
  - .specify/templates/spec-template.md — ✅ no changes needed
  - .specify/templates/tasks-template.md — ✅ no changes needed
  - README.md — ✅ updated (spec index note, structure, authoring instructions)
  - CLAUDE.md — ✅ updated (sections and social data files, config is not content)
  - specs/008-side-navigation/ — ✅ updated (deviation resolved, not recorded)
- Code brought into compliance in the same change (II):
  - _data/sections.yml + _includes/section-links.html — the navigation list was
    written twice as markup, in nav.html and side-nav.html. Now one list, one
    include, both navigations
  - _data/social.yml — the footer hardcoded three social links while _config.yml
    carried an unread copy of the same three. Editing the obvious place changed
    nothing. Now one list, read by the footer; icon drawings stay in the include
    because a drawing is not content
- Follow-up TODOs:
  - contact.md repeats the LinkedIn URL in prose. Left as written: it is the
    owner's own sentence in a Markdown content file, which is where content
    belongs, and threading Liquid through it would make the file harder to edit —
    the opposite of what Principle II is for.
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
- This applies to repeated structure as well as prose. Navigation labels,
  section names, and any list rendered on more than one surface MUST live
  in `_data/` and be rendered from it.
- Where entries in such a list behave differently from one another, that
  difference MUST be expressed as a value in the data file, not as
  branching in the template. A template MAY act on that value; it MUST
  NOT carry the list's knowledge of itself.
- The same list MUST NOT be written out in two places. If two surfaces
  show it, they render from the same data through the same include.
- Rationale: the owner edits content frequently and must be able to do so
  without understanding HTML or Liquid internals. Two copies of a list
  are two chances to disagree, and the copy nobody remembers is the one
  that goes stale.

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
- Meaning MUST NOT be carried by colour alone. Any state or category
  distinguished by colour MUST also be distinguishable without it — by
  shape, border, position, or text.
- Content that is visually hidden MUST also be hidden from assistive
  technology and removed from the tab order, unless it is deliberately
  offered to screen readers only.
- All assets MUST be committed to this repository and served from it.
  The site MUST NOT request fonts, scripts, styles, or images from an
  external host.
- Rationale: the site serves a broad audience on varying devices and
  connections. Self-hosting also means no third party observes who reads
  this site.

### V. Minimal JavaScript

- JavaScript MUST NOT be added unless there is a clear, documented need
  that cannot be met with HTML and CSS alone.
- When JavaScript is used, it MUST be small, inline or in a single file,
  and MUST NOT require a build step or npm dependencies.
- Where a native HTML element already provides the behaviour, that element
  MUST be used rather than a scripted equivalent.
- When a feature depends on native browser behaviour that is not obvious
  from the markup, that behaviour MUST be verified in a real browser
  before the feature is considered complete. Reasoning about the
  specification is not sufficient evidence.
- Rationale: every script adds maintenance burden and potential
  accessibility or performance issues. A native element that is assumed
  to behave a certain way, and does not, is a bug that reaches visitors.

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
- Claims about what the built site does MUST be checked against the built
  site, not inferred from the source. What was verified, and what was not,
  MUST be stated plainly.

## Governance

- This constitution supersedes ad-hoc decisions. All changes to the site
  MUST be checked against these principles.
- Amendments to this constitution require updating this file, bumping
  the version, and noting the rationale.
- Complexity that violates a principle MUST be justified in writing
  before implementation.

### Specifying before building

- Features SHOULD be specified before they are built, using the Spec Kit
  flow under `specs/`.
- When a feature is built first and specified afterwards, its spec MUST
  say so. A retrospective spec MUST NOT be written as though it had
  constrained the work, because every requirement in it is known to be
  satisfiable and that is a weaker guarantee than a spec written ahead.

### Amending a shipped decision

- When a decision recorded in a shipped spec is later reversed, the
  original requirement MUST be left in place and marked superseded or
  amended, with a pointer to what replaced it and why.
- Superseded requirements MUST NOT be silently edited to match current
  behaviour, and completed task lists MUST NOT be rewritten. Follow-on
  work is appended.
- Rationale: the value of these documents is the reasoning, not the
  description. A spec quietly edited to agree with the code records no
  decision at all, and the next person repeats the argument.

### Taste is not a requirement

- Editorial and aesthetic choices about the owner's own content — what to
  show, what to leave out, how much to say — belong to the owner and MUST
  be recorded as decisions with their reasoning, not as prohibitions.
- Such a choice MUST NOT be written as a MUST NOT requirement. Changing
  one is a content decision, and it MUST NOT put the site in violation of
  its own specification.
- Worked example: showing years on the journey track. Feature 004 recorded
  "Milestone years MUST NOT be displayed" and feature 005 built a period
  field on the condition that the track stay year-free. Both were taste,
  written as prohibitions. When the owner later wanted years on the track
  — a reasonable change of mind about her own history — a two-word content
  edit required superseding notes in two separate specs. The decision was
  sound; recording it as a prohibition was the mistake.
- Requirements MUST be reserved for things that would be broken if
  violated: accessibility, correctness, privacy, the ability to deploy.

### Recording a deviation

- A deviation from a principle MUST be recorded in the feature's plan, in
  the Constitution Check table, and MUST state the cost of the deviation
  and the condition that would reverse it.
- A deviation without a named reversal condition is a violation, not a
  deviation.
- A principle MUST NOT be loosened in order to make existing code
  compliant. If the code and the principle disagree, either the code
  changes or the principle changes on its own merits — never the latter
  as a way of avoiding the former.

**Version**: 2.0.0 | **Ratified**: 2026-07-25 | **Last Amended**: 2026-07-25
