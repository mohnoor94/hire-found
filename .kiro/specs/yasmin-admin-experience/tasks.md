# Implementation Plan: Yasmin Admin Experience

## Overview

Transform the HireFound admin panel into a personalized, butterfly-themed workspace for Yasmin. Implementation proceeds in layers: color tokens first, then static page identity changes, followed by dynamic greeting logic, animation, nav indicator, and finally sign-in screen personality. Property-based tests validate correctness properties defined in the design.

## Tasks

- [x] 1. Extend Tailwind config with butterfly color tokens
  - [x] 1.1 Add butterfly-lavender, butterfly-rose, and butterfly-gold color tokens to `/js/tailwind-config.js`
    - Add `'butterfly-lavender': '#C4B5FD'`, `'butterfly-rose': '#FDA4AF'`, `'butterfly-gold': '#FCD34D'` inside `theme.extend.colors`
    - Preserve all existing color tokens (primary, primary-light, primary-dark, secondary, secondary-light, warm, warm-dark, dark, dark-light, text-main, muted, success, whatsapp)
    - _Requirements: 4.1, 4.5_

  - [x] 1.2 Write property test for Tailwind config preservation (Property 4)
    - **Property 4: Original Tailwind color tokens are preserved alongside butterfly tokens**
    - **Validates: Requirements 4.5, 4.1**
    - Create `admin/__tests__/tailwind-config.property.test.js`
    - Verify all original tokens remain with original values
    - Verify butterfly-lavender, butterfly-rose, butterfly-gold are present
    - Use fast-check to enumerate all original token names and assert presence

- [x] 2. Update page identity and create butterfly favicon
  - [x] 2.1 Create butterfly favicon SVG asset at `/assets/butterfly-favicon.svg`
    - Design a butterfly silhouette/outline recognizable at 32x32 pixels
    - Use butterfly-lavender and butterfly-rose colors
    - _Requirements: 3.4_

  - [x] 2.2 Update static page identity in `/admin/index.html`
    - Change `<title>` from "HireFound Admin" to "Yasmin's Space"
    - Change favicon `<link>` href from `../assets/hirefound-signature.svg` to `../assets/butterfly-favicon.svg`
    - Change nav branding `<a>` text from "HireFound Admin" to "Yasmin's Space"
    - Change sign-in `<h1>` from "Admin Panel" to "Yasmin's Space"
    - Change sign-in `<p>` from "Sign in to manage job posts" to "Welcome back, beautiful ✨"
    - Replace the HireFound logo `<img>` in sign-in view with a decorative butterfly SVG element (minimum 48x48px display size)
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 6.1_

  - [x] 2.3 Update sign-in button and background styling in `/admin/index.html`
    - Change sign-in button to use butterfly-rose or butterfly-lavender background with pill shape (rounded-full) and minimum 44x44px touch target
    - Add gradient background to body using warm-to-butterfly-rose top-to-bottom linear gradient
    - _Requirements: 4.2, 6.2, 6.3_

- [x] 3. Checkpoint - Verify static changes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement personalized greeting logic
  - [x] 4.1 Rewrite `renderGreeting` in `/admin/js/app.js` with affectionate templates
    - Define `GREETING_TEMPLATES` array with ≥3 templates using first name and emoji (e.g., "Hey ${name} ✨", "Welcome back, ${name} 🦋", "Hi ${name}, lovely to see you 💜", "Hello ${name} 🌸")
    - Define `SUBTITLES` array with ≥4 phrases, each ≤60 characters, no brand name references
    - Implement `extractFirstName(displayName)` that returns first space-delimited segment or "Yasmin" fallback for null/empty/whitespace
    - Render random greeting from template pool and random subtitle from subtitle pool
    - When `user.photoURL` is present, render circular `<img>` at 48×48px
    - When `user.photoURL` is null/empty, render inline butterfly SVG fallback avatar at 48×48px (no initial-circle)
    - Export `extractFirstName`, `GREETING_TEMPLATES`, `SUBTITLES`, and `renderGreeting` for testability
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 4.2 Write property test for greeting name extraction (Property 1)
    - **Property 1: Greeting always contains a valid first name from template pool**
    - **Validates: Requirements 2.1, 2.3**
    - Create `admin/__tests__/greeting.property.test.js`
    - Generate random display names (null, empty, whitespace, unicode, multi-word)
    - Assert greeting contains either first segment of display name or "Yasmin"
    - Assert greeting matches one of the predefined template patterns

  - [ ]* 4.3 Write property test for subtitle pool invariants (Property 2)
    - **Property 2: Subtitles are always from the predefined pool and within length limit**
    - **Validates: Requirements 2.2**
    - Add to `admin/__tests__/greeting.property.test.js`
    - Assert returned subtitle is a member of the predefined pool
    - Assert subtitle length ≤ 60 characters

  - [ ]* 4.4 Write property test for avatar rendering (Property 3)
    - **Property 3: Photo URL presence determines avatar rendering**
    - **Validates: Requirements 2.4, 2.5**
    - Add to `admin/__tests__/greeting.property.test.js`
    - Generate random photo URLs and null/empty values
    - Assert non-empty photoURL produces `<img>` with 48×48 dimensions
    - Assert null/empty photoURL produces butterfly SVG element (no initial-circle)

