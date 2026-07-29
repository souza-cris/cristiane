# Contract: Side Navigation Include

**Date**: 2026-07-25 | **Feature**: [../spec.md](../spec.md)

The contract between `_layouts/default.html` and `_includes/side-nav.html`: what the layout must do to use it, and what the include guarantees in return.

---

## Calling contract

```liquid
{% unless page.url == '/' %}{% include side-nav.html %}{% endunless %}
```

**Requirements on the caller**

- The include takes **no parameters**. It reads `page.url` from the ambient page context and needs nothing passed in.
- It MUST be called from inside `<body>` and outside `<main>`. It is `position: fixed`, so it does not matter where in the flow it sits, but it must not be nested in the content column — a screen reader walking the document should meet it as a sibling of the main content, not inside it.
- The caller decides whether home gets it. The include does **not** self-gate on home, unlike `study-callout.html`. See the note below.
- The caller MUST also set the body class, since the stylesheet's `is-home` rules are a separate concern the include knows nothing about.

**Why this one does not self-gate**

`study-callout.html` renders nothing when its study is inactive, so callers need no condition. This include is different: the decision is about *which page is being rendered*, not about the include's own content. Putting `page.url == '/'` inside the include would hide a layout decision inside a component and make the layout read as though every page gets a side navigation. The condition stays where the decision is made.

---

## Guarantees

**Markup**

- Emits exactly one `<nav class="side-nav" aria-label="Section navigation">` wrapping `section-links.html`, which renders one `<ul class="side-nav__links">` of one `<li>` per entry in `_data/sections.yml`.
- Emits nothing else — no wrapper, no heading, no script.
- Every `href` passes through `relative_url`, so links are correct under the `/cristiane` base path.
- The link list is **not** written in this include. It has no opinion about which sections exist; changing the sections means editing the data file, not this file.

**Current section**

- At most one link carries `aria-current="page"`.
- A page inside a section marks that section: any URL containing `/stories` marks stories, any URL containing `/bookmarks` marks bookmarks.
- On a page in no listed section — a 404, say — no link is marked, and this is not an error.

**Layout**

- Being `position: fixed`, the element never affects the content column's width or position. Including it cannot shift the page.
- Below 1000px it is `display: none`: not rendered visually, not focusable, not announced.
- It never causes horizontal scrolling. `body { overflow-x: hidden }` already guards the page, but the menu sits within the viewport at every width where it is shown.

**Accessibility**

- Reachable in the tab order in document order, with the site's standard focus ring.
- The current link is distinguished by a right border as well as color, so the state does not depend on color perception.
- Labeled "Section navigation", so assistive technology can tell it apart from the top navigation.

---

## What would break this contract

- Passing parameters and expecting them to be read.
- Calling it on the home page — it would render, because the include does not gate itself.
- Moving the call inside `<main>` or inside the container, which would place it wrongly in the reading order.
- Changing the 1000px breakpoint without rechecking overlap against the 44rem content column. The two numbers are related; see decision 2 in [../research.md](../research.md).
- Writing links directly into this include instead of adding them to `_data/sections.yml`. That would recreate the duplication this feature was corrected to remove, and put the two navigations back in a position to disagree.

---

## The shared list contract — `section-links.html`

Both navigations call it the same way, differing only in the class:

```liquid
{% include section-links.html class="site-nav__links" %}
{% include section-links.html class="side-nav__links" %}
```

**Requirements on the caller**

- MUST pass `class`. Without it the `<ul>` renders unclassed and unstyled.
- MUST provide its own `<nav>` wrapper and accessible name. This include emits the list only.

**Guarantees**

- One `<li>` per entry in `_data/sections.yml`, in file order.
- At most one `aria-current="page"`, decided per entry by its `match` value.
- No knowledge of which navigation is calling it beyond the class string, so the two can never render different links.
