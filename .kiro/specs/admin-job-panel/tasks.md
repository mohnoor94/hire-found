# Implementation Plan: Admin Job Panel

## Overview

Build a private admin panel at `/admin/index.html` for managing HireFound job posts. The implementation follows the project's vanilla JS ES module architecture with Firebase CDN imports, Tailwind CSS theming, and no build step. Tasks are ordered to establish infrastructure first, then core modules, then integration and wiring.

## Tasks

- [x] 1. Set up project structure and extend Firebase config
  - [x] 1.1 Extend `js/firebase-config.js` to export `auth` and `app`
    - Import `getAuth` from Firebase Auth CDN
    - Export `app`, `db`, and `auth` from the module
    - Maintain backward compatibility with existing `db` import consumers
    - _Requirements: 1.1, 1.4_

  - [x] 1.2 Create `admin/index.html` with page shell and view containers
    - Include Tailwind CDN, shared CSS, tailwind-config.js
    - Add view containers: loading, sign-in, app (dashboard + editor)
    - Add glassmorphism nav bar with sign-out button
    - Apply HireFound theme fonts (Inter body, DM Serif Display headings)
    - Add responsive meta viewport tag
    - Import `admin/js/app.js` as ES module entry point
    - _Requirements: 7.1, 7.5, 7.7_

  - [x] 1.3 Create `admin/js/toast.js` notification module
    - Implement `showToast({ type, message, duration })` function
    - Support 'success' and 'error' variants with appropriate colors
    - Auto-dismiss after duration (default 5000ms)
    - Stack multiple toasts vertically (max 3 visible)
    - Add `role="alert"` and `aria-live="assertive"` for accessibility
    - Apply CSS transitions (300ms) with project easing variables
    - Respect `prefers-reduced-motion` by reducing animation duration
    - _Requirements: 3.4, 3.6, 4.5, 4.6, 5.2, 5.3, 6.4, 7.2, 7.8_

- [x] 2. Implement authentication guard
  - [x] 2.1 Create `admin/js/auth.js` module
    - Import Firebase Auth SDK (signInWithPopup, GoogleAuthProvider, onAuthStateChanged, setPersistence, browserLocalPersistence)
    - Implement `initAuth(config)` with auth state listener
    - Show loading indicator during auth state verification
    - Render Google sign-in button on sign-in screen with HireFound logo
    - On successful sign-in, check email against allowed email
    - If email doesn't match: show "Access Denied", auto sign-out after 3 seconds
    - If email matches: call `onAuthenticated` callback, show app container
    - Implement `signOut()` to end session and show sign-in screen
    - Implement `getCurrentUser()` to return current user or null
    - Handle Firebase Auth initialization failure with error message and retry button
    - Detect session expiry via `onAuthStateChanged` and redirect to sign-in
    - Set persistence to LOCAL for session survival across browser restarts
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [x]* 2.2 Write property test for auth email rejection (Property 1)
    - **Property 1: Auth email rejection**
    - Generate random email strings that are not the allowed email
    - Verify the auth check function returns "denied" for all generated emails
    - File: `admin/__tests__/auth.property.test.js`
    - **Validates: Requirements 1.2**

