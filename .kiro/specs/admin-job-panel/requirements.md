# Requirements Document

## Introduction

A private, beautifully designed admin control panel for Yasmin to manage HireFound job posts directly from the browser. The panel replaces manual Firestore collection editing with a delightful, modern interface protected by Google Authentication. It lives at `/admin/` on the existing static site and uses the same Firebase project, Tailwind CSS theme, and vanilla JS ES module architecture.

## Glossary

- **Admin_Panel**: The private web page at `/admin/index.html` that provides job post management capabilities
- **Auth_Guard**: The authentication layer that restricts access to the Admin_Panel using Firebase Authentication with Google sign-in
- **Job_Post**: A Firestore document in the jobs collection containing fields: title, titleAr, slug, category, location, employmentType, shortDescription, fullDescription, fullDescriptionAr, companyName, salary, contactWhatsApp, contactEmail, tallyFormId, createdAt, isActive
- **Job_Editor**: The form interface within the Admin_Panel for creating and editing Job_Post documents
- **Job_List**: The dashboard view displaying all Job_Post documents with filtering, search, and status indicators
- **Allowed_User**: The single authorized Google account (Yasmin) permitted to access the Admin_Panel
- **Toast_Notification**: A brief animated message confirming successful operations or reporting errors

## Requirements

### Requirement 1: Google Authentication Gate

**User Story:** As Yasmin, I want the admin panel protected by Google sign-in so that only I can access and manage job posts.

#### Acceptance Criteria

1. WHEN an unauthenticated user navigates to the Admin_Panel, THE Auth_Guard SHALL display a sign-in screen showing the HireFound logo and a Google sign-in button
2. IF a user signs in with a Google account whose email does not match the Allowed_User email, THEN THE Auth_Guard SHALL display an "Access Denied" message and automatically sign the user out within 3 seconds
3. WHEN the Allowed_User signs in with Google, THE Auth_Guard SHALL grant access to the Admin_Panel and display a greeting that includes the user's display name from their Google account
4. WHILE the Allowed_User is authenticated, THE Auth_Guard SHALL persist the session using Firebase Auth LOCAL persistence so that the session survives browser restarts
5. WHEN the Allowed_User clicks the sign-out button, THE Auth_Guard SHALL end the session and redirect to the sign-in screen
6. IF Firebase Authentication fails to initialize, THEN THE Auth_Guard SHALL display an error message indicating that authentication is unavailable and provide a retry button
7. WHILE the Auth_Guard is verifying the user's authentication state on page load, THE Auth_Guard SHALL display a loading indicator and SHALL NOT render Admin_Panel content until verification completes
8. IF the Allowed_User's session token expires or is revoked while the Admin_Panel is open, THEN THE Auth_Guard SHALL redirect the user to the sign-in screen within 5 seconds of detecting the auth state change

### Requirement 2: Job Post Dashboard

**User Story:** As Yasmin, I want to see all job posts at a glance with their status so that I can quickly find and manage any listing.

#### Acceptance Criteria

1. WHEN the Admin_Panel loads after authentication, THE Job_List SHALL fetch and display all Job_Post documents from Firestore ordered by createdAt descending
2. THE Job_List SHALL display each Job_Post as a card showing: title, category badge, location, employment type, company name, and active/inactive status
3. WHEN Yasmin types in the search field, THE Job_List SHALL filter displayed Job_Post cards by title, company name, or location within 300 milliseconds of the last keystroke
4. WHEN Yasmin selects a category filter, THE Job_List SHALL show only Job_Post cards matching the selected category
5. WHEN Yasmin toggles the status filter, THE Job_List SHALL show only active or only inactive Job_Post cards
6. WHEN multiple filters are active simultaneously (search text, category, and status), THE Job_List SHALL display only Job_Post cards that satisfy all applied filter conditions and update the visible count accordingly
7. THE Job_List SHALL display a count of total jobs and currently visible (filtered) jobs
8. WHEN no Job_Post documents match the current filters, THE Job_List SHALL display an empty state with an illustration and a message prompting Yasmin to adjust filters or create a new post
9. WHILE Job_Post documents are loading, THE Job_List SHALL display 6 animated skeleton placeholder cards matching the layout dimensions of Job_Post cards
10. IF the Firestore fetch fails or exceeds 10 seconds, THEN THE Job_List SHALL display an error message indicating the failure and a retry button that re-triggers the fetch

### Requirement 3: Create New Job Post

**User Story:** As Yasmin, I want to create new job posts from the admin panel so that I can publish listings without touching Firestore directly.

#### Acceptance Criteria

