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

// ─── Constants ───────────────────────────────────────────────────────────────

const ALLOWED_EMAILS = [
  'moh.noor94@gmail.com',
];

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

// ─── Internal: Auth Callbacks ────────────────────────────────────────────────

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

  // Render greeting above dashboard
  renderGreeting(user);

  // Initialize dashboard with callbacks
  initDashboard(viewDashboard, {
    onNewJob: handleNewJob,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleActive: handleToggleActive,
  });

  // Ensure dashboard view is visible
  showDashboardView();
}

/**
 * Called when the user signs out.
 * Hides the nav bar.
 */
function handleSignedOut() {
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
}

/**
 * Switches to the editor view and hides the dashboard.
 */
function showEditorView() {
  if (viewDashboard) viewDashboard.classList.add('hidden');
  if (viewEditor) viewEditor.classList.remove('hidden');
}

// ─── Internal: Greeting ──────────────────────────────────────────────────────

/**
 * Renders the personalized greeting section above the dashboard content.
 * @param {Object} user - Firebase Auth user object
 */
function renderGreeting(user) {
  if (!viewDashboard) return;

  const hour = new Date().getHours();
  const greeting = getGreeting(hour);
  const displayName = user.displayName || 'Yasmin';
  const firstName = displayName.split(' ')[0];

  // Check if greeting already exists
  let greetingEl = viewDashboard.querySelector('#admin-greeting');
  if (!greetingEl) {
    greetingEl = document.createElement('div');
    greetingEl.id = 'admin-greeting';
    greetingEl.className = 'mb-8';
    viewDashboard.prepend(greetingEl);
  }

  greetingEl.innerHTML = `
    <h1 class="font-accent text-3xl font-bold text-primary">${greeting}, ${escapeHtml(firstName)}</h1>
    <p class="text-muted text-sm mt-1">Manage your job listings from here.</p>
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

  // Wire up cancel button
  const cancelBtn = modal.querySelector('#delete-cancel-btn');
  cancelBtn.addEventListener('click', () => {
    overlay.remove();
  });

  // Close on overlay click (outside modal)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
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
      removeJobCard(job.id);
      showToast({ type: 'success', message: 'Job post deleted successfully.' });
    } catch (error) {
      console.error('Failed to delete job:', error);
      // Failure: close dialog, show error toast, keep card in list
      overlay.remove();
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
    refreshJobs();
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

// ─── Internal: Helpers ───────────────────────────────────────────────────────

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
