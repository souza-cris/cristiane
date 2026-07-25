# Data Model: Research Page Call for Participants

**Date**: 2026-07-25 | **Feature**: [spec.md](spec.md)

## Entities

### Study call

The current call for participants. A single record in `_data/study.yml` — not a list. This feature owns it; feature 006 only reads it.

| Field | Required | Surface | Description |
|-------|----------|---------|-------------|
| `active` | Yes | — | `true` or `false`. The single control that opens and closes recruitment |
| `title` | Yes | Both variants | What the study is called. Becomes the callout's heading and its accessible name |
| `description` | Yes | `full`; `compact` as fallback | What the study is about, in the author's words |
| `summary` | No | `compact` only | One tight line for the home page. Falls back to `description` when absent |
| `eligibility` | Yes | `full` only | Who can take part |
| `involves` | Yes | `full` only | What taking part involves — time, format, compensation if any |
| `action_label` | Yes | Both variants | The link text, e.g. "Sign up" or "Email me to take part" |
| `action_url` | Yes | Both variants | The complete destination, including `mailto:` when it is an email |
| `deadline` | No | Both variants | Author-formatted string, rendered verbatim. Omit when there is none |

### Validation rules

- **`active` governs everything.** When `false`, nothing renders on any surface. The rest of the record stays in the file untouched, so turning it back on restores the same content (FR-004, US2 scenario 3).
- **Absent file.** If `_data/study.yml` does not exist at all, the site MUST still build and the research page MUST render normally. The template guards on the record existing before it guards on `active`.
- **Empty optional fields render nothing** — no empty deadline element, no stray label, no punctuation left behind (spec edge cases).
- **`action_url` is used as written.** No scheme is inferred. External `http`/`https` destinations open in a new tab with `rel="noopener"`, matching bookmarks; `mailto:` destinations do not.
- **Required fields are an authoring obligation.** A missing `title` or `action_url` is an error in the record, not a case the template defends against — the callout would be meaningless without them.
- **`deadline` is informational.** A date in the past does not hide the callout. The site rebuilds when the author publishes, not on a schedule, so `active` is the only reliable control. This is documented for the author in the data file itself.

### State

The record has exactly two states, and the author moves between them by editing one word:

```
active: false  ──▶  no callout anywhere; content preserved in the file
active: true   ──▶  full callout on the research page
                    compact callout on the home page (once feature 006 lands)
```

There is no third state and no automatic transition.

## Relationships

```
_data/study.yml  ──active?──▶  gate: renders nothing at all when false
                 ──title────▶  callout heading + accessible name (both variants)
                 ──description / summary──▶  body text (summary preferred when compact)
                 ──eligibility, involves──▶  full variant only
                 ──deadline──▶  shown when set, omitted when not
                 ──action_label + action_url──▶  the call to action

_includes/study-callout.html  ──variant: "full"─────▶  research.md   (this feature)
                              ──variant: "compact"──▶  home page     (feature 006)
```

## Not in this model

- **No participant data.** The site stores, processes and transmits nothing about anyone who responds. The action links out to the author's own recruitment destination, which is where any consent and data handling lives.
- **No study history.** One record, one study. Past studies are not retained; if that is ever wanted, it is a new feature and a list.
- **No scheduling.** No start date, no automatic expiry — see the `deadline` rule above.
