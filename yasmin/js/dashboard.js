/**
 * Dashboard Module
 * Renders the job list with filtering, search, and action buttons.
 * Fetches jobs from Firestore and displays them as cards with status indicators.
 */

import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

import { db } from '../../js/firebase-config.js';

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORY_COLORS = {
  hospitality: { bg: 'bg-butterfly-lavender/10', text: 'text-butterfly-lavender' },
  tech: { bg: 'bg-blue-50', text: 'text-blue-700' },
  fnb: { bg: 'bg-amber-50', text: 'text-amber-700' },
  aviation: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  other: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

const FETCH_TIMEOUT_MS = 10000;
const SKELETON_COUNT = 6;

// ─── Module State ────────────────────────────────────────────────────────────

/** @type {HTMLElement|null} */
let dashboardContainer = null;

/** @type {Object|null} */
let dashboardCallbacks = null;

/** @type {Array<Object>} */
let allJobs = [];

/** @type {Array<Object>} */
let filteredJobs = [];

/** @type {boolean} */
let isLoading = false;

// ─── Filter State ────────────────────────────────────────────────────────────

/** @type {string} */
let searchText = '';

/** @type {string} */
let categoryFilter = 'all';

/** @type {string} */
let statusFilter = 'all';

/** @type {number|null} */
let searchDebounceTimer = null;

const DEBOUNCE_DELAY_MS = 300;

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Initializes the dashboard view.
 * @param {HTMLElement} container - The dashboard container element
 * @param {Object} callbacks
 * @param {Function} callbacks.onEdit - Called with job doc when edit is clicked
 * @param {Function} callbacks.onDelete - Called with job doc when delete is clicked
 * @param {Function} callbacks.onToggleActive - Called with job doc when toggle is clicked
 * @param {Function} callbacks.onNewJob - Called when "New Job" button is clicked
 */
export function initDashboard(container, callbacks) {
  dashboardContainer = container;
  dashboardCallbacks = callbacks;

  // Reset filter state
  searchText = '';
  categoryFilter = 'all';
  statusFilter = 'all';

  renderDashboardShell();
  renderFiltersUI();
  refreshJobs();
}

/**
 * Returns the count of jobs where isActive is strictly true.
 * @returns {number}
 */
export function getActiveJobCount() {
  return allJobs.filter((job) => job.isActive === true).length;
}

/**
 * Refreshes the job list from Firestore.
 * Shows loading skeletons during fetch, error state on failure.
 * @returns {Promise<void>}
 */
export async function refreshJobs() {
  if (isLoading) return;
  isLoading = true;

  showLoadingState();

  try {
    const jobs = await fetchJobsWithTimeout();
    allJobs = jobs;
    applyFilters();
    // Notify coordinator that jobs have been loaded
    if (dashboardCallbacks?.onJobsLoaded) {
      dashboardCallbacks.onJobsLoaded();
    }
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    showErrorState();
  } finally {
    isLoading = false;
  }
}

/**
 * Updates a single job card in the list without full refresh.
 * @param {string} jobId - The Firestore document ID
 * @param {Object} data - Updated job data fields
 */
export function updateJobCard(jobId, data) {
  // Update in allJobs array
  const jobIndex = allJobs.findIndex((j) => j.id === jobId);
  if (jobIndex > -1) {
    allJobs[jobIndex] = { ...allJobs[jobIndex], ...data };
  }

  // Update in filteredJobs array
  const filteredIndex = filteredJobs.findIndex((j) => j.id === jobId);
  if (filteredIndex > -1) {
    filteredJobs[filteredIndex] = { ...filteredJobs[filteredIndex], ...data };
  }

  // Update the DOM card
  const card = dashboardContainer?.querySelector(`[data-job-id="${jobId}"]`);
  if (card) {
    const updatedJob = allJobs.find((j) => j.id === jobId);
    if (updatedJob) {
      const newCard = createJobCardElement(updatedJob);
      card.replaceWith(newCard);
    }
  }
}

/**
 * Removes a job card from the list with exit animation.
 * @param {string} jobId - The Firestore document ID
 */
export function removeJobCard(jobId) {
  // Remove from arrays
  allJobs = allJobs.filter((j) => j.id !== jobId);
  filteredJobs = filteredJobs.filter((j) => j.id !== jobId);

  // Animate and remove from DOM
  const card = dashboardContainer?.querySelector(`[data-job-id="${jobId}"]`);
  if (card) {
    const reducedMotion = prefersReducedMotion();
    card.style.transition = reducedMotion ? 'opacity 1ms' : 'opacity 300ms var(--ease-out-quint), transform 300ms var(--ease-out-expo)';
    card.style.opacity = '0';
    card.style.transform = reducedMotion ? '' : 'scale(0.95)';

    setTimeout(() => {
      card.remove();
      updateJobCounts();

      // Show empty state if no jobs remain
      if (filteredJobs.length === 0) {
        showEmptyState();
      }
    }, reducedMotion ? 1 : 300);
  } else {
    updateJobCounts();
    if (filteredJobs.length === 0) {
      showEmptyState();
    }
  }
}

/**
 * Filters a list of jobs by search text, category, and status using AND logic.
 * Exported for independent testing by property tests.
 * @param {Array<Object>} jobs - The list of job objects to filter
 * @param {Object} filters - The filter criteria
 * @param {string} [filters.searchText=''] - Text to match against title, companyName, or location
 * @param {string} [filters.category='all'] - Category to filter by, or 'all' for no category filter
 * @param {string} [filters.status='all'] - 'active', 'inactive', or 'all'
 * @returns {Array<Object>} The filtered list of jobs
 */
export function filterJobs(jobs, { searchText: search = '', category = 'all', status = 'all' } = {}) {
  const normalizedSearch = search.trim().toLowerCase();

  return jobs.filter((job) => {
    // Search filter: match title, companyName, or location
    if (normalizedSearch) {
      const title = (job.title || '').toLowerCase();
      const companyName = (job.companyName || '').toLowerCase();
      const location = (job.location || '').toLowerCase();
      const matchesSearch = title.includes(normalizedSearch) ||
        companyName.includes(normalizedSearch) ||
        location.includes(normalizedSearch);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (category !== 'all') {
      if (job.category !== category) return false;
    }

    // Status filter
    if (status !== 'all') {
      const isActive = job.isActive !== false;
      if (status === 'active' && !isActive) return false;
      if (status === 'inactive' && isActive) return false;
    }

    return true;
  });
}

// ─── Internal: Filtering ─────────────────────────────────────────────────────

/**
 * Applies all active filters to allJobs and updates the display.
 */
function applyFilters() {
  filteredJobs = filterJobs(allJobs, {
    searchText,
    category: categoryFilter,
    status: statusFilter,
  });
  updateCategoryFilterOptions();
  renderJobList();
}

/**
 * Dynamically populates the category filter dropdown from loaded jobs.
 */
function updateCategoryFilterOptions() {
  const categorySelect = dashboardContainer?.querySelector('#dashboard-category-filter');
  if (!categorySelect) return;

  // Collect unique categories from all jobs
  const categories = [...new Set(allJobs.map((j) => j.category).filter(Boolean))].sort();

  // Preserve current selection
  const currentValue = categorySelect.value;

  // Rebuild options
  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = formatCategoryLabel(cat);
    if (cat === currentValue) option.selected = true;
    categorySelect.appendChild(option);
  });
}

