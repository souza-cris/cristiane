# Specification Quality Checklist: Search Discoverability Remediation

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
- [x] No implementation details leak into specification

## Notes

**The supplied audit was verified, not trusted.** Nine of its factual claims were checked
against the live site and this repository before adoption. All nine held, several to the exact
number — 11 pages sharing one title, 6 sharing another, 5 of 5 section links redirecting, and
exactly 7 empty taxonomy pages in the sitemap. An audit this specific is unusual; confirming it
rather than assuming took one pass and is recorded in the spec.

**Two of the audit's own uncertainties are now closed**, both marked
`[NEEDS CLARIFICATION]` in the original because the repository was unreachable:

- No Jekyll plugins are in use. The `Gemfile` has one gem, `jekyll`; `_config.yml` has no
  `plugins:` key. Head metadata, sitemap and robots are hand-written, per feature 010.
- Section links do come from one shared data file, `_data/sections.yml`, so the trailing-slash
  fix is a one-place change as the audit hoped.

**One correction.** The audit says 21 of 22 pages carry the default description; it is 22 of
23 built pages. The extra is the 404, which is not in the sitemap. Substance unchanged.

**The one marker is resolved.** User Story 9 of this audit and feature 011, specified earlier
the same day, gave opposite answers to whether analytics is gated behind consent. The author
chose the gate: feature 011 stands, US9 is amended, and the two features now ship together.
US9's original no-gate wording is left in audit.md as superseded rather than deleted, so it
stays visible that the question was open and how it was closed.

The other eleven stories breach nothing and can proceed immediately, independent of analytics.

**Four ambiguities closed by `/speckit-clarify`, 28 July 2026.** All four were real forks that
would have caused rework, and two of them changed what the work *is*:

- Filter-page descriptions are **derived, not written** — turning 15 authoring tasks into one
  template change, and making FR-011's uniqueness hold by construction rather than by review.
- The contact page uses **ORCID and an institutional page, no email** — which makes FR-034's
  obfuscation requirement moot, along with the accessibility risk obfuscation carries.

The other two settled FR-005's explicit either/or (self-canonical) and kept Bing in scope.
Recorded as FR-A04 to FR-A07 and in the Clarifications section.

**Note on sequence.** `/speckit-plan` ran before this clarify pass, which is the reverse of the
intended order. Two answers touched planned artifacts, and both were propagated: the data model
now says filter-page descriptions are derived, and the dependencies list no longer asks the
author to write them. Nothing in the plan's Constitution Check or structure was affected.

**On adopting a supplied document as a spec.** The audit arrived already in spec form and of
good quality, so it is adopted rather than rewritten, and preserved verbatim in
[audit.md](../audit.md). The spec file carries only what verification changed: the corrections,
the resolved uncertainties, the three amendments (FR-A01 to FR-A03), and the conflict. Rewriting
it in different words would have obscured which parts were the author's and which were mine.

Ready for planning.
