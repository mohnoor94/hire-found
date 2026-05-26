# Jobs Feature — Full Implementation Prompt

## Context

We are building a jobs/vacancies feature for **HireFound** (hirefound.com), a recruitment matchmaking site by Yasmin Blasi. The site is hosted on **GitHub Pages** (static HTML/CSS/JS, no server, no build step). The current homepage is a single `index.html` file using Tailwind CDN, Inter + DM Serif Display fonts, and a warm/primary color palette (#FFFAF5 warm bg, #8B2252 primary, #D4A574 secondary, #1A1A2E dark).

The job data will be stored in **Firebase Firestore** and fetched dynamically at runtime. Yasmin manages jobs through a separate admin page (to be built later). The public-facing pages read from Firestore and render client-side.

---

## What to Build

### 1. Jobs Listing Page (`/jobs/index.html`)

A page that displays all active job postings fetched from Firestore.

**Requirements:**
- Extends the homepage design language exactly (same fonts, colors, shadows, card styles, animations)
- Sticky nav at top with HireFound logo linking back to homepage, and navigation links (About, Jobs [active], Services, Process, Get Started CTA)
- Page header: "Find Your Match" title + subtitle
- Filter pills by category (All, Hospitality, Tech, F&B, Aviation, Other) — dynamically generated from available categories in the data
- Job cards in a responsive grid (1 col mobile, 2 col desktop)
- Each card shows: category badge, job title, Arabic title (if exists), location, short description (truncated), posted date (relative: "2 days ago"), and employment type badge (Full-time, Part-time, Contract)
- Cards link to the individual job detail view
- **Empty state:** If no jobs exist, show a friendly illustrated message: "No open roles right now — but things move fast. Follow us or get in touch and we'll let you know when something comes up." with CTA buttons to WhatsApp and the booking/contact flow.
- Loading state: Show skeleton/shimmer cards while fetching from Firestore
- Footer matching homepage footer
- RTL support: if a job title or description is in Arabic, that specific text should render RTL

### 2. Job Detail View (`/jobs/index.html?id={slug}`)

Same HTML file handles both listing and detail via query parameter. When `?id=` is present, render the single job view instead of the grid.

**Requirements:**
- Back link/breadcrumb: "← All Jobs" linking back to `/jobs/`
- Job header: title, Arabic title (if exists), category badge, location, employment type, posted date
- Full job description (rich text — supports paragraphs, bullet lists, bold text). Content may be in Arabic (render RTL with `dir="rtl"` when Arabic is detected)
- "How to Apply" section at the bottom with TWO possible modes:

  **Mode A — Tally Form Embed (if job has a `tallyFormId`):**
  - Embed the Tally form inline using their widget script
  - Use `transparentBackground=1&dynamicHeight=1&hideTitle=1&alignLeft=1`
  - Pass the job title as a URL parameter to populate a hidden field in Tally
  - Wrap in a styled card that matches the site

  **Mode B — Contact CTAs (if job has NO `tallyFormId`):**
  - Show the existing contact options: WhatsApp message (pre-filled with "Hi Yasmin, I'm interested in the [Job Title] role"), Book a Call (Cal.com link), Email (mailto with subject pre-filled)
  - Style these as the same CTA buttons used on the homepage

- **Empty/Not Found state:** If the job ID doesn't exist or the job is inactive, show: "This role is no longer available. Check out our other open positions." with a link back to /jobs/
- Share button (copy link to clipboard)

### 3. Homepage Integration

Update the existing homepage vacancies section (`#vacancies`) to:

- Fetch the latest 0–4 active jobs from Firestore (ordered by `createdAt` descending, limit 4)
- Render them as the same card style currently used (keep the existing card design)
- Add a "View All Open Roles →" link/button at the bottom linking to `/jobs/`
- **If zero jobs exist:** Replace the entire vacancies section content with a softer message: "We're always looking for great people. No open roles listed right now, but reach out — the right match can happen anytime." with WhatsApp + Book a Call CTAs. Keep the section visible (don't hide it) but remove the filter pills.
- Remove the hardcoded job cards currently in the HTML (they'll be replaced by dynamic ones)

---

## Firestore Collection Schema

Collection: `jobs`

Each document:

```
{
  id: string (auto-generated Firestore doc ID),
  slug: string (URL-friendly identifier, e.g., "hotel-operations-manager"),
  title: string (English job title — required),
  titleAr: string | null (Arabic job title — optional),
  category: string (one of: "hospitality", "tech", "fnb", "aviation", "other"),
  location: string (e.g., "Amman, Jordan" or "Remote" or "Dubai, UAE"),
  employmentType: string (one of: "full-time", "part-time", "contract", "freelance"),
  shortDescription: string (1-2 sentence teaser for the card — required),
  shortDescriptionAr: string | null (Arabic short description — optional),
  fullDescription: string (full job description, stored as HTML string — required),
  fullDescriptionAr: string | null (Arabic full description as HTML — optional),
  tallyFormId: string | null (if set, embed Tally form; if null, show contact CTAs),
  isActive: boolean (only active jobs are shown publicly),
  isFeatured: boolean (featured jobs may get priority in homepage display),
  createdAt: timestamp (when the job was first created),
  updatedAt: timestamp (when the job was last modified),
  expiresAt: timestamp | null (optional auto-expiry date — if set and past, treat as inactive),
  contactWhatsApp: string | null (override WhatsApp number for this specific job, defaults to Yasmin's main number if null),
  contactEmail: string | null (override email for this specific job, defaults to main email if null),
  salary: string | null (optional salary range text, e.g., "2,000 - 3,000 JOD" — shown if provided),
  companyName: string | null (optional — if recruiting for a named client),
  companyNameAr: string | null (optional — Arabic company name)
}
```

---

## Technical Specifications

- **Firebase SDK:** Use Firebase v9+ modular SDK (tree-shakeable imports via CDN/ESM)
- **No build step:** Everything runs as vanilla HTML/JS loaded from CDN. Use ES module script tags.
- **Firestore queries:**
  - Jobs listing: `where("isActive", "==", true)`, optionally filtered by category, ordered by `createdAt` desc
  - Homepage featured: `where("isActive", "==", true)`, ordered by `createdAt` desc, limit 4
  - Also filter out expired jobs client-side: if `expiresAt` is set and `expiresAt < now`, skip
- **Routing:** Query parameter based (`?id=slug`). No hash routing. Use `history.pushState` for clean back-button behavior.
- **RTL detection:** Simple heuristic — if text contains Arabic Unicode range characters (\u0600-\u06FF), apply `dir="rtl"` to that element
- **Animations:** Use the same `reveal` / `fade-up` / `premium-card` animation classes from the homepage
- **Responsive:** Mobile-first, same breakpoints as homepage (md: 768px, lg: 1024px)
- **Accessibility:** Proper heading hierarchy, aria-labels on interactive elements, focus-visible styles, skip-to-content link, semantic HTML
- **Error handling:** If Firestore fetch fails, show a friendly error state with retry button

---

## Design Details

- **Card design:** White background, rounded-2xl, shadow-card, hover lift effect (translateY -6px), gradient top-border on hover (same as homepage premium-card)
- **Category badges:** Small pill with category-specific colors:
  - Hospitality: primary/10 bg, primary text
  - Tech: blue-50 bg, blue-700 text
  - F&B: amber-50 bg, amber-700 text
  - Aviation: indigo-50 bg, indigo-700 text
  - Other: gray-100 bg, gray-600 text
- **Employment type badges:** Outlined pills (border + text, no fill)
- **Loading skeletons:** Animated pulse placeholders matching card dimensions
- **Empty states:** Centered, with a subtle illustration or emoji, warm tone messaging, always provide a next action
- **Tally embed wrapper:** White card with rounded corners, subtle shadow, padding around the iframe
- **Page transitions:** Smooth fade between listing and detail views

---

## Files to Create/Modify

1. **CREATE** `/jobs/index.html` — Jobs listing + detail page
2. **MODIFY** `/index.html` — Update #vacancies section to fetch from Firestore dynamically, handle empty state
3. **CREATE** `/js/firebase-config.js` — Firebase initialization (placeholder config to be filled in)
4. **CREATE** `/js/jobs.js` — Shared logic for fetching/rendering jobs (used by both homepage and jobs page)

---

## Important Notes

- Do NOT use any framework (React, Vue, etc.) — vanilla JS only
- Do NOT add a build step — everything must work as static files on GitHub Pages
- The Firebase config values (apiKey, projectId, etc.) are safe to commit — security is handled by Firestore rules
- All text content that Yasmin enters may be in Arabic — always handle RTL gracefully
- The Tally form embed should pass the job title via URL params so the hidden field in Tally captures which job the applicant is applying for
- Keep the existing homepage functionality intact — only modify the #vacancies section
- Match the homepage quality: smooth animations, attention to spacing, premium feel
- The admin page is a SEPARATE task — do not build it in this prompt. Only build the public-facing pages and the Firestore read logic.
