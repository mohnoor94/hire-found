# Implementation Plan: Jobs Feature

## Overview

This plan implements the dynamic jobs feature for HireFound — replacing hardcoded vacancy cards with live Firestore data, adding a dedicated jobs listing page with filtering and detail views, and integrating application flows via Tally forms and contact CTAs. The implementation uses vanilla JavaScript ES modules loaded via CDN on a static GitHub Pages site.

## Tasks

- [x] 1. Set up Firebase configuration and shared jobs module
  - [x] 1.1 Create `/js/firebase-config.js` module
    - Initialize Firebase v9+ modular SDK via CDN ESM imports
    - Export configured Firestore `db` instance
    - Handle initialization errors gracefully (log to console, export undefined on failure)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 12.4, 12.5_

  - [x] 1.2 Create `/js/jobs.js` shared module with core utility functions
    - Implement `containsArabic(text)` — detects Arabic Unicode range \u0600-\u06FF
    - Implement `truncateText(text, maxLength)` — truncates with ellipsis character
    - Implement `getRelativeTime(timestamp)` — converts Date to "X days ago" format
    - Implement `getCategories(jobs)` — extracts distinct category values
    - Implement `filterByCategory(jobs, category)` — filters jobs by category, "all" returns full list
    - Define `DEFAULTS` object (whatsApp, email, calLink, queryTimeout)
    - Define `CATEGORY_COLORS` map
    - _Requirements: 4.2, 4.3, 5.1, 5.3, 7.3, 9.1_

  - [x] 1.3 Implement `fetchJobs(options)` in `/js/jobs.js`
    - Query Firestore `jobs` collection where `isActive === true`, ordered by `createdAt` desc
    - Support `limit` option for homepage (4 jobs)
    - Filter out expired jobs client-side (`expiresAt < now`)
    - Implement 10-second timeout with AbortController or Promise.race
    - Convert Firestore Timestamps to Date objects
    - Handle undefined `db` gracefully (immediate error)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2. Implement job card rendering and loading states
  - [x] 2.1 Implement `renderSkeletons(count, container)` in `/js/jobs.js`
    - Render shimmer-animated placeholder cards matching Job_Card dimensions
    - Support responsive grid layout (1 col < 768px, 2 cols >= 768px)
    - _Requirements: 4.5, 11.1_

  - [x] 2.2 Implement `renderJobCards(jobs, container)` in `/js/jobs.js`
    - Render cards with: category badge (colored per CATEGORY_COLORS), title, Arabic title (with dir="rtl" lang="ar" if titleAr exists), location, truncated shortDescription (120 chars), relative posted date, employment type badge
    - Make cards clickable — navigate to `?id={slug}`
    - Apply `premium-card` styling, hover lift effect, scroll-reveal animations
    - Handle RTL for Arabic fields — skip empty RTL elements for null/empty titleAr
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 9.1, 9.2, 9.3_

  - [x] 2.3 Implement `renderError(container, onRetry)` and `renderEmpty(container, message)` in `/js/jobs.js`
    - Error state: user-friendly message + retry button that re-triggers fetch with skeletons
    - Empty state: message + WhatsApp and Book a Call CTAs using DEFAULTS
    - _Requirements: 2.4, 2.5, 4.6, 11.2, 11.3_

  - [ ]* 2.4 Write property tests for utility functions (Properties 1, 3, 4, 5, 10)
    - **Property 1: Expiry filtering excludes only expired jobs**
    - **Property 3: Arabic text detection and RTL attribute application**
    - **Property 4: Category extraction produces correct distinct set**
    - **Property 5: Category filtering returns only matching jobs**
    - **Property 10: Text truncation correctness**
    - **Validates: Requirements 2.3, 4.2, 4.3, 5.1, 5.3, 5.4, 9.1, 9.2, 9.3**

