# Feature Specification: Site Icon and Brand Mark

**Feature Branch**: `009-site-icon`

**Created**: 2026-07-25

**Status**: Partially implemented — the home page mark (FR-013) is built and deployed. The
browser icon itself (User Stories 1–3, FR-001 to FR-006) is specified but not yet built;
it needs the author's icon files.

**Input**: The author supplied a set of six icon files and, on being asked, named the
brand colour: "this is the color #0B7E8A". The artwork is an open book on a rounded
square tile, supplied in two teals — the brand `#0B7E8A` and a brighter `#0FA3B1` — with
light and reversed variants. One file carries the accessible label "CRIS app icon". The
author holds the original files and supplies them at implementation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recognise the site among many open tabs (Priority: P1)

A visitor has a dozen tabs open. The site's tab currently shows the browser's blank
placeholder, identical to every other site with no icon. With the mark in place, the tab
is identifiable at a glance, and so is the entry in a bookmarks list or in history.

**Why this priority**: This is the point of an icon, and the case that occurs thousands of
times more often than any other. It is also the only story that fixes a present defect —
the site has no icon at all today, so it is anonymous everywhere a browser shows one.

**Independent Test**: Open the site alongside several other tabs and confirm its tab
carries the mark. Bookmark it and confirm the bookmark shows the mark too.

**Acceptance Scenarios**:

1. **Given** a visitor opens any page of the site, **When** the browser renders the tab,
   **Then** the mark appears in place of the blank placeholder.
2. **Given** the visitor bookmarks the page, **When** they view their bookmarks,
   **Then** the mark identifies the entry.
3. **Given** the visitor returns later, **When** they type in the address bar,
   **Then** the mark appears beside the site in history suggestions.
4. **Given** any page on the site, **When** it loads, **Then** the same mark is used —
   the icon does not vary from page to page.

---

### User Story 2 - Save the site to a phone home screen (Priority: P2)

A visitor on a phone adds the site to their home screen. The saved shortcut shows the mark
on its tile, sized and shaped the way the device expects, rather than a cropped screenshot
or a letter in a grey circle.

**Why this priority**: Real but far less frequent than the tab case, and it reuses the same
artwork. Worth doing properly, because a shortcut that looks unfinished is worse than no
shortcut.

**Independent Test**: Add the site to a phone home screen and confirm the resulting icon
shows the mark, filling its tile with no unexpected border or transparency.

**Acceptance Scenarios**:

1. **Given** a visitor saves the site to a home screen, **When** the shortcut is created,
   **Then** its icon is the supplied mark on its tile.
2. **Given** the device applies its own rounding or masking, **When** the icon renders,
   **Then** no part of the book is clipped.

---

### User Story 3 - Stay legible wherever it is shown (Priority: P3)

The mark remains recognisable at the smallest size a browser displays it, and holds up
against both light and dark browser chrome, so it never disappears into the toolbar it
sits in.

**Why this priority**: A refinement of presentation rather than new capability, but it
decides whether stories 1 and 2 actually deliver. An icon that vanishes against a dark
toolbar has not solved the recognition problem.

**Independent Test**: View the icon at its smallest rendered size in both a light-themed
and a dark-themed browser and confirm it is distinguishable in both.

**Acceptance Scenarios**:

1. **Given** a browser with light chrome, **When** the tab renders, **Then** the mark is
   distinguishable from the toolbar behind it.
2. **Given** a browser with dark chrome, **When** the tab renders, **Then** the mark is
   still distinguishable.
3. **Given** the icon at its smallest rendered size, **When** a visitor glances at it,
   **Then** the open-book shape is still readable as a shape, not a coloured blob.

---

### User Story 4 - See the mark on arriving at the site (Priority: P2)

A visitor landing on the home page sees the mark, small and centred, above the
introduction. It gives the page an identity of its own before any text is read, and ties
the site to the icon in the browser tab. Interior pages stay as they are — the mark does
not repeat down every page.

**Why this priority**: This is presence rather than function; nothing breaks without it,
which is why it sits below the tab icon. It ranks above legibility tuning because it is
the one part of this feature a visitor meets head-on.

