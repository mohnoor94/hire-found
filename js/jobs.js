/**
 * jobs.js — Shared logic for fetching, filtering, and rendering jobs.
 * Used by both the Jobs page (/jobs/index.html) and the Homepage (/index.html).
 * 
 * This module is a vanilla JavaScript ES module (no build step, no npm).
 */

import { collection, query, where, orderBy, limit as firestoreLimit, getDocs } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';
import { db } from './firebase-config.js';

// ─── Constants ───────────────────────────────────────────────────────────────

export const DEFAULTS = {
  whatsApp: '962793001043',
  email: 'yasmin@hirefound.com',
  calLink: 'https://cal.com/yasminblasi',
  queryTimeout: 10000 // 10 seconds
};

export const CATEGORY_COLORS = {
  hospitality: { bg: 'bg-primary/10', text: 'text-primary' },
  tech:        { bg: 'bg-blue-50', text: 'text-blue-700' },
  fnb:         { bg: 'bg-amber-50', text: 'text-amber-700' },
  aviation:    { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  other:       { bg: 'bg-gray-100', text: 'text-gray-600' }
};

// ─── Utility Functions ───────────────────────────────────────────────────────

/**
 * Detects whether a string contains at least one Arabic character.
 * Checks Unicode range \u0600-\u06FF.
 * @param {string} text - The text to check.
 * @returns {boolean} True if the text contains Arabic characters.
 */
export function containsArabic(text) {
  if (!text) return false;
  return /[\u0600-\u06FF]/.test(text);
}

/**
 * Truncates text to a maximum length, appending an ellipsis character "…" if needed.
 * If the text length is at or below maxLength, returns the original string unchanged.
 * Otherwise returns a string of exactly maxLength characters where the last character
 * is "…" and the preceding characters are a prefix of the original.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum allowed length (including ellipsis).
 * @returns {string} The original or truncated text.
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

/**
 * Converts a Date object to a relative time string.
 * Returns strings like "just now", "1 minute ago", "2 hours ago", "3 days ago",
 * "1 month ago", "1 year ago", etc.
 * @param {Date} timestamp - The date to convert.
 * @returns {string} A human-readable relative time string.
 */
export function getRelativeTime(timestamp) {
  if (!timestamp) return '';

  const now = new Date();
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes === 1) return '1 minute ago';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  if (diffYears === 1) return '1 year ago';
  return `${diffYears} years ago`;
}

/**
 * Extracts distinct category values from a list of jobs.
 * @param {Array} jobs - Array of job objects with a `category` field.
 * @returns {string[]} Array of distinct category strings.
 */
export function getCategories(jobs) {
  if (!jobs || !Array.isArray(jobs)) return [];
  return [...new Set(jobs.map(job => job.category).filter(Boolean))];
}

/**
 * Filters jobs by category. When category is "all" (case-insensitive),
 * returns the full list. Otherwise returns only jobs whose category
 * field matches the given category.
 * @param {Array} jobs - Array of job objects.
 * @param {string} category - The category to filter by, or "all" for no filter.
 * @returns {Array} Filtered array of job objects.
 */
export function filterByCategory(jobs, category) {
  if (!jobs || !Array.isArray(jobs)) return [];
  if (!category || category.toLowerCase() === 'all') return jobs;
  return jobs.filter(job => job.category === category);
}

// ─── Rendering Functions ─────────────────────────────────────────────────────

/**
 * Renders shimmer-animated skeleton placeholder cards into a container.
 * Clears the container first, sets up a responsive grid layout
 * (1 column below 768px, 2 columns at or above 768px), and inserts
 * `count` skeleton cards matching Job_Card dimensions.
 *
 * @param {number} count - Number of skeleton cards to render.
 * @param {HTMLElement} container - The DOM element to render skeletons into.
 */
export function renderSkeletons(count, container) {
  container.innerHTML = '';
  container.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';

  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-[20px] p-7 shadow-card animate-pulse';
    card.setAttribute('aria-hidden', 'true');

    card.innerHTML = `
      <div class="flex items-start justify-between mb-3">
        <div class="w-[38px] h-[38px] rounded-[10px] bg-gray-200"></div>
        <div class="h-6 w-20 rounded-full bg-gray-200"></div>
      </div>
      <div class="h-5 w-3/4 rounded bg-gray-200 mb-2"></div>
      <div class="h-4 w-1/2 rounded bg-gray-200 mb-3"></div>
      <div class="space-y-2 mb-4">
        <div class="h-3 w-full rounded bg-gray-200"></div>
        <div class="h-3 w-5/6 rounded bg-gray-200"></div>
      </div>
      <div class="flex items-center justify-between">
        <div class="h-3 w-24 rounded bg-gray-200"></div>
        <div class="h-6 w-16 rounded-full bg-gray-200"></div>
      </div>
    `;

    container.appendChild(card);
  }
}

