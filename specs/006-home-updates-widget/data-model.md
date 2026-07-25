# Data Model: Home Page Updates Widget

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

## Entities

### Update

One featured item in the widget. A list entry in `_data/updates.yml`. This feature owns it.

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | `publication`, `story`, `bookmark`, or any other word. Rendered as the pill label exactly as written |
| `title` | Yes | What the entry is called. Becomes the link text when a link is present |
| `date` | Yes | Year-month-day, e.g. `2026-07-25`. Used for ordering and shown to the visitor |
| `link` | No | Internal path (`/stories/…`) or external URL (`https://…`). Omit for a plain-text entry |
| `blurb` | No | One line of context. Omit and nothing renders |
| `active` | No | Only `false` does anything — it hides the entry while keeping it in the file. Absent means visible |
| `pinned` | No | `true` promotes the entry above the rest, regardless of date |

### Validation rules

- **Visibility**: an entry renders unless it carries an explicit `active: false`. A missing `active` key means visible — see decision 4 in [research.md](research.md).
- **Ordering**: visible entries sort by `date`, newest first; entries with `pinned: true` are promoted ahead of the rest, keeping date order within each group.
- **Limit**: after ordering, only the first `updates_limit` entries render. Entries beyond it are silently dropped — that is the intended "old entries fall off" behaviour, not a truncation error.
- **Links**: a `link` containing `://` is external and opens in a new tab with `rel="noopener"`. Anything else is an internal path and is passed through `relative_url` so it resolves under the site's base path. No link renders the title as plain text.
- **Empty optionals** render nothing at all — no empty blurb element, no empty link.
- **Unknown `type`** renders its own string as the label with the base pill style. It never fails the build.
- **Required fields are an authoring obligation.** An entry with no `title` or no `date` is an error in the record; the widget does not defend against it, because such an entry could not be ordered or displayed meaningfully.

### Widget settings

| Setting | Where | Default | Description |
|---------|-------|---------|-------------|
| `updates_limit` | `_config.yml` | `4` | How many entries appear at once |

The default lives in the include, so the widget works correctly whether or not the setting exists. Note that Jekyll reads `_config.yml` at startup — changing this locally needs a server restart, not just a rebuild.

### Study call (borrowed — owned by feature 007)

The widget reads the study record and calls 007's callout include. It **owns none of this** and never copies study text.

| What | Where | This feature's use |
|------|-------|--------------------|
| Study record | `_data/study.yml` | Read `active` only, to decide whether the widget has anything to show |
| Callout markup | `_includes/study-callout.html` | Called with `variant="compact"`; it gates itself |

Per 007's contract, the compact variant shows the title, the `summary` (falling back to `description`), the deadline when set, and the action — and never eligibility or what's involved.

## Render decision

```
visible_entries = updates, minus active:false, ordered, limited
study_active    = study record exists AND study.active

if visible_entries is empty AND study_active is false
    → render nothing at all: no section, no heading
else
    → render the section and heading
      → the entry list, only if visible_entries is non-empty
      → the compact study callout, which gates itself
```

Both inputs are resolved before the heading is emitted. This is what makes FR-010 achievable — see decision 6 in [research.md](research.md).

## Relationships

```
_data/updates.yml  ──active?──▶  drop explicit false
                   ──date─────▶  sort newest first
                   ──pinned───▶  promote ahead of the rest
                   ──(limit)──▶  site.updates_limit, default 4
                   ──type─────▶  pill label + modifier class
                   ──link─────▶  external as-is / internal via relative_url / none → plain text

_data/study.yml    ──active──▶   whether the widget has anything to show   (read-only, 007 owns)
_includes/study-callout.html ──variant: "compact"──▶ the recruiting callout (called, 007 owns)
```

## Not in this model

- **No aggregation.** Entries are written by hand and do not read from `_posts/` or the bookmarks. The duplication is the deliberate cost of curation, recorded in the spec.
- **No archive.** Entries pushed past the limit are simply not shown; there is no "older updates" page.
- **No study content.** Not one field of the study is defined here.
