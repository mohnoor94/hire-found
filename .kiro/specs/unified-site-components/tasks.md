# Implementation Plan: Unified Site Components

## Overview

Extract shared UI elements (Tailwind config, CSS, navigation, footer) from the HireFound static site into reusable vanilla JS modules and shared files. The homepage is the source of truth. Implementation proceeds bottom-up: shared utilities first, then config/CSS extraction, then component modules, and finally page integration and cleanup.

## Tasks

- [x] 1. Create shared utilities and configuration files
  - [x] 1.1 Create `/js/utils.js` with the `getBasePath()` path resolution utility
    - Implement the `getBasePath()` function as an ES module export
    - Function computes relative path prefix from current page to project root
    - Returns empty string for root pages, `"../"` for one level deep, etc.
    - _Requirements: 7.1, 7.2, 7.4, 9.1_

  - [ ]* 1.2 Write property tests for `getBasePath()` using fast-check
    - **Property 1: Path resolution depth invariant**
    - For any valid URL pathname with N directory segments, `getBasePath()` returns `"../"` repeated N times
    - **Property 2: Path resolution round-trip with asset concatenation**
    - For any valid URL pathname and asset filename, `getBasePath() + "assets/" + filename` resolves to `/assets/{filename}`
    - **Validates: Requirements 7.1, 7.2, 7.4, 4.4**

  - [x] 1.3 Create `/js/tailwind-config.js` with the shared Tailwind configuration
    - Define `tailwind.config` object with all color tokens, font families, and box-shadow values from the homepage
    - This is a side-effect script (no exports), sets `tailwind.config` on global scope
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [x] 1.4 Create `/css/shared.css` with extracted shared styles
    - Extract from homepage: CSS custom properties (`:root`), `.nav-glass`, `.reveal`/`.revealed`, `.premium-card`, `.filter-pill`, `.skip-link`, focus indicator rules, `prefers-reduced-motion` media query
    - Add Arabic font rule (`[lang="ar"], [dir="rtl"]`) from Jobs_Page
    - Use homepage versions as source of truth for all shared rules
    - _Requirements: 2.1, 2.2, 2.3, 8.3_

- [x] 2. Checkpoint - Ensure shared files are correct
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Implement navigation component
  - [x] 3.1 Create `/js/nav.js` ES module with `initNav()` function
    - Import `getBasePath` from `./utils.js`
    - Detect current page via `window.location.pathname`
    - Render nav with canonical menu labels: About, Find Your Match, Services, Process, Get Started
    - Homepage: use anchor hrefs (`#about`, `#vacancies`, `#services`, `#how-it-works`)
    - Other pages: use absolute paths (`/#about`, `/jobs/`, `/#services`, `/#how-it-works`)
    - Highlight active page link with `aria-current="page"`, semibold font, bottom border
    - Apply `nav-glass` backdrop-blur styling
    - Mobile CTA: min-height 44px, min-width 44px
    - Homepage "Get Started": open booking modal (`window.BookingModal.open()`) with fallback to `/#contact`
    - Other pages "Get Started": navigate to `/#contact`
    - Homepage: nav starts hidden, slides in after scroll past hero (500ms transition)
    - Other pages: nav visible immediately
    - Include `<noscript>` fallback guidance in comments
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 7.3, 7.4_

  - [ ]* 3.2 Write unit tests for the nav component
    - Test correct labels rendered in correct order
    - Test homepage anchor hrefs vs non-homepage absolute paths
    - Test active page highlighting on Jobs page
    - Test mobile CTA touch target size
    - Test "Get Started" behavior differences between homepage and other pages
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 5.1–5.6_

- [x] 4. Implement footer component
  - [x] 4.1 Create `/js/footer.js` ES module with `initFooter()` function
    - Import `getBasePath` from `./utils.js`
    - Render footer with: contact CTA (heading, subtext, WhatsApp button, Book a Call button), social links row (LinkedIn, Instagram, Email), logo image, tagline, italic tagline, credit line, copyright
    - Use homepage contact section as source of truth for all text content
    - Apply dark background with two decorative radial gradient overlays
    - Resolve asset paths using `getBasePath()` for logo image
    - Ensure identical visible content regardless of which page includes it
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 4.2 Write unit tests for the footer component
    - Test all required elements are rendered
    - Test content matches homepage source of truth
    - Test asset paths use correct prefix for different page depths
    - _Requirements: 4.2, 4.3, 4.4, 4.6_