**Independent Test**: Load the home page and confirm the mark appears, centred, above the
introduction. Load any other page and confirm it does not appear.

**Acceptance Scenarios**:

1. **Given** a visitor opens the home page, **When** it renders, **Then** the mark appears
   centred above the content, at a size that does not compete with the introduction.
2. **Given** a visitor opens any other page, **When** it renders, **Then** no mark appears
   and the page is unchanged.
3. **Given** a visitor using a screen reader, **When** the home page is read aloud,
   **Then** the mark is skipped entirely — it announces nothing and adds no link.
4. **Given** the mark is shown, **When** a visitor tabs through the page, **Then** focus
   never lands on it.

---

### Edge Cases

- **A browser that requests a size the site does not offer**: the site MUST still render
  normally and MUST NOT show a broken-image indicator. A missing size falls back to one
  that exists.
- **A browser that ignores the declared icon and requests `/favicon.ico` directly**: today
  that path returns 404. After this feature it MUST return an icon rather than an error.
- **A visitor with images disabled, or using a screen reader**: the icon is decoration; its
  absence MUST NOT remove any information or navigation.
- **The mark shown against a background close to its own colour**: covered by User Story 3
  — the chosen variant MUST carry its own edge rather than relying on the surface behind it.
- **A device that masks the icon into a circle**: covered by User Story 2 — the book must
  survive the crop.
- **The brand colour used where it cannot be read**: `#0B7E8A` measures 3.93:1 against the
  site's background, below the 4.5:1 that normal text requires. FR-013 and FR-014 keep it
  out of every position where that would matter, so the risk is closed by scope rather than
  managed. If a later feature puts teal on the page, this measurement applies again.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every page of the site MUST offer an icon to the browser for use in tabs,
  bookmarks, history, and anywhere else the browser identifies a site.
- **FR-002**: The icon MUST be the artwork the author supplied. It MUST NOT be redrawn,
  recoloured, cropped, or otherwise altered beyond producing the sizes and formats that
  browsers require.
- **FR-003**: The same mark MUST identify every page; the icon MUST NOT vary by section.
- **FR-004**: The site MUST offer an icon suitable for a phone or tablet home screen,
  filling its tile without clipping the book.
- **FR-005**: The icon MUST remain distinguishable against both light and dark browser
  chrome, and MUST remain readable as a shape at the smallest size a browser renders.
- **FR-006**: A direct request for the conventional root icon path MUST return an icon
  rather than a 404.
- **FR-007**: All icon files MUST be committed to this repository and served from it. No
  icon may be requested from an external host.
- **FR-008**: The icon MUST be decorative. No information, navigation, or meaning may
  depend on a visitor seeing it.
- **FR-009**: Icon files MUST be sized for their purpose, consistent with the site's
  existing practice of committing web-sized images rather than large originals.
- **FR-010**: The feature MUST deploy on the site's existing static hosting with no
  additional build step and no new dependency.
- **FR-011**: The colour the site declares for surrounding browser interface MUST match
  what the visitor actually sees, so the browser's furniture and the page do not
  contradict each other.
- **FR-012**: Any future use of `#0B7E8A` that carries text or an interface edge MUST meet
  the contrast the site already holds itself to. Where it cannot, the brighter `#0FA3B1`
  (6.21:1 against the site background) MUST be used instead, or the colour MUST not be used
  in that position at all. This feature creates no such use — see FR-015.
- **FR-013**: The mark appears on the **home page only**, centred above the content, at a
  small size. It is decorative: it carries an empty alt text, is hidden from assistive
  technology, and is not a link — the navigation already carries the way home. It is not
  emitted at all on other pages, rather than emitted and hidden.
- **FR-014**: The site's existing accent colour remains unchanged. Links, headings, focus
  outlines, journey rings, and every other accented element keep `#58a6ff`. Teal is not
  introduced into the page's palette beyond the mark itself.
- **FR-015**: Because teal never carries text or an interface edge under FR-013 and
  FR-014, the brand `#0B7E8A` MAY be used as supplied wherever it appears — inside the
  artwork, and as the colour the site declares for surrounding browser interface. Its
  3.93:1 measurement constrains text and interface edges only, and this feature creates
  none.

