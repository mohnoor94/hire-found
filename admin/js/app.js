/**
 * App Coordinator Module
 * Orchestrates views, handles routing between dashboard and editor,
 * and coordinates Firestore operations.
 */

import { initAuth, signOut } from './auth.js';
import { initDashboard, refreshJobs } from './dashboard.js';
import { openCreateEditor, openEditEditor } from './editor.js';
import { showToast } from './toast.js';

// ─── Constants ───────────────────────────────────────────────────────────────

const ALLOWED_EMAIL = 'moh.noor94@gmail.com';

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
    allowedEmail: ALLOWED_EMAIL,
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
 * Placeholder for delete action — will be implemented in task 6.5.
 * @param {Object} job - The job document data
 */
function handleDelete(job) {
  showToast({ type: 'success', message: 'Coming soon' });
}

/**
 * Placeholder for toggle active action — will be implemented in task 6.4.
 * @param {Object} job - The job document data
 */
function handleToggleActive(job) {
  showToast({ type: 'success', message: 'Coming soon' });
}

// ─── Internal: Editor Callbacks ──────────────────────────────────────────────

/**
 * Placeholder for create save — will be implemented in task 6.2.
 * @param {Object} formData - The validated form data
 * @param {string|null} jobId - null for create
 */
function handleCreateSave(formData, jobId) {
  showToast({ type: 'success', message: 'Coming soon' });
}

/**
 * Placeholder for edit save — will be implemented in task 6.3.
 * @param {Object} formData - The validated form data
 * @param {string} jobId - The Firestore document ID
 */
function handleEditSave(formData, jobId) {
  showToast({ type: 'success', message: 'Coming soon' });
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
