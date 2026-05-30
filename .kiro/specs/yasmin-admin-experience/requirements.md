# Requirements Document

## Introduction

Transform the HireFound admin panel into a personalized, Yasmin-centric experience. The admin panel is used exclusively by Yasmin, so the branding, URL, page title, greeting, and visual aesthetic should reflect her personal space rather than a generic corporate admin tool. The design should incorporate a butterfly motif and a delightful, feminine aesthetic that makes the experience feel warm and personal upon login.

## Glossary

- **Admin_Panel**: The authenticated web application at the `/admin/` route used to manage job posts
- **Butterfly_Theme**: A visual design system incorporating butterfly motifs, soft feminine colors, and delicate animations to create a personal, delightful aesthetic
- **Nav_Bar**: The fixed navigation bar at the top of the Admin_Panel containing branding, links, and the sign-out button
- **Sign_In_View**: The unauthenticated landing screen shown before Yasmin signs in
- **Greeting_Section**: The personalized welcome area displayed above the dashboard after authentication
- **Page_Title**: The HTML `<title>` element and browser tab text for the Admin_Panel
- **Butterfly_Animation**: A subtle CSS animation of butterfly elements that plays on the Sign_In_View or upon successful authentication

## Requirements

### Requirement 1: Yasmin-Centric Page Identity

**User Story:** As Yasmin, I want the admin panel to feel like my personal workspace, so that it reflects my identity rather than a generic admin tool.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display "Yasmin's Space" as the Page_Title in the browser tab
2. THE Nav_Bar SHALL display "Yasmin's Space" as the branding text instead of "HireFound Admin"
3. THE Admin_Panel SHALL be served at the `/admin/` URL path without any route changes
4. THE Sign_In_View SHALL display "Yasmin's Space" as the heading instead of "Admin Panel"
5. THE Sign_In_View SHALL display "Welcome back, beautiful ✨" as the subtext instead of "Sign in to manage job posts"
6. WHEN the Sign_In_View is restored after an access-denied dismissal, THE Sign_In_View SHALL display "Yasmin's Space" as the heading and "Welcome back, beautiful ✨" as the subtext

### Requirement 2: Personalized Greeting Experience

**User Story:** As Yasmin, I want a warm, personal greeting when I log in, so that the experience feels intimate and delightful.

#### Acceptance Criteria

1. WHEN Yasmin authenticates successfully, THE Greeting_Section SHALL display her first name (extracted from the first space-delimited segment of her account display name) with a greeting randomly selected from a predefined pool of at least 3 affectionate greeting templates that include the user's first name and an emoji (e.g., "Hey Yasmin ✨", "Welcome back, Yasmin 🦋")
2. WHEN the Greeting_Section is rendered, THE Greeting_Section SHALL display a subtitle randomly selected from a predefined pool of at least 4 short motivational or playful phrases (maximum 60 characters each) that do not reference the company brand name
3. IF the authenticated user's account display name is empty or null, THEN THE Greeting_Section SHALL use the fallback name "Yasmin" for the greeting display
4. WHILE the authenticated user's Google account provides a profile photo URL, THE Greeting_Section SHALL display the profile photo as a circular image (48×48 CSS pixels) adjacent to the greeting text
5. IF the profile photo URL is unavailable (null or empty), THEN THE Greeting_Section SHALL display a butterfly-themed fallback avatar of the same dimensions (48×48 CSS pixels) in place of the profile photo, instead of displaying a plain initial circle

### Requirement 3: Butterfly Visual Theme

**User Story:** As Yasmin, I want a butterfly-inspired aesthetic throughout the admin panel, so that the experience feels feminine, delightful, and uniquely mine.

#### Acceptance Criteria

