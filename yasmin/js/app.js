/**
 * App Coordinator Module
 * Orchestrates views, handles routing between dashboard and editor,
 * and coordinates Firestore operations.
 */

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

import { db } from '../../js/firebase-config.js';
import { initAuth, signOut } from './auth.js';
import { initDashboard, refreshJobs, updateJobCard, removeJobCard } from './dashboard.js';
import { openCreateEditor, openEditEditor, deduplicateSlug, validateForm } from './editor.js';
import { showToast } from './toast.js';
import { initShortcuts } from './shortcuts.js';

// ─── Constants ───────────────────────────────────────────────────────────────

const ALLOWED_EMAILS = [
  'moh.noor94@gmail.com',
  "yasmin@hirefound.com"
];

// ─── Greeting Constants ──────────────────────────────────────────────────────

/**
 * Pool of affectionate greeting templates using first name and emoji.
 * Each template is a function that takes a name and returns a greeting string.
 */
export const GREETING_TEMPLATES = [
  (name) => `Hey ${name} ✨`,
  (name) => `Welcome back, ${name} 🦋`,
  (name) => `Hi ${name}, lovely to see you 💜`,
  (name) => `Hello ${name} 🌸`,
  (name) => `There she is, ${name} 💫`,
  (name) => `Good to see you, ${name} 🌷`,
  (name) => `Hey gorgeous, ${name} 💕`,
  (name) => `Look who's here, ${name} 🦋`,
];

/**
 * Pool of short motivational/playful subtitles (each ≤60 chars, no brand name).
 */
export const SUBTITLES = [
  'Your next great hire is one click away.',
  'Ready to find someone amazing?',
  "Let's connect talent with opportunity.",
  'Time to make magic happen ✨',
  'The perfect candidate is out there 🦋',
  "Let's build something beautiful today 🌸",
  'Great things are about to happen.',
  'You make hiring look effortless 💜',
  'Another day, another perfect match.',
  "Today's going to be a good one 🌷",
];

/**
 * Extracts the first name from a display name string.
 * Returns the first space-delimited segment, or "Yasmin" as fallback
 * for null, empty, or whitespace-only input.
 * @param {string|null|undefined} displayName
 * @returns {string}
 */
export function extractFirstName(displayName) {
  if (!displayName || !displayName.trim()) return 'Yasmin';
  return displayName.trim().split(' ')[0];
}

// ─── DOM References ──────────────────────────────────────────────────────────

/** @type {HTMLElement|null} */
let viewDashboard = null;

/** @type {HTMLElement|null} */
let viewEditor = null;

/** @type {HTMLElement|null} */
let navBar = null;

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns a time-of-day greeting string based on the given hour.
 * - "Good morning" for hours 5–11
 * - "Good afternoon" for hours 12–16
 * - "Good evening" for hours 17–23 and 0–4
 * @param {number} hour - Hour of the day (0–23)
 * @returns {string}
 */
export function getGreeting(hour) {
  if (hour >= 5 && hour <= 11) {
    return 'Good morning';
  }
  if (hour >= 12 && hour <= 16) {
    return 'Good afternoon';
  }
  return 'Good evening';
}

/**
 * Entry point — initializes auth, then dashboard on success.
 */
export function initApp() {
  // Cache DOM references
  viewDashboard = document.getElementById('view-dashboard');
  viewEditor = document.getElementById('view-editor');
  navBar = document.getElementById('admin-nav');

  // Initialize authentication
  initAuth({
    allowedEmails: ALLOWED_EMAILS,
    signInContainer: document.getElementById('view-sign-in'),
    appContainer: document.getElementById('view-app'),
    loadingContainer: document.getElementById('view-loading'),
    onAuthenticated: handleAuthenticated,
    onSignedOut: handleSignedOut,
  });

  // Wire up sign-out button
  const signOutBtn = document.getElementById('sign-out-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => signOut());
  }
}

// ─── Nav Bar User Indicator ──────────────────────────────────────────────────

/**
 * Returns the user's display name (or email fallback), truncated to 30 characters
 * with an ellipsis appended if the identifier exceeds 30 characters.
 * @param {Object} user - Firebase Auth user object
 * @returns {string}
 */
export function truncateUserIdentifier(user) {
  const identifier = user.displayName || user.email || '';
  if (identifier.length <= 30) return identifier;
  return identifier.substring(0, 30) + '…';
}

// ─── Internal: Auth Callbacks ────────────────────────────────────────────────

/** @type {boolean} */
let dashboardInitialized = false;

