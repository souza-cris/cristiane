# Implementation Plan: Journey Storytelling and Usability

**Branch**: `005-journey-storytelling` | **Date**: 2026-07-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/005-journey-storytelling/spec.md`

## Summary

Turn the journey track from a decorative strip into something readable. Each stop becomes a native disclosure that expands to show the full title and description already recorded for that milestone, using `<details name="...">` so only one opens at a time with no script. The track becomes responsive — vertical and page-scrolled on phones, horizontal with CSS scroll shadows on wide screens. Badges become a uniform size, category gains a non-colour cue, and framing copy above the track names the throughline and derives the country count from the milestone data so it cannot drift.

## Technical Context

**Language/Version**: HTML5, CSS3, Liquid templating, Markdown, YAML

**Primary Dependencies**: Jekyll 4.4 (existing), liquid 4.0.4; no new dependencies

**Storage**: Filesystem — `_data/journey.yml` gains one optional field; no other data changes

**Testing**: `bundle exec jekyll build` for Liquid errors, HTTP checks against the local server, manual browser checks at narrow and wide widths, keyboard-only pass

**Target Platform**: GitHub Pages via GitHub Actions; modern evergreen browsers, mobile and desktop

**Project Type**: Static website — single page changed (`journey.md`) plus its include and stylesheet

**Performance Goals**: No new network requests; no JavaScript added; detail text is already in the page payload

**Constraints**: No build step, no npm, no plugins; must not reintroduce horizontal page overflow

**Scale/Scope**: 1 page, 1 include, 1 stylesheet section, 11 milestones

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity & Maintainability | ✅ Pass | Uses a native HTML element for the accordion instead of building one. Removes the per-stop badge-size interpolation from feature 004, so the include gets simpler, not more complex |
| II. Content as Data | ✅ Pass | The optional period joins the existing milestone record in `_data/`; framing copy lives in the page's content, and the country count is derived from the data rather than typed |
| III. GitHub Pages Compatibility | ✅ Pass | No plugins, no build step; everything is stock Liquid, HTML and CSS |
| IV. Performance & Accessibility | ✅ Pass | `<details>`/`<summary>` is keyboard and screen-reader native. Category stops relying on colour alone (FR-013). Layout adapts without script (FR-005), satisfying "responsive without relying on JavaScript" |
| V. Minimal JavaScript | ✅ Pass | No JavaScript added. The disclosure, the exclusive-open behaviour and the scroll affordance are all native or CSS |

**Post-design re-check**: still passing. The design added no script, no dependency and no plugin; it removed one piece of computed styling.

*No violations — Complexity Tracking omitted.*

## Project Structure

### Documentation (this feature)

```text
specs/005-journey-storytelling/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── journey-milestone.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Created by /speckit-tasks, not here
```

### Source Code (repository root)

```text
_data/journey.yml                  # Milestone records; gains optional `period`
_includes/journey-timeline.html    # Stops become <details>; badge sizing removed
journey.md                         # Framing copy; derived country count
assets/css/style.css               # Journey section: responsive track, scroll
                                   # shadows, uniform badges, category cue
```

**Structure Decision**: This is a static Jekyll site with no application source tree — the layered `src/`/`tests/` layouts in the template do not apply. The feature touches one data file, one include, one page and one stylesheet, matching the structure established by features 003 and 004. No new files are created.

## Phase 0: Research

See [research.md](research.md). Five questions were open; all are resolved:

1. How to expand a stop with one-open-at-a-time and no script → `<details name="journey">`
2. How to signal that the track continues past the edge, and stop signalling at the end → CSS scroll shadows via `background-attachment: local`
3. How an expanded stop should occupy space in a horizontal track → the open stop's column widens to a readable measure
4. How to distinguish category without colour → ring style plus the category named in the detail
5. Where the framing copy lives and how to keep the country count honest → page content, count derived from the data

## Phase 1: Design

- **[data-model.md](data-model.md)** — the milestone record with the new optional `period`, and the derived country count.
- **[contracts/journey-milestone.md](contracts/journey-milestone.md)** — the authoring contract for a milestone: which fields are required, which are optional, what renders where, and what must never render on the collapsed surface.
- **[quickstart.md](quickstart.md)** — how to run the validation scenarios that prove each user story.

### Rendering shape

Each stop becomes:

```text
<details name="journey">     ← grouped, so opening one closes the others
  <summary>                  ← badge, flag, label, org (the always-visible surface)
  <div class="…__detail">    ← full title, period if set, place, description
</details>
```

The always-visible surface keeps exactly what it shows today. Everything new lives inside the disclosure.

### Layout

| Width | Track | Rail | Detail |
|-------|-------|------|--------|
| Narrow | Vertical list, scrolls with the page | Vertical, at the left | Expands in flow beneath its summary |
| Wide | Horizontal, sideways scroll | Horizontal, behind the badges | Open column widens to a readable measure |

## Phase 2: Validation

- Build completes with no Liquid errors; every affected page loads locally.
- Detail text matches the milestone record; a milestone with an empty description expands with no empty block.
- Opening a second stop closes the first.
- Narrow viewport renders vertically and scrolls with the page; wide viewport shows the edge shadow only while stops remain past the edge.
- Keyboard alone can reach a stop, open it, read it, and scroll the track.
- No year appears on the always-visible surface. Note that detail content is present in the HTML even when collapsed, so this must be checked against the summary markup or visually — not by grepping the whole page.