/**
 * Renders the filter UI into the #dashboard-filters container.
 */
function renderFiltersUI() {
  const filtersContainer = dashboardContainer?.querySelector('#dashboard-filters');
  if (!filtersContainer) return;

  filtersContainer.innerHTML = `
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          type="text"
          id="dashboard-search"
          placeholder="Search by title, company, or location..."
          class="w-full pl-10 pr-4 py-2.5 min-h-[44px] text-sm border border-gray-200 rounded-xl bg-white placeholder:text-[#6B6560] focus:outline-none focus:ring-2 focus:ring-butterfly-lavender/30 focus:border-butterfly-lavender transition-all duration-200"
          aria-label="Search jobs"
        >
      </div>
      <select
        id="dashboard-category-filter"
        class="min-w-[44px] min-h-[44px] px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-butterfly-lavender/30 focus:border-butterfly-lavender transition-all duration-200 cursor-pointer"
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
      </select>
      <select
        id="dashboard-status-filter"
        class="min-w-[44px] min-h-[44px] px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-butterfly-lavender/30 focus:border-butterfly-lavender transition-all duration-200 cursor-pointer"
        aria-label="Filter by status"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  `;

  // Wire up search input with debounce
  const searchInput = filtersContainer.querySelector('#dashboard-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
      searchDebounceTimer = setTimeout(() => {
        searchText = e.target.value;
        applyFilters();
      }, DEBOUNCE_DELAY_MS);
    });
  }

  // Wire up category filter
  const categorySelect = filtersContainer.querySelector('#dashboard-category-filter');
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      categoryFilter = e.target.value;
      applyFilters();
    });
  }

  // Wire up status filter
  const statusSelect = filtersContainer.querySelector('#dashboard-status-filter');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      statusFilter = e.target.value;
      applyFilters();
    });
  }
}