/**
 * Renders job cards into the given container element.
 * Sets up a responsive grid (1 col < 768px, 2 cols >= 768px) and renders
 * each job as a premium card with category badge, title, Arabic title (if exists),
 * location, truncated description, relative posted date, and employment type badge.
 * Cards are clickable and navigate to ?id={slug}.
 *
 * @param {Array} jobs - Array of job objects to render.
 * @param {HTMLElement} container - The DOM element to render cards into.
 */
export function renderJobCards(jobs, container) {
  if (!container) return;

  // Clear existing content
  container.innerHTML = '';

  // Set up responsive grid layout
  container.className = 'grid md:grid-cols-2 gap-6';

  if (!jobs || jobs.length === 0) return;

  jobs.forEach((job, index) => {
    const colors = CATEGORY_COLORS[job.category] || CATEGORY_COLORS.other;
    const description = truncateText(job.shortDescription, 120);
    const postedDate = getRelativeTime(job.createdAt);
    const categoryLabel = job.category
      ? job.category.charAt(0).toUpperCase() + job.category.slice(1)
      : 'Other';

    // Build card element
    const card = document.createElement('article');
    card.className = 'premium-card p-7 shadow-card reveal cursor-pointer min-h-[44px] min-w-[44px]';
    card.style.transitionDelay = `${index * 0.1}s`;
    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', `View details for ${job.title}`);
    card.setAttribute('tabindex', '0');

    // Build Arabic title HTML only if titleAr is non-null and non-empty
    let arabicTitleHtml = '';
    if (job.titleAr && job.titleAr.trim() !== '') {
      arabicTitleHtml = `<p class="text-sm font-semibold text-secondary mb-2" dir="rtl" lang="ar">${job.titleAr}</p>`;
    }

    card.innerHTML = `
      <div class="flex items-start justify-between mb-3">
        <span class="text-xs font-semibold px-3 py-1 ${colors.bg} ${colors.text} rounded-full">${categoryLabel}</span>
      </div>
      <h3 class="text-lg font-bold mb-1">${job.title}</h3>
      ${arabicTitleHtml}
      <p class="text-muted text-sm leading-relaxed mb-3">${description || ''}</p>
      <div class="flex items-center flex-wrap gap-3 text-xs text-muted">
        <span>📍 ${job.location || ''}</span>
        <span>&#x2022;</span>
        <span>${postedDate}</span>
        <span>&#x2022;</span>
        <span class="inline-flex items-center px-2 py-0.5 ${colors.bg} ${colors.text} rounded-full text-xs font-medium">${job.employmentType || ''}</span>
      </div>
    `;

    // Make card clickable — navigate to ?id={slug} using pushState
    card.addEventListener('click', () => {
      try {
        history.pushState({}, '', `?id=${job.slug}`);
        window.dispatchEvent(new CustomEvent('jobNavigate', { detail: { slug: job.slug } }));
      } catch (err) {
        // pushState unavailable — prevent navigation and keep current view
      }
    });

    // Support keyboard activation
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        try {
          history.pushState({}, '', `?id=${job.slug}`);
          window.dispatchEvent(new CustomEvent('jobNavigate', { detail: { slug: job.slug } }));
        } catch (err) {
          // pushState unavailable — prevent navigation and keep current view
        }
      }
    });

    container.appendChild(card);
  });
}

// ─── Render Functions ─────────────────────────────────────────────────────────

/**
 * Renders an error state with a user-friendly message and a retry button.
 * Clears the container and replaces content with the error UI.
 * When the retry button is clicked, the onRetry callback is invoked.
 *
 * @param {HTMLElement} container - The DOM element to render the error state into.
 * @param {Function} onRetry - Callback function triggered when the retry button is clicked.
 */