- [x] 3. Checkpoint - Core module verification
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Build the Jobs listing page
  - [x] 4.1 Create `/jobs/index.html` with page structure
    - Sticky nav with HireFound logo (link to homepage), nav links (About, Jobs active, Services, Process, Get Started CTA)
    - Skip-to-content link as first focusable element
    - Page header: h1 "Find Your Match" + subtitle (≤150 chars)
    - Filter pills container, job cards grid container, detail view container
    - Footer matching homepage design
    - Semantic HTML (h1, h2, h3, aria-labels, visible focus indicators)
    - Same fonts, colors, Tailwind config as homepage
    - Import firebase-config.js and jobs.js as ES modules
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 12.1, 12.2_

  - [x] 4.2 Implement listing view controller in `/jobs/index.html` inline script
    - On load: check URL for `?id=` param → determine LISTING or DETAIL state
    - LISTING state: show skeletons → fetch all jobs → render cards + filter pills
    - Generate filter pills dynamically from fetched job categories (All + distinct categories)
    - Wire filter pill click handlers — client-side filtering without re-fetch
    - Active pill gets filled style, inactive pills get outlined style
    - Show empty state if no jobs match selected filter
    - _Requirements: 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 11.1_

  - [x] 4.3 Implement detail view controller and `renderJobDetail(job, container)` in `/js/jobs.js`
    - DETAIL state: fetch jobs → find by slug → render detail or NOT_FOUND
    - Detail view: back link "← All Jobs", title, Arabic title (RTL), category badge, location, employment type, company name (if exists), salary (if exists), relative posted date
    - Render fullDescription as rich text (paragraphs, bullets, bold)
    - Apply dir="rtl" to Arabic content blocks (detect via containsArabic)
    - Share button: copy URL to clipboard + show confirmation for 2s
    - Handle NOT_FOUND: "Job Not Found" message + link back to listing
    - Handle expired/inactive jobs accessed via direct URL as NOT_FOUND
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 9.1, 9.2_

  - [x] 4.4 Implement URL routing and history navigation
    - Use `history.pushState` for card click → detail and back link → listing
    - Handle `popstate` event for browser back/forward
    - If pushState unavailable, prevent navigation and keep current view
    - _Requirements: 12.3, 12.6_

  - [ ]* 4.5 Write property tests for rendering functions (Properties 2, 6, 7, 8, 9)
    - **Property 2: Job card contains all required display fields**
    - **Property 6: Job detail renders all available metadata**
    - **Property 7: Tally embed URL construction**
    - **Property 8: Contact CTA message construction**
    - **Property 9: Contact info fallback to defaults**
    - **Validates: Requirements 4.2, 6.3, 7.1, 7.2, 7.3, 7.4**

- [x] 5. Implement application methods
  - [x] 5.1 Implement Tally form embed in job detail view
    - When job has `tallyFormId`: embed Tally form in "How to Apply" section
    - Use widget params: `transparentBackground=1`, `dynamicHeight=1`, `hideTitle=1`, `alignLeft=1`
    - Pass URL-encoded job title as parameter
    - _Requirements: 7.1_

  - [x] 5.2 Implement Contact CTAs fallback in job detail view
    - When job has no `tallyFormId`: show WhatsApp button (pre-filled message with job title), Book a Call button (cal.com/yasminblasi), Email button (subject with job title)
    - Use job-specific contactWhatsApp/contactEmail when non-null, fall back to DEFAULTS
    - _Requirements: 7.2, 7.3, 7.4_

- [x] 6. Checkpoint - Jobs page verification
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Update homepage vacancies integration
  - [x] 7.1 Modify `/index.html` #vacancies section for dynamic loading
    - Remove all hardcoded vacancy card markup from HTML source
    - Add ES module script importing firebase-config.js and jobs.js
    - On load: show skeleton loaders → fetch 4 latest active jobs → render cards
    - Render cards using shared `renderJobCards` with same styling
    - Add "View All Open Roles →" link below cards navigating to /jobs/
    - _Requirements: 8.1, 8.2, 8.3, 8.6, 11.4_

  - [x] 7.2 Handle homepage empty and error states
    - If zero jobs after fetch+filter: replace cards area with message + Contact CTAs (WhatsApp, Book a Call), hide filter pills, keep #vacancies section visible
    - If fetch fails/timeout: hide cards area, show "temporarily unavailable" + WhatsApp/Book a Call CTAs
    - _Requirements: 2.5, 8.4, 8.5_

  - [x] 7.3 Update homepage filter pills to be dynamic
    - Generate filter pills from fetched job categories (instead of hardcoded)
    - Wire client-side filtering for homepage cards
    - Apply same active/inactive pill styling
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8. Responsive design and accessibility polish
  - [x] 8.1 Ensure responsive layout across all views
    - Job cards: 1 column < 768px, 2 columns >= 768px
    - Filter pills: wrap to multiple lines on mobile, no horizontal scroll
    - Detail view: single column, max-width 65ch, min padding 16px
    - Touch targets: minimum 44×44px on mobile for all interactive elements
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 8.2 Ensure accessibility compliance
    - Verify aria-labels on all interactive elements
    - Verify visible focus indicators on all focusable elements
    - Verify skip-to-content link functionality
    - Verify RTL attributes applied correctly to Arabic content on both pages
    - _Requirements: 3.5, 3.6, 9.1, 9.2, 9.3, 9.4_

- [x] 9. Final checkpoint - Full integration verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- All JavaScript uses vanilla ES modules loaded via CDN — no build step required
- Firebase config values are embedded directly in source code (no env vars)
- The existing homepage styles (.premium-card, .filter-pill, .reveal, etc.) should be reused on the jobs page

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3"] },
    { "id": 3, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 4, "tasks": ["2.4"] },
    { "id": 5, "tasks": ["4.1"] },
    { "id": 6, "tasks": ["4.2", "4.3", "5.1", "5.2"] },
    { "id": 7, "tasks": ["4.4"] },
    { "id": 8, "tasks": ["4.5"] },
    { "id": 9, "tasks": ["7.1"] },
    { "id": 10, "tasks": ["7.2", "7.3"] },
    { "id": 11, "tasks": ["8.1", "8.2"] }
  ]
}
```