// ─── Internal: Data Fetching ─────────────────────────────────────────────────

/**
 * Fetches all jobs from Firestore with a timeout.
 * @returns {Promise<Array<Object>>}
 */
async function fetchJobsWithTimeout() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const jobsRef = collection(db, 'jobs');
    const q = query(jobsRef, orderBy('createdAt', 'desc'));

    const fetchPromise = getDocs(q);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Fetch timeout: exceeded 10 seconds')), FETCH_TIMEOUT_MS);
    });

    const snapshot = await Promise.race([fetchPromise, timeoutPromise]);

    clearTimeout(timeoutId);

    const jobs = [];
    snapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    return jobs;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ─── Internal: Rendering ─────────────────────────────────────────────────────

/**
 * Renders the Quick Links section with external tool cards.
 * Each link opens in a new tab with security attributes.
 * @returns {string} HTML string for the quick links section
 */
export function renderQuickLinks() {
  // Internal links (your site) — lavender border
  const internalClass = 'quick-link-card inline-flex items-center gap-2 min-w-[44px] min-h-[44px] px-4 py-3 rounded-xl border border-butterfly-lavender/30 bg-white text-sm font-medium text-text-main shadow-card hover:bg-butterfly-lavender/10 hover:border-butterfly-lavender hover:text-[#7C3AED] transition-all duration-300';
  // External links (third-party tools) — gold border + small external icon
  const externalClass = 'quick-link-card inline-flex items-center gap-2 min-w-[44px] min-h-[44px] px-4 py-3 rounded-xl border border-butterfly-gold/30 bg-white text-sm font-medium text-text-main shadow-card hover:bg-butterfly-gold/10 hover:border-butterfly-gold hover:text-amber-700 transition-all duration-300';
  const externalIcon = '<svg class="w-3 h-3 flex-shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>';

  return `
    <div id="quick-links" class="mb-8" aria-label="Quick Actions">
      <h2 class="font-accent text-xl font-bold text-text-main mb-3">Quick Actions</h2>
      <div class="flex flex-wrap gap-3">
        <a href="../" target="_blank" rel="noopener noreferrer" class="${internalClass}">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          View Homepage
        </a>
        <a href="../jobs/" target="_blank" rel="noopener noreferrer" class="${internalClass}">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          View Jobs
        </a>
        <a href="https://tally.so/forms/create" target="_blank" rel="noopener noreferrer" class="${externalClass}">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Create Tally Form
          ${externalIcon}
        </a>
        <a href="https://app.cal.com" target="_blank" rel="noopener noreferrer" class="${externalClass}">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Open Cal.com
          ${externalIcon}
        </a>
      </div>
    </div>
  `;
}

/**
 * Renders the dashboard shell with header, filters area, and job grid container.
 */
