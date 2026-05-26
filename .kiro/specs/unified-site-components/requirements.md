# Requirements Document

## Introduction

Unify the visual experience and component structure across the HireFound site (homepage, jobs listing page, and job detail view). The homepage (`/index.html`) serves as the source of truth for styling, navigation labels, and layout patterns. This spec covers extracting reusable partial components (nav, footer, shared CSS/config), resolving inconsistencies in menu item titles, and applying visual enhancements where needed — all without introducing a build tool or framework.

## Glossary

- **Homepage**: The root page at `/index.html`, treated as the reference/source of truth for all shared UI elements.
- **Jobs_Page**: The jobs listing and detail page at `/jobs/index.html`.
- **Nav_Component**: The sticky navigation bar shared across all pages.
- **Footer_Component**: The footer section shared across all pages, including contact CTAs and branding.
- **Shared_Styles**: The CSS custom properties, Tailwind config, and utility classes used across all pages.
- **Partial**: A reusable HTML/JS snippet loaded at runtime or included via a simple templating approach (e.g., JS-injected components) to avoid copy-paste duplication.
- **Source_of_Truth**: The homepage — when differences exist between pages, the homepage version is authoritative.

## Requirements

### Requirement 1: Shared Tailwind Configuration

**User Story:** As a developer, I want a single Tailwind configuration used across all pages, so that color tokens, fonts, shadows, and spacing are consistent site-wide.

#### Acceptance Criteria

1. THE Shared_Styles SHALL define the Tailwind config in a single external JavaScript file that is referenced via a `<script>` tag by every HTML page in the project.
2. WHEN a page loads the shared Tailwind config, THE page SHALL render using the same color tokens (warm, primary, secondary, dark, muted, success, whatsapp and their variants), font families (sans, accent), and box-shadow values (card, card-hover, warm, glow, glass) as defined in the shared config file.
3. THE Shared_Styles SHALL include the Noto Sans Arabic font family in the shared font stack, and every page SHALL load the Noto Sans Arabic Google Fonts stylesheet so the font is available for rendering.
4. IF the shared config file fails to load, THEN THE page SHALL fall back to Tailwind's default configuration and all page content SHALL remain visible, scrollable, and interactive with no overlapping elements.
5. WHEN the shared Tailwind config file is loaded by a page, THE page SHALL NOT contain any inline `tailwind.config` object that overrides or duplicates the shared configuration values.

### Requirement 2: Shared CSS Styles

**User Story:** As a developer, I want shared CSS utility classes (nav-glass, reveal animations, premium-card, filter-pill, etc.) defined in one place, so that I don't duplicate styles across pages.

#### Acceptance Criteria

1. THE Shared_Styles SHALL be defined in a single external CSS file loaded by all pages (Homepage and Jobs_Page).
2. WHEN the shared CSS file is loaded, THE page SHALL have access to all utility classes currently duplicated between Homepage and Jobs_Page (CSS custom properties --ease-out-quint, --ease-out-expo, --primary, --secondary, --dark; nav-glass, reveal, revealed, premium-card, filter-pill, skip-link, focus indicators for a/button/[tabindex="0"], and the prefers-reduced-motion media query rule), plus the Arabic font rule used by Jobs_Page.
3. THE shared CSS file SHALL use the Homepage versions of all styles as the Source_of_Truth.
4. IF the shared CSS file fails to load, THEN THE page SHALL remain usable such that all text content is visible, no elements overlap or overflow the viewport, and interactive controls remain operable via default browser styling.
5. WHEN the shared CSS file is adopted, THEN each page SHALL remove its inline duplicate definitions of the shared classes so that no shared class is defined in more than one location.

### Requirement 3: Unified Navigation Component

**User Story:** As a site visitor, I want the navigation bar to look and behave identically across all pages, so that I have a consistent browsing experience.

#### Acceptance Criteria