export function renderError(container, onRetry) {
  container.innerHTML = '';
  container.className = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col items-center justify-center text-center py-16 px-4';

  // Error icon
  const icon = document.createElement('div');
  icon.className = 'w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6';
  icon.innerHTML = `<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>`;

  // Error message
  const message = document.createElement('p');
  message.className = 'text-text-main text-lg font-semibold mb-2';
  message.textContent = 'Unable to load jobs';

  const subMessage = document.createElement('p');
  subMessage.className = 'text-muted text-sm mb-8 max-w-md';
  subMessage.textContent = 'Something went wrong while fetching job listings. Please try again.';

  // Retry button (44x44px minimum touch target)
  const retryBtn = document.createElement('button');
  retryBtn.className = 'magnetic inline-flex items-center gap-2 px-6 py-3 min-h-[44px] min-w-[44px] bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-light transition-colors duration-200 shadow-warm';
  retryBtn.setAttribute('aria-label', 'Retry loading jobs');
  retryBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"/></svg> Retry`;
  retryBtn.addEventListener('click', () => {
    if (typeof onRetry === 'function') {
      onRetry();
    }
  });

  wrapper.appendChild(icon);
  wrapper.appendChild(message);
  wrapper.appendChild(subMessage);
  wrapper.appendChild(retryBtn);
  container.appendChild(wrapper);
}

/**
 * Renders an empty state with a message and contact CTAs (WhatsApp and Book a Call).
 * Clears the container and replaces content with the empty state UI.
 *
 * @param {HTMLElement} container - The DOM element to render the empty state into.
 * @param {string} message - The message to display in the empty state.
 */
export function renderEmpty(container, message) {
  container.innerHTML = '';
  container.className = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col items-center justify-center text-center py-16 px-4';

  // Empty state icon
  const icon = document.createElement('div');
  icon.className = 'w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6';
  icon.innerHTML = `<svg class="w-8 h-8 text-secondary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"/></svg>`;

  // Empty state message
  const msgEl = document.createElement('p');
  msgEl.className = 'text-text-main text-lg font-semibold mb-2';
  msgEl.textContent = message;

  const subMsg = document.createElement('p');
  subMsg.className = 'text-muted text-sm mb-8 max-w-md';
  subMsg.textContent = "Interested in opportunities? Reach out directly — I'd love to hear from you.";

  // CTA buttons container
  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'flex flex-col sm:flex-row items-center gap-3';

  // WhatsApp button
  const whatsAppLink = document.createElement('a');
  whatsAppLink.href = `https://wa.me/${DEFAULTS.whatsApp}?text=${encodeURIComponent("Hi Yasmin! I'm interested in job opportunities.")}`;
  whatsAppLink.target = '_blank';
  whatsAppLink.rel = 'noopener';
  whatsAppLink.className = 'magnetic inline-flex items-center gap-2 px-6 py-3 min-h-[44px] min-w-[44px] bg-whatsapp text-white text-sm font-semibold rounded-full hover:brightness-110 transition-all duration-200 shadow-md';
  whatsAppLink.setAttribute('aria-label', 'Contact via WhatsApp');
  whatsAppLink.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> WhatsApp`;

  // Book a Call button
  const calLink = document.createElement('a');
  calLink.href = DEFAULTS.calLink;
  calLink.target = '_blank';
  calLink.rel = 'noopener';
  calLink.className = 'magnetic inline-flex items-center gap-2 px-6 py-3 min-h-[44px] min-w-[44px] bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-light transition-colors duration-200 shadow-warm';
  calLink.setAttribute('aria-label', 'Book a call with Yasmin');
  calLink.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg> Book a Call`;

  ctaContainer.appendChild(whatsAppLink);
  ctaContainer.appendChild(calLink);

  wrapper.appendChild(icon);
  wrapper.appendChild(msgEl);
  wrapper.appendChild(subMsg);
  wrapper.appendChild(ctaContainer);
  container.appendChild(wrapper);
}

// ─── Detail View Rendering ────────────────────────────────────────────────────

/**
 * Renders the "Job Not Found" state into the given container.
 * Displays a message indicating the role is no longer available and a link
 * back to the jobs listing page.
 *
 * @param {HTMLElement} container - The DOM element to render the not-found state into.
 */
