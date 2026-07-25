# Feature Specification: Personal Website

**Feature Branch**: `001-personal-site`

**Created**: 2026-07-25

**Status**: Implemented

**Input**: User description: "Build a personal website for Cristiane as a Jekyll static site hosted on GitHub Pages with five sections: Home, Portfolio/Resume, Projects, Blog, and Curation."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Home Page and Site Navigation (Priority: P1)

A visitor arrives at the site and sees Cristiane's name, a one-line description, and a photo. They can navigate to any section of the site using a consistent navigation bar. They can also find links to external profiles (GitHub, LinkedIn).

**Why this priority**: The home page is the entry point for every visitor. Without it and the shared navigation, no other section is reachable or useful. This story also establishes the site layout, header, footer, and styling that every other story depends on.

**Independent Test**: Deploy only the home page with the navigation bar. A visitor can load the site, see the intro content, click external profile links, and see navigation links (even if destination pages are placeholders).

**Acceptance Scenarios**:

1. **Given** a visitor opens the site root URL, **When** the page loads, **Then** they see Cristiane's name, a one-line description, a photo, and links to GitHub and LinkedIn.
2. **Given** a visitor is on any page, **When** they look at the top of the page, **Then** they see a navigation bar with links to Home, Portfolio, Projects, Blog, and Curation.
3. **Given** a visitor is on a mobile device, **When** the page loads, **Then** the layout adjusts to fit the screen and navigation remains accessible.
4. **Given** a visitor clicks an external profile link, **When** the link activates, **Then** it opens in a new tab.

---

### User Story 2 - Blog (Priority: P2)

A visitor navigates to the Blog section and sees a list of posts, newest first. They click a post title to read the full post. Cristiane adds a new blog post by creating a Markdown file — no other changes needed.

**Why this priority**: A blog is the most dynamic section and the primary reason visitors return. It validates the core content-as-data workflow (Markdown files becoming pages automatically).

**Independent Test**: Add two sample Markdown posts and verify they appear on the blog index in reverse chronological order, each linking to its own page with full content.

**Acceptance Scenarios**:

1. **Given** the blog index page, **When** it loads, **Then** posts are listed newest first, each showing title, date, and a short excerpt.
2. **Given** a visitor clicks a post title on the index, **When** the link activates, **Then** they see the full post content on its own page.
3. **Given** Cristiane creates a new Markdown file in the posts directory with proper front matter, **When** the site rebuilds, **Then** the new post appears at the top of the blog index without any other file changes.

---

### User Story 3 - Projects Showcase (Priority: P3)

A visitor navigates to the Projects section and sees a list of projects. They click a project to see its detail page with title, description, images, links, and what was used or learned. Cristiane adds a new project by creating a Markdown file or adding an entry to a data file.

**Why this priority**: Projects demonstrate Cristiane's work and skills. This section is important for professional visibility but less frequently updated than blog posts.

**Independent Test**: Add two sample projects and verify they appear on the projects index, each linking to a detail page with all expected fields.

**Acceptance Scenarios**:

1. **Given** the projects index page, **When** it loads, **Then** all projects are listed with their titles and short descriptions.
2. **Given** a visitor clicks a project title, **When** the link activates, **Then** they see the project detail page with title, description, images, external links, and a section on what was used or learned.
3. **Given** Cristiane adds a new project file with proper front matter, **When** the site rebuilds, **Then** the new project appears on the index without any other file changes.

---

### User Story 4 - Portfolio / Resume (Priority: P4)

A visitor navigates to the Portfolio section and reads about Cristiane's background, experience, and skills. They can optionally download a resume file. A contact method is available on this page.

**Why this priority**: This is mostly static content that changes infrequently. It is important for professional credibility but does not require the dynamic data-driven patterns of the blog or projects sections.

**Independent Test**: Load the portfolio page and verify it displays background, experience, skills, a contact method, and a download link for the resume file.

**Acceptance Scenarios**:

1. **Given** a visitor opens the Portfolio page, **When** it loads, **Then** they see sections for background, experience, and skills.
2. **Given** a visitor looks for contact information, **When** they scan the Portfolio page, **Then** they find a contact method (email link or contact form reference).
3. **Given** a resume file exists in the site assets, **When** a visitor clicks the resume download link, **Then** the file downloads.

---

### User Story 5 - Curation Page (Priority: P5)

A visitor navigates to the Curation section and sees a collection of recommended items (links, articles, tools, books) grouped by category. Each item has a short note explaining why Cristiane recommends it. Cristiane adds new items by editing a data file.

