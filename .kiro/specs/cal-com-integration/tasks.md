# Implementation Plan: Cal.com Integration

## Overview

This plan integrates Cal.com booking functionality into the HireFound single-page site (index.html). All changes are made to a single file using inline HTML, CSS, and JavaScript — no build tools or backend required. The implementation adds the Cal.com embed SDK, a custom booking modal, a floating action stack (replacing the existing WhatsApp FAB), a contact section booking button, and rewires the navigation "Get Started" buttons to open the modal.

## Tasks

- [-] 1. Add Cal.com Embed SDK and Booking Modal HTML
  - [x] 1.1 Add the Cal.com embed SDK loader script at the bottom of `<body>` (async, non-blocking) with namespace initialization, brand theme colors, and preload call for "yasminblasi"
    - Add the IIFE script that loads `https://app.cal.com/embed/embed.js`
    - Initialize namespace `Cal("init", "booking", { origin: "https://cal.com" })`
    - Configure `Cal.ns.booking("ui", {...})` with HireFound brand colors (primary #8B2252, bg #FFFAF5)
    - Call `Cal.ns.booking("preload", { calLink: "yasminblasi" })`
    - _Requirements: 1.1, 1.3, 1.6, 1.8, 1.9, 6.1, 6.3_

  - [x] 1.2 Add the Booking Modal HTML structure with header, loading state, Cal.com embed container, and error state
    - Add `#booking-modal` with `role="dialog"`, `aria-modal="true"`, `aria-labelledby="booking-modal-title"`
    - Include backdrop (`#booking-backdrop`) with dark overlay (bg-dark/60)
    - Include modal card (`#booking-card`) with branded header (Yasmin's photo, title, close button)
    - Include loading spinner (`#booking-loading`), embed container (`#booking-cal-container`), and error state (`#booking-error`) with fallback link to Cal.com
    - Ensure close button has 44×44px touch target and accessible label
    - On mobile (<768px), modal should be full-screen; on desktop (≥768px), centered card with max-w-[480px] and rounded-xl
    - _Requirements: 1.2, 1.7, 4.1, 4.2, 4.3, 4.7, 5.1, 5.4_

- [x] 2. Replace WhatsApp FAB with Floating Action Stack
  - [x] 2.1 Remove the existing `#wa-fab` element and its associated styles/scripts, then add the new `#action-stack` HTML with Book a Call and WhatsApp pill buttons
    - Remove the old `#wa-fab` anchor element from the HTML
    - Add `#action-stack` fixed bottom-6 right-6 z-50 with two buttons stacked vertically (gap-3)
    - Book a Call button (`#fab-book`): primary bg, calendar icon + text, icon-only on mobile
    - WhatsApp button (`#fab-whatsapp`): whatsapp green bg, WhatsApp icon + text, icon-only on mobile, links to `https://wa.me/962793001043`
    - Both buttons: rounded-full, shadow-lg, min 44×44px touch target on mobile
    - Start hidden (opacity-0, pointer-events-none)
    - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.8, 2.10, 5.2, 5.5_

  - [x] 2.2 Implement IntersectionObserver logic to show/hide the Floating Action Stack based on hero section visibility
    - Observe `#hero` section with threshold 0
    - When hero is not intersecting: set opacity-1, pointer-events-auto (fade in over 500ms)
    - When hero is intersecting: set opacity-0, pointer-events-none (fade out over 500ms)
    - Replace any existing scroll-based show/hide logic that was tied to the old WhatsApp FAB
    - _Requirements: 2.3, 2.4, 2.9_

- [ ] 3. Add Contact Section Booking Button
  - [ ] 3.1 Add a "Book a Call" button in the contact section alongside the existing WhatsApp CTA with matching visual weight
    - Add `#contact-book-btn` with classes: `px-8 py-4 bg-primary text-white font-bold rounded-full shadow-lg text-lg`
    - Include calendar icon (w-6 h-6) + "Book a Call" text
    - Position above or beside the existing WhatsApp button in the same container
    - Ensure both buttons appear as equal-weight options with matching padding and text size
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ] 4. Checkpoint - Verify HTML structure
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement Modal Controller JavaScript
  - [ ] 5.1 Write the BookingModal controller object with open/close methods, animation logic, scroll lock, and focus return
    - Implement `BookingModal.init()` to bind all DOM elements
    - Implement `BookingModal.open(triggerElement)`: store trigger, show modal, animate in (opacity 0→1, scale 0.95→1.0 over 200-400ms), disable body scroll (`overflow: hidden`), start 8-second load timeout
    - Implement `BookingModal.close()`: animate out (opacity 1→0, scale 1.0→0.95 over 150-300ms), restore body scroll, return focus to stored trigger element (fallback to `document.body` if trigger removed)
    - Handle `data-state` attribute for open/closed tracking
    - _Requirements: 1.4, 1.5, 4.4, 4.5, 4.6, 4.8, 4.9, 4.10, 8.2, 8.3, 8.4_

  - [ ] 5.2 Implement focus trap logic that cycles Tab/Shift+Tab within the modal while open
    - Query all focusable elements within `#booking-modal` (buttons, links, inputs)
    - On Tab at last element: move focus to first element
    - On Shift+Tab at first element: move focus to last element
    - Attach on modal open, detach on modal close
    - _Requirements: 1.4, 4.8_

  - [ ] 5.3 Implement Cal.com embed initialization inside the modal and loading/error state transitions
    - On first modal open: call `Cal.ns.booking("inline", { elementOrSelector: "#booking-cal-container", calLink: "yasminblasi" })`
    - Listen for Cal.com `linkReady` event: hide loading spinner, show embed container
    - Listen for Cal.com `linkFailed` event: hide loading spinner, show error state
    - Implement 8-second timeout: if neither event fires, show error state with fallback link
    - On subsequent opens: skip re-initialization if embed already loaded
    - _Requirements: 1.2, 1.7, 6.4, 6.5_

  - [ ] 5.4 Implement SDK load failure detection and fallback redirect behavior
    - Track whether the Cal.com SDK script loaded successfully (10-second timeout)
    - If SDK not loaded when any booking trigger is activated: `window.open("https://cal.com/yasminblasi", "_blank")` instead of opening modal
    - _Requirements: 6.2_

- [ ] 6. Wire All Booking Triggers to Modal Controller
  - [ ] 6.1 Attach click handlers to `#fab-book`, `#contact-book-btn`, and both nav "Get Started" buttons to call `BookingModal.open()`
    - `#fab-book` click → `BookingModal.open(fabBookBtn)`
    - `#contact-book-btn` click → `BookingModal.open(contactBookBtn)`
    - Desktop nav "Get Started" → change `href="#contact"` to `role="button"`, attach click handler → `BookingModal.open(navBtn)`
    - Mobile nav "Get Started" → same treatment as desktop
    - Prevent default anchor behavior on nav buttons
    - _Requirements: 2.7, 3.4, 7.1, 7.2, 7.3, 7.4_

  - [ ] 6.2 Attach close handlers: close button click, Escape key, and backdrop click
    - `#booking-close-btn` click → `BookingModal.close()`
    - `document` keydown Escape (only when modal open) → `BookingModal.close()`
    - `#booking-backdrop` click → `BookingModal.close()`
    - _Requirements: 1.5, 4.6, 4.10_

- [ ] 7. Checkpoint - Verify full integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Mobile Responsiveness and Polish
  - [ ] 8.1 Verify and adjust mobile styles: full-screen modal on <768px, icon-only FAB buttons, minimum touch targets, and no horizontal overflow
    - Confirm modal uses `max-md:!w-full max-md:!h-full max-md:!max-h-full max-md:!rounded-none` for full-screen on mobile
    - Confirm FAB buttons use `max-md:px-0 max-md:w-12 max-md:h-12` for icon-only on mobile
    - Confirm all interactive elements have min 44×44px touch targets
    - Confirm min 16px font size on interactive elements to prevent browser auto-zoom
    - Test Cal.com embed fills 100% container width without horizontal scrollbar from 320px to 1440px
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 8.2 Add CSS for modal open/close animations and ensure `prefers-reduced-motion` is respected
    - Add transition classes for backdrop opacity and card scale/opacity
    - Ensure existing `prefers-reduced-motion` media query covers the new modal animations
    - Verify the 500ms fade duration on the Floating Action Stack
    - _Requirements: 4.4, 4.5, 2.4, 2.9_

- [ ] 9. Final Checkpoint - Full feature validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All changes are made to a single file: `index.html`
- No build tools, npm packages, or backend code required
- The Cal.com embed SDK is loaded from their CDN (`https://app.cal.com/embed/embed.js`)
- Cal.com handles timezone detection, availability, and booking confirmation natively
- The existing WhatsApp FAB (`#wa-fab`) is fully replaced by the new Floating Action Stack
- The existing "Get Started" nav buttons are rewired from `href="#contact"` to modal triggers
- Property-based testing is not applicable for this feature (pure UI/DOM integration)
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "3.1"] },
    { "id": 2, "tasks": ["2.2", "5.1"] },
    { "id": 3, "tasks": ["5.2", "5.3", "5.4"] },
    { "id": 4, "tasks": ["6.1", "6.2"] },
    { "id": 5, "tasks": ["8.1", "8.2"] }
  ]
}
```