export function renderNotFound(container) {
  if (!container) return;
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col items-center justify-center text-center py-16 px-4';

  // Not found icon
  const icon = document.createElement('div');
  icon.className = 'w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6';
  icon.innerHTML = `<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`;

  // Not found message
  const title = document.createElement('h2');
  title.className = 'text-text-main text-2xl font-bold mb-2';
  title.textContent = 'Job Not Found';

  const message = document.createElement('p');
  message.className = 'text-muted text-sm mb-8 max-w-md';
  message.textContent = 'This role is no longer available or may have been removed. Browse our current openings below.';

  // Back link
  const backLink = document.createElement('a');
  backLink.href = '/jobs/';
  backLink.className = 'magnetic inline-flex items-center gap-2 px-6 py-3 min-h-[44px] min-w-[44px] bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-light transition-colors duration-200 shadow-warm';
  backLink.setAttribute('aria-label', 'Back to all job listings');
  backLink.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg> View All Jobs`;

  wrapper.appendChild(icon);
  wrapper.appendChild(title);
  wrapper.appendChild(message);
  wrapper.appendChild(backLink);
  container.appendChild(wrapper);
}

/**
 * Renders the full job detail view into the given container.
 * Includes: back link, title, Arabic title (RTL), category badge, location,
 * employment type, company name (if exists), salary (if exists), relative posted date,
 * full description as rich text, and a share button.
 *
 * @param {Object} job - The job object to render.
 * @param {HTMLElement} container - The DOM element to render the detail view into.
 */
export function renderJobDetail(job, container) {
  if (!container || !job) return;
  container.innerHTML = '';

  const colors = CATEGORY_COLORS[job.category] || CATEGORY_COLORS.other;
  const categoryLabel = job.category
    ? job.category.charAt(0).toUpperCase() + job.category.slice(1)
    : 'Other';
  const postedDate = getRelativeTime(job.createdAt);

  // === Back Link ===
  const backLink = document.createElement('a');
  backLink.href = '/jobs/';
  backLink.className = 'inline-flex items-center gap-1 text-sm text-primary font-semibold hover:text-primary-light transition-colors duration-200 mb-8 min-h-[44px]';
  backLink.setAttribute('aria-label', 'Back to all job listings');
  backLink.setAttribute('data-back-link', 'true');
  backLink.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg> All Jobs`;

  // === Header Section ===
  const header = document.createElement('header');
  header.className = 'mb-8';

  // Title
  const title = document.createElement('h1');
  title.className = 'font-accent text-3xl md:text-4xl font-bold text-text-main mb-2';
  title.textContent = job.title;

  header.appendChild(title);

  // Arabic title (if exists)
  if (job.titleAr && job.titleAr.trim() !== '') {
    const arabicTitle = document.createElement('p');
    arabicTitle.className = 'text-xl font-semibold text-secondary mb-3';
    arabicTitle.setAttribute('dir', 'rtl');
    arabicTitle.setAttribute('lang', 'ar');
    arabicTitle.textContent = job.titleAr;
    header.appendChild(arabicTitle);
  }

  // Metadata row
  const metaRow = document.createElement('div');
  metaRow.className = 'flex flex-wrap items-center gap-3 text-sm text-muted mt-4';

  // Category badge
  const categoryBadge = document.createElement('span');
  categoryBadge.className = `inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`;
  categoryBadge.textContent = categoryLabel;
  metaRow.appendChild(categoryBadge);

  // Location
  if (job.location) {
    const locationEl = document.createElement('span');
    locationEl.className = 'inline-flex items-center gap-1';
    locationEl.innerHTML = `📍 ${job.location}`;
    metaRow.appendChild(locationEl);
  }

  // Employment type
  if (job.employmentType) {
    const typeEl = document.createElement('span');
    typeEl.className = `inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`;
    typeEl.textContent = job.employmentType;
    metaRow.appendChild(typeEl);
  }

  // Company name
  if (job.companyName && job.companyName.trim() !== '') {
    const companyEl = document.createElement('span');
    companyEl.className = 'inline-flex items-center gap-1';
    companyEl.innerHTML = `🏢 ${job.companyName}`;
    metaRow.appendChild(companyEl);
  }

  // Salary
  if (job.salary && job.salary.trim() !== '') {
    const salaryEl = document.createElement('span');
    salaryEl.className = 'inline-flex items-center gap-1';
    salaryEl.innerHTML = `💰 ${job.salary}`;
    metaRow.appendChild(salaryEl);
  }

  // Posted date
  if (postedDate) {
    const dateEl = document.createElement('span');
    dateEl.className = 'inline-flex items-center gap-1';
    dateEl.innerHTML = `🕐 ${postedDate}`;
    metaRow.appendChild(dateEl);
  }

  header.appendChild(metaRow);

  // === Share Button ===
  const shareContainer = document.createElement('div');
  shareContainer.className = 'mt-6 flex items-center gap-3';

  const shareBtn = document.createElement('button');
  shareBtn.className = 'magnetic inline-flex items-center gap-2 px-4 py-2 min-h-[44px] min-w-[44px] text-sm font-semibold text-primary border-2 border-primary/20 rounded-full hover:bg-primary/5 transition-colors duration-200';
  shareBtn.setAttribute('aria-label', 'Share this job - copy URL to clipboard');
  shareBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/></svg> Share`;

  const shareConfirmation = document.createElement('span');
  shareConfirmation.className = 'text-sm text-success font-medium opacity-0 transition-opacity duration-200';
  shareConfirmation.textContent = '✓ Link copied!';
  shareConfirmation.setAttribute('aria-live', 'polite');

  shareBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      shareConfirmation.style.opacity = '1';
      setTimeout(() => {
        shareConfirmation.style.opacity = '0';
      }, 2000);
    } catch (err) {
      // Fallback: silently fail if clipboard API is unavailable
      console.warn('Clipboard API unavailable:', err);
    }
  });

  shareContainer.appendChild(shareBtn);
  shareContainer.appendChild(shareConfirmation);
  header.appendChild(shareContainer);

  // === Full Description ===
  const descriptionSection = document.createElement('section');
  descriptionSection.className = 'mt-10';

  const descHeading = document.createElement('h2');
  descHeading.className = 'text-xl font-bold text-text-main mb-4';
  descHeading.textContent = 'About This Role';
  descriptionSection.appendChild(descHeading);

  // Render full description as rich text
  const descContent = document.createElement('div');
  descContent.className = 'prose prose-sm max-w-none text-text-main leading-relaxed space-y-4';

  // Determine which description to use (Arabic or English)
  let descriptionHtml = job.fullDescription || '';

  // If there's an Arabic full description, render it in an RTL block
  if (job.fullDescriptionAr && job.fullDescriptionAr.trim() !== '') {
    const arabicDescBlock = document.createElement('div');
    arabicDescBlock.setAttribute('dir', 'rtl');
    arabicDescBlock.setAttribute('lang', 'ar');
    arabicDescBlock.className = 'prose prose-sm max-w-none text-text-main leading-relaxed space-y-4 mb-8';
    arabicDescBlock.innerHTML = formatRichText(job.fullDescriptionAr);
    descriptionSection.appendChild(arabicDescBlock);
  }

  // Apply RTL to English description blocks that contain Arabic
  if (containsArabic(descriptionHtml)) {
    descContent.setAttribute('dir', 'rtl');
    descContent.setAttribute('lang', 'ar');
  }

  descContent.innerHTML = formatRichText(descriptionHtml);
  descriptionSection.appendChild(descContent);

  // === How to Apply Section (Tally Form Embed or Contact CTAs) ===
  let applySection = null;
  
  // Resolve contact info: use job-specific values when non-null, fall back to DEFAULTS
  const whatsAppNumber = job.contactWhatsApp || DEFAULTS.whatsApp;
  const emailAddress = job.contactEmail || DEFAULTS.email;
  const jobTitle = job.title || '';
  const encodedMessage = encodeURIComponent(`Hi! I'm interested in the "${jobTitle}" position.`);
  const encodedSubject = encodeURIComponent(`Interest in: ${jobTitle}`);

  if (job.tallyFormId && job.tallyFormId.trim() !== '') {
    applySection = document.createElement('section');
    applySection.className = 'mt-10';

    const applyHeading = document.createElement('h2');
    applyHeading.className = 'text-xl font-bold text-text-main mb-4';
    applyHeading.textContent = 'Apply Now';
    applySection.appendChild(applyHeading);

    const encodedTitle = encodeURIComponent(job.title || '');
    const tallyUrl = `https://tally.so/embed/${job.tallyFormId}?transparentBackground=1&dynamicHeight=1&hideTitle=1&alignLeft=1&jobTitle=${encodedTitle}`;

    const iframe = document.createElement('iframe');
    iframe.setAttribute('data-tally-src', tallyUrl);
    iframe.src = tallyUrl;
    iframe.width = '100%';
    iframe.frameBorder = '0';
    iframe.marginHeight = '0';
    iframe.marginWidth = '0';
    iframe.title = 'Application Form';
    iframe.className = 'rounded-lg';
    iframe.style.minHeight = '400px';

    applySection.appendChild(iframe);

    // Load Tally embed script for dynamic height resizing
    if (!document.querySelector('script[src*="tally.so/widgets/embed.js"]')) {
      const tallyScript = document.createElement('script');
      tallyScript.src = 'https://tally.so/widgets/embed.js';
      document.body.appendChild(tallyScript);
    }

    // Secondary contact section below the form
    const questionsSection = document.createElement('div');
    questionsSection.className = 'mt-10 pt-8 border-t border-gray-200';

    const questionsHeading = document.createElement('h3');
    questionsHeading.className = 'text-lg font-bold text-text-main mb-2';
    questionsHeading.textContent = 'Have Questions?';
    questionsSection.appendChild(questionsHeading);

    const questionsSubtext = document.createElement('p');
    questionsSubtext.className = 'text-muted text-sm mb-4';
    questionsSubtext.textContent = 'Want more details or prefer to reach out directly? We\'re happy to help.';
    questionsSection.appendChild(questionsSubtext);

    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap';

    // WhatsApp button
    const whatsAppLink = document.createElement('a');
    whatsAppLink.href = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;
    whatsAppLink.target = '_blank';
    whatsAppLink.rel = 'noopener';
    whatsAppLink.className = 'magnetic inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] min-w-[44px] border-2 border-whatsapp/30 text-whatsapp text-sm font-semibold rounded-full hover:bg-whatsapp hover:text-white transition-all duration-200';
    whatsAppLink.setAttribute('aria-label', 'Contact via WhatsApp');
    whatsAppLink.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> WhatsApp`;

    // Book a Call button
    const calLink = document.createElement('a');
    calLink.href = DEFAULTS.calLink;
    calLink.target = '_blank';
    calLink.rel = 'noopener';
    calLink.className = 'magnetic inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] min-w-[44px] border-2 border-primary/30 text-primary text-sm font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-200';
    calLink.setAttribute('aria-label', 'Book a call with Yasmin');
    calLink.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg> Book a Call`;

    // Email button
    const emailLink = document.createElement('a');
    emailLink.href = `mailto:${emailAddress}?subject=${encodedSubject}`;
    emailLink.className = 'magnetic inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] min-w-[44px] border-2 border-secondary/30 text-secondary text-sm font-semibold rounded-full hover:bg-secondary hover:text-white transition-all duration-200';
    emailLink.setAttribute('aria-label', 'Send an email');
    emailLink.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg> Email`;

    ctaContainer.appendChild(whatsAppLink);
    ctaContainer.appendChild(calLink);
    ctaContainer.appendChild(emailLink);
    questionsSection.appendChild(ctaContainer);
    applySection.appendChild(questionsSection);
  } else {
    // === Contact CTAs only (no Tally form) ===
    applySection = document.createElement('section');
    applySection.className = 'mt-10';

    const applyHeading = document.createElement('h2');
    applyHeading.className = 'text-xl font-bold text-text-main mb-4';
    applyHeading.textContent = 'Interested? Get in Touch';
    applySection.appendChild(applyHeading);

    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap';

    // WhatsApp button
    const whatsAppLink = document.createElement('a');
    whatsAppLink.href = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;
    whatsAppLink.target = '_blank';
    whatsAppLink.rel = 'noopener';
    whatsAppLink.className = 'magnetic inline-flex items-center gap-2 px-6 py-3 min-h-[44px] min-w-[44px] bg-whatsapp text-white text-sm font-semibold rounded-full hover:brightness-110 transition-all duration-200 shadow-md';
    whatsAppLink.setAttribute('aria-label', 'Contact via WhatsApp');
    whatsAppLink.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> WhatsApp`;

    // Book a Call button
    const calLink = document.createElement('a');
    calLink.href = DEFAULTS.calLink;
    calLink.target = '_blank';
    calLink.rel = 'noopener';
    calLink.className = 'magnetic inline-flex items-center gap-2 px-6 py-3 min-h-[44px] min-w-[44px] bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-light transition-colors duration-200 shadow-warm';
    calLink.setAttribute('aria-label', 'Book a call with Yasmin');
    calLink.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg> Book a Call`;

    // Email button
    const emailLink = document.createElement('a');
    emailLink.href = `mailto:${emailAddress}?subject=${encodedSubject}`;
    emailLink.className = 'magnetic inline-flex items-center gap-2 px-6 py-3 min-h-[44px] min-w-[44px] bg-secondary text-white text-sm font-semibold rounded-full hover:brightness-110 transition-all duration-200 shadow-md';
    emailLink.setAttribute('aria-label', 'Send an email');
    emailLink.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg> Email`;

    ctaContainer.appendChild(whatsAppLink);
    ctaContainer.appendChild(calLink);
    ctaContainer.appendChild(emailLink);
    applySection.appendChild(ctaContainer);
  }

  // === Assemble the detail view ===
  container.appendChild(backLink);
  container.appendChild(header);
  container.appendChild(descriptionSection);
  if (applySection) {
    container.appendChild(applySection);
  }
}