function renderDashboardShell() {
  if (!dashboardContainer) return;

  dashboardContainer.innerHTML = `
    <div id="admin-greeting" class="mb-8 pb-6 border-b border-gray-100">
      <!-- Greeting rendered by app.js -->
    </div>

    ${renderQuickLinks()}

    <div class="dashboard-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <h2 class="font-accent text-xl font-bold text-text-main">Your Listings</h2>
        <span id="dashboard-job-count" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-butterfly-lavender/15 text-[#7C3AED]">Loading...</span>
        <button
          type="button"
          id="refresh-jobs-btn"
          class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:text-text-main hover:bg-gray-100 transition-all duration-200"
          aria-label="Refresh job listings"
          title="Refresh"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>
      <button
        type="button"
        id="new-job-btn"
        class="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-6 py-3 text-sm font-semibold text-white bg-[#7C3AED] rounded-full hover:bg-butterfly-rose transition-all duration-300 shadow-warm sm:ml-auto"
        aria-label="Create new job post"
      >
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        New Job
      </button>
    </div>

    <div id="dashboard-filters" class="mb-6">
      <!-- Filters rendered here -->
    </div>

    <div id="dashboard-job-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Job cards rendered here -->
    </div>
  `;

  // Wire up "New Job" button
  const newJobBtn = dashboardContainer.querySelector('#new-job-btn');
  if (newJobBtn && dashboardCallbacks?.onNewJob) {
    newJobBtn.addEventListener('click', () => dashboardCallbacks.onNewJob());
  }

  // Wire up refresh button
  const refreshBtn = dashboardContainer.querySelector('#refresh-jobs-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => refreshJobs());
  }
}

/**
 * Renders the job list into the grid container.
 */
function renderJobList() {
  const grid = dashboardContainer?.querySelector('#dashboard-job-grid');
  if (!grid) return;

  if (filteredJobs.length === 0) {
    showEmptyState();
    updateJobCounts();
    return;
  }

  grid.innerHTML = '';
  filteredJobs.forEach((job) => {
    const card = createJobCardElement(job);
    grid.appendChild(card);
  });

  updateJobCounts();
}

/**
 * Creates a job card DOM element.
 * @param {Object} job - The job document data with id
 * @returns {HTMLElement}
 */
