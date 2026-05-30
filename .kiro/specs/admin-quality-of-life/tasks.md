# Implementation Plan: Admin Quality-of-Life Improvements

## Overview

This plan implements six quality-of-life improvements to Yasmin's admin panel: Quick Links section, per-job Tally form button, URL path change from `/admin/` to `/yasmin/`, color/contrast fixes for WCAG 2.1 AA compliance, keyboard shortcut for new job creation, and a job count badge in the nav bar. All changes use vanilla JS modules with Tailwind CSS via CDN — no build step introduced.

## Tasks

- [x] 1. Rename admin directory to yasmin and update references
  - [x] 1.1 Rename the `/admin/` directory to `/yasmin/` and update all internal asset references
    - Rename the `admin/` folder to `yasmin/`
    - Update the `firebase-config.js` import path in `yasmin/js/auth.js` (from `../../js/firebase-config.js` — verify it still resolves)
    - Update the `firebase-config.js` import path in `yasmin/js/app.js`
    - Update any nav bar links that reference `/admin/` to `/yasmin/`
    - Update any links in the main site (`index.html`, other pages) that point to `/admin/`
    - Update GitHub Actions deploy workflow if it references the admin path
    - Move test files from `admin/__tests__/` to `yasmin/__tests__/`
    - Update vitest config if it references `admin/` paths
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2. Checkpoint - Verify directory rename
  - Ensure all relative imports resolve correctly from the new `/yasmin/` path. Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Implement color and contrast fixes
  - [ ] 3.1 Update Tailwind config and CSS for WCAG 2.1 AA compliance
    - In `js/tailwind-config.js`, darken the `muted` color from `#8A8380` to `#6B6560` to achieve ≥4.5:1 contrast on white
    - Add a `butterfly-lavender-dark` color (`#7C3AED`) for buttons that need white text
    - Update the "New Job" button in `yasmin/js/dashboard.js` to use `bg-[#7C3AED]` instead of `bg-butterfly-lavender` for white text
    - Set explicit placeholder text color `placeholder:text-[#6B6560]` on the search input in dashboard filters
    - Verify nav bar text (`text-text-main` #2D2926) on `nav-glass` background meets 4.5:1
    - Ensure status indicator text on job cards meets ≥3:1 for UI components
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ]* 3.2 Write property test for WCAG contrast ratio computation
    - **Property 5: WCAG contrast ratio computation**
    - Implement a `computeContrastRatio(fg, bg)` utility function in `yasmin/js/contrast-utils.js`
    - Write property test in `yasmin/__tests__/contrast.property.test.js` using fast-check
    - Verify that for any two valid sRGB hex colors, the computed ratio equals `(L1 + 0.05) / (L2 + 0.05)` and is always ≥ 1.0
    - **Validates: Requirements 4.1**

  - [ ]* 3.3 Write unit tests for specific color pairs used in the admin panel
    - Test `#2D2926` on `#FFFAF5` ≥ 4.5:1
    - Test updated muted color `#6B6560` on `#FFFFFF` ≥ 4.5:1
    - Test `#FFFFFF` on `#7C3AED` ≥ 4.5:1
    - Test status indicator colors on card gradient ≥ 3:1
    - _Requirements: 4.2, 4.3, 4.5, 4.6_

- [ ] 4. Implement Quick Links section on dashboard
  - [ ] 4.1 Add Quick Links section to the dashboard shell in `yasmin/js/dashboard.js`
    - Add a `renderQuickLinks()` function that returns HTML for 3 link cards
    - Insert the Quick Links section between `#admin-greeting` and the "Your Listings" header in `renderDashboardShell()`
    - Links: "Create New Tally Form" → `https://tally.so/forms/create`, "Cal.com Settings" → `https://app.cal.com`, "View Live Site" → `../`
    - Each link styled as a card/pill with icon, label, hover feedback (lavender → rose)
    - All links have `target="_blank"` and `rel="noopener noreferrer"`
    - All links have minimum 44×44px touch target
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ]* 4.2 Write unit tests for Quick Links rendering
    - Test that 3 links are rendered with correct hrefs
    - Test `target="_blank"` and `rel="noopener noreferrer"` attributes
    - Test minimum 44px touch targets
    - _Requirements: 1.2, 1.3, 1.4, 1.6, 1.7_

