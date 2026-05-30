# Book a Call Modal Consistency Bugfix Design

## Overview

The "Book a Call" CTAs in the footer (`footer.js`), jobs empty state (`jobs.js` → `renderEmpty()`), and job detail section (`jobs.js` → `renderJobDetail()`) open `cal.com/yasminblasi` directly in a new tab. They should instead open the custom booking modal (`window.BookingModal.open()`) that provides a branded, accessible, in-page experience. The root cause is that the booking modal infrastructure (HTML markup, Cal.com embed SDK script, and the `BookingModal` controller object) is defined exclusively in `index.html` and is unavailable on other pages like `/jobs/`. The fix extracts the modal into a shared module loadable from any page, and updates the CTAs to invoke it.

## Glossary

- **Bug_Condition (C)**: A user clicks a "Book a Call" CTA rendered by `footer.js` or `jobs.js` — these CTAs currently render as `<a href="https://cal.com/yasminblasi" target="_blank">` links that navigate away from the page
- **Property (P)**: The desired behavior — clicking "Book a Call" opens the custom booking modal in-page with branded header, loading states, and accessibility features
- **Preservation**: Existing behaviors that must remain unchanged — homepage FAB, nav "Get Started", WhatsApp links, email links, and the modal's own UX (focus trap, Escape to close, branded header)
- **BookingModal**: The controller object (`window.BookingModal`) in `index.html` that manages the modal lifecycle (open, close, focus trap, Cal.com embed initialization)
- **Cal.com Embed SDK**: The third-party script (`app.cal.com/embed/embed.js`) that renders the scheduling widget inside the modal
- **initFooter()**: Function in `js/footer.js` that renders the site footer including the "Book a Call" CTA
- **renderEmpty()**: Function in `js/jobs.js` that renders the empty state with contact CTAs when no jobs match
- **renderJobDetail()**: Function in `js/jobs.js` that renders job detail view including "Book a Call" in the contact section

## Bug Details

### Bug Condition

The bug manifests when a user clicks any "Book a Call" button rendered by `footer.js` or `jobs.js`. These modules render the CTA as a standard anchor tag pointing to `https://cal.com/yasminblasi` with `target="_blank"`, causing the browser to open a new tab instead of invoking the in-page booking modal.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type UserClickEvent
  OUTPUT: boolean
  
  RETURN input.targetElement.textContent CONTAINS "Book a Call"
         AND input.targetElement.href == "https://cal.com/yasminblasi"
         AND input.targetElement.target == "_blank"
         AND input.sourceModule IN ["footer.js", "jobs.js"]