function createJobCardElement(job) {
  const card = document.createElement('div');
  card.setAttribute('data-job-id', job.id);

  const isActive = job.isActive !== false;

  if (isActive) {
    card.className = 'job-card rounded-2xl border border-butterfly-lavender p-5 shadow-card hover:shadow-warm hover:border-butterfly-lavender hover:-translate-y-0.5 transition-all duration-300 flex flex-col';
    card.style.background = 'linear-gradient(135deg, #ffffff 0%, #fff5f9 100%)';
  } else {
    card.className = 'job-card rounded-2xl border border-rose-200 border-l-4 border-l-rose-400 p-5 shadow-card hover:shadow-warm hover:-translate-y-0.5 transition-all duration-300 flex flex-col opacity-75';
    card.style.background = '#FEF2F2';
  }

  const categoryColors = CATEGORY_COLORS[job.category] || CATEGORY_COLORS.other;

  card.innerHTML = `
    <div class="flex items-start justify-between gap-3 mb-3">
      <h3 class="font-semibold text-text-main text-sm leading-tight line-clamp-2 flex-1">${escapeHtml(job.title || 'Untitled')}</h3>
      <label class="relative inline-flex items-center cursor-pointer flex-shrink-0" aria-label="Toggle active status for ${escapeHtml(job.title || 'this job')}">
        <input
          type="checkbox"
          class="sr-only peer job-toggle"
          ${isActive ? 'checked' : ''}
          data-job-id="${job.id}"
        >
        <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-butterfly-lavender/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-butterfly-lavender"></div>
      </label>
    </div>

    <div class="flex flex-wrap items-center gap-2 mb-3">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors.bg} ${categoryColors.text}">
        ${escapeHtml(formatCategoryLabel(job.category))}
      </span>
      <span class="text-xs ${isActive ? 'text-muted' : 'text-[#E11D48]'}">
        ${isActive ? '● Active' : '○ Inactive'}
      </span>
    </div>

    <div class="space-y-1.5 mb-4 flex-1">
      ${job.location ? `
        <p class="text-xs text-muted flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          ${escapeHtml(job.location)}
        </p>
      ` : ''}
      ${job.employmentType ? `
        <p class="text-xs text-muted flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          ${escapeHtml(formatEmploymentType(job.employmentType))}
        </p>
      ` : ''}
      ${job.companyName ? `
        <p class="text-xs text-muted flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          ${escapeHtml(job.companyName)}
        </p>
      ` : ''}
    </div>

    <div class="flex items-center gap-2 pt-3 border-t border-butterfly-lavender/10">
      ${job.slug ? `
        <a
          href="../jobs/?id=${escapeHtml(job.slug)}"
          target="_blank"
          rel="noopener"
          class="job-view-btn inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 text-xs font-medium text-text-main bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
          aria-label="View ${escapeHtml(job.title || 'this job')} on site"
          onclick="event.stopPropagation()"
        >
          <svg class="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          View
        </a>
      ` : ''}
      <button
        type="button"
        class="job-edit-btn inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 text-xs font-medium text-[#7C3AED] bg-butterfly-lavender/10 rounded-lg hover:bg-butterfly-lavender/20 transition-all duration-200"
        data-job-id="${job.id}"
        aria-label="Edit ${escapeHtml(job.title || 'this job')}"
      >
        <svg class="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
        Edit
      </button>
      <button
        type="button"
        class="job-delete-btn inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200"
        data-job-id="${job.id}"
        aria-label="Delete ${escapeHtml(job.title || 'this job')}"
      >
        <svg class="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        Delete
      </button>
    </div>
  `;

  // Wire up edit button
  const editBtn = card.querySelector('.job-edit-btn');
  if (editBtn && dashboardCallbacks?.onEdit) {
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dashboardCallbacks.onEdit(job);
    });
  }

  // Wire up delete button
  const deleteBtn = card.querySelector('.job-delete-btn');
  if (deleteBtn && dashboardCallbacks?.onDelete) {
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dashboardCallbacks.onDelete(job);
    });
  }

  // Wire up toggle
  const toggle = card.querySelector('.job-toggle');
  if (toggle && dashboardCallbacks?.onToggleActive) {
    toggle.addEventListener('change', (e) => {
      e.stopPropagation();
      dashboardCallbacks.onToggleActive(job);
    });
    // Prevent click on the toggle label from bubbling to card
    const toggleLabel = toggle.closest('label');
    if (toggleLabel) {
      toggleLabel.addEventListener('click', (e) => e.stopPropagation());
    }
  }

  // Wire up card click to open edit
  if (dashboardCallbacks?.onEdit) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => dashboardCallbacks.onEdit(job));
  }

  return card;
}

// ─── Internal: States ────────────────────────────────────────────────────────

/**
 * Shows 6 animated skeleton placeholder cards during loading.
 */
function showLoadingState() {
  const grid = dashboardContainer?.querySelector('#dashboard-job-grid');
  if (!grid) return;

  const countEl = dashboardContainer?.querySelector('#dashboard-job-count');
  if (countEl) countEl.textContent = 'Loading...';

  grid.innerHTML = '';
  for (let i = 0; i < SKELETON_COUNT; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'bg-white rounded-2xl border border-gray-100 p-5 shadow-card animate-pulse';
    skeleton.setAttribute('aria-hidden', 'true');

    skeleton.innerHTML = `
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-5 w-9 bg-gray-200 rounded-full"></div>
      </div>
      <div class="flex items-center gap-2 mb-3">
        <div class="h-5 w-20 bg-gray-200 rounded-full"></div>
        <div class="h-4 w-14 bg-gray-200 rounded"></div>
      </div>
      <div class="space-y-2 mb-4">
        <div class="h-3 bg-gray-200 rounded w-2/3"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        <div class="h-3 bg-gray-200 rounded w-3/5"></div>
      </div>
      <div class="flex items-center gap-2 pt-3 border-t border-gray-100">
        <div class="h-8 w-16 bg-gray-200 rounded-lg"></div>
        <div class="h-8 w-16 bg-gray-200 rounded-lg"></div>
      </div>
    `;

    grid.appendChild(skeleton);
  }
}

