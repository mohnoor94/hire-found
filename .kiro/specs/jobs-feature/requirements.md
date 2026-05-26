# Requirements Document

## Introduction

HireFound is a recruitment matchmaking website hosted on GitHub Pages. This feature adds a dynamic jobs/vacancies system powered by Firebase Firestore, replacing the current hardcoded vacancy cards. It includes a dedicated jobs listing page with filtering, individual job detail views with application options, and an updated homepage integration that fetches live job data.

## Glossary

- **Jobs_Page**: The public-facing page at `/jobs/index.html` that displays job listings and individual job details
- **Homepage**: The main landing page at `/index.html` containing the #vacancies section
- **Job_Card**: A UI component displaying a summary of a job listing (title, category, location, description snippet, metadata)
- **Job_Detail_View**: The detailed view of a single job, rendered on the same Jobs_Page via query parameter routing
- **Filter_System**: The category-based pill buttons that filter visible job cards
- **Firebase_Client**: The client-side JavaScript module that connects to and queries Firebase Firestore
- **Firestore_Collection**: The `jobs` collection in Firebase Firestore containing all job documents
- **Tally_Form**: An embedded form from Tally.so used as an application method for specific jobs
- **Contact_CTAs**: Call-to-action buttons (WhatsApp, Book a Call, Email) shown when no Tally form is configured
- **RTL_Content**: Right-to-left text content, specifically Arabic titles and descriptions
- **Skeleton_Loader**: A shimmer/placeholder animation shown while job data is being fetched
- **Slug**: A URL-friendly identifier for each job used in query parameter routing

## Requirements

### Requirement 1: Firebase Configuration Module

**User Story:** As a developer, I want a shared Firebase configuration module, so that all pages can connect to Firestore consistently without duplicating setup code.

#### Acceptance Criteria

1. THE Firebase_Client SHALL initialize Firebase using the v9+ modular SDK loaded via CDN ESM imports
2. THE Firebase_Client SHALL export a configured Firestore database instance for use by other modules
3. THE Firebase_Client SHALL reside at `/js/firebase-config.js` as a standalone ES module
4. IF the Firebase SDK fails to load or Firebase initialization throws an error, THEN THE Firebase_Client SHALL log the error to the browser console and consuming modules SHALL receive an undefined database instance that prevents silent failures

### Requirement 2: Jobs Data Fetching

**User Story:** As a developer, I want a jobs module that queries Firestore, so that job data can be fetched and rendered on both the jobs page and homepage.

#### Acceptance Criteria

1. WHEN the Jobs_Page loads, THE Firebase_Client SHALL query the Firestore_Collection for all documents where `isActive` equals true, ordered by `createdAt` descending
2. WHEN the Homepage loads, THE Firebase_Client SHALL query the Firestore_Collection for the most recent 4 documents where `isActive` equals true, ordered by `createdAt` descending
3. WHEN the Firebase_Client receives query results, THE Firebase_Client SHALL exclude any document whose `expiresAt` field is set and is earlier than the current timestamp
4. IF the Firestore query fails or does not respond within 10 seconds, THEN THE Jobs_Page SHALL display an error message indicating that jobs could not be loaded, along with a retry button that re-executes the query
5. IF the Firestore query fails or does not respond within 10 seconds, THEN THE Homepage SHALL hide the job cards area and display a message indicating jobs are temporarily unavailable, with WhatsApp and Book a Call contact CTAs

### Requirement 3: Jobs Listing Page Layout

**User Story:** As a job seeker, I want a dedicated jobs page that matches the HireFound design language, so that I can browse open roles in a familiar and professional interface.

#### Acceptance Criteria