- [x] 3. Implement editor module with form validation and slug generation
  - [x] 3.1 Create `admin/js/editor.js` — form rendering and section layout
    - Implement `openCreateEditor(container, callbacks)` with empty form
    - Implement `openEditEditor(container, jobData, jobId, callbacks)` with pre-populated fields
    - Organize fields into collapsible sections: Basic Info, Company Details, Description, Contact
    - All sections expanded by default
    - Render category dropdown (hospitality, tech, fnb, aviation, other)
    - Render employmentType dropdown (full-time, part-time, contract, freelance)
    - Set `dir="rtl"` on titleAr and fullDescriptionAr fields
    - Set min-height 6 rows for shortDescription, 12 rows for fullDescription/fullDescriptionAr
    - Add cancel button that calls `onCancel` callback
    - _Requirements: 3.1, 4.1, 8.1, 8.2, 8.3, 8.7, 8.8_

  - [x] 3.2 Implement form validation logic in `admin/js/editor.js`
    - Implement `validateForm(formData)` returning `{ valid, errors }`
    - Validate required fields: title (1–120 chars), category (enum), location (1–100 chars), employmentType (enum)
    - Validate optional fields when present: contactWhatsApp (digits only, 7–15 chars), contactEmail (email format)
    - Validate slug format (lowercase alphanumeric + hyphens, max 80 chars)
    - Validate field length constraints: titleAr (max 120), shortDescription (max 300), salary (max 100)
    - Show inline validation errors on blur for required fields
    - Block form submission when any field is invalid
    - _Requirements: 3.2, 3.8, 4.2, 4.3, 8.4_

  - [x] 3.3 Implement slug generation in `admin/js/editor.js`
    - Implement `generateSlug(title)` function
    - Lowercase input, replace spaces/non-alphanumeric with hyphens
    - Collapse consecutive hyphens, strip leading/trailing hyphens
    - Truncate to 80 characters
    - Auto-generate slug on title input when slug hasn't been manually edited
    - Stop auto-generation if user edits slug field directly
    - _Requirements: 3.5, 8.5, 8.6_

  - [x] 3.4 Write property test for slug generation (Property 5)
    - **Property 5: Slug generation structural invariants**
    - Generate random non-empty title strings
    - Verify slug contains only lowercase alphanumeric + hyphens
    - Verify slug doesn't start/end with hyphen
    - Verify no consecutive hyphens
    - Verify length ≤ 80 characters
    - File: `admin/__tests__/slug.property.test.js`
    - **Validates: Requirements 3.5, 8.5**

  - [x] 3.5 Write property test for form validation (Property 4)
    - **Property 4: Form validation rejects invalid data**
    - Generate random form data with at least one invalid required field or invalid optional field format
    - Verify `validateForm` returns `valid: false` with error entries for each invalid field
    - File: `admin/__tests__/validation.property.test.js`
    - **Validates: Requirements 3.2, 3.8, 4.2, 4.3, 8.4**

  - [x] 3.6 Write property test for slug deduplication (Property 6)
    - **Property 6: Slug deduplication uniqueness**
    - Generate random base slugs and sets of existing slugs
    - Verify the deduplication function returns a slug not in the existing set
    - Verify the returned slug preserves the base slug as a prefix
    - File: `admin/__tests__/slug.property.test.js`
    - **Validates: Requirements 3.7**

- [x] 4. Checkpoint — Ensure core modules work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement dashboard module
  - [x] 5.1 Create `admin/js/dashboard.js` — job list rendering
    - Implement `initDashboard(container, callbacks)` to set up the dashboard view
    - Implement `refreshJobs()` to fetch all jobs from Firestore ordered by `createdAt` descending
    - Render each job as a card with: title, category badge (using CATEGORY_COLORS), location, employmentType, companyName, active/inactive toggle
    - Display total job count and filtered job count
    - Show 6 animated skeleton placeholder cards during loading
    - Show error state with retry button if fetch fails or exceeds 10 seconds
    - Show empty state with illustration when no jobs match filters
    - Add "New Job" button that calls `onNewJob` callback
    - Add edit and delete action buttons on each card
    - _Requirements: 2.1, 2.2, 2.7, 2.8, 2.9, 2.10, 7.4, 7.6_

  - [x] 5.2 Implement search and filter logic in `admin/js/dashboard.js`
    - Add search input that filters by title, companyName, or location
    - Debounce search to 300ms after last keystroke
    - Add category dropdown filter
    - Add status toggle filter (active/inactive/all)
    - Apply all filters simultaneously (AND logic)
    - Update visible count when filters change
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7_

  - [x] 5.3 Implement card update and removal helpers in `admin/js/dashboard.js`
    - Implement `updateJobCard(jobId, data)` to update a single card in-place
    - Implement `removeJobCard(jobId)` with exit animation (300ms)
    - _Requirements: 4.5, 5.2, 6.2, 6.5_

  - [x]* 5.4 Write property test for combined filter correctness (Property 3)
    - **Property 3: Combined filter correctness**
    - Generate random lists of job objects and random filter combinations
    - Verify filtered result contains only jobs satisfying ALL active conditions
    - Verify reported count equals filtered result array length
    - File: `admin/__tests__/filters.property.test.js`
    - **Validates: Requirements 2.3, 2.4, 2.5, 2.6, 2.7**

  - [x]* 5.5 Write property test for job card rendering completeness (Property 2)
    - **Property 2: Job card rendering completeness**
    - Generate random valid Job_Post objects
    - Verify rendered card HTML contains title, category badge, location, employmentType, companyName, and status indicator
    - File: `admin/__tests__/card-render.property.test.js`
    - **Validates: Requirements 2.2**