- [ ] 5. Implement butterfly entrance animation
  - [ ] 5.1 Add butterfly entrance animation CSS and JS injection in `/admin/index.html` and `/admin/js/app.js`
    - Add `@keyframes butterflyEntrance` CSS in admin `<style>` block (0%→50%→100% opacity/transform, 1.5s duration)
    - Add `.butterfly-entrance` class with `animation: butterflyEntrance 1.5s ease-out forwards`
    - Add `@media (prefers-reduced-motion: reduce)` rule to disable animation (set `animation: none; opacity: 0; display: none`)
    - Add `@media (max-width: 767px)` rule to reduce butterfly SVG size to 32×32px
    - In `handleAuthenticated` in app.js, inject a butterfly SVG element with `.butterfly-entrance` class on auth success, remove from DOM after animation completes (1.5s timeout)
    - _Requirements: 3.2, 3.3, 3.5, 3.6_

- [ ] 6. Implement nav bar user indicator and butterfly styling
  - [ ] 6.1 Add user identifier display in nav bar in `/admin/js/app.js`
    - Implement `truncateUserIdentifier(user)` that returns displayName (or email fallback), truncated to 30 chars + ellipsis if exceeded
    - In `handleAuthenticated`, render a `<span class="text-muted text-xs">` with the truncated identifier, positioned before the Sign Out button in the nav's right-aligned flex group
    - Export `truncateUserIdentifier` for testability
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 6.2 Write property test for user identifier truncation (Property 5)
    - **Property 5: User identifier truncation respects 30-character limit with correct fallback**
    - **Validates: Requirements 5.1**
    - Create `admin/__tests__/nav-indicator.property.test.js`
    - Generate random strings of varying lengths (0–200 chars)
    - Assert output ≤ 31 characters (30 + ellipsis)
    - Assert strings ≤ 30 chars returned unmodified
    - Assert displayName preferred over email

  - [ ] 6.3 Update nav bar styling with butterfly theme colors in `/admin/index.html` and `/css/shared.css`
    - Update `.nav-glass` border-bottom to use butterfly-rose color
    - Update nav background tint to use butterfly-lavender
    - Retain Sign Out button styling with butterfly-theme tokens
    - _Requirements: 4.3, 5.3_

- [ ] 7. Checkpoint - Verify greeting, animation, and nav indicator
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Update auth module with butterfly theming
  - [ ] 8.1 Update sign-in error display in `/admin/js/auth.js`
    - Modify `showSignInError` to use `text-butterfly-rose` instead of `text-red-600`
    - Add `role="alert"` attribute to the error element for ARIA accessibility
    - _Requirements: 6.4_

  - [ ]* 8.2 Write property test for sign-in error ARIA and styling (Property 6)
    - **Property 6: Sign-in error messages have correct ARIA role and butterfly styling**
    - **Validates: Requirements 6.4**
    - Create `admin/__tests__/auth-error.property.test.js`
    - Generate random non-empty error message strings
    - Assert error element has `role="alert"` attribute
    - Assert error element class list contains butterfly-theme color reference

  - [ ] 8.3 Update `restoreSignInScreen` in `/admin/js/auth.js` with Yasmin branding
    - Replace HireFound logo with butterfly SVG element (matching sign-in view)
    - Change heading to "Yasmin's Space"
    - Change subtext to "Welcome back, beautiful ✨"
    - Ensure sign-in button uses butterfly-theme accent color and pill shape
    - _Requirements: 1.6, 6.1, 6.2, 6.3_

- [ ] 9. Update job card styling with butterfly colors
  - [ ] 9.1 Apply butterfly color tokens to job cards in `/admin/js/dashboard.js` or `/admin/index.html`
    - Apply `border-butterfly-lavender` as the border color on `.job-card` elements
    - Apply `butterfly-rose` with reduced opacity as the box-shadow color
    - Retain existing functionality: hover transform, click actions, status toggle
    - _Requirements: 4.4_

- [ ] 10. Add decorative butterfly SVG to sign-in view
  - [ ] 10.1 Add a decorative butterfly SVG element to the sign-in card in `/admin/index.html`
    - Position within the sign-in card area, visible without scrolling on viewports ≥768px
    - Use butterfly-theme accent colors (lavender/rose)
    - Ensure it does not interfere with sign-in button touch targets
    - _Requirements: 3.1_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All changes are purely presentational — no backend or route changes
- The existing Tailwind CDN + config pattern is preserved (no build step needed)
- Exported functions enable testability without changing the runtime module structure

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "2.2", "2.3"] },
    { "id": 2, "tasks": ["4.1", "5.1", "10.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "4.4", "6.1", "6.3"] },
    { "id": 4, "tasks": ["6.2", "8.1", "8.3", "9.1"] },
    { "id": 5, "tasks": ["8.2"] }
  ]
}
```