### Key Entities

- **Site icon**: the author's artwork, held as a small set of committed files covering the
  variants browsers and devices ask for. Attributes: the artwork itself, the background
  treatment (solid tile or transparent), and the size or sizes each file serves.
- **Brand colour**: `#0B7E8A`, the author's stated colour, with the brighter `#0FA3B1`
  available where contrast demands it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The site's tab is visually distinguishable from a tab with no icon, in every
  major current browser on desktop and mobile.
- **SC-002**: A visitor scanning a bar of ten open tabs can locate this site's tab without
  reading any tab titles.
- **SC-003**: The icon is present on 100% of the site's pages, including the 404 page.
- **SC-004**: A request to the conventional root icon path returns an icon, not an error.
- **SC-005**: The icon is recognisable as an open book at the smallest size any target
  browser renders it.
- **SC-006**: The site makes no request to any external host — unchanged from today.
- **SC-007**: Every colour pairing introduced by this feature meets at least 4.5:1 for
  normal text and 3:1 for large text and interface edges.
- **SC-008**: Added page weight stays small enough not to be perceptible; the icon must not
  become the largest asset on a text page.
- **SC-009**: The mark appears on the home page and on no other page — verifiable by
  checking every built page.
- **SC-010**: A screen reader announces nothing for the mark, and keyboard focus never
  lands on it.

## Assumptions

- **The artwork is final.** It is the author's own and is treated the way study wording and
  organisation logos already are: used as supplied, never regenerated or "improved". Any
  change to the drawing is the author's to make.
- **The author supplies the files.** She has the originals. This feature does not recreate,
  trace, or re-export them from any copy.
- **The mark is an open book.** Nothing functional depends on the reading, but it is
  recorded so that any later description of the icon is accurate. If it is meant to be
  something else, that is worth correcting now.
- **The solid-tile variant is the primary icon.** A filled tile carries its own background
  and so satisfies FR-005 against light and dark chrome alike, whereas a transparent mark
  depends on whatever sits behind it. The reversed and transparent variants are held for
  contexts where a tile would be wrong.
- **`#0B7E8A` is the brand colour**, as stated by the author. It is used as supplied inside
  the artwork. FR-012 governs it only where it would carry text or an interface edge.
- **No text changes.** The home page gains the mark above its content (FR-013); no wording,
  navigation, or colour changes anywhere. Nothing a visitor *reads* is different.

## Dependencies

- The author's six icon files, supplied at implementation.
- No other feature depends on this one, and it depends on none.

## Out of Scope

- The mark on any page other than home — no logo in the navigation, header, or interior
  pages. See FR-013.
- Any change to the site's colours. The blue accent stays; see FR-014.
- A full visual rebrand: the dark background, type and layout are untouched.
- A wordmark or logotype. The supplied artwork is a symbol only.
- Any installable-app behaviour beyond the home screen icon itself — no offline support,
  no splash screen, no install prompt.

## Resolved Questions

1. **Does the mark appear on the site itself?** Asked before planning and answered "browser
   only"; the author then revised it to "on the home page, small and centred", and then
   narrowed it from every page to home alone. FR-013 records where it landed.
2. **Does teal replace the site's blue accent?** No — the mark is teal, the site stays blue.
   This sidesteps the contrast problem: `#0B7E8A` fails text contrast at 3.93:1, but it
   never carries text. Recorded as FR-014 and FR-015.

### A correction to how FR-013 was first written

FR-013 originally read: *"It MUST NOT appear in the site's navigation, header, home page,
or any other on-page position."* That was a preference — where the author wants her own
mark — written as a prohibition. When she changed her mind an hour later, a two-line
change put the site in violation of its own specification.

This is the exact mistake the constitution names under *Taste is not a requirement*, added
in v2.0.0 after the same thing happened with years on the journey track. Writing it here
was a failure to apply a rule this project had just adopted. FR-013 and FR-014 are now
stated as decisions rather than prohibitions, so revising them is a content change and not
a breach.

**MUST** is reserved in this spec for the things that would actually break: the mark being
used as supplied (FR-002), self-hosting (FR-007), decorative-only semantics (FR-008), and
the contrast guard (FR-012).