1. WHEN Yasmin clicks the "New Job" button, THE Job_Editor SHALL open a form with all Job_Post fields grouped into sections: identity (title, titleAr, slug), classification (category, employmentType), location, descriptions (shortDescription, fullDescription, fullDescriptionAr), company details (companyName, salary), and contact (contactWhatsApp, contactEmail, tallyFormId)
2. THE Job_Editor SHALL validate that title (between 1 and 120 characters), category (one of hospitality, tech, fnb, aviation, other), location (between 1 and 100 characters), and employmentType (one of full-time, part-time, contract, freelance) are provided, and SHALL explicitly block form submission when any required field is invalid
3. WHEN Yasmin submits a valid new Job_Post form, THE Job_Editor SHALL write the document to Firestore with a server-generated createdAt timestamp and isActive set to true
4. WHEN a Job_Post is successfully created, THE Admin_Panel SHALL display a success Toast_Notification and add the new post to the top of the Job_List
5. WHEN the title field value changes, THE Job_Editor SHALL auto-generate a slug by lowercasing the English title, replacing spaces and non-alphanumeric characters with hyphens, removing consecutive hyphens, stripping leading and trailing hyphens, and truncating to a maximum of 80 characters
6. IF Firestore write fails during creation, THEN THE Job_Editor SHALL display an error Toast_Notification and preserve the form data so Yasmin can retry
7. IF the auto-generated slug already exists in Firestore, THEN THE Job_Editor SHALL append a numeric suffix (e.g., "-2", "-3") to produce a unique slug before submission
8. IF contactWhatsApp is provided, THEN THE Job_Editor SHALL validate that it contains only digits and is between 7 and 15 characters; IF contactEmail is provided, THEN THE Job_Editor SHALL validate that it matches a standard email format before allowing submission

### Requirement 4: Edit Existing Job Post

**User Story:** As Yasmin, I want to edit any existing job post so that I can update details, fix typos, or change status without using the Firebase console.

#### Acceptance Criteria

1. WHEN Yasmin clicks the edit action on a Job_Post card, THE Job_Editor SHALL open pre-populated with all current field values for that document within 2 seconds of the click event
2. THE Job_Editor SHALL allow modification of all Job_Post fields except createdAt, enforcing the following constraints: title and titleAr maximum 120 characters, shortDescription maximum 300 characters, slug containing only lowercase alphanumeric characters and hyphens, contactEmail in valid email format, contactWhatsApp containing only digits with a length between 7 and 15 characters, and salary maximum 100 characters
3. IF Yasmin submits the edited Job_Post form and one or more fields fail validation, THEN THE Job_Editor SHALL display inline validation errors adjacent to each invalid field and SHALL NOT submit the update to Firestore
4. WHEN Yasmin submits a valid edited Job_Post form, THE Job_Editor SHALL disable the submit button, display a loading indicator, and update the Firestore document with the changed fields
5. WHEN a Job_Post is successfully updated, THE Admin_Panel SHALL display a success Toast_Notification for 5 seconds confirming the update and refresh the corresponding card in the Job_List with the new values
6. IF Firestore update fails, THEN THE Job_Editor SHALL display an error Toast_Notification for 5 seconds, re-enable the submit button, and preserve all edited field values in the form so Yasmin can retry without re-entering data

### Requirement 5: Toggle Job Post Active Status

**User Story:** As Yasmin, I want to quickly activate or deactivate a job post so that I can control which listings are visible to candidates.

#### Acceptance Criteria

1. WHEN Yasmin clicks the toggle switch on a Job_Post card, THE Admin_Panel SHALL disable the toggle switch, send a Firestore update to set the isActive field to the opposite boolean value, and re-enable the toggle switch upon receiving a success or failure response within 10 seconds
2. WHEN the Firestore isActive update succeeds, THE Job_List SHALL update the toggle switch position and the Job_Post card's visual active/inactive indicator within 1 second of receiving the success response, using a transition of 200–300ms duration
3. IF the Firestore isActive update fails, does not respond within 10 seconds, or receives conflicting success and failure responses, THEN THE Admin_Panel SHALL treat the operation as failed, revert the toggle switch to its previous position, and display an error Toast_Notification for 5 seconds indicating that the status change was unsuccessful

### Requirement 6: Delete Job Post

**User Story:** As Yasmin, I want to permanently delete a job post so that I can remove outdated or incorrect listings.

#### Acceptance Criteria