- [x] 5. Checkpoint - Ensure components work in isolation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Integrate shared files into pages and remove duplicates
  - [~] 6.1 Update `/index.html` to use shared config, CSS, and components
    - Add Google Fonts link including Noto Sans Arabic (weights 400, 500, 600, 700)
    - Replace inline `tailwind.config` with `<script src="/js/tailwind-config.js"></script>` before Tailwind CDN
    - Add `<link rel="stylesheet" href="/css/shared.css">` before the page-specific `<style>` block
    - Remove duplicated CSS rules from inline `<style>` (`:root` vars, `.nav-glass`, `.reveal`, `.premium-card`, `.filter-pill`, `.skip-link`, focus indicators, `prefers-reduced-motion`)
    - Retain page-specific styles (custom cursor, hero animations, WA chat, pill tabs, step connector, etc.)
    - Replace static nav HTML with container + `<noscript>` fallback, initialize via `initNav()`
    - Replace static footer HTML with container + `<noscript>` fallback, initialize via `initFooter()`
    - Add `<script type="module">` to import and call `initNav` and `initFooter`
    - _Requirements: 1.1, 1.5, 2.1, 2.5, 3.1, 4.1, 6.1, 6.3, 6.5, 6.7, 8.1, 8.3, 9.1, 9.2, 9.3_

  - [~] 6.2 Update `/jobs/index.html` to use shared config, CSS, and components
    - Ensure Google Fonts link includes Noto Sans Arabic (weights 400, 500, 600, 700)
    - Replace inline `tailwind.config` with `<script src="../js/tailwind-config.js"></script>` before Tailwind CDN
    - Add `<link rel="stylesheet" href="../css/shared.css">` before the page-specific `<style>` block
    - Remove duplicated CSS rules from inline `<style>` (`:root` vars, `.nav-glass`, `.reveal`, `.premium-card`, `.filter-pill`, `.skip-link`, focus indicators, `prefers-reduced-motion`)
    - Retain page-specific styles (skeleton loader shimmer, Arabic font rule if not in shared)
    - Replace static nav HTML with container + `<noscript>` fallback, initialize via `initNav()`
    - Replace static footer HTML with container + `<noscript>` fallback, initialize via `initFooter()`
    - Add `<script type="module">` to import and call `initNav` and `initFooter`
    - _Requirements: 1.1, 1.3, 1.5, 2.1, 2.2, 2.5, 3.1, 4.1, 6.2, 6.4, 6.6, 6.7, 8.2, 8.4, 9.1, 9.2, 9.3_

- [ ] 7. Final verification and cleanup
  - [~] 7.1 Verify no inline `tailwind.config` remains in HTML files
    - Confirm both pages load shared config and have no duplicate config objects
    - Confirm no duplicated CSS class definitions between shared file and inline styles
    - Confirm `<link>` for shared CSS precedes `<style>` block in each page's `<head>`
    - _Requirements: 1.5, 2.5, 6.7, 9.4, 9.5_

  - [ ]* 7.2 Write integration tests verifying no 404 errors for assets
    - Test that nav and footer render all images/icons without broken-image indicators
    - Test on both root-level and subdirectory pages
    - _Requirements: 7.3, 7.4_

- [~] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate the `getBasePath()` path resolution utility using fast-check
- Unit tests validate component rendering and behavior
- The project uses no build tools — all files are plain HTML/CSS/JS served statically
- The homepage (`/index.html`) is the source of truth for all shared UI elements

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.3", "1.4"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["3.1", "4.1"] },
    { "id": 3, "tasks": ["3.2", "4.2"] },
    { "id": 4, "tasks": ["6.1", "6.2"] },
    { "id": 5, "tasks": ["7.1", "7.2"] }
  ]
}
```