- [ ] 5. Implement per-job Tally form button
  - [ ] 5.1 Add "Create Form" button to job card footer in `yasmin/js/dashboard.js`
    - Insert a "Create Form" `<a>` element in `createJobCardElement()` after the "View" link and before the "Edit" button
    - Link href: `https://tally.so/forms/create`, opens in new tab
    - Styled with `text-butterfly-gold bg-butterfly-gold/10 rounded-lg text-xs font-medium min-w-[44px] min-h-[44px]`
    - Include a document/form SVG icon and "Create Form" text label
    - Use `event.stopPropagation()` via `onclick` attribute to prevent card click handler
    - Add `aria-label="Create Tally form for {job.title}"`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 5.2 Write property test for Create Form button event isolation
    - **Property 3: Create Form button event isolation**
    - Verify that clicking the "Create Form" button does not invoke the card's onEdit callback
    - Use fast-check to generate arbitrary job objects and test isolation
    - **Validates: Requirements 2.5**

  - [ ]* 5.3 Write property test for Create Form button presence and position
    - **Property 4: Create Form button presence and position**
    - For any valid job object with non-empty title, verify the "Create Form" link appears after "View" and before "Edit" in DOM order
    - **Validates: Requirements 2.1**

- [ ] 6. Implement keyboard shortcut for new job
  - [ ] 6.1 Create `yasmin/js/shortcuts.js` module with shortcut logic
    - Export `shouldSuppressShortcut(event, viewState)` — returns true if editor/modal is open, focus is in input/textarea/select/contenteditable, or modifier keys are pressed
    - Export `initShortcuts(config)` — registers keydown listener for "N" key, calls `config.onNewJob()` when conditions are met
    - `config.getViewState()` returns `{ isEditorOpen, isModalOpen }`
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ] 6.2 Integrate shortcuts module into `yasmin/js/app.js`
    - Import and call `initShortcuts()` in `handleAuthenticated()` with `onNewJob` callback and `getViewState` function
    - Track `isEditorOpen` and `isModalOpen` state in app.js
    - Add a keyboard hint `<kbd>N</kbd>` element near the "New Job" button, visible only on md+ viewports (`hidden md:inline`)
    - _Requirements: 5.1, 5.4_

  - [ ]* 6.3 Write property test for keyboard shortcut suppression
    - **Property 1: Keyboard shortcut suppression correctness**
    - Use fast-check to generate arbitrary combinations of view state and event targets
    - Verify `shouldSuppressShortcut` returns true iff editor open, modal open, focus in text input, or modifier key pressed
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [ ] 7. Implement job count badge in nav bar
  - [ ] 7.1 Add active job count badge to nav bar in `yasmin/js/app.js` and expose count from `dashboard.js`
    - Export `getActiveJobCount()` from `dashboard.js` that returns the count of jobs where `isActive === true`
    - In `app.js`, create `updateNavBadge(count)` that renders/updates a badge span adjacent to "Yasmin's Space" in the nav
    - Badge styled as `rounded-full text-xs px-2 py-0.5 bg-butterfly-lavender text-text-main font-medium`
    - Call `updateNavBadge()` after job fetch, toggle, create, and delete operations
    - Hide badge until job data is available (not shown during loading)
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 7.2 Write property test for active job count accuracy
    - **Property 2: Active job count accuracy**
    - Use fast-check to generate arrays of job objects with arbitrary `isActive` values
    - Verify `getActiveJobCount(jobs)` equals the count of jobs where `isActive` is strictly `true`
    - **Validates: Requirements 6.1, 6.3**

- [ ] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The directory rename (task 1) must be done first as all subsequent tasks reference the new `/yasmin/` path
- No build step is introduced — all vanilla JS modules with Tailwind CDN

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["3.1", "4.1", "5.1", "6.1", "7.1"] },
    { "id": 2, "tasks": ["3.2", "3.3", "4.2", "5.2", "5.3", "6.2", "7.2"] },
    { "id": 3, "tasks": ["6.3"] }
  ]
}
```