1. THE Sign_In_View SHALL display at least one decorative butterfly SVG element positioned within the sign-in card area, visible without scrolling on viewports 768px and above
2. WHEN Yasmin successfully authenticates, THE Admin_Panel SHALL display a Butterfly_Animation lasting between 1 and 2 seconds that transitions from transparent to visible and back to transparent, playing once before the dashboard content is fully interactive
3. THE Butterfly_Theme SHALL use accent colors limited to lavender (purple-300 to purple-400 range), rose (rose-300 to rose-400 range), and soft pink (pink-200 to pink-300 range) applied only to decorative butterfly elements and subtle background accents, without replacing the existing HireFound primary, secondary, or warm palette colors
4. THE Admin_Panel SHALL display a favicon that contains a butterfly silhouette or outline recognizable at 32x32 pixels
5. WHILE the user has enabled prefers-reduced-motion in their operating system, THE Admin_Panel SHALL not play the Butterfly_Animation and SHALL display static butterfly SVG elements in place of any animated butterfly elements, with no transform or opacity transitions applied to butterfly elements
6. WHEN Yasmin successfully authenticates on a viewport below 768px, THE Admin_Panel SHALL display the Butterfly_Animation at a reduced size that does not obscure the dashboard greeting or navigation elements

### Requirement 4: Refined Color Palette and Typography

**User Story:** As Yasmin, I want the color palette to feel soft and feminine, so that the admin panel feels like a personal creative space.

#### Acceptance Criteria

1. THE Admin_Panel SHALL extend the Tailwind configuration with a butterfly-theme color group containing the following named tokens: butterfly-lavender, butterfly-rose, and butterfly-gold, registered under theme.extend.colors so they are available as Tailwind utility classes throughout the Admin_Panel
2. THE Admin_Panel SHALL apply a linear gradient background to the body element transitioning from the existing warm color token to the butterfly-rose token, oriented from top to bottom
3. THE Nav_Bar SHALL apply butterfly-theme color tokens to its background, text, and border styling, replacing the existing primary-based color references in the nav-glass style with butterfly-lavender for the background tint and butterfly-rose for the bottom border
4. THE job cards SHALL retain their existing functionality, layout structure, and interactive behavior (hover transform, click actions, status toggle) while applying butterfly-lavender as the border color and butterfly-rose with reduced opacity as the box-shadow color
5. THE Admin_Panel SHALL preserve all existing Tailwind theme color tokens (primary, secondary, warm, dark, muted, success, whatsapp and their variants) alongside the new butterfly-theme tokens, ensuring no existing color references are removed from the configuration

### Requirement 5: Authenticated User Indicator

**User Story:** As Yasmin, I want to still see who is logged in, so that I have confirmation my session is active.

#### Acceptance Criteria

1. THE Nav_Bar SHALL display the authenticated user's display name when available, falling back to the user's email address when no display name is set, truncated to a maximum of 30 characters with an ellipsis if exceeded
2. THE Nav_Bar SHALL render the user identifier as plain text styled with the `text-muted` color and `text-xs` font size, positioned to the left of the Sign Out button within the right-aligned group of nav items
3. THE Nav_Bar SHALL retain the Sign Out button styled using the Butterfly_Theme color tokens (text-primary foreground, primary/10 background, rounded-full shape, transitioning to primary background with white text on hover)
4. THE Nav_Bar SHALL retain navigation links to the Main Site and Jobs Page

### Requirement 6: Sign-In Screen Personality

**User Story:** As Yasmin, I want the sign-in screen to feel personal and inviting, so that even before logging in, the space feels like mine.

#### Acceptance Criteria

1. THE Sign_In_View SHALL display a butterfly icon or illustration, rendered at a minimum display size of 48x48 pixels, in place of the generic HireFound logo
2. THE Sign_In_View SHALL use a gradient background using colors defined in the Butterfly_Theme palette
3. THE Sign_In_View sign-in button SHALL be pill-shaped (fully rounded) and use a Butterfly_Theme accent color (rose or lavender) as its background, with a minimum touch-target size of 44x44 pixels
4. WHEN sign-in fails, THE Sign_In_View SHALL display an error message below the sign-in button, using Butterfly_Theme accent colors for text styling, and the error message container SHALL have an appropriate ARIA role to announce the error to assistive technologies
