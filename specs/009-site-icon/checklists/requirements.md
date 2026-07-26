# Specification Quality Checklist: Site Icon and Brand Mark

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-07-25
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
- [x] No implementation details leak into specification

## Notes

**All items pass**, after a revision.

Both [NEEDS CLARIFICATION] markers were resolved before planning:

1. Where the mark appears. First answered "browser only", then revised by the author to the
   home page, centred (FR-013). User Story 4 and SC-009/SC-010 were added to cover it, since
   the original three stories were all about the browser icon and left FR-013 with no
   acceptance criteria.
2. The blue accent stays; teal lives in the mark alone (FR-014, FR-015).

**A requirement was written as a prohibition, and it cost something.** FR-013 first said the
mark "MUST NOT appear ... on the home page". That is taste, not a constraint, and when the
author changed her mind the site was briefly in breach of its own spec. The constitution
added a rule about exactly this in v2.0.0, after the journey-years episode, and it was not
applied here. Both FR-013 and FR-014 are now written as decisions. The spec's *Resolved
Questions* section records the correction rather than hiding it.

**On naming colours in a spec.** FR-012 cites two hex values, which normally counts as an
implementation detail. They are kept because the contrast ratios attached to them are the
requirement: `#0B7E8A` measures 3.93:1 against the site background, under the 4.5:1 that
normal text needs, while `#0FA3B1` measures 6.21:1. Writing that as "use an accessible
teal" would lose the specific fact that the author's stated brand colour is the one that
fails. The constraint is what matters; the numbers are how it gets checked.

Note that FR-013 and FR-014 close this risk by scope — under the agreed design, teal never
carries text at all. FR-012 is retained as a guard for any later feature that puts teal on
the page, not as a live constraint on this one.

**Ratios were measured, not estimated** — computed from the site's actual background
(`#0d1117`) and surface (`#161b22`) values, per the constitution's requirement that claims
about the built site be checked rather than inferred.

Ready for `/speckit-plan`.