END FUNCTION
```

### Examples

- **Footer on /jobs/ page**: User clicks "Book a Call" in the footer → browser opens `cal.com/yasminblasi` in a new tab. Expected: booking modal opens in-page.
- **Jobs empty state**: User filters jobs to a category with no results, clicks "Book a Call" → browser opens new tab. Expected: booking modal opens in-page.
- **Job detail (no Tally form)**: User views a job without a Tally application form, clicks "Book a Call" in the "Interested? Get in Touch" section → browser opens new tab. Expected: booking modal opens in-page.
- **Footer on homepage**: User clicks "Book a Call" in the footer → browser opens new tab. Expected: booking modal opens in-page (same bug, homepage footer also uses `footer.js`).

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Homepage floating action button (FAB) "Book a Call" must continue to open the booking modal as it does today
- Nav "Get Started" button on the homepage must continue to open the booking modal
- "Chat on WhatsApp" links in the footer and job detail must continue to open WhatsApp in a new tab
- "Email" links in the job detail section must continue to open the email client
- Nav "Get Started" on non-homepage pages must continue to navigate to `/#contact` (or open modal if now available)
- The booking modal must continue to display the branded header (Yasmin's photo, title), loading states, and accessibility features (focus trap, Escape to close, aria attributes)
- The Cal.com embed SDK must only be loaded once per page regardless of how many CTAs exist

**Scope:**
All inputs that do NOT involve clicking a "Book a Call" CTA should be completely unaffected by this fix. This includes:
- Mouse clicks on WhatsApp buttons
- Mouse clicks on Email buttons
- Keyboard navigation and other interactions
- Page load behavior and script initialization order
- Any non-"Book a Call" anchor or button interactions

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is clear:

1. **Modal Infrastructure Not Available Site-Wide**: The booking modal HTML (`#booking-modal` div), Cal.com embed SDK script, and `BookingModal` controller are all defined inline in `index.html` only. Pages like `/jobs/index.html` do not include any of this infrastructure.

2. **CTAs Render as Static Links**: `footer.js` renders the "Book a Call" CTA as `<a href="${FOOTER_CONFIG.calLink}" target="_blank">` — a plain anchor tag. Similarly, `jobs.js` renders `<a href="${DEFAULTS.calLink}" target="_blank">`. Neither module attempts to call `window.BookingModal.open()`.

3. **No Shared Module Exists**: There is no shared JavaScript module that can inject the modal HTML, load the Cal.com SDK, and expose the `BookingModal` controller on any page. The architecture assumes the modal only exists on the homepage.

4. **No Lazy-Loading Pattern**: Even if `footer.js` or `jobs.js` tried to call `window.BookingModal.open()`, it would fail on non-homepage pages because the object doesn't exist. There's no mechanism to lazily initialize the modal on first use.

## Correctness Properties

Property 1: Bug Condition - Book a Call CTAs Open Modal

_For any_ click event on a "Book a Call" CTA rendered by `footer.js` or `jobs.js` (where isBugCondition returns true), the fixed code SHALL open the custom booking modal in-page with the branded header, loading state, and Cal.com embed — without navigating away from the current page or opening a new tab.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Non-Book-a-Call Interactions Unchanged

_For any_ user interaction that is NOT a click on a "Book a Call" CTA (WhatsApp links, Email links, nav links, page loads, keyboard navigation), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing functionality for non-booking interactions.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `js/booking-modal.js` (NEW)

**Purpose**: Shared module that encapsulates the booking modal infrastructure

**Specific Changes**:
1. **Extract Modal HTML**: Create a function that injects the modal markup (`#booking-modal` div with backdrop, card, branded header, Cal.com container, loading spinner) into the DOM if not already present
2. **Extract BookingModal Controller**: Move the `BookingModal` object (open, close, focus trap, Cal.com embed init/destroy) into this module and export it
3. **Lazy Cal.com SDK Loading**: Load the Cal.com embed SDK script on first modal open (not on page load) to avoid unnecessary network requests on pages where the user never clicks "Book a Call"
4. **Idempotent Initialization**: Ensure calling the init function multiple times is safe — check if modal HTML already exists before injecting, check if SDK script already loaded before adding it
5. **Expose on window**: Set `window.BookingModal` after initialization so existing homepage code continues to work

**File**: `js/footer.js`

**Function**: `initFooter()`

**Specific Changes**:
1. **Replace anchor with button**: Change the "Book a Call" CTA from `<a href="..." target="_blank">` to a `<button>` (or anchor with `href="#"` and `role="button"`)
2. **Add click handler**: On click, import and initialize the booking modal module, then call `BookingModal.open(triggerElement)`
3. **Import booking-modal module**: Add dynamic `import()` or static import of the new shared module

**File**: `js/jobs.js`

**Functions**: `renderEmpty()`, `renderJobDetail()`

**Specific Changes**:
1. **renderEmpty() — Replace anchor with button**: Change the "Book a Call" `<a>` element to invoke the modal instead of linking externally
2. **renderJobDetail() — Replace anchor with button**: In the "Interested? Get in Touch" section (no Tally form branch), change the "Book a Call" `<a>` to invoke the modal
3. **Add click handlers**: Both CTAs should call the shared booking modal's open function on click
4. **Import booking-modal module**: Import the shared module

**File**: `index.html`

**Specific Changes**:
1. **Remove inline modal HTML** (optional, can keep for backward compat): Or keep it and have the shared module detect it's already present
2. **Remove inline BookingModal controller**: Replace with import of the shared module
3. **Keep Cal.com SDK script tag** or let the shared module handle it — ensure no double-loading

**File**: `jobs/index.html`

**Specific Changes**:
1. **No HTML changes needed**: The shared JS module handles injecting modal HTML dynamically

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate clicking "Book a Call" CTAs rendered by `footer.js` and `jobs.js`, and assert that `window.BookingModal.open()` is invoked (or that no navigation occurs). Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Footer Book a Call Test**: Render footer via `initFooter()`, click "Book a Call" — assert modal opens (will fail on unfixed code because it's a plain link)
2. **Jobs Empty State Test**: Render empty state via `renderEmpty()`, click "Book a Call" — assert modal opens (will fail on unfixed code)
3. **Job Detail No-Tally Test**: Render job detail without Tally form via `renderJobDetail()`, click "Book a Call" — assert modal opens (will fail on unfixed code)
4. **Modal Availability Test**: On a non-homepage page, check if `window.BookingModal` exists (will fail on unfixed code — it's undefined)

**Expected Counterexamples**:
- `window.BookingModal` is undefined on non-homepage pages
- "Book a Call" elements are `<a>` tags with `target="_blank"` that trigger navigation instead of modal
- Possible causes: modal infrastructure only in `index.html`, CTAs hardcoded as external links

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := handleBookACallClick_fixed(input)
  ASSERT modalOpened(result)
  ASSERT noNavigationOccurred(result)
  ASSERT modalHasBrandedHeader(result)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalBehavior(input) = fixedBehavior(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for WhatsApp links, email links, and other interactions, then write property-based tests capturing that behavior.

**Test Cases**:
1. **WhatsApp Link Preservation**: Verify clicking "Chat on WhatsApp" in footer and job detail continues to open WhatsApp URL in new tab
2. **Email Link Preservation**: Verify clicking "Email" in job detail continues to open mailto link
3. **Homepage FAB Preservation**: Verify the homepage FAB "Book a Call" continues to open the modal (not regressed by shared module extraction)
4. **Nav Get Started Preservation**: Verify nav "Get Started" on homepage continues to open modal
5. **Cal.com SDK Single-Load**: Verify the SDK script is only loaded once even if multiple CTAs exist on the same page

### Unit Tests

- Test that `initFooter()` renders a "Book a Call" element that calls `BookingModal.open()` on click
- Test that `renderEmpty()` renders a "Book a Call" element that calls `BookingModal.open()` on click
- Test that `renderJobDetail()` (no Tally form) renders a "Book a Call" element that calls `BookingModal.open()` on click
- Test that the shared booking modal module injects HTML only once (idempotent)
- Test that the Cal.com SDK script is loaded only once per page
- Test that `BookingModal.open()` and `BookingModal.close()` work correctly after lazy initialization

### Property-Based Tests

- Generate random page contexts (homepage, jobs page, job detail) and verify "Book a Call" always opens the modal
- Generate random sequences of open/close actions and verify modal state remains consistent
- Generate random combinations of CTAs on a page and verify SDK is loaded exactly once

### Integration Tests

- Test full flow: load `/jobs/` page, render footer, click "Book a Call" → modal opens with branded header and Cal.com embed
- Test full flow: load `/jobs/` page, trigger empty state, click "Book a Call" → modal opens
- Test full flow: load `/jobs/?id=some-job` page, render job detail without Tally, click "Book a Call" → modal opens
- Test that homepage behavior is unchanged after extracting modal to shared module
- Test that modal accessibility features (focus trap, Escape to close, aria attributes) work on non-homepage pages
