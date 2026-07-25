# Contract: Study Record and Callout Include

**Date**: 2026-07-25 | **Feature**: [../spec.md](../spec.md)

Two contracts here. The **authoring contract** is between the author and the site: what goes in `_data/study.yml` and what the site guarantees to do with it. The **include contract** is between this feature and feature 006: how the home page asks for the callout and what it can rely on.

---

## 1. Authoring contract — `_data/study.yml`

```yaml
active: false                       # required — the only recruitment switch
title: "…"                          # required — becomes the heading
description: "…"                    # required — what the study is about
summary: "…"                        # optional — one line for the home page
eligibility: "…"                    # required — who can take part
involves: "…"                       # required — time, format, compensation
action_label: "Sign up"             # required — the link text
action_url: "https://…"             # required — complete destination, or mailto:…
deadline: "15 March 2027"           # optional — shown verbatim, omit if none
```

### Guarantees

**The switch**

- `active: false` renders nothing, anywhere. The rest of the record is left alone — turn it back on and the same content returns.
- If the file does not exist, the site still builds and the research page renders normally.

**The research page (`full`)**

- Shows title, description, eligibility, what's involved, the deadline when set, and the action.
- Appears as a distinct, named region — not another item in the publications list.

**The home page (`compact`, once feature 006 lands)**

- Shows title, `summary` (or `description` when no summary), the deadline when set, and the action.
- Never shows eligibility or what's involved — that detail belongs on the research page.

**The action**

- `action_url` is used exactly as written. No scheme is inferred, ever.
- `http`/`https` destinations open in a new tab with `rel="noopener"`.
- `mailto:` destinations open in the visitor's mail client and do not force a new tab.

**Empty fields**

- Omitting `summary` or `deadline` renders nothing at all for that field — no empty element, no dangling label.

### Author obligations

- Supply all seven required fields. A record missing `title` or `action_url` is an authoring error; the callout is meaningless without them.
- Write `action_url` complete, including `mailto:` for an email. `cris@example.com` is not a link; `mailto:cris@example.com` is.
- Keep `summary` to roughly one sentence — it sits under the home page hero.
- **Write the study content yourself.** For human-subjects research this is normally IRB-approved recruitment text and should be used verbatim. Nothing here is generated or paraphrased on your behalf.
- Set `active: true` only when recruitment is genuinely open. `deadline` is informational and will not close it for you.

### What the site does not do

- It never collects, stores or transmits participant data. Consent and data handling live entirely at `action_url`.
- It never auto-expires a study.

---

## 2. Include contract — `_includes/study-callout.html`

Feature 006 depends on this. Changing it is a breaking change.

### Call

```liquid
{% include study-callout.html variant="compact" %}
```

| Parameter | Values | Default |
|-----------|--------|---------|
| `variant` | `full`, `compact` | `full` |

### Guarantees to the caller

- **Self-gating.** The include renders nothing when the study is inactive or absent. The caller does not need to test `active` first — wrapping it in a condition is allowed but redundant.
- **Self-contained.** It emits one `<section>` and nothing outside it. It sets no page-level state and requires no wrapper markup.
- **Uniquely identified.** The heading id is scoped by variant, so both variants on one page would still produce valid markup.
- **Styled by class.** Presentation hangs off `study-callout` and `study-callout--{variant}`; a caller may position the section but should not restyle its internals.

### Breaking changes

Any of these requires a spec update and a coordinated change in feature 006:

- Renaming `variant` or its accepted values.
- Making the include stop gating on `active` internally.
- Emitting more than one root element, or requiring wrapper markup.
- Renaming the `study-callout` class root.
- Changing which fields a variant renders.
