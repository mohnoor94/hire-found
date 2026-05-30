# Requirements Document

## Introduction

Add quality-of-life improvements to Yasmin's admin panel that streamline daily workflows. This includes a Quick Links section for frequently used external tools (Tally form creation, Cal.com settings), per-job-card links to create Tally forms, a URL path change from `/admin/` to `/yasmin/`, and a color/contrast review pass to ensure the butterfly-themed palette remains legible and visually clear.

## Glossary

- **Admin_Panel**: The authenticated web application used by Yasmin to manage job posts, currently served at `/admin/` and to be relocated to `/yasmin/`
- **Quick_Links_Section**: A dedicated area on the dashboard home view that provides one-click access to frequently used external tools and services
- **Tally_Link**: A hyperlink that opens the Tally form builder to create a new application form, optionally pre-associated with a specific job post
- **Cal_Link**: A hyperlink that opens the Cal.com dashboard for managing booking availability and event types
- **Job_Card**: The individual card component in the dashboard grid representing a single job post
- **Color_Contrast**: The measurable difference in luminance between foreground text/icons and their background, evaluated against WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text and UI components)

## Requirements

### Requirement 1: Quick Links Section on Dashboard

**User Story:** As Yasmin, I want a Quick Links section on my dashboard home page, so that I can access my most-used external tools in one click without leaving the admin panel to search for URLs.

#### Acceptance Criteria

1. WHEN the dashboard view is rendered, THE Admin_Panel SHALL display a Quick_Links_Section positioned between the greeting section and the "Your Listings" header
2. THE Quick_Links_Section SHALL contain a link labeled "Create New Tally Form" that opens the Tally form builder (https://tally.so/forms/create) in a new browser tab
3. THE Quick_Links_Section SHALL contain a link labeled "Cal.com Settings" that opens the Cal.com dashboard (https://app.cal.com) in a new browser tab
4. THE Quick_Links_Section SHALL contain a link labeled "View Live Site" that opens the HireFound homepage (the root `/` path) in a new browser tab
5. THE Quick_Links_Section SHALL render each link as a visually distinct card or pill with an icon, a label, and appropriate hover feedback consistent with the Butterfly_Theme
6. THE Quick_Links_Section SHALL render all links with `target="_blank"` and `rel="noopener noreferrer"` attributes for security
7. THE Quick_Links_Section SHALL render all link elements with a minimum touch-target size of 44x44 CSS pixels

### Requirement 2: Per-Job Tally Form Link

**User Story:** As Yasmin, I want a quick action on each job card to create a Tally form for that specific job, so that I can set up application forms without manually navigating to Tally and remembering which job I was working on.

#### Acceptance Criteria

1. THE Job_Card SHALL display a "Create Form" action button in the card footer actions row, positioned after the existing "View" link and before the "Edit" button
2. WHEN the "Create Form" button is clicked, THE Admin_Panel SHALL open the Tally form builder URL (https://tally.so/forms/create) in a new browser tab
3. THE "Create Form" button SHALL be styled consistently with the existing card action buttons (rounded-lg, text-xs font-medium, min 44x44px touch target) using a distinct but harmonious color from the Butterfly_Theme palette (butterfly-gold text on butterfly-gold/10 background)
4. THE "Create Form" button SHALL include an appropriate icon (document/form icon) and the text label "Create Form"
5. THE "Create Form" button click SHALL NOT trigger the card's own click handler (edit action) by using event propagation stopping

### Requirement 3: URL Path Change from /admin/ to /yasmin/

**User Story:** As Yasmin, I want the admin panel URL to be `/yasmin/` instead of `/admin/`, so that the URL feels personal and matches the "Yasmin's Space" branding.

#### Acceptance Criteria

1. THE Admin_Panel SHALL be served at the `/yasmin/` URL path by relocating the admin directory to a directory named `yasmin`
2. WHEN a user navigates to `/yasmin/`, THE Admin_Panel SHALL load and function identically to the current `/admin/` behavior
3. THE Admin_Panel internal asset references (JS imports, CSS links, font links) SHALL resolve correctly from the new `/yasmin/` path
4. THE Nav_Bar links to "Main Site" and "Jobs Page" SHALL continue to resolve correctly from the `/yasmin/` directory (using relative paths `../` and `../jobs/`)
5. THE firebase-config.js import path in auth.js and app.js SHALL be updated to resolve from the new directory location

### Requirement 4: Color and Contrast Review

**User Story:** As Yasmin, I want the admin panel colors to be clear and easy to read, so that text, icons, and interactive elements are never hard to distinguish from their backgrounds.

#### Acceptance Criteria

1. THE Admin_Panel SHALL ensure all body text (text-text-main on gradient background) meets WCAG 2.1 AA contrast ratio of at least 4.5:1
2. THE Admin_Panel SHALL ensure all muted/secondary text (text-muted) on white or near-white card backgrounds meets WCAG 2.1 AA contrast ratio of at least 4.5:1
3. THE Admin_Panel SHALL ensure the "New Job" button and Quick Links have sufficient contrast between their text color and background color (at least 4.5:1 for normal text)
4. THE Admin_Panel SHALL ensure the active/inactive status indicator text on Job_Card backgrounds meets a minimum contrast ratio of 3:1 for UI components
5. IF the butterfly-lavender color (#C4B5FD) is used as a background for white text (e.g., buttons), THEN THE Admin_Panel SHALL darken the background to at least #A78BFA (purple-400) to achieve a 4.5:1 contrast ratio with white text
6. THE Nav_Bar text links (text-text-main) SHALL maintain at least 4.5:1 contrast against the nav-glass translucent background on both light and dark page scroll positions
7. THE filter input borders and placeholder text SHALL maintain at least 3:1 contrast ratio against their white background to remain perceivable

### Requirement 5: Keyboard Shortcut for New Job

**User Story:** As Yasmin, I want a keyboard shortcut to quickly create a new job post, so that I can work faster without reaching for the mouse.

#### Acceptance Criteria

1. WHILE the dashboard view is active and no modal or editor is open, WHEN Yasmin presses the "N" key (without modifier keys), THE Admin_Panel SHALL open the job editor in create mode
2. WHILE the editor view or a modal dialog is active, THE Admin_Panel SHALL NOT respond to the "N" key shortcut to prevent accidental navigation
3. WHILE focus is inside a text input, textarea, select, or contenteditable element, THE Admin_Panel SHALL NOT respond to the "N" key shortcut to prevent interference with typing
4. THE Admin_Panel SHALL display a subtle hint near the "New Job" button indicating the keyboard shortcut (e.g., "Press N") visible only on viewports 768px and above

### Requirement 6: Job Count Summary in Nav Bar

**User Story:** As Yasmin, I want to see a quick count of my active job posts in the navigation bar, so that I always know my current listing status at a glance without scrolling to the dashboard content.

#### Acceptance Criteria

1. WHILE the dashboard view is loaded and jobs have been fetched, THE Nav_Bar SHALL display a badge showing the count of active job posts (where isActive is true)
2. THE badge SHALL be positioned adjacent to the "Yasmin's Space" branding text in the nav bar, styled as a small pill (rounded-full, text-xs, px-2 py-0.5) using butterfly-lavender background with dark text
3. WHEN a job's active status is toggled or a job is created or deleted, THE badge count SHALL update immediately without requiring a page refresh
4. IF no jobs are loaded yet (loading state), THEN THE badge SHALL NOT be displayed until job data is available

