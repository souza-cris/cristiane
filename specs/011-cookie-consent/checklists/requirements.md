# Specification Quality Checklist: Cookie Consent

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-07-28
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [ ] No implementation details leak into specification

## Notes

**All markers resolved.** The site was measured before this spec was written: zero `Set-Cookie`
headers on any page, zero third-party scripts, styles, images or frames, and no analytics
anywhere. That measurement drove both questions:

1. The consent gates **Google Analytics 4**, which the author is adding now — so the banner and
   the tracker are one feature (FR-011, FR-013).
2. GA4 was chosen over a cookieless alternative. Worth having asked: with Plausible or
   GoatCounter there would have been no cookies and arguably no need for a banner at all, and
   this feature would have collapsed to almost nothing. It did not, and the reason is recorded.

**The provider is named in the spec, and that is deliberate.** Normally naming a vendor would
fail the "no implementation details" check, and it is marked incomplete above for that reason.
It is kept because the author supplied a specific account — a site ID and a cookie policy ID —
and those are facts about her existing arrangements rather than a technical choice this spec is
making. A plan could not sensibly propose a different provider without her opening a different
account.

**This feature cannot be built as the constitution stands.** It breaches two principles:

- **IV** — "All assets MUST be committed to this repository and served from it. The site MUST
  NOT request fonts, scripts, styles, or images from an external host." The snippet loads three
  scripts from two external origins.
- **V** — "JavaScript MUST NOT be added unless there is a clear, documented need that cannot be
  met with HTML and CSS alone."

FR-010 requires the exception be named in the constitution rather than left as a silent breach.
That amendment is a prerequisite, not a follow-up, and it is listed under Dependencies.

Worth noting alongside: feature 010 deliberately excluded analytics and trackers on the grounds
that "a visitor's reading stays between them and this site". This feature points the other way.
Both can be true — but the constitution should end up saying which, rather than containing two
decisions that pull against each other.

Items marked incomplete require spec updates before `/speckit-plan`.
