# Data Model: Journey Timeline and List Search

**Date**: 2026-07-25

## Entities

### Milestone

One stop on the journey track. Stored in `_data/journey.yml` as a list, oldest first — the order in the file is the order on the page.

| Field | Required | Description |
|-------|----------|-------------|
| `category` | Yes | `academia` or `industry`; sets the ring colour |
| `label` | Yes | Short line shown on the track — a few words |
| `org` | Yes | School, company or community |
| `short` | Yes | 1–3 letters shown in the circle when no logo file is set |
| `logo` | Yes | Filename under `assets/img/logos/`, or `""` for the initials fallback |
| `flag` | Yes | Country flag emoji |
| `place` | Yes | City, country — also the flag's accessible label |
| `title` | No | Longer form of the label; **not displayed** |
| `note` | No | Longer description; **not displayed** |

**Derived at render time**: badge diameter, interpolated from the entry's position across the list (2.6rem at the first stop to 4.2rem at the last).

**Rules**:
- Years MUST NOT appear in any displayed field.
- `title` and `note` are retained for a possible future detail view; the track ignores them.

### Story

A Markdown file in `_posts/`. Changed in this feature: `keywords` replaces the previous single-value `category` and `length` fields.

| Field | Required | Description |
|-------|----------|-------------|
| `layout` | Yes | Always `story` |
| `title` | Yes | Story title |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `keywords` | Yes | List of filter slugs, e.g. `[short, ai]` |
| `tags` | No | Free-form tags, unrelated to filtering |
| `tldr` | Yes | 1–2 sentence summary |

**Permalink**: `/stories/:year/:month/:day/:title/`, set in `_config.yml`.

**Rules**:
- Every entry in `keywords` SHOULD match a `slug` in `_data/story_keywords.yml`; an unmatched slug still renders, falling back to the raw slug as its label.
- A story appears on the filter page of every keyword it carries.

### Story keyword

A filter pill on the stories page. Stored in `_data/story_keywords.yml`.

| Field | Required | Description |
|-------|----------|-------------|
| `slug` | Yes | Matches the values used in a story's `keywords` |
| `label` | Yes | Text shown on the pill |

Current values: `short`, `ai`, `leadership`, `conference`, `isd`.

### Bookmark type

A filter pill on the bookmarks page. Stored in `_data/bookmark_types.yml`.

| Field | Required | Description |
|-------|----------|-------------|
| `slug` | Yes | Matches `type` in `_data/bookmarks.yml` |
| `label` | Yes | Text shown on the pill |
| `empty` | Yes | Message shown when nothing matches |

Current values: `paper`, `book`, `talk`, `tool`, `dataset`, `more`.

### Publication

Stored in `_data/research.yml`. Simplified in this feature: the `status` field and its published / in progress / under review groupings were removed, because the real entries ("accepted for presentation", "presented", theses) did not fit those labels.

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Publication title |
| `authors` | Yes | Author list as written |
| `venue` | Yes | Venue and status, e.g. `AMCIS 2026 (accepted for presentation)` |
| `link` | Yes | URL, or `""` to render the title as plain text |

`interests` in the same file is a single prose paragraph, not a list.

## Relationships

```
_data/story_keywords.yml  --slug-->  _posts/*.md keywords[]  -->  stories/<slug>.md
_data/bookmark_types.yml  --slug-->  _data/bookmarks.yml type  -->  bookmarks/<slug>.md
_data/journey.yml         --logo-->  assets/img/logos/<file>
```

## Adding a filter

Two steps, by design — Jekyll cannot generate pages from data without a plugin, and GitHub Pages will not run one:

1. Add the slug and label to the relevant data file.
2. Copy an existing page in `stories/` or `bookmarks/` and change the slug in its permalink, its front matter, and its empty-state message.