/** @type {boolean} - Tracks whether the editor view is currently open */
let isEditorOpen = false;

/** @type {boolean} - Tracks whether a modal dialog is currently open */
let isModalOpen = false;

/**
 * Called when the user is successfully authenticated.
 * Shows the nav bar, renders the greeting, and initializes the dashboard.
 * @param {Object} user - Firebase Auth user object
 */
function handleAuthenticated(user) {
  // Show nav bar
  if (navBar) {
    navBar.classList.remove('hidden');
  }

  // Render user identifier in nav bar (before Sign Out button)
  // Disabled: full name in nav looked cluttered for a single-user panel
  // renderNavUserIdentifier(user);

  // Only initialize dashboard once — subsequent auth events just show the view
  if (!dashboardInitialized) {
    dashboardInitialized = true;

    // Initialize dashboard with callbacks (this replaces container innerHTML)
    initDashboard(viewDashboard, {
      onNewJob: handleNewJob,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onToggleActive: handleToggleActive,
    });

    // Render greeting above dashboard (after initDashboard so it doesn't get wiped)
    renderGreeting(user);

    // Initialize keyboard shortcuts
    initShortcuts({
      onNewJob: handleNewJob,
      getViewState: () => ({ isEditorOpen, isModalOpen }),
    });

    // Add keyboard hint near the "New Job" button
    addKeyboardHint();
  }

  // Ensure dashboard view is visible
  showDashboardView();
}

/**
 * Called when the user signs out.
 * Hides the nav bar.
 */
function handleSignedOut() {
  dashboardInitialized = false;
  if (navBar) {
    navBar.classList.add('hidden');
  }
}

// ─── Internal: View Switching ────────────────────────────────────────────────

/**
 * Switches to the dashboard view and hides the editor.
 */
function showDashboardView() {
  if (viewDashboard) viewDashboard.classList.remove('hidden');
  if (viewEditor) viewEditor.classList.add('hidden');
  isEditorOpen = false;
}

/**
 * Switches to the editor view and hides the dashboard.
 */
function showEditorView() {
  if (viewDashboard) viewDashboard.classList.add('hidden');
  if (viewEditor) viewEditor.classList.remove('hidden');
  isEditorOpen = true;
}

// ─── Internal: Greeting ──────────────────────────────────────────────────────

/**
 * Renders the personalized greeting section above the dashboard content.
 * Uses affectionate templates with emoji and a butterfly SVG fallback avatar.
 * @param {Object} user - Firebase Auth user object
 */
export function renderGreeting(user) {
  if (!viewDashboard) return;

  const firstName = extractFirstName(user.displayName);
  const photoURL = user.photoURL || '';

  const greetingEl = viewDashboard.querySelector('#admin-greeting');
  if (!greetingEl) return;

  // Pick random greeting from template pool
  const template = GREETING_TEMPLATES[Math.floor(Math.random() * GREETING_TEMPLATES.length)];
  const greeting = template(firstName);

  // Pick random subtitle from subtitle pool
  const subtitle = SUBTITLES[Math.floor(Math.random() * SUBTITLES.length)];

  // Butterfly SVG fallback avatar (48×48px)
  const butterflySvgAvatar = `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#C4B5FD" fill-opacity="0.2"/>
      <path d="M24 14c-3-5-10-6-12-2s1 9 6 12c-5 3-8 8-6 12s9 3 12-2c3 5 10 6 12 2s-1-9-6-12c5-3 8-8 6-12s-9-3-12 2z" fill="#C4B5FD" stroke="#A78BFA" stroke-width="1"/>
      <ellipse cx="24" cy="24" rx="1.5" ry="6" fill="#A78BFA"/>
    </svg>
  `;

  greetingEl.innerHTML = `
    <div class="flex items-center gap-4 sm:gap-5">
      ${photoURL ? `
        <img src="${escapeHtml(photoURL)}" alt="" class="w-12 h-12 rounded-full shadow-sm ring-2 ring-butterfly-lavender/30 ring-offset-2 object-cover flex-shrink-0" style="width:48px;height:48px;">
      ` : butterflySvgAvatar}
      <div class="min-w-0">
        <h1 class="font-accent text-2xl sm:text-3xl font-bold text-text-main truncate">${escapeHtml(greeting)}</h1>
        <p class="text-text-main/70 text-sm sm:text-base mt-1">${escapeHtml(subtitle)}</p>
      </div>
    </div>
  `;
}

// ─── Internal: Dashboard Callbacks ───────────────────────────────────────────

/**
 * Handles "New Job" button click — switches to editor in create mode.
 */
