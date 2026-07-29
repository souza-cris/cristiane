# Feature Specification: Cookie Consent

**Feature Branch**: `011-cookie-consent`

**Created**: 2026-07-28

**Status**: Draft — ready for planning once the constitution is amended.

**Confirmed against feature 012, 28 July 2026.** A later audit proposed the opposite — Google
Analytics loading for every visitor with no consent gate. The author chose the gate, so this
spec stands unchanged and feature 012's User Story 9 was amended to match. The two features
ship together: this one is the gate, that one is what the gate lets through.

The consent gates **Google Analytics 4**, which the author is adding (FR-011, FR-012). The two
ship together: the banner alone would ask about nothing, and the analytics alone would collect
without asking. This is the first third-party code the site has ever carried, and it cannot be
built until Principles IV and V are amended — see FR-010.

**Input**: The author supplied an Iubenda consent-mode snippet (site ID 4625293, cookie
policy 42390325, English) and asked for it to be installed. The snippet loads three scripts
from `cs.iubenda.com` and `cdn.iubenda.com` and configures a consent banner with autoblocking.

## Current state

Measured against the live site before writing this, not assumed:

| | Today |
|---|---|
| Cookies set by the site | **none** — zero `Set-Cookie` headers on any page |
| Third-party scripts, styles, images or frames | **none** |
| Analytics, tag manager or tracker | **none** — deliberately excluded in feature 010 |
| Scripts of any kind | one, `search.js`, served from this repository |

**The site currently collects nothing about anyone and asks no third party to.** This matters
because it decides what the feature is actually for — see the question below.

## The tension this feature has to resolve

The requested snippet would be the **first third-party code the site has ever loaded**, and
consent platforms set their own cookie to remember a visitor's choice. So installing it would,
today, create the first cookie and the first outside request on a site that has neither — in
order to ask permission for cookies and outside requests that do not exist.

That is not an argument against doing it. It is an argument for being clear about *why*, because
the answer changes the feature. It also cannot be built as the constitution currently stands:

- **Principle IV** — "All assets MUST be committed to this repository and served from it. The
  site MUST NOT request fonts, scripts, styles, or images from an external host." Three
  external scripts.
- **Principle V** — "JavaScript MUST NOT be added unless there is a clear, documented need that
  cannot be met with HTML and CSS alone." A consent banner cannot be done without script.

Both can be amended. Neither should be amended silently, which is what this spec exists to
prevent.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A visitor decides what the site may do (Priority: P1)

A visitor arrives and is asked, before anything non-essential loads, whether they consent to
it. They can accept, refuse, or choose per purpose. Refusing leaves the site fully usable, and
the choice is remembered so they are not asked again on every page.

**Why this priority**: This is the feature. Everything else supports it.

**Independent Test**: Load the site in a clean browser; confirm the notice appears, that
refusing leaves every page working, and that the choice survives navigating to another page.

**Acceptance Scenarios**:

1. **Given** a visitor with no stored choice, **When** they open any page, **Then** they are
   asked before any non-essential script runs.
2. **Given** the notice, **When** the visitor refuses, **Then** nothing non-essential loads and
   every page still works — navigation, search, the journey track, the story.
3. **Given** a visitor who has chosen, **When** they open another page, **Then** they are not
   asked again.
4. **Given** a visitor who has chosen, **When** they want to change their mind, **Then** there
   is a way to reopen the choice.
5. **Given** a visitor using only a keyboard, **When** the notice appears, **Then** it can be
   read and answered without a mouse.

---

### User Story 2 - The author meets her obligation (Priority: P1)

The author can point to a consent record and a cookie policy if asked — by a university, an
ethics board, a collaborator, or a reader.

**Why this priority**: It is the reason a static personal site would carry a consent banner at
all, and it ranks with Story 1 because neither is useful without the other.

**Independent Test**: Confirm the cookie policy is reachable from the notice and from the site,
and that consent choices are recorded wherever the provider records them.

**Acceptance Scenarios**:

1. **Given** the notice, **When** a visitor looks for detail, **Then** a cookie policy is one
   click away.
2. **Given** a visitor's choice, **When** it is made, **Then** it is recorded by the provider so
   the author can evidence it.

---

### User Story 3 - Nothing is slower or uglier for it (Priority: P2)

The notice matches the site rather than arriving as a stranger, and the site does not become
noticeably slower to load or start showing content later than it does now.

**Why this priority**: Real, but subordinate. A consent notice that is ugly or slow is still a
working consent notice.

**Independent Test**: Compare the page against how it looks and loads today; confirm the notice
does not shift the content beneath it once dismissed.

**Acceptance Scenarios**:

1. **Given** the notice appears, **When** it is dismissed, **Then** the page beneath is
   unchanged — no shifted layout.
2. **Given** the added scripts, **When** a page loads, **Then** the site's own content is not
   held up waiting for them.
3. **Given** the notice, **When** it renders, **Then** it is legible against the site's dark
   theme.

---

### Edge Cases

- **A visitor who blocks third-party scripts**: the notice will not load. Every page MUST still
  work, and nothing non-essential should run in its absence.
- **The provider's service is slow or down**: the site's own content MUST still render. It must
  never be the case that a page is blank because a consent script did not arrive.
- **A visitor who refuses**: nothing non-essential loads, now or later, until they change their
  mind.