1. THE Jobs_Page SHALL include a sticky navigation bar with the HireFound logo linking to the Homepage and navigation links (About, Jobs, Services, Process, and a Get Started call-to-action), where the Jobs link is visually indicated as the currently active page
2. THE Jobs_Page SHALL display a page header with the title "Find Your Match" and a subtitle of no more than 150 characters describing the purpose of the page
3. THE Jobs_Page SHALL use the same fonts (Inter, DM Serif Display), color palette (#FFFAF5, #8B2252, #D4A574, #1A1A2E), card styles (rounded corners, shadow, hover lift effect), and scroll-reveal animations as the Homepage
4. THE Jobs_Page SHALL include a footer section matching the Homepage footer design
5. THE Jobs_Page SHALL use semantic HTML with a single h1 for the page title, h2 for section headings, h3 for card-level headings, aria-labels on all interactive elements, and visible focus indicators on all focusable elements
6. THE Jobs_Page SHALL include a skip-to-content link as the first focusable element that moves keyboard focus to the main content area past the navigation bar

### Requirement 4: Job Cards Display

**User Story:** As a job seeker, I want to see job listings as cards with key information, so that I can quickly scan available positions.

#### Acceptance Criteria

1. THE Jobs_Page SHALL render Job_Cards in a responsive grid layout with 1 column on viewports below 768px and 2 columns on viewports at or above 768px
2. WHEN a job has data available, THE Job_Card SHALL display: category badge, job title, Arabic title (if `titleAr` exists), location, short description truncated to a maximum of 120 characters with an ellipsis, relative posted date (e.g., "2 days ago"), and employment type badge
3. WHEN a job has an Arabic title, THE Job_Card SHALL render the Arabic title with `dir="rtl"` and `lang="ar"` attributes
4. WHEN a user clicks a Job_Card, THE Jobs_Page SHALL navigate to the Job_Detail_View using the query parameter `?id={slug}`
5. WHILE job data is loading, THE Jobs_Page SHALL display 4 Skeleton_Loader placeholder cards with shimmer animation matching the Job_Card dimensions
6. IF no active jobs exist in the Firestore_Collection, THEN THE Jobs_Page SHALL display an empty state message indicating no open roles are currently available, along with Contact_CTAs (WhatsApp and Book a Call buttons) providing a next action for the user

### Requirement 5: Category Filtering

**User Story:** As a job seeker, I want to filter jobs by category, so that I can find roles relevant to my industry.

#### Acceptance Criteria

1. THE Filter_System SHALL always display an "All" pill button, followed by category pills dynamically generated from the distinct categories present in the fetched job data
2. WHEN the Jobs_Page listing view loads, THE Filter_System SHALL set the "All" pill as the active filter by default and display all active Job_Cards
3. WHEN a user selects a category pill, THE Jobs_Page SHALL immediately display only Job_Cards whose category field matches the selected category, without re-fetching data from Firestore
4. WHEN a user selects the "All" pill, THE Jobs_Page SHALL display all active Job_Cards
5. WHEN the active filter changes, THE Filter_System SHALL explicitly set the style of all pills: the active pill uses a filled background style, and all inactive pills use an unfilled or outlined style
6. IF a selected category filter results in zero matching Job_Cards, THEN THE Jobs_Page SHALL display an empty state message indicating no jobs are available in that category

### Requirement 6: Job Detail View

**User Story:** As a job seeker, I want to view full details of a job, so that I can understand the role requirements and decide whether to apply.

#### Acceptance Criteria

1. WHEN the Jobs_Page URL contains a query parameter `id` with a slug that matches an active job document's `slug` field, THE Jobs_Page SHALL set the view type to DETAIL and render the Job_Detail_View instead of the listing view
2. THE Job_Detail_View SHALL display a back link labeled "← All Jobs" that navigates to the Jobs_Page listing view without query parameters
3. THE Job_Detail_View SHALL display the job header with title, Arabic title (if `titleAr` exists, rendered with `dir="rtl"` and `lang="ar"`), category badge, location, employment type badge, company name (if `companyName` exists), salary (if `salary` exists), and posted date in relative format (e.g., "3 days ago")
4. THE Job_Detail_View SHALL render the full job description as rich text supporting paragraphs, bullet lists, and bold formatting
5. WHEN the full description contains Arabic characters (Unicode range \u0600-\u06FF), THE Job_Detail_View SHALL apply `dir="rtl"` to those content blocks
6. IF the query parameter `id` does not match any active job document's `slug` field, THEN THE Jobs_Page SHALL set the current view state to NOT_FOUND and display a "Job Not Found" message indicating the role is no longer available and a link back to the Jobs_Page listing
7. WHEN a user activates the share button, THE Job_Detail_View SHALL copy the current page URL to the clipboard and display a visible confirmation message for at least 2 seconds indicating the URL was copied

### Requirement 7: Job Application Methods

**User Story:** As a job seeker, I want clear instructions on how to apply, so that I can submit my interest in a role.

#### Acceptance Criteria

1. WHEN a job has a `tallyFormId` value, THE Job_Detail_View SHALL embed the corresponding Tally form in a "How to Apply" section using the widget parameters `transparentBackground=1`, `dynamicHeight=1`, `hideTitle=1`, and `alignLeft=1`, and SHALL pass the job title as a URL parameter to the embedded form
2. WHEN a job does not have a `tallyFormId` value, THE Job_Detail_View SHALL display Contact_CTAs including a WhatsApp button with a pre-filled message containing the job title, a Book a Call button linking to the Cal.com booking page, and an Email button with the job title pre-filled in the subject line
3. IF the job document fields `contactWhatsApp` or `contactEmail` are null, THEN THE Contact_CTAs SHALL fall back to the site-wide default contact information for the respective channel
4. THE Contact_CTAs SHALL use the contact information stored in the job document fields (`contactWhatsApp`, `contactEmail`) when those fields contain a value

### Requirement 8: Homepage Vacancies Integration

**User Story:** As a site visitor, I want to see the latest open roles on the homepage, so that I can discover opportunities without navigating to a separate page.

#### Acceptance Criteria

1. WHEN the Homepage loads, THE Homepage SHALL fetch and display up to 4 active jobs from the Firestore_Collection in the #vacancies section, ordered by `createdAt` descending, excluding any job whose `expiresAt` timestamp is in the past
2. THE Homepage SHALL render fetched jobs using the same Job_Card style as the Jobs_Page, including category badge, job title, Arabic title (if exists), location, truncated short description, relative posted date, and employment type badge
3. THE Homepage SHALL display a "View All Open Roles →" link below the job cards that navigates to the Jobs_Page
4. IF zero jobs are displayed after fetching and filtering (including when all fetched jobs are expired), THEN THE Homepage SHALL replace the job cards area with a message indicating no roles are currently listed along with Contact_CTAs (WhatsApp and Book a Call) and keep the #vacancies section visible
5. IF zero jobs are displayed after fetching and filtering, THEN THE Homepage SHALL hide the filter pills from the #vacancies section
6. THE Homepage SHALL render job cards solely from dynamically fetched Firestore data with no hardcoded job card markup in the HTML source

### Requirement 9: RTL Language Support

**User Story:** As an Arabic-speaking job seeker, I want Arabic content displayed correctly, so that I can read job information in my language.

#### Acceptance Criteria

1. WHEN a text field contains Arabic characters (Unicode range \u0600-\u06FF), THE Jobs_Page SHALL apply `dir="rtl"` and `lang="ar"` attributes to that text element
2. WHEN an Arabic content field (`titleAr`, `shortDescriptionAr`, `fullDescriptionAr`, or `companyNameAr`) contains a non-empty value, THE Jobs_Page SHALL render that Arabic text in a dedicated element with `dir="rtl"` and `lang="ar"` attributes alongside or in place of the corresponding English content
3. IF an Arabic content field (`titleAr`, `shortDescriptionAr`, `fullDescriptionAr`, or `companyNameAr`) is null or empty, THEN THE Jobs_Page SHALL display only the English content for that field without rendering an empty RTL element
4. WHEN the Homepage renders Job_Cards that contain Arabic content fields, THE Homepage SHALL apply the same `dir="rtl"` and `lang="ar"` attributes to Arabic text elements as the Jobs_Page

### Requirement 10: Responsive and Mobile-First Design

**User Story:** As a mobile user, I want the jobs page to work well on my device, so that I can browse jobs on the go.

#### Acceptance Criteria

1. THE Jobs_Page SHALL use a mobile-first responsive approach where the base CSS targets viewports below 768px and applies progressive enhancements at the 768px and 1024px breakpoints
2. THE Jobs_Page SHALL display Job_Cards in a single column on viewports below 768px and two columns on viewports at or above 768px
3. THE Filter_System SHALL wrap pills to multiple lines on viewports below 768px without horizontal scrolling, while horizontal scrolling is permitted on desktop viewports
4. THE Job_Detail_View SHALL display content in a single-column layout on all viewport sizes with a maximum content width of 65ch and minimum horizontal padding of 16px
5. THE Jobs_Page SHALL render all interactive elements (filter pills, buttons, and Job_Card tap areas) with a minimum touch target size of 44×44 CSS pixels on viewports below 768px

### Requirement 11: Loading and Error States

**User Story:** As a user, I want clear feedback during loading and errors, so that I know the page is working and can recover from failures.

#### Acceptance Criteria

1. WHILE data is being fetched from Firestore, THE Jobs_Page SHALL display 4 animated Skeleton_Loader placeholders arranged in the same grid layout as Job_Cards
2. IF a network error occurs during data fetch, THEN THE Jobs_Page SHALL display a user-friendly error message indicating that jobs could not be loaded, replacing all existing content including any previously loaded job data
3. IF a network error occurs during data fetch, THEN THE Jobs_Page SHALL provide a retry button that re-attempts the Firestore query and displays the Skeleton_Loader placeholders while the re-attempt is in progress
4. WHILE data is being fetched on the Homepage, THE Homepage SHALL display Skeleton_Loader placeholders in the #vacancies section matching the Job_Card dimensions

### Requirement 12: Static Hosting Compatibility

**User Story:** As a developer, I want the feature to work on GitHub Pages without a build step, so that deployment remains simple.

#### Acceptance Criteria

1. THE Jobs_Page SHALL function as a static HTML file served from GitHub Pages without any server-side processing, build commands, or transpilation in the deployment pipeline
2. THE Jobs_Page SHALL use vanilla JavaScript with ES module imports via CDN for Firebase SDK, with no npm packages, bundlers, or package managers required for deployment
3. THE Jobs_Page SHALL handle routing between listing and detail views using query parameters only, without requiring server-side URL rewriting or custom 404 page redirects
4. THE Firebase_Client SHALL load the Firebase SDK via CDN ES module imports without a bundler or build step
5. THE Firebase_Client SHALL embed Firebase configuration values directly in the source code without relying on environment variable injection or build-time substitution
6. WHEN a user navigates between listing and detail views, THE Jobs_Page SHALL use `history.pushState` to update the URL so that browser back and forward buttons return the user to the previous view without a full page reload. IF `history.pushState` fails or is unavailable, THEN THE Jobs_Page SHALL prevent the navigation and keep the current view