function handleNewJob() {
  showEditorView();
  openCreateEditor(viewEditor, {
    onSave: handleCreateSave,
    onCancel: handleEditorCancel,
  });
}

/**
 * Handles edit action — switches to editor in edit mode with job data.
 * @param {Object} job - The job document data with id
 */
function handleEdit(job) {
  showEditorView();
  openEditEditor(viewEditor, job, job.id, {
    onSave: handleEditSave,
    onCancel: handleEditorCancel,
  });
}

/**
 * Handles delete action — shows confirmation modal and deletes from Firestore on confirm.
 * @param {Object} job - The job document data
 */
function handleDelete(job) {
  // Create modal overlay with glassmorphism
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
  overlay.style.background = 'rgba(255, 250, 245, 0.8)';
  overlay.style.backdropFilter = 'blur(16px)';
  overlay.style.WebkitBackdropFilter = 'blur(16px)';
  overlay.style.border = '1px solid rgba(139, 34, 82, 0.08)';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'delete-modal-title');

  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm';

  modal.innerHTML = `
    <div class="text-center">
      <div class="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-50">
        <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </div>
      <h3 id="delete-modal-title" class="font-accent text-lg font-bold text-text-main mb-2">Delete "${escapeHtml(job.title || 'Untitled')}"?</h3>
      <p class="text-muted text-sm mb-6">This action is permanent and cannot be undone.</p>
      <div class="flex items-center gap-3">
        <button
          type="button"
          id="delete-cancel-btn"
          class="flex-1 inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 text-sm font-medium text-text-main bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="button"
          id="delete-confirm-btn"
          class="flex-1 inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  isModalOpen = true;

  // Wire up cancel button
  const cancelBtn = modal.querySelector('#delete-cancel-btn');
  cancelBtn.addEventListener('click', () => {
    overlay.remove();
    isModalOpen = false;
  });

  // Close on overlay click (outside modal)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      isModalOpen = false;
    }
  });

  // Wire up confirm button
  const confirmBtn = modal.querySelector('#delete-confirm-btn');
  confirmBtn.addEventListener('click', async () => {
    // Disable confirm button to prevent duplicate submissions
    confirmBtn.disabled = true;
    confirmBtn.style.opacity = '0.6';
    confirmBtn.style.cursor = 'not-allowed';
    confirmBtn.textContent = 'Deleting...';

    try {
      // Delete Firestore document
      await deleteDoc(doc(db, 'jobs', job.id));

      // Success: close dialog, remove card with exit animation, update counts
      overlay.remove();
      isModalOpen = false;
      removeJobCard(job.id);
      showToast({ type: 'success', message: 'Job post deleted successfully.' });
    } catch (error) {
      console.error('Failed to delete job:', error);
      // Failure: close dialog, show error toast, keep card in list
      overlay.remove();
      isModalOpen = false;
      showToast({ type: 'error', message: 'Failed to delete job post. Please try again.' });
    }
  });
}

/**
 * Handles toggling the isActive status of a job post.
 * Disables the toggle during the operation, reverts on failure/timeout.
 * @param {Object} job - The job document data with id and isActive
 */
async function handleToggleActive(job) {
  // Find the toggle checkbox in the DOM
  const toggle = document.querySelector(`.job-toggle[data-job-id="${job.id}"]`);
  if (!toggle) return;

  // Disable toggle to prevent double-clicks
  toggle.disabled = true;

  const newIsActive = !job.isActive;
  let timeoutId = null;
  let timedOut = false;

  try {
    // Set up a 10-second timeout
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        timedOut = true;
        reject(new Error('Toggle timeout: exceeded 10 seconds'));
      }, 10000);
    });

    // Send Firestore update
    const updatePromise = updateDoc(doc(db, 'jobs', job.id), { isActive: newIsActive });

    // Race between update and timeout
    await Promise.race([updatePromise, timeoutPromise]);

    // Clear timeout on success
    clearTimeout(timeoutId);

    // On success: update the card with transition
    updateJobCard(job.id, { isActive: newIsActive });
  } catch (error) {
    // Clear timeout if it hasn't fired yet
    if (timeoutId && !timedOut) {
      clearTimeout(timeoutId);
    }

    console.error('Failed to toggle job active status:', error);

    // Revert toggle to previous position
    toggle.checked = job.isActive !== false;

    // Show error toast
    showToast({
      type: 'error',
      message: 'Failed to update job status. Please try again.',
    });
  } finally {
    // Re-enable the toggle in both success and failure cases
    toggle.disabled = false;
  }
}

// ─── Internal: Editor Callbacks ──────────────────────────────────────────────

/**
 * Handles saving a new job post to Firestore.
 * Validates form, checks slug uniqueness, writes document, and updates UI.
 * @param {Object} formData - The validated form data
 * @param {string|null} jobId - null for create
 */
async function handleCreateSave(formData, jobId) {
  // Double-check validation (editor already validates before calling onSave)
  const { valid, errors } = validateForm(formData);
  if (!valid) {
    const firstError = Object.values(errors)[0];
    showToast({ type: 'error', message: firstError || 'Please fix form errors before saving.' });
    return;
  }

  try {
    // Query Firestore for existing slugs to check uniqueness
    const jobsRef = collection(db, 'jobs');
    const slugQuery = query(jobsRef, where('slug', '==', formData.slug));
    const slugSnapshot = await getDocs(slugQuery);

    let uniqueSlug = formData.slug;

    if (!slugSnapshot.empty) {
      // Slug already exists — fetch all slugs to find a unique one
      const allJobsSnapshot = await getDocs(jobsRef);
      const existingSlugs = [];
      allJobsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.slug) {
          existingSlugs.push(data.slug);
        }
      });
      uniqueSlug = deduplicateSlug(formData.slug, existingSlugs);
    }

    // Write document to Firestore
    await addDoc(jobsRef, {
      ...formData,
      slug: uniqueSlug,
      createdAt: serverTimestamp(),
      isActive: true,
    });

    // Success: show toast, switch to dashboard, refresh job list
    showToast({ type: 'success', message: 'Job post created successfully!' });
    showDashboardView();
    await refreshJobs();
  } catch (error) {
    console.error('Failed to create job:', error);
    showToast({ type: 'error', message: 'Failed to create job post. Please try again.' });
    // Form data is preserved since we don't clear the editor
  }
}

/**
 * Handles saving edits to an existing job post in Firestore.
 * Validates form, disables submit button, shows loading, updates document, and refreshes UI.
 * @param {Object} formData - The validated form data
 * @param {string} jobId - The Firestore document ID
 */
async function handleEditSave(formData, jobId) {
  // Double-check validation (editor already validates before calling onSave)
  const { valid, errors } = validateForm(formData);
  if (!valid) {
    const firstError = Object.values(errors)[0];
    showToast({ type: 'error', message: firstError || 'Please fix form errors before saving.' });
    return;
  }

  // Get the submit button and add loading state
  const saveBtn = viewEditor?.querySelector('#editor-save-btn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = `
      <svg class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      Saving...
    `;
  }

  try {
    // Update Firestore document with changed fields
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, formData);

    // Success: show toast, update card in dashboard, switch to dashboard view
    showToast({ type: 'success', message: 'Job post updated successfully!' });
    updateJobCard(jobId, formData);
    showDashboardView();
  } catch (error) {
    console.error('Failed to update job:', error);
    showToast({ type: 'error', message: 'Failed to update job post. Please try again.' });

    // Re-enable submit button and restore label (form data is preserved)
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = 'Update Job';
    }
  }
}

/**
 * Handles editor cancel — switches back to dashboard view.
 */
function handleEditorCancel() {
  showDashboardView();
}

// ─── Internal: Nav User Identifier ───────────────────────────────────────────

/**
 * Renders the authenticated user's identifier (display name or email) in the nav bar,
 * positioned before the Sign Out button in the right-aligned flex group.
 * @param {Object} user - Firebase Auth user object
 */
function renderNavUserIdentifier(user) {
  const signOutBtn = document.getElementById('sign-out-btn');
  if (!signOutBtn) return;

  // Remove any existing user identifier span
  const existing = document.getElementById('nav-user-identifier');
  if (existing) existing.remove();

  const identifier = truncateUserIdentifier(user);
  if (!identifier) return;

  const span = document.createElement('span');
  span.id = 'nav-user-identifier';
  span.className = 'text-muted text-xs';
  span.textContent = identifier;

  // Insert before the Sign Out button
  signOutBtn.parentNode.insertBefore(span, signOutBtn);
}

// ─── Internal: Helpers ───────────────────────────────────────────────────────

/**
 * Adds a title tooltip to the "New Job" button indicating the keyboard shortcut.
 */
function addKeyboardHint() {
  const newJobBtn = viewDashboard?.querySelector('#new-job-btn');
  if (!newJobBtn) return;

  newJobBtn.title = 'Press N to create new job';
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

// ─── Bootstrap ───────────────────────────────────────────────────────────────

// Auto-initialize when the module loads
initApp();
