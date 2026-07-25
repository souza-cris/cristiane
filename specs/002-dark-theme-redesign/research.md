# Research: Dark Theme Redesign

**Date**: 2026-07-25

## Summary

No NEEDS CLARIFICATION items. Research focused on selecting specific colors, fonts, and patterns that meet the spec requirements (dark techy aesthetic, WCAG AA contrast, system font stacks).

## Decisions

### 1. Color Palette

- **Decision**: Use the following palette:
  - Background: `#0d1117` (GitHub-dark inspired, near-black with a slight blue undertone)
  - Text: `#e6edf3` (off-white, warm enough for comfortable reading)
  - Accent: `#58a6ff` (soft electric blue — readable, familiar, versatile)
  - Accent hover: `#79c0ff` (lighter shade for hover states)
  - Muted text: `#8b949e` (secondary/meta text like dates, descriptions)
  - Borders: `#21262d` (subtle dark gray dividers)
  - Surface: `#161b22` (slightly lighter than background, for cards/code blocks)
  - Code background: `#1c2128` (distinct from page background)
- **Rationale**: This palette is proven readable (GitHub, VS Code dark themes use similar values). All combinations exceed WCAG AA:
  - `#e6edf3` on `#0d1117` = ~13.5:1 (passes AAA)
  - `#58a6ff` on `#0d1117` = ~5.8:1 (passes AA)
  - `#8b949e` on `#0d1117` = ~4.6:1 (passes AA)
- **Alternatives considered**: Pure cyan (#00d4ff) — too vibrant, fatiguing in dark UI. Green (#00cc88) — viable but less conventional for a developer site. The chosen blue is widely associated with developer tooling.

### 2. Typography — Monospace Font Stack

- **Decision**: System monospace stack for headings, nav, dates, chips:
  `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace`
- **Rationale**: Available on all platforms without loading external fonts. Matches the "developer terminal" aesthetic. SFMono on macOS, Consolas on Windows, Liberation Mono on Linux.
- **Alternatives considered**: Loading a web font (Fira Code, JetBrains Mono) — rejected per constitution (adds external dependency, hurts performance).

### 3. Typography — Sans-Serif Body Stack

- **Decision**: Keep existing system sans-serif stack for body text:
  `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- **Rationale**: Already in use, highly readable, no font loading needed.
- **Alternatives considered**: None needed — the current stack is ideal.

### 4. Tool Chips / Tag Pills Styling

- **Decision**: Monospace text, border in accent or muted color, transparent background with subtle border, rounded corners.
- **Rationale**: A bordered pill on dark background is more readable than a filled chip (which can compete with code blocks). The border approach is subtle and techy.
- **Alternatives considered**: Filled chips with surface color background — viable but less distinctive.

### 5. Code Block Styling

- **Decision**: Use `#1c2128` background for code blocks (slightly lighter than page `#0d1117`), with the monospace font stack, `#e6edf3` text, and a subtle `#21262d` border. Inline code gets `#1c2128` background with slight padding.
- **Rationale**: Subtle contrast between page background and code block background creates visual separation without harsh borders. Matches VS Code dark conventions.
- **Alternatives considered**: Darker code background than page — rejected because it would make code blocks nearly invisible.

### 6. Focus States

- **Decision**: Use `outline: 2px solid #58a6ff; outline-offset: 2px` for keyboard focus on all interactive elements.
- **Rationale**: Accent-colored outline is clearly visible on dark background, does not shift layout (outline vs border), and the offset prevents it from overlapping content.
- **Alternatives considered**: Box-shadow focus ring — viable but outline is more reliable across browsers and respects high-contrast mode.

### 7. Mobile Theme Color

- **Decision**: Add `<meta name="theme-color" content="#0d1117">` to `head.html` so mobile browser chrome matches the dark theme.
- **Rationale**: Small touch that makes the dark theme feel native on mobile. No JavaScript, just a meta tag.
- **Alternatives considered**: Omit it — acceptable but misses an easy polish opportunity.