/**
 * Shows error state with retry button when fetch fails.
 */
function showErrorState() {
  const grid = dashboardContainer?.querySelector('#dashboard-job-grid');
  if (!grid) return;

  const countEl = dashboardContainer?.querySelector('#dashboard-job-count');
  if (countEl) countEl.textContent = 'Unable to load jobs';

  grid.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-50">
        <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <h3 class="font-semibold text-text-main text-base mb-1">Failed to load jobs</h3>
      <p class="text-muted text-sm mb-6 max-w-xs">Something went wrong while fetching job posts. Please check your connection and try again.</p>
      <button
        type="button"
        id="dashboard-retry-btn"
        class="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-6 py-3 text-sm font-semibold text-white bg-butterfly-lavender rounded-full hover:bg-butterfly-rose transition-all duration-300 shadow-warm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Retry
      </button>
    </div>
  `;

  // Wire up retry button
  const retryBtn = grid.querySelector('#dashboard-retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => refreshJobs());
  }
}

/**
 * Shows empty state with illustration when no jobs match filters.
 */
function showEmptyState() {
  const grid = dashboardContainer?.querySelector('#dashboard-job-grid');
  if (!grid) return;

  grid.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div class="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-warm-dark">
        <svg class="w-10 h-10 text-butterfly-lavender/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      </div>
      <h3 class="font-semibold text-text-main text-base mb-1">No jobs found</h3>
      <p class="text-muted text-sm mb-6 max-w-xs">No job posts match your current filters. Try adjusting your search or create a new listing.</p>
      <button
        type="button"
        id="empty-new-job-btn"
        class="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-6 py-3 text-sm font-semibold text-white bg-butterfly-lavender rounded-full hover:bg-butterfly-rose transition-all duration-300 shadow-warm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Create New Job
      </button>
    </div>
  `;

  // Wire up the "Create New Job" button in empty state
  const emptyNewJobBtn = grid.querySelector('#empty-new-job-btn');
  if (emptyNewJobBtn && dashboardCallbacks?.onNewJob) {
    emptyNewJobBtn.addEventListener('click', () => dashboardCallbacks.onNewJob());
  }
}

// ─── Internal: Helpers ───────────────────────────────────────────────────────

/**
 * Updates the job count display.
 */
function updateJobCounts() {
  const countEl = dashboardContainer?.querySelector('#dashboard-job-count');
  if (!countEl) return;

  const total = allJobs.length;
  const active = allJobs.filter((j) => j.isActive === true).length;
  const filtered = filteredJobs.length;

  if (total === filtered) {
    countEl.textContent = `${active} active of ${total}`;
  } else {
    countEl.textContent = `${filtered} of ${total}`;
  }
}

/**
 * Formats a category value into a display label.
 * @param {string} category
 * @returns {string}
 */
function formatCategoryLabel(category) {
  const labels = {
    hospitality: 'Hospitality',
    tech: 'Tech',
    fnb: 'F&B',
    aviation: 'Aviation',
    retail: 'Retail',
    healthcare: 'Healthcare',
    education: 'Education',
    finance: 'Finance',
    marketing: 'Marketing',
    engineering: 'Engineering',
    design: 'Design',
    'customer-service': 'Customer Service',
    logistics: 'Logistics',
    'real-estate': 'Real Estate',
    media: 'Media',
    other: 'Other',
  };
  // Return known label or capitalize the first letter of unknown categories
  return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Formats an employment type value into a display label.
 * @param {string} type
 * @returns {string}
 */
function formatEmploymentType(type) {
  return (type || '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Returns true if the user prefers reduced motion.
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