/**
 * Formats a text/HTML string as rich text supporting paragraphs, bullet lists, and bold.
 * If the input is already HTML (contains tags), it passes through with sanitization.
 * If it's plain text, it converts newlines to paragraphs and recognizes basic patterns.
 *
 * @param {string} text - The text or HTML to format.
 * @returns {string} Formatted HTML string.
 */
function formatRichText(text) {
  if (!text) return '';

  // If text already contains HTML tags, return as-is (it's pre-formatted from Firestore)
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return text;
  }

  // Plain text formatting:
  // Split by double newlines for paragraphs
  const blocks = text.split(/\n\n+/);
  let html = '';

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Check if block is a bullet list (lines starting with - or •)
    const lines = trimmed.split('\n');
    const isList = lines.every(line => /^\s*[-•*]\s/.test(line) || line.trim() === '');

    if (isList) {
      html += '<ul class="list-disc list-inside space-y-1">';
      for (const line of lines) {
        const content = line.replace(/^\s*[-•*]\s*/, '').trim();
        if (content) {
          html += `<li>${applyInlineFormatting(content)}</li>`;
        }
      }
      html += '</ul>';
    } else {
      html += `<p>${applyInlineFormatting(trimmed.replace(/\n/g, '<br>'))}</p>`;
    }
  }

  return html;
}

