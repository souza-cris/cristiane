# Contract: Update Record and Widget

**Date**: 2026-07-25 | **Feature**: [../spec.md](../spec.md)

Two contracts. The **authoring contract** is between the author and the site: what goes in `_data/updates.yml` and what the widget guarantees. The **dependency contract** is what this feature relies on from feature 007 — stated here so a future change to 007 can see what it would break.

---

## 1. Authoring contract — `_data/updates.yml`

A plain top-level list. Order in the file does not matter; date and pinning decide what appears.

```yaml
- type: publication          # required — also the pill label, any word works
  title: "…"                 # required — link text when a link is present
  date: 2026-07-25           # required — year-month-day, orders and displays
  link: "/research/"         # optional — internal path or external URL
  blurb: "…"                 # optional — one line of context
  active: false              # optional — only `false` does anything
  pinned: true               # optional — promotes above the rest
```

### Guarantees

**What appears**

- Entries render unless they carry `active: false`. Omitting `active` means visible.
- Ordering is newest-first by `date`, with `pinned: true` entries promoted ahead of the rest.
- Only the first `updates_limit` entries render — four by default. Older entries fall off on their own as new ones are added.

**Links**

- A `link` containing `://` is treated as external: rendered as written, opening in a new tab with `rel="noopener"`.
- Anything else is an internal path, resolved against the site's base path — write `/stories/`, not `/cristiane/stories/`.
- No `link` renders the title as plain text, not a dead link.

**Types**

- The `type` string is the label, shown as written.
- A type with no styling rule of its own still renders, with the default pill style. An unfamiliar type never fails the build.

**Empty fields**

- Omitting `blurb` renders nothing — no empty element, no stray spacing.

**The empty state**

- With no visible entries and no active study, the widget renders nothing at all: no section, no heading, no container.

### Author obligations

- Supply `type`, `title` and `date` on every entry. An entry without a date cannot be ordered.
- Write `date` as year-month-day. Other formats will sort wrongly.
- Write internal links as site-root paths (`/stories/…`), leaving the base path to the site.
- Keep `blurb` to roughly one line — it sits under the hero on a phone.
- Remember this file is curated by hand: featuring a story here does not create it, and editing a story does not update this entry.

### What the widget does not do

- It does not read `_posts/` or the bookmarks. Nothing is aggregated automatically.
- It does not define any study content.

---

## 2. Dependency contract — what this feature needs from feature 007

This feature is a **consumer**. It reads and calls; it owns nothing here.

| Depends on | Owned by | Used for |
|------------|----------|----------|
| `_data/study.yml` → `active` | 007 | Deciding whether the widget has anything to show |
| `_includes/study-callout.html` | 007 | Rendering the recruiting callout |
| `variant="compact"` | 007 | Selecting the short form |
| Include self-gating | 007 | Calling it unconditionally, with no surrounding test |
| Single root element | 007 | Placing it inside the widget section without wrapper markup |

### What would break this feature

Any of these changes in 007 requires a coordinated change here:

- Removing or renaming the `compact` variant.
- Making the callout stop gating itself on `active`.
- Renaming the study record, or the `active` field within it.
- Emitting more than one root element, or requiring wrapper markup.

### What this feature must never do

- Copy study text into `_data/updates.yml` or into the widget markup. The study has exactly one source.
- Add an update entry that duplicates the call for participants. The callout is surfaced, not listed.
- Edit `_data/study.yml` or `_includes/study-callout.html`.