1. THE Nav_Component SHALL use a single reusable JavaScript module to render the navigation bar on all pages, producing identical DOM structure and CSS classes on each page.
2. THE Nav_Component SHALL display the following menu items in left-to-right order: "About", "Find Your Match", "Services", "Process", and a "Get Started" CTA button — matching the Homepage labels exactly.
3. WHEN the visitor is on the Jobs_Page, THE Nav_Component SHALL highlight the "Find Your Match" link as the active page indicator by applying visually distinct styling (font-weight semibold and a bottom border) and setting the `aria-current="page"` attribute.
4. WHEN the visitor is on the Homepage, THE Nav_Component SHALL link menu items to in-page anchors (#about, #vacancies, #services, #how-it-works).
5. WHEN the visitor is on a non-homepage page, THE Nav_Component SHALL link menu items to absolute paths with anchors (/#about, /jobs/, /#services, /#how-it-works).
6. THE Nav_Component SHALL render the mobile "Get Started" CTA with a minimum touch target size of 44×44 CSS pixels (min-height: 44px, min-width: 44px).
7. THE Nav_Component SHALL apply the nav-glass backdrop-blur styling (background rgba(255, 250, 245, 0.8), backdrop-filter blur(16px), and a bottom border) consistently across all pages.
8. WHEN the "Get Started" button is clicked on the Homepage, THE Nav_Component SHALL open the booking modal without navigating away from the page.
9. WHEN the "Get Started" button is clicked on a non-homepage page, THE Nav_Component SHALL navigate the visitor to the homepage contact section (/#contact).
10. WHEN the Homepage is first loaded, THE Nav_Component SHALL be hidden off-screen (translated above the viewport) and become visible by sliding down within 500ms after the visitor scrolls past the hero section.
11. WHEN a non-homepage page is loaded, THE Nav_Component SHALL be visible immediately without a scroll-triggered entrance animation.

### Requirement 4: Unified Footer Component

**User Story:** As a site visitor, I want the footer to be consistent across all pages, so that I always have access to contact options and branding.

#### Acceptance Criteria

1. THE Footer_Component SHALL be implemented as a single reusable JavaScript module that programmatically renders the footer HTML into a designated container element on every page where it is included.
2. THE Footer_Component SHALL render the following elements in order: a contact CTA section containing a heading, subtext, a WhatsApp button linking to the HireFound WhatsApp number, and a Book a Call button linking to the HireFound booking URL; a social links row containing LinkedIn, Instagram, and Email icon links; the HireFound logo image (hirefound-logo-white.svg); a tagline; a credit line; and a copyright notice.
3. THE Footer_Component SHALL use the Homepage contact section (section id="contact") as the Source_of_Truth, reproducing the same heading text, subtext copy, button labels, social link URLs, tagline text, credit line text, and copyright text defined there.
4. WHEN rendered on a page located in a subdirectory (e.g., /jobs/index.html), THE Footer_Component SHALL resolve asset paths relative to the page depth by prepending "../" for each directory level below the project root, so that assets such as "../assets/hirefound-logo-white.svg" load correctly.
5. THE Footer_Component SHALL apply a dark background (bg-dark / #1A1A2E) with two decorative radial gradient overlays matching the Homepage contact section: one primary-colored gradient (rgba(139, 34, 82, 0.2) at 40% opacity) positioned at 30% 40%, and one secondary-colored gradient (rgba(212, 165, 116, 0.15) at 30% opacity) positioned at 80% 70%.
6. WHEN the Footer_Component is rendered on any page, THE Footer_Component SHALL produce identical visible content (text, links, and images) regardless of which page includes it, such that a visual comparison between any two pages shows no difference in footer content or layout.

### Requirement 5: Navigation Label Consistency

**User Story:** As a site visitor, I want menu item labels to be the same on every page, so that I'm never confused about where a link will take me.

#### Acceptance Criteria

1. THE Nav_Component SHALL use "Find Your Match" as the label for the jobs/vacancies navigation link on all pages, including when that link represents the currently active page.
2. THE Nav_Component SHALL use "About" as the label for the about section link on all pages.
3. THE Nav_Component SHALL use "Services" as the label for the services section link on all pages.
4. THE Nav_Component SHALL use "Process" as the label for the how-it-works section link on all pages.
5. THE Nav_Component SHALL display identical label text in both the desktop navigation menu and the mobile navigation menu for each link.
6. IF a page currently uses a different label for a navigation destination (e.g., "Jobs" instead of "Find Your Match"), THEN THE Nav_Component SHALL replace that label with the canonical label defined in criteria 1 through 4.

### Requirement 6: Page-Specific Style Removal

**User Story:** As a developer, I want to remove duplicated inline styles from individual pages after extracting them into shared files, so that the codebase is maintainable.

#### Acceptance Criteria

1. WHEN shared CSS and Tailwind config files are created, THE Homepage SHALL remove from its inline `<style>` block all style rules that are duplicated in the shared CSS file, including at minimum: CSS custom properties (`:root` variables), `.nav-glass`, `.reveal`/`.revealed`, `.premium-card`, `.filter-pill`, focus indicator rules, `.skip-link`, and `prefers-reduced-motion` media query rules.
2. WHEN shared CSS and Tailwind config files are created, THE Jobs_Page SHALL remove from its inline `<style>` block all style rules that are duplicated in the shared CSS file, including at minimum: CSS custom properties (`:root` variables), `.nav-glass`, `.reveal`/`.revealed`, `.premium-card`, `.filter-pill`, focus indicator rules, `.skip-link`, and `prefers-reduced-motion` media query rules.
3. THE Homepage SHALL retain in its inline `<style>` block all page-specific styles not present in the shared CSS file, including: custom cursor styles, hero animations (`.hero-mouse-glow`, `.text-reveal`, `.fade-up`, `.floating`, `.scroll-bounce`, `.photo-glow`), WhatsApp chat window styles (`.wa-chat-window`, `.wa-bubble`, typing dots, reply bar), pill tabs, step connector, testimonial, magnetic button, text gradient, form input focus, icon boxes, section glow, tab panel, step pulse, logo stagger, and vacancy card transition.
4. THE Jobs_Page SHALL retain in its inline `<style>` block all page-specific styles not present in the shared CSS file, including: skeleton loader (`@keyframes shimmer`, `.skeleton`) and Arabic font-family rule (`[lang="ar"], [dir="rtl"]`).
5. WHEN inline styles are removed, THE Homepage SHALL load the shared CSS file via a `<link>` element placed in the `<head>` section before the page-specific `<style>` block, so that page-specific rules can override shared rules when needed.
6. WHEN inline styles are removed, THE Jobs_Page SHALL load the shared CSS file via a `<link>` element placed in the `<head>` section before the page-specific `<style>` block, so that page-specific rules can override shared rules when needed.
7. WHEN shared CSS and Tailwind config files are loaded, THE pages SHALL render with no visual difference compared to their appearance before the refactor, as verified by matching computed styles on navigation, cards, filter pills, and reveal animations.

### Requirement 7: Asset Path Consistency

**User Story:** As a developer, I want asset references to work correctly regardless of page depth, so that images and icons render on all pages.

#### Acceptance Criteria

1. WHEN a shared component is rendered on a root-level page (e.g., Homepage at `/index.html`), THE component SHALL reference assets without a directory prefix (e.g., `assets/logo.svg`).
2. WHEN a shared component is rendered on a page one directory level deep (e.g., Jobs_Page at `/jobs/index.html`), THE component SHALL reference assets with a single `../` prefix (e.g., `../assets/logo.svg`).
3. WHEN any page is loaded in the browser, THE Nav_Component and Footer_Component SHALL render all referenced images and icons without producing broken-image indicators or 404 network errors for asset URLs.
4. THE Nav_Component and Footer_Component SHALL reference the same set of asset filenames on every page, differing only in the relative path prefix corresponding to the page's directory depth.

### Requirement 8: Visual Enhancement — Consistent Font Loading

**User Story:** As a site visitor, I want all pages to load the same fonts including Arabic support, so that text renders consistently everywhere.

#### Acceptance Criteria

1. WHEN the Homepage loads, THE page SHALL include Google Fonts preconnect links (`fonts.googleapis.com` and `fonts.gstatic.com` with crossorigin) and a stylesheet link that loads DM Serif Display, Inter, and Noto Sans Arabic with weights 400, 500, 600, and 700 for Noto Sans Arabic.
2. WHEN the Jobs_Page loads, THE page SHALL include the same Google Fonts preconnect links and stylesheet link loading DM Serif Display, Inter, and Noto Sans Arabic with weights 400, 500, 600, and 700 for Noto Sans Arabic.
3. THE Homepage SHALL include a CSS rule that applies Noto Sans Arabic as the primary font-family for elements with `[lang="ar"]` or `[dir="rtl"]` attributes, matching the rule already present on the Jobs_Page.
4. WHEN either page loads, THE page SHALL render any element marked with `lang="ar"` or `dir="rtl"` using the Noto Sans Arabic font family.

### Requirement 9: No Build Tool Requirement

**User Story:** As a developer, I want the component extraction to work without introducing a build tool or framework, so that the site remains a simple static HTML/JS project.

#### Acceptance Criteria

1. THE reusable components SHALL be implemented as vanilla JavaScript ES modules loaded via `<script type="module">`, using only relative paths or CDN URLs for import specifiers (no bare module specifiers that require a bundler to resolve).
2. THE shared CSS SHALL be a plain `.css` file loaded via a standard `<link>` element.
3. THE shared Tailwind config SHALL be a plain `.js` file loaded via a `<script>` element placed before the Tailwind CDN script so that configuration is available when Tailwind processes styles.
4. THE implementation SHALL NOT require npm, a bundler, a transpiler, or any build step to function; serving the project directory with any static HTTP server SHALL render all pages correctly.
5. THE implementation SHALL NOT use syntax that requires transpilation (such as TypeScript or JSX); all JavaScript files SHALL contain only standard ES module syntax supported natively by modern browsers.