- [x] 6. Implement app coordinator and CRUD operations
  - [x] 6.1 Create `admin/js/app.js` — view routing and state coordination
    - Implement `initApp()` as entry point
    - Initialize auth, then dashboard on successful authentication
    - Implement view switching between dashboard and editor
    - Display personalized greeting with time-of-day logic
    - Wire "New Job" button to open create editor
    - Wire edit action to open edit editor with job data
    - _Requirements: 1.3, 7.3_

  - [x] 6.2 Implement create job flow in `admin/js/app.js`
    - On editor save: validate form, check slug uniqueness (append suffix if needed)
    - Write document to Firestore with server-generated `createdAt` and `isActive: true`
    - Show success toast, add new card to top of job list
    - On failure: show error toast, preserve form data
    - _Requirements: 3.3, 3.4, 3.6, 3.7_

  - [x] 6.3 Implement edit job flow in `admin/js/app.js`
    - On editor save: validate form, disable submit button, show loading indicator
    - Update Firestore document with changed fields
    - Show success toast, refresh card in job list
    - On failure: show error toast, re-enable submit, preserve form data
    - _Requirements: 4.4, 4.5, 4.6_

  - [x] 6.4 Implement toggle active status in `admin/js/app.js`
    - Disable toggle switch on click
    - Send Firestore update to flip `isActive` boolean
    - On success: update toggle position and card indicator with 200–300ms transition
    - On failure or timeout (>10s): revert toggle, show error toast
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 6.5 Implement delete job flow in `admin/js/app.js`
    - Show confirmation modal with job title, warning message, confirm/cancel buttons
    - Apply glassmorphism to modal overlay
    - On confirm: disable confirm button, delete Firestore document
    - On success: close dialog, remove card with exit animation, update counts
    - On failure: close dialog, show error toast, keep card in list
    - On cancel: close dialog without changes
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x]* 6.6 Write property test for time-of-day greeting (Property 7)
    - **Property 7: Time-of-day greeting correctness**
    - Generate random hour values 0–23
    - Verify "Good morning" for 5–11, "Good afternoon" for 12–16, "Good evening" for 17–23 and 0–4
    - File: `admin/__tests__/greeting.property.test.js`
    - **Validates: Requirements 7.3**

- [x] 7. Checkpoint — Ensure all modules integrate correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Firestore security rules and UI polish
  - [x] 8.1 Configure Firestore Security Rules for the `jobs` collection
    - Allow public read for active jobs (`isActive == true`)
    - Allow full read/write only for authenticated user with allowed email
    - Deploy rules to Firebase project
    - _Requirements: 1.2, 3.3, 4.4_

  - [x] 8.2 Apply micro-interactions and responsive polish to `admin/index.html`
    - Add CSS transitions (300–500ms) with `--ease-out-quint` / `--ease-out-expo` for card hovers, page transitions, form reveals
    - Ensure all interactive elements have minimum 44x44px touch targets
    - Implement single-column layout below 768px, multi-column at 768px+
    - Add `prefers-reduced-motion` media query to disable motion animations
    - Ensure loading indicators appear within 200ms of operation start
    - _Requirements: 7.2, 7.6, 7.7, 7.8_

- [x] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- All JS modules use CDN ESM imports — no npm bundling for frontend code
- Tests run via Vitest in Node.js (fast-check for property tests)
- The admin panel is a single HTML page with JS-driven view switching (no page reloads)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.3"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["3.2", "3.3"] },
    { "id": 4, "tasks": ["3.4", "3.5", "3.6", "5.1"] },
    { "id": 5, "tasks": ["5.2", "5.3"] },
    { "id": 6, "tasks": ["5.4", "5.5", "6.1"] },
    { "id": 7, "tasks": ["6.2", "6.3", "6.4", "6.5"] },
    { "id": 8, "tasks": ["6.6", "8.1", "8.2"] }
  ]
}
```
