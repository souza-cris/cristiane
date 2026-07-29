# Contract: Journey Milestone

**Date**: 2026-07-25 | **Feature**: [../spec.md](../spec.md)

The journey page has no API. Its external interface is the **authoring contract**: what the author writes in `_data/journey.yml` and what the page guarantees to do with it. This document is the agreement between the two.

## Record shape

```yaml
- category: industry          # required — "academia" or "industry"
  label: "Lead Agile Coach"   # required — short line on the track
  org: "HelloFresh"           # required — organization name
  short: "HF"                 # required — initials fallback for the circle
  logo: "hellofresh.png"      # required — filename, or "" for initials
  flag: "🇩🇪"                  # required — country flag emoji
  place: "Berlin, Germany"    # required — city, country
  title: "Lead Agile Coach"   # optional — full title, detail only
  note: "Built and managed…"  # optional — the substance, detail only
  period: "2022–2023"         # optional — year or range, detail only
```

## Guarantees

**Order**

- Entries render in file order, oldest first. The page never re-sorts.

**Collapsed surface** — what every visitor sees without interacting:

- Shows exactly: badge (logo or initials), flag, `label`, `org`.
- Shows nothing from `title`, `note` or `period`.
- Contains no year, ever.

**Expanded detail** — revealed on activating a stop:

- Shows `title`, `period`, `place` and `note`, each omitted entirely when empty.
- Opening one stop closes any other open stop.
- Works without JavaScript.

**Category**

- `academia` and `industry` each get a distinct ring color **and** a distinct ring style, and the category is named in words inside the detail. A visitor who cannot distinguish the colors can still tell them apart.
- An unrecognized value renders with the default ring and no category name. It does not break the layout.

**Badges**

- Every badge is the same size, regardless of position. Position is conveyed by the rail, not by size.

**Assets**

- `logo` resolves under `assets/img/logos/`. Files are committed to the repository; the page requests nothing from an external host.
- An empty `logo` falls back to `short` on the dark surface. A present `logo` renders on a light face so dark brand marks stay legible.

## Author obligations

- Supply all seven required fields. A missing required field is an authoring error, not a case the page defends against.
- Keep `label` short — a few words. Long labels are not truncated and will wrap.
- Write no year into `label`, `org` or `place`. The year-free surface is a design guarantee the page cannot enforce for you; `period` is the supported place for time.
- Keep `short` to 1–3 characters.

## Breaking changes

Changing any of the following breaks this contract and requires a spec update:

- Rendering `title`, `note` or `period` on the collapsed surface.
- Re-sorting entries by anything other than file order.
- Making a currently optional field required, or vice versa.
- Reintroducing badge sizes that vary by position.