**Why this priority**: This is a supplementary section that adds personality but is not essential for the site's core purpose. It validates the data-file-driven content pattern using YAML.

**Independent Test**: Add sample items across two categories in a data file and verify they appear grouped by category on the curation page, each with its title, link, and note.

**Acceptance Scenarios**:

1. **Given** the curation page, **When** it loads, **Then** items are displayed grouped by category with visible category headings.
2. **Given** a curation item has a link, **When** a visitor clicks it, **Then** the link opens the external resource in a new tab.
3. **Given** Cristiane adds a new item to the curation data file, **When** the site rebuilds, **Then** the new item appears under the correct category without any other file changes.

---

### Edge Cases

- What happens when there are no blog posts yet? The blog index displays a friendly message like "No posts yet" instead of a blank page.
- What happens when there are no projects yet? The projects index displays a friendly empty-state message.
- What happens when the resume file is missing? The download link is hidden or displays a note that it is not yet available.
- What happens when a curation category has no items? The category heading is not displayed.
- What happens when a visitor accesses a URL that does not exist? A custom 404 page is shown with navigation back to the home page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST have a home page displaying Cristiane's name, a one-line description, a photo, and external profile links (GitHub, LinkedIn).
- **FR-002**: The site MUST have a consistent navigation bar on every page linking to all five sections (Home, Portfolio, Projects, Blog, Curation).
- **FR-003**: The blog section MUST display posts in reverse chronological order on an index page, with each post linking to its own detail page.
- **FR-004**: Adding a new blog post MUST require only creating a Markdown file with front matter — no changes to other files.
- **FR-005**: The projects section MUST display a list of projects on an index page, with each project linking to a detail page showing title, description, images, links, and what was used or learned.
- **FR-006**: Adding a new project MUST require only creating a content file with front matter — no changes to other files.
- **FR-007**: The portfolio page MUST display background, experience, skills, and a contact method.
- **FR-008**: The portfolio page MUST include a downloadable resume link when a resume file is present.
- **FR-009**: The curation page MUST display recommended items grouped by category, each with a title, link, and short note.
- **FR-010**: Curation items MUST be managed through a YAML data file — adding an item requires only editing that file.
- **FR-011**: All pages MUST be responsive and render correctly on mobile devices, tablets, and desktops.
- **FR-012**: The site MUST include a custom 404 page with navigation back to the home page.
- **FR-013**: All content (posts, projects, curation items, portfolio details) MUST live in Markdown or YAML data files, not hardcoded in HTML.
- **FR-014**: The site MUST build with Jekyll and deploy on GitHub Pages without custom build tools.

### Key Entities

- **Blog Post**: A piece of written content with a title, date, body (Markdown), and optional excerpt. Lives as a file in the Jekyll posts directory.
- **Project**: A showcase item with a title, description, images, external links, and a "what I used/learned" section. Lives as a content file with front matter.
- **Curation Item**: A recommended resource with a title, URL, category, and short note. Lives as an entry in a YAML data file.
- **Profile Link**: An external link (GitHub, LinkedIn, etc.) with a label and URL. Managed through site configuration or a data file.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All five sections (Home, Portfolio, Projects, Blog, Curation) are reachable from any page via navigation within one click.
- **SC-002**: A new blog post can be published by creating a single Markdown file and pushing to the repository — no other files need to change.
- **SC-003**: A new project can be added by creating a single content file and pushing — no other files need to change.
- **SC-004**: A new curation item can be added by editing a single YAML file and pushing — no other files need to change.
- **SC-005**: Every page loads in under 3 seconds on a standard mobile connection.
- **SC-006**: The site passes basic accessibility checks: all images have alt text, navigation is keyboard-accessible, and color contrast meets WCAG AA.
- **SC-007**: The site builds successfully with `bundle exec jekyll serve` locally and deploys without errors on GitHub Pages.
- **SC-008**: All pages render correctly on viewports from 320px to 1920px wide.

## Assumptions

- The site has a single author (Cristiane) and no user accounts, authentication, or authorization.
- Contact method is a simple email link (mailto:); no server-side contact form is needed.
- The resume is a static file (PDF) placed in the site's assets directory; there is no dynamic resume generation.
- Images for projects and the profile photo are provided by Cristiane and stored in the repository.
- The site uses a minimal custom theme or layout built from scratch (not a third-party Jekyll theme gem), keeping dependencies simple.
- Comments on blog posts are out of scope for the initial version.
- Search functionality is out of scope for the initial version.
- Analytics or tracking scripts are out of scope for the initial version.
