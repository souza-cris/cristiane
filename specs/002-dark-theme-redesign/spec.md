# Feature Specification: Dark Theme Redesign

**Feature Branch**: `002-dark-theme-redesign`

**Created**: 2026-07-25

**Status**: Draft

**Input**: User description: "Visual redesign of the existing personal website — dark, techy aesthetic applied via CSS and layout changes only. No structural, content, or JavaScript changes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dark Techy Visual Identity (Priority: P1)

A visitor arrives at any page of the site and immediately sees a dark, developer-oriented design: near-black background, off-white text, and a single bright accent color for interactive elements. The experience feels cohesive and intentional — every page uses the same palette, typography, and visual language.

**Why this priority**: This is the core deliverable. The entire redesign exists to achieve this visual identity. Without it, no other styling detail matters.

**Independent Test**: Load the home page, then navigate to every other page (Portfolio, Projects, Blog, Curation, 404). Verify each page has the dark background, off-white text, accent-colored links, and monospace headings. No page should show the old light theme.

**Acceptance Scenarios**:

1. **Given** a visitor opens any page, **When** the page loads, **Then** they see a dark background (near-black, not pure #000), off-white body text (not pure #fff), and a consistent bright accent color on links and interactive elements.
2. **Given** a visitor navigates between pages, **When** they move from one section to another, **Then** the visual style (colors, fonts, spacing) remains consistent across all pages.
3. **Given** a visitor views the site on a mobile device, **When** the page loads, **Then** the dark theme renders correctly with the same color scheme and the mobile menu still functions.

---

### User Story 2 - Typography with Developer Feel (Priority: P2)

A visitor notices that headings, the site title, nav labels, dates, and tag/tool chips use a monospace font, giving the site a developer aesthetic. Body text remains in a readable sans-serif for comfortable long-form reading.

**Why this priority**: Typography is the primary way the "techy" identity comes through. After color, it is the most impactful design element.

**Independent Test**: Load a blog post page and verify that headings are monospace, body paragraphs are sans-serif, dates are monospace, and tool/tag chips are monospace. Verify body text is comfortable to read at typical reading distances.

**Acceptance Scenarios**:

1. **Given** a visitor reads a blog post, **When** they look at the heading vs. the body text, **Then** the heading is in a monospace font and the body text is in a sans-serif font.
2. **Given** a visitor views a project detail page, **When** they look at the tool chips, **Then** each chip uses a monospace font and looks like a styled tag/pill.
3. **Given** a visitor views dates on the blog index, **When** they scan the list, **Then** dates appear in monospace.

---

### User Story 3 - Accessible Contrast and Focus States (Priority: P3)

A visitor using assistive technology or navigating with a keyboard can clearly see focus indicators and read all text comfortably. All text-to-background color combinations meet WCAG AA contrast requirements.

**Why this priority**: Accessibility is a constitutional principle (Principle IV). Failing contrast or missing focus states would violate project governance and exclude users.

**Independent Test**: Run a contrast checker on the background/text and background/accent combinations. Tab through the navigation and links with a keyboard and verify that focus outlines are clearly visible in the accent color.

**Acceptance Scenarios**:

1. **Given** the dark background color and body text color, **When** tested with a WCAG contrast checker, **Then** the contrast ratio meets or exceeds 4.5:1 (AA for normal text).
2. **Given** the dark background color and the accent color, **When** tested with a WCAG contrast checker, **Then** the contrast ratio meets or exceeds 4.5:1 (AA for normal text) or 3:1 (AA for large text/UI elements).
3. **Given** a visitor navigates links and nav items with the keyboard Tab key, **When** an element receives focus, **Then** a clearly visible accent-colored outline or highlight appears.

---

### User Story 4 - Styled Code Blocks and Content Elements (Priority: P4)

A visitor reading a blog post that contains code blocks sees them styled with a darker code background that fits the theme. Blockquotes, lists, and other content elements blend naturally with the dark design.

**Why this priority**: Code blocks and content formatting are secondary to the overall palette and typography but important for the blog reading experience.

**Independent Test**: Create a blog post with a code block, a blockquote, and a list. Verify code blocks have a distinct dark background, inline code is visually distinct, and all content elements look intentional in the dark theme.

**Acceptance Scenarios**:

1. **Given** a blog post contains a fenced code block, **When** the visitor reads it, **Then** the code block has a distinct dark background (slightly lighter or darker than the page background) with readable monospace text.
2. **Given** a blog post contains inline code, **When** the visitor reads it, **Then** inline code has a subtle background tint and monospace font that distinguishes it from surrounding text.
3. **Given** a blog post contains a blockquote, **When** the visitor reads it, **Then** the blockquote has a visible left border in the accent color or a muted gray.

---

### Edge Cases

- What happens if a visitor has a system-wide light mode preference? The site always displays the dark theme regardless of OS preference (no media query toggle).
- What happens with images on the dark background? Images display as-is. The profile photo (round-cropped) and project images should look natural on the dark background.
- What happens with the empty-state messages (no posts, no projects)? They should use the same off-white text color and remain readable on the dark background.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All pages MUST use a near-black background color (not pure #000000) for the page body.
- **FR-002**: Body text MUST be off-white (not pure #ffffff) for comfortable reading on dark backgrounds.
- **FR-003**: One bright accent color MUST be chosen and used consistently for all links, hover states, active nav indicators, and interactive highlights across all pages.
- **FR-004**: Headings (h1–h6), the site title/brand text, navigation labels, dates, and tool/tag chips MUST use a monospace font.
- **FR-005**: Body text (paragraphs, list items, descriptions) MUST use a readable sans-serif font.
- **FR-006**: Borders and dividers MUST use a low-contrast dark gray that is visible but subtle against the dark background.
- **FR-007**: Links MUST have a visible accent-colored hover and focus state.
- **FR-008**: Project tool chips and curation category headings MUST be styled as tag/pill elements that fit the dark techy aesthetic.
- **FR-009**: Code blocks MUST have a distinct dark background with monospace text. Inline code MUST be visually distinguishable from surrounding text.
- **FR-010**: The theme MUST be a single fixed dark theme with no light/dark toggle and no JavaScript.
- **FR-011**: All text and accent color combinations against the dark background MUST meet WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text and UI components).
- **FR-012**: The existing responsive layout and mobile navigation MUST continue to work without modification to behavior.
- **FR-013**: No external CSS frameworks, prebuilt themes, or JavaScript MUST be introduced.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every page on the site (Home, Portfolio, Projects, Blog, Curation, 404) uses the same dark color palette — no page retains the old light theme colors.
- **SC-002**: All body text achieves at least 4.5:1 contrast ratio against the dark background (WCAG AA).
- **SC-003**: The accent color achieves at least 3:1 contrast ratio against the dark background for UI elements.
- **SC-004**: The site loads in under 3 seconds on a standard mobile connection (no performance regression from CSS changes).
- **SC-005**: All pages render correctly on viewports from 320px to 1920px wide (no layout regressions).
- **SC-006**: Keyboard navigation through all links and interactive elements shows a clearly visible focus indicator.
- **SC-007**: Blog posts with code blocks, blockquotes, and lists are comfortable to read with appropriate spacing and contrast.

## Assumptions

- The redesign only changes visual presentation (CSS and, where needed, layout/include markup for class names). It does not change site structure, page content, sections, or navigation behavior.
- No new pages, collections, data files, or content are added.
- The profile photo and project images are provided by the site owner and will not be replaced or modified by this feature.
- Fonts are loaded from the system font stack or a standard web-safe monospace family — no custom font files or external font services are required.
- The single accent color is chosen by the implementer to meet contrast requirements. Suggestions include cyan (#00d4ff-range), electric blue (#4da6ff-range), or green (#00cc88-range), but the final choice is made during implementation as long as it meets accessibility requirements.
