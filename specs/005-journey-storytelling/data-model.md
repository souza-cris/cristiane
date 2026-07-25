# Data Model: Journey Storytelling and Usability

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

## Changes at a glance

| Change | Entity | Detail |
|--------|--------|--------|
| New optional field | Milestone | `period` — a year or range, shown only inside the expanded detail |
| Newly rendered | Milestone | `title` and `note` already exist and were never displayed; they become the detail content |
| New derived value | Journey framing | Country count, computed from distinct milestone flags |

No field is removed and no existing value changes, so the current `_data/journey.yml` remains valid as written.

## Entities

### Milestone

One stop on the journey track. A list entry in `_data/journey.yml`, ordered oldest first.

| Field | Required | Surface | Description |
|-------|----------|---------|-------------|
| `category` | Yes | Collapsed + detail | `academia` or `industry`. Drives ring colour **and** ring style; named in words in the detail |
| `label` | Yes | Collapsed | Short line on the track — a few words |
| `org` | Yes | Collapsed | School, company or community |
| `short` | Yes | Collapsed | 1–3 letters shown in the circle when no logo is set |
| `logo` | Yes | Collapsed | Filename under `assets/img/logos/`, or `""` for the initials fallback |
| `flag` | Yes | Collapsed | Country flag emoji; also the source of the derived country count |
| `place` | Yes | Collapsed (label) + detail | City, country. Accessible label for the flag; shown as text in the detail |
| `title` | No | **Detail only** | Full title of the role or degree. Was stored but never rendered |
| `note` | No | **Detail only** | The substance of the milestone. Was stored but never rendered |
| `period` | No | **Detail only** | **New.** Year or range, e.g. `"2019–2022"`. Empty for now by decision |

**Validation rules**

- `period` MUST NOT render on the collapsed surface (FR-010). It appears only inside the disclosure.
- An empty `note`, `title` or `period` MUST render nothing at all — no empty element, no stray punctuation, no label with a blank value (FR-004).
- `category` MUST be `academia` or `industry`; an unrecognised value gets the default ring and no category name rather than breaking the layout.
- Field order in the file is irrelevant; entry order is the story order and MUST be preserved.

**Removed behaviour**

- The per-stop badge diameter derived from list position in feature 004 is withdrawn (FR-012). Badge size becomes a single constant; the brightening rail remains the progression cue. Nothing in the data file changes as a result — the derivation lived in the include.

### Journey framing

The copy above the track. Lives in the body of `journey.md`, not in a data file.

| Value | Source | Description |
|-------|--------|-------------|
| Tagline | Page content | Existing line: "from industry to academia. continuously improving." |
| Throughline | Page content | Sentence connecting the career arc to the research focus (FR-008) |
| Geography | Page content + derived count | Names the multi-country path (FR-009) |
| Country count | **Derived** | Number of distinct `flag` values across all milestones |

**Derivation**: the count is computed at build time from the distinct flags in the milestone list. Adding or removing a milestone in a new country corrects the sentence automatically — this is what closes the drift edge case in the spec. Continent count is **not** derivable from the current fields and is therefore not stated.

## Relationships

```
_data/journey.yml  ──entry order──▶  left-to-right (or top-down) sequence on the track
                   ──category────▶  ring colour + ring style + category name in detail
                   ──logo────────▶  assets/img/logos/<file>
                   ──flag────────▶  per-stop flag  +  distinct count for the geography line
                   ──title/note/period──▶  detail content, never the collapsed surface
```

## Adding a period later

Add one line to any milestone:

```yaml
  period: "2019–2022"
```

It appears the next time the site builds, inside that stop's detail only. No template change is needed — the slot is built in this feature and simply renders nothing while the field is empty.
