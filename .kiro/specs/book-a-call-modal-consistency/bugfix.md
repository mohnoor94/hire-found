# Bugfix Requirements Document

## Introduction

The "Book a Call" interaction is inconsistent across the site. The homepage floating action button (FAB) and nav "Get Started" button correctly open a custom booking modal (`window.BookingModal.open()`) with branded UI, loading states, and accessibility features. However, "Book a Call" CTAs in the footer, jobs page empty state, and job detail "Have Questions?" section render as direct external links (`<a href="https://cal.com/yasminblasi" target="_blank">`) that navigate away from the site. This inconsistency breaks the branded user experience and bypasses the modal's accessibility features.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user clicks "Book a Call" in the site footer (rendered by `footer.js`) THEN the system opens `https://cal.com/yasminblasi` in a new browser tab instead of opening the booking modal

1.2 WHEN a user clicks "Book a Call" in the jobs page empty state (rendered by `jobs.js` → `renderEmpty()`) THEN the system opens `https://cal.com/yasminblasi` in a new browser tab instead of opening the booking modal

1.3 WHEN a user clicks "Book a Call" in the job detail "Interested? Get in Touch" section (rendered by `jobs.js` → `renderJobDetail()` when no Tally form is present) THEN the system opens `https://cal.com/yasminblasi` in a new browser tab instead of opening the booking modal

1.4 WHEN the booking modal HTML, Cal.com embed SDK, and `window.BookingModal` controller are only initialized on the homepage THEN the shared components (`footer.js`, `jobs.js`) on non-homepage pages have no modal to invoke and fall back to direct external links

### Expected Behavior (Correct)

2.1 WHEN a user clicks "Book a Call" in the site footer THEN the system SHALL open the custom booking modal with the branded header (Yasmin's photo, title), loading states, and accessibility features — without navigating away from the current page

2.2 WHEN a user clicks "Book a Call" in the jobs page empty state THEN the system SHALL open the custom booking modal with the same branded experience as the homepage

2.3 WHEN a user clicks "Book a Call" in the job detail "Interested? Get in Touch" section THEN the system SHALL open the custom booking modal with the same branded experience as the homepage

2.4 WHEN the booking modal infrastructure (modal HTML, Cal.com SDK, `window.BookingModal` controller) is needed on any page THEN the system SHALL make it available site-wide so all "Book a Call" CTAs can invoke it regardless of which page the user is on

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user clicks the homepage floating action button (FAB) "Book a Call" THEN the system SHALL CONTINUE TO open the booking modal as it does today

3.2 WHEN a user clicks the nav "Get Started" button on the homepage THEN the system SHALL CONTINUE TO open the booking modal as it does today

3.3 WHEN a user clicks "Chat on WhatsApp" in the footer or job detail THEN the system SHALL CONTINUE TO open the WhatsApp link in a new tab

3.4 WHEN a user clicks "Email" in the job detail section THEN the system SHALL CONTINUE TO open the email client as it does today

3.5 WHEN a user is on a non-homepage page and clicks nav "Get Started" THEN the system SHALL CONTINUE TO navigate to `/#contact` (or open the modal if now available site-wide)

3.6 WHEN the booking modal is open THEN the system SHALL CONTINUE TO display the branded header with Yasmin's photo, title, loading states, and full accessibility features (focus trap, Escape to close, aria attributes)
