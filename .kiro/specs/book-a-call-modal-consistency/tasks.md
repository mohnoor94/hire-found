# Implementation Plan: Book a Call Modal Consistency

## Overview

Fix the inconsistent "Book a Call" CTA behavior across the site. Extract the booking modal infrastructure from `index.html` into a shared module (`js/booking-modal.js`), then update `footer.js` and `jobs.js` to invoke the modal instead of linking externally. The fix follows the exploratory bugfix workflow: write tests first to confirm the bug, write preservation tests, implement the fix, then verify.

## Tasks

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Book a Call CTAs Render as External Links
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to the three concrete failing cases: footer CTA, empty state CTA, and job detail (no Tally) CTA
  - Test that `initFooter()` renders a "Book a Call" element that invokes `BookingModal.open()` on click instead of navigating externally (from Bug Condition: `input.sourceModule IN ["footer.js", "jobs.js"]` AND `input.targetElement.href == "https://cal.com/yasminblasi"`)
  - Test that `renderEmpty()` renders a "Book a Call" element that invokes `BookingModal.open()` on click instead of navigating externally
  - Test that `renderJobDetail()` (no Tally form) renders a "Book a Call" element that invokes `BookingModal.open()` on click instead of navigating externally
  - The test assertions should match the Expected Behavior: modal opens in-page, no navigation occurs, no `target="_blank"` link behavior
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists because CTAs are `<a href="https://cal.com/yasminblasi" target="_blank">` links)
  - Document counterexamples found: "Book a Call" elements are anchor tags with `target="_blank"` that trigger navigation instead of opening the modal
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Book-a-Call Interactions Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: `initFooter()` renders a "Chat on WhatsApp" link with `href="https://wa.me/962793001043..."` and `target="_blank"` on unfixed code
  - Observe: `initFooter()` renders social links (LinkedIn, Instagram, Email) with correct hrefs on unfixed code
  - Observe: `renderJobDetail()` (with Tally form) renders WhatsApp and Email CTAs without a "Book a Call" button on unfixed code
  - Observe: `renderJobDetail()` (no Tally form) renders WhatsApp link with `target="_blank"` and Email link with `mailto:` href on unfixed code
  - Observe: `renderEmpty()` renders WhatsApp link with `target="_blank"` on unfixed code
  - Write property-based test: for all non-"Book a Call" CTAs rendered by `footer.js` and `jobs.js`, the element type, href, and target attributes remain unchanged after the fix
  - Write property-based test: for all job objects with a `tallyFormId`, `renderJobDetail()` does NOT render a "Book a Call" CTA (only WhatsApp + Email)
  - Verify tests pass on UNFIXED code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 3. Fix: Extract booking modal into shared module and update CTAs

  - [x] 3.1 Create `js/booking-modal.js` shared module
    - Extract modal HTML injection (backdrop, card, branded header with Yasmin's photo, Cal.com container, loading spinner) into a lazily-initialized function
    - Extract `BookingModal` controller (open, close, focus trap, Cal.com embed init/destroy) into the module
    - Implement lazy Cal.com SDK loading on first `open()` call (not on page load)
    - Ensure idempotent initialization: check if `#booking-modal` already exists before injecting, check if SDK script already loaded before adding
    - Expose `window.BookingModal` after initialization for backward compatibility with homepage FAB and nav
    - Export the module's `open()` function for direct ES module imports
    - _Bug_Condition: isBugCondition(input) where input.sourceModule IN ["footer.js", "jobs.js"] AND input.targetElement is an external link to cal.com_
    - _Expected_Behavior: All "Book a Call" CTAs open the in-page modal with branded header, loading states, and accessibility features_
    - _Preservation: Homepage FAB, nav "Get Started", WhatsApp links, Email links, and modal UX (focus trap, Escape, aria) must remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.6_

  - [x] 3.2 Update `js/footer.js` to use booking modal
    - Replace the "Book a Call" `<a href="${FOOTER_CONFIG.calLink}" target="_blank">` with a `<button>` element (or anchor with `role="button"` and `href="#"`)
    - Add click handler that imports and calls `BookingModal.open(triggerElement)` from the shared module
    - Keep all other footer elements unchanged (WhatsApp link, social links, email, branding)
    - _Bug_Condition: Footer "Book a Call" CTA navigates to cal.com in new tab_
    - _Expected_Behavior: Footer "Book a Call" opens the in-page booking modal_
    - _Preservation: WhatsApp, LinkedIn, Instagram, Email links in footer remain unchanged_
    - _Requirements: 1.1, 2.1, 3.3_

  - [x] 3.3 Update `js/jobs.js` `renderEmpty()` to use booking modal
    - Replace the "Book a Call" `<a>` element (`calLink` with `target="_blank"`) with a `<button>` that calls `BookingModal.open()`
    - Keep the WhatsApp link unchanged
    - _Bug_Condition: Empty state "Book a Call" CTA navigates to cal.com in new tab_
    - _Expected_Behavior: Empty state "Book a Call" opens the in-page booking modal_
    - _Preservation: WhatsApp link in empty state remains unchanged_
    - _Requirements: 1.2, 2.2, 3.3_

  - [x] 3.4 Update `js/jobs.js` `renderJobDetail()` (no Tally form branch) to use booking modal
    - Replace the "Book a Call" `<a>` element (`calLink` with `target="_blank"`) with a `<button>` that calls `BookingModal.open()`
    - Keep WhatsApp and Email links unchanged
    - _Bug_Condition: Job detail "Book a Call" CTA navigates to cal.com in new tab_
    - _Expected_Behavior: Job detail "Book a Call" opens the in-page booking modal_
    - _Preservation: WhatsApp and Email links in job detail remain unchanged_
    - _Requirements: 1.3, 2.3, 3.3, 3.4_

  - [x] 3.5 Update `index.html` to use the shared booking modal module
    - Replace inline `BookingModal` controller and modal HTML with an import of `js/booking-modal.js`
    - Or keep existing modal HTML and have the shared module detect it's already present (idempotent)
    - Ensure homepage FAB and nav "Get Started" continue to work via `window.BookingModal.open()`
    - Verify Cal.com SDK is only loaded once per page
    - _Preservation: Homepage FAB, nav "Get Started", and modal UX must remain unchanged_
    - _Requirements: 2.4, 3.1, 3.2, 3.6_

  - [x] 3.6 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Book a Call CTAs Open Modal
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior (modal opens, no navigation)
    - When this test passes, it confirms the expected behavior is satisfied for all three CTAs
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.7 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Book-a-Call Interactions Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm WhatsApp links, Email links, social links, and non-"Book a Call" interactions are unchanged
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 4. Checkpoint - Ensure all tests pass
  - Run full test suite (`vitest --run`) to confirm all property-based tests and unit tests pass
  - Verify no regressions in existing tests (admin tests, slug property tests, validation property tests)
  - Ensure the Cal.com SDK is loaded only once per page regardless of how many CTAs exist
  - Ask the user if questions arise

## Notes

- This is a vanilla JS project with ES modules (no build step). The shared module uses dynamic `import()` for lazy loading.
- The project uses vitest for testing with jsdom environment.
- The booking modal module must be idempotent — safe to call multiple times without duplicating DOM elements or SDK scripts.
- Property-based tests use fast-check for generating test inputs.
- The homepage already has the modal working correctly; the fix must not regress that behavior.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2"] },
    { "id": 1, "tasks": ["3.1"] },
    { "id": 2, "tasks": ["3.2", "3.3", "3.4", "3.5"] },
    { "id": 3, "tasks": ["3.6", "3.7"] },
    { "id": 4, "tasks": ["4"] }
  ]
}
```