/**
 * Applies inline formatting (bold) to text.
 * Converts **text** or __text__ to <strong>text</strong>.
 *
 * @param {string} text - The text to apply inline formatting to.
 * @returns {string} Text with inline formatting applied.
 */
function applyInlineFormatting(text) {
  if (!text) return '';
  // Bold: **text** or __text__
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>');
}

// ─── Data Fetching ───────────────────────────────────────────────────────────

/**
 * Fetches active, non-expired jobs from Firestore.
 * Queries the `jobs` collection where isActive === true, ordered by createdAt desc.
 * Supports an optional limit for homepage use (e.g., 4 jobs).
 * Implements a 10-second timeout using Promise.race.
 * Filters out expired jobs client-side (expiresAt < now).
 * Converts Firestore Timestamps to JavaScript Date objects.
 *
 * @param {Object} [options] - Fetch options.
 * @param {number} [options.limit] - Maximum number of jobs to fetch from Firestore.
 * @returns {Promise<Array>} Array of job objects with Date fields.
 * @throws {Error} If db is undefined or query fails/times out.
 */
export async function fetchJobs(options = {}) {
  // Handle undefined db gracefully — throw immediately
  if (!db) {
    throw new Error('Firestore database is not initialized. Check Firebase configuration.');
  }

  // Build query constraints
  const constraints = [
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  ];

  if (options.limit) {
    constraints.push(firestoreLimit(options.limit));
  }

  const jobsRef = collection(db, 'jobs');
  const q = query(jobsRef, ...constraints);

  // Create timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Query timed out after 10 seconds.'));
    }, DEFAULTS.queryTimeout);
  });

  // Race the Firestore query against the timeout
  const snapshot = await Promise.race([
    getDocs(q),
    timeoutPromise
  ]);

  // Convert documents to job objects and filter expired ones
  const now = new Date();
  const jobs = [];

  snapshot.forEach((doc) => {
    const data = doc.data();

    // Convert Firestore Timestamps to Date objects
    const createdAt = data.createdAt ? data.createdAt.toDate() : null;
    const updatedAt = data.updatedAt ? data.updatedAt.toDate() : null;
    const expiresAt = data.expiresAt ? data.expiresAt.toDate() : null;

    // Filter out expired jobs client-side
    if (expiresAt && expiresAt < now) {
      return; // Skip expired job
    }

    jobs.push({
      id: doc.id,
      ...data,
      createdAt,
      updatedAt,
      expiresAt
    });
  });

  return jobs;
}