1. WHEN Yasmin clicks the delete action on a Job_Post card, THE Admin_Panel SHALL display a confirmation dialog as a modal overlay containing the job title, a warning message indicating that deletion is permanent and cannot be undone, a confirm button, and a cancel button
2. WHEN Yasmin confirms deletion, THE Admin_Panel SHALL disable the confirm button to prevent duplicate submissions, delete the Firestore document, close the confirmation dialog, and remove the card from the Job_List with an exit animation within 300ms
3. WHEN Yasmin cancels deletion, THE Admin_Panel SHALL close the confirmation dialog without changes
4. IF the Firestore deletion operation fails, THEN THE Admin_Panel SHALL close the confirmation dialog, display an error Toast_Notification for 5 seconds indicating the deletion failed, and keep the Job_Post card in the Job_List in its original position; UI-only failures (animation or count update errors) after a successful Firestore deletion SHALL NOT trigger error handling
5. WHEN a Job_Post is successfully deleted, THE Admin_Panel SHALL update the displayed total job count and filtered job count in the Job_List to reflect the removal

### Requirement 7: Delightful UI and Micro-Interactions

**User Story:** As Yasmin, I want the admin panel to feel premium, fun, and made with love so that managing jobs is an enjoyable experience rather than a chore.

#### Acceptance Criteria

1. THE Admin_Panel SHALL apply the HireFound Tailwind theme colors (primary, primary-light, primary-dark, secondary, secondary-light, warm, warm-dark, dark, dark-light, text-main, muted, success, whatsapp) and font families (Inter for body text, DM Serif Display for headings) to all UI elements, with no element using colors or fonts outside this defined set
2. THE Admin_Panel SHALL apply CSS transitions of 300ms to 500ms duration using the project's easing variables (--ease-out-quint, --ease-out-expo) for card hover states, page transitions, form reveals, and status changes
3. THE Admin_Panel SHALL display a personalized welcome section showing "Yasmin" and a time-of-day greeting: "Good morning" from 05:00 to 11:59, "Good afternoon" from 12:00 to 16:59, and "Good evening" from 17:00 to 04:59, based on the user's local browser time
4. THE Admin_Panel SHALL render category badges using the CATEGORY_COLORS mapping: hospitality (primary/10 background, primary text), tech (blue-50 background, blue-700 text), fnb (amber-50 background, amber-700 text), aviation (indigo-50 background, indigo-700 text), and other (gray-100 background, gray-600 text)
5. THE Admin_Panel SHALL apply glassmorphism effects to the navigation bar and modal overlays using the nav-glass style (rgba(255, 250, 245, 0.8) background, 16px backdrop blur, and 1px bottom border at rgba(139, 34, 82, 0.08))
6. WHILE a Firestore operation is in progress, THE Admin_Panel SHALL display an animated loading indicator (opacity pulse or spinner) on the affected element within 200ms of operation start, without disabling interaction with unaffected elements
7. THE Admin_Panel SHALL render all views in a single-column layout on viewports below 768px and a multi-column layout at 768px and above, with all interactive elements maintaining a minimum touch target of 44x44px
8. IF the user has enabled prefers-reduced-motion in their operating system, THEN THE Admin_Panel SHALL disable motion-based CSS transitions and animations by reducing their duration to near-zero, while preserving non-movement visual feedback such as color changes and opacity shifts, and keeping other visual effects like backdrop blur and loading indicator pulses active

### Requirement 8: Form UX and Rich Editing

**User Story:** As Yasmin, I want the job form to be intuitive and guide me through creating complete listings so that I don't miss important fields.

#### Acceptance Criteria

1. THE Job_Editor SHALL organize fields into collapsible sections: Basic Info (title, titleAr, slug, category, location, employmentType), Company Details (companyName, salary), Description (shortDescription, fullDescription, fullDescriptionAr), and Contact (contactWhatsApp, contactEmail, tallyFormId), with all sections expanded by default
2. THE Job_Editor SHALL provide a dropdown selector for category with options: hospitality, tech, fnb, aviation, other
3. THE Job_Editor SHALL provide a dropdown selector for employmentType with options: full-time, part-time, contract, freelance
4. WHEN the user moves focus away from a required field (title, category, location, employmentType) that is empty, or from contactEmail containing a value that does not match a valid email format, THE Job_Editor SHALL display an inline validation message beneath that field within 200ms
5. WHEN Yasmin types in the title field and the slug field has not been manually edited, THE Job_Editor SHALL auto-generate the slug on each input event by lowercasing the title, replacing spaces and special characters with hyphens, removing consecutive hyphens, and trimming leading/trailing hyphens
6. IF the user edits the slug field directly, THEN THE Job_Editor SHALL stop auto-generating the slug from the title for the remainder of the editing session
7. THE Job_Editor SHALL provide multi-line text areas with a minimum height of 6 rows for shortDescription and a minimum height of 12 rows for fullDescription and fullDescriptionAr
8. THE Job_Editor SHALL render titleAr and fullDescriptionAr fields with dir="rtl" attribute and right-aligned text
