# Requirements Document

## Introduction

This feature integrates Cal.com booking functionality into the HireFound website, allowing visitors (employers and candidates) to schedule calls directly with Yasmin Blasi. The integration uses the Cal.com embed SDK to provide a seamless, on-brand booking experience without leaving the site. The goal is to complement the existing WhatsApp-first communication style with a structured scheduling option that feels premium, personal, and frictionless.

## Glossary

- **Booking_Modal**: A full-screen overlay that displays the Cal.com scheduling interface within the HireFound website
- **Cal_Embed**: The Cal.com JavaScript embed SDK that renders the scheduling UI inside the website without a raw iframe
- **Floating_Action_Stack**: The fixed-position button group in the bottom-right corner containing the Book a Call and WhatsApp action buttons
- **Contact_Section**: The dark-background section at the bottom of the page containing primary contact CTAs
- **Booking_Trigger**: Any button or link on the page that opens the Booking_Modal when activated
- **Cal_URL**: The Cal.com profile URL (https://cal.com/yasminblasi) used as the scheduling source

## Requirements

### Requirement 1: Cal.com Embed SDK Integration

**User Story:** As a website visitor, I want to book a call with Yasmin directly from the website, so that I can schedule a conversation without leaving the page or navigating to an external site.

#### Acceptance Criteria

1. THE Booking_Modal SHALL load the Cal_Embed SDK from Cal.com's official CDN
2. WHEN a Booking_Trigger is activated, THE Booking_Modal SHALL open within 3 seconds and display the Cal.com scheduling interface for the Cal_URL (https://cal.com/yasminblasi), showing all available event types for the visitor to choose from
3. THE Cal_Embed SHALL render with theme colors matching the HireFound brand (primary: #8B2252, background: #FFFAF5)
4. WHILE the Booking_Modal is open, THE Booking_Modal SHALL prevent scrolling of the page behind the overlay and trap keyboard focus within the modal
5. WHEN the user clicks outside the scheduling interface or activates the close button or presses the Escape key, THE Booking_Modal SHALL close and restore normal page scrolling and return focus to the Booking_Trigger that opened it
6. THE Cal_Embed SHALL load without requiring any backend server code
7. IF the Cal_Embed SDK fails to load or the Cal.com scheduling interface does not render within 5 seconds, THEN THE Booking_Modal SHALL display an error message indicating the scheduling service is unavailable and provide a direct link to the Cal_URL as a fallback
8. THE Cal_Embed SHALL rely on Cal.com's built-in timezone detection to automatically display available time slots in the visitor's local browser timezone without any custom timezone logic
9. THE Cal_Embed SHALL display Cal.com's real-time availability data, reflecting Yasmin's live calendar state including any blocked or booked slots, without requiring any server-side syncing code on the HireFound website

### Requirement 2: Floating Action Stack

**User Story:** As a website visitor browsing any section of the page, I want persistent access to both booking and WhatsApp options, so that I can reach Yasmin through my preferred channel at any moment.

#### Acceptance Criteria

1. THE Floating_Action_Stack SHALL be positioned fixed in the bottom-right corner of the viewport with a 24px offset from both the bottom and right edges
2. THE Floating_Action_Stack SHALL contain two pill-shaped buttons stacked vertically with 12px gap between them: a Book a Call button above a WhatsApp button
3. WHILE any portion of the hero section is visible in the viewport, THE Floating_Action_Stack SHALL remain hidden with opacity 0 and not receive pointer events
4. WHEN the user scrolls such that the hero section is no longer visible in the viewport, THE Floating_Action_Stack SHALL fade into view over a duration of 500ms
5. THE Book a Call button SHALL display a calendar icon and the text "Book a Call" with the HireFound primary color background (#8B2252) and white text
6. THE WhatsApp button SHALL display the WhatsApp icon and the text "WhatsApp" with the WhatsApp green background (#25D366) and white text
7. WHEN the Book a Call button is activated, THE Booking_Modal SHALL open
8. WHEN the WhatsApp button is activated, THE Floating_Action_Stack SHALL open the WhatsApp chat link (https://wa.me/962793001043) in a new tab
9. WHEN the user scrolls back so that any portion of the hero section becomes visible in the viewport, THE Floating_Action_Stack SHALL fade out of view over a duration of 500ms
10. THE Floating_Action_Stack SHALL render above all page content at a z-index of 50 and each button SHALL have an accessible name matching its visible label text

### Requirement 3: Contact Section Booking Button

**User Story:** As a website visitor who has scrolled to the contact section, I want a clear booking option alongside the existing WhatsApp CTA, so that I can choose between an immediate chat or a scheduled call.

#### Acceptance Criteria

1. THE Contact_Section SHALL display a "Book a Call" button positioned directly above or beside the existing "Chat on WhatsApp" button within the same centered container, using matching padding (px-8 py-4) and text size (text-lg) so both buttons appear as equal-weight options
2. THE Book_a_Call_Button SHALL use the classes rounded-full, font-bold, and shadow-lg, matching the existing WhatsApp button's shape and elevation style
3. THE Book_a_Call_Button SHALL display a calendar icon (sized to match the WhatsApp icon at w-6 h-6) followed by the text "Book a Call"
4. WHEN the Book_a_Call_Button is activated via click or keyboard (Enter/Space), THE Booking_Modal SHALL open
5. THE Book_a_Call_Button SHALL use the site primary background color (bg-primary) to be visually distinguishable from the WhatsApp button's green (bg-whatsapp) background
6. IF the Booking_Modal fails to load its content within 5 seconds, THEN THE Contact_Section SHALL continue to display both buttons in their default interactive state without disabling user interaction

### Requirement 4: Booking Modal Design

**User Story:** As a website visitor, I want the booking overlay to feel like a natural part of the HireFound experience, so that scheduling a call feels premium and trustworthy rather than jarring.

#### Acceptance Criteria

1. THE Booking_Modal SHALL display a backdrop with a background opacity between 0.5 and 0.7 (dark overlay) behind the scheduling interface
2. THE Booking_Modal SHALL include a header no taller than 64px containing Yasmin's photo, the text "Book a Call with Yasmin", and a close button with an accessible label
3. THE Booking_Modal SHALL center the Cal_Embed content both horizontally and vertically within the viewport
4. THE Booking_Modal SHALL animate in with a fade from opacity 0 to 1 and a scale transition from 0.95 to 1.0, with a total duration between 200ms and 400ms
5. WHEN the Booking_Modal is closed, THE Booking_Modal SHALL animate out with a fade from opacity 1 to 0 and a scale transition from 1.0 to 0.95, with a total duration between 150ms and 300ms
6. WHILE the Booking_Modal is open, WHEN the Escape key is pressed, THE Booking_Modal SHALL close
7. THE Booking_Modal SHALL be accessible with ARIA attributes role="dialog", aria-modal="true", and aria-labelledby referencing the header text
8. WHILE the Booking_Modal is open, THE Booking_Modal SHALL trap keyboard focus within the modal and prevent background page scrolling
9. WHEN the Booking_Modal is closed, THE Booking_Modal SHALL return keyboard focus to the element that triggered the modal
10. WHEN the user clicks the backdrop area outside the modal content, THE Booking_Modal SHALL close

### Requirement 5: Mobile Responsiveness

**User Story:** As a mobile visitor, I want the booking experience to work smoothly on small screens, so that I can schedule a call without pinching, zooming, or struggling with the interface.

#### Acceptance Criteria

1. WHILE the viewport width is below 768px, THE Booking_Modal SHALL occupy the full screen (100vw × 100vh) with no more than 16px of padding on each side, and SHALL display a visible close button with a minimum touch target of 44×44px
2. WHILE the viewport width is below 768px, THE Floating_Action_Stack SHALL collapse to icon-only buttons (minimum touch target 44×44px) that display a tooltip label after a long-press of 500ms or more, and SHALL occupy no more than 15% of the viewport height
3. THE Cal_Embed SHALL fill 100% of its container width and SHALL not produce a horizontal scrollbar at any viewport width from 320px to 1440px
4. WHILE the viewport width is 768px or above, THE Booking_Modal SHALL display as a horizontally and vertically centered card with a border-radius of 12px and a maximum width of 480px
5. WHILE the viewport width is below 768px, THE Booking_Modal and Floating_Action_Stack SHALL render all interactive elements (buttons, links, form inputs) with a minimum touch target size of 44×44px and a minimum font size of 16px to prevent browser auto-zoom

### Requirement 6: Performance and Loading

**User Story:** As a website visitor, I want the booking feature to load quickly and not slow down the initial page experience, so that the site remains fast and responsive.

#### Acceptance Criteria

1. THE Cal_Embed SDK script SHALL be loaded asynchronously and deferred until after the main page content has rendered
2. IF the Cal_Embed SDK fails to load within 10 seconds or returns a network error, THEN THE Booking_Trigger SHALL redirect the user to the Cal_URL in a new tab as a fallback
3. THE Cal_Embed SDK script SHALL not block the initial page render or increase Largest Contentful Paint by more than 100 milliseconds compared to the page without the script
4. WHEN the Booking_Modal is opened for the first time, THE Booking_Modal SHALL display a loading spinner until the Cal_Embed iframe content fires its load-complete event
5. IF the Booking_Modal loading spinner is displayed for more than 8 seconds without the Cal_Embed content becoming ready, THEN THE Booking_Modal SHALL display an error message indicating the calendar could not be loaded and offer a link to the Cal_URL in a new tab

### Requirement 7: Navigation Bar Integration

**User Story:** As a website visitor using the sticky navigation, I want the "Get Started" button to open the booking modal, so that I have quick access to scheduling from anywhere on the page.

#### Acceptance Criteria

1. WHEN the sticky navigation "Get Started" button is activated, THE Booking_Modal SHALL open and the button SHALL NOT perform anchor navigation to the contact section
2. WHEN the mobile navigation "Get Started" button is activated, THE Booking_Modal SHALL open and the button SHALL NOT perform anchor navigation to the contact section
3. WHEN the Booking_Modal is opened from the navigation, THE Booking_Modal SHALL behave identically to when opened from other Booking_Triggers as defined in Requirement 1 and Requirement 4
4. IF the Cal_Embed SDK has not yet loaded when a navigation "Get Started" button is activated, THEN THE System SHALL apply the fallback behavior defined in Requirement 6 criterion 2

### Requirement 8: Post-Booking Confirmation Experience

**User Story:** As a website visitor who has just booked a call, I want clear confirmation that my booking was successful, so that I feel confident the meeting is scheduled.

#### Acceptance Criteria

1. WHEN a booking is successfully completed within the Cal_Embed, THE Booking_Modal SHALL continue displaying Cal.com's built-in confirmation screen (which includes the meeting details, time in the visitor's timezone, and calendar invite options)
2. THE Booking_Modal SHALL remain open after a successful booking until the user explicitly closes it via the close button, Escape key, or backdrop click
3. THE Booking_Modal SHALL NOT auto-close or navigate away after a successful booking, allowing the visitor time to review confirmation details or add the event to their calendar
4. AFTER a successful booking, THE Booking_Modal close button SHALL remain visible and functional so the visitor can dismiss the modal at their convenience