- **A returning visitor after the policy changes**: the provider re-asks; the site does not have
  to do anything.
- **The site adds an analytics tool later**: it MUST be gated by this consent, not loaded
  alongside it.
- **A visitor in a jurisdiction with no such requirement**: the notice still appears. This is
  accepted rather than solved; per-region behavior is out of scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A visitor MUST be asked for consent before any non-essential script runs, and MUST
  be able to accept, refuse, or choose by purpose.
- **FR-002**: Refusing MUST leave every page fully usable. No content, navigation or search may
  depend on consent being given.
- **FR-003**: A visitor's choice MUST persist across pages and visits, and MUST be changeable
  afterwards from somewhere findable.
- **FR-004**: A cookie policy MUST be reachable from the notice and from the site.
- **FR-005**: The notice MUST be operable by keyboard alone and readable by a screen reader.
- **FR-006**: The notice MUST be legible against the site's dark theme and MUST NOT shift the
  page content when dismissed.
- **FR-007**: The site's own content MUST render regardless of whether the consent scripts load,
  succeed, or are blocked.
- **FR-008**: Any tracking or analytics added later MUST be gated behind this consent rather
  than loaded independently.
- **FR-009**: The consent provider MUST record choices such that the author can evidence them.
- **FR-010**: The scripts this feature introduces MUST be the only third-party code on the site,
  and their presence MUST be recorded as a named exception in the constitution rather than left
  as an undocumented breach.
- **FR-011**: The consent exists to gate **analytics the author intends to add**. The analytics
  and the consent MUST ship together: the tracker may not load before a choice is made, and
  refusing MUST mean it never loads. Shipping the banner alone would ask permission for nothing;
  shipping the analytics alone would collect without asking.
- **FR-012**: The analytics is **Google Analytics 4**, chosen by the author. It sets cookies and
  sends visitor data to Google, so consent is genuinely required rather than precautionary —
  which is what makes the banner in FR-001 necessary rather than decorative.
- **FR-013**: Google Analytics MUST NOT load, and MUST NOT set any cookie or send any request,
  until the visitor has consented. Refusing MUST mean it never loads for that visitor, on any
  page, for as long as the refusal stands.
- **FR-014**: The site MUST contact exactly two third-party origin groups after this feature —
  the consent provider and Google Analytics — and no others. Any further origin is a new
  decision, not an extension of this one.

### Key Entities

- **Consent choice**: what a visitor allowed or refused, and when. Held by the provider, not by
  this site.
- **Cookie policy**: the document describing what is collected and why. Hosted by the provider.
- **Consent-gated script**: any future third-party code that must wait for consent. There are
  none today; FR-008 governs the first one.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor with no stored choice is asked on their first page, and not asked again
  after choosing.
- **SC-002**: With consent refused, 100% of pages remain fully usable — every link, the search,
  the journey track and the story.
- **SC-003**: With the consent scripts blocked entirely, 100% of pages still render.
- **SC-004**: The cookie policy is reachable in one click from the notice.
- **SC-005**: The notice can be read and answered using only a keyboard.
- **SC-006**: Dismissing the notice causes no visible layout shift.
- **SC-007**: The site's own content appears no later than it does today.
- **SC-008**: The constitution names this exception explicitly, and the count of third-party
  origins the site contacts is stated and matches reality.

## Assumptions

- **The author has an Iubenda account** and the supplied site ID and policy ID are hers. The
  configuration is used as given; it is not this feature's place to alter her legal wording.
- **The cookie policy is written by the author or her provider.** As with the study text, legal
  wording is not generated here.
- **Consent is asked of everyone**, without region detection. Simpler, and never under-asks.
- **The provider sets its own cookie** to remember the choice. That cookie is treated as
  strictly necessary, which is the standard position.
- **Analytics is part of this feature**, confirmed by the author. It is not a separate later
  change: FR-011 requires the two ship together, because either alone is worse than neither.

## Dependencies

- An Iubenda account, its site ID, cookie policy ID, and a published cookie policy. All supplied
  except the policy, which must exist before the notice can link to it.
- A Google Analytics 4 property and its measurement ID, which the author must create.
- A constitution amendment to Principles IV and V. This feature cannot be built without one; see
  FR-010. It is a prerequisite, not a follow-up.

## Out of Scope

- Region-specific behavior.
- Writing the cookie policy or any other legal text.
- Self-hosting the consent scripts. They are served by the provider and update independently;
  pinning a copy would defeat that.

## Resolved Questions

Both were settled by the author before planning.

1. **What is the consent for?** Analytics she is adding now. So the banner and the tracker are
   one feature, not two — recorded as FR-011.
2. **Which analytics?** Google Analytics 4. This was worth asking rather than assuming: a
   cookieless tool such as Plausible or GoatCounter would arguably have needed no consent banner
   at all, which would have made this whole feature unnecessary. GA4 sets cookies and sends data
   to Google, so consent is genuinely required. Recorded as FR-012.

**What this costs, stated plainly.** The site goes from contacting nobody to contacting two
outside parties on every page, and from setting no cookies to setting several. Feature 010
deliberately left analytics out on the grounds that "a visitor's reading stays between them and
this site". That is no longer the position, and the constitution should be amended to say so
rather than left contradicting the code.
