/**
 * Auth Guard Module
 * Manages Firebase Authentication state and access control for the Admin Panel.
 * Only the configured allowed email can access the panel.
 */

import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut as firebaseSignOut,
} from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js';

import { auth } from '../../js/firebase-config.js';

/** @type {import('firebase/auth').User|null} */
let currentUser = null;

/** @type {Object|null} */
let authConfig = null;

/** @type {Function|null} */
let unsubscribeAuthListener = null;

const AUTH_CONFIG = {
  allowedEmails: ['moh.noor94@gmail.com'],
  autoSignOutDelay: 3000,
};

/**
 * Initializes auth state listener and renders appropriate view.
 * @param {Object} config
 * @param {string[]} config.allowedEmails - Array of permitted email addresses
 * @param {HTMLElement} config.signInContainer - Element for sign-in UI
 * @param {HTMLElement} config.appContainer - Element for authenticated content
 * @param {HTMLElement} config.loadingContainer - Element for loading state
 * @param {Function} config.onAuthenticated - Callback when user is verified
 * @param {Function} config.onSignedOut - Callback when user signs out
 */
export function initAuth(config) {
  authConfig = config;

  // Check if Firebase Auth initialized successfully
  if (!auth) {
    showAuthError();
    return;
  }

  // Show loading while verifying auth state
  showView('loading');

  // Set persistence to LOCAL so session survives browser restarts
  // This is fire-and-forget — it only affects future sign-ins
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Failed to set auth persistence:', error);
  });

  // Set up auth listener immediately to catch the restored session
  setupAuthListener();

  // Wire up the Google sign-in button
  setupSignInButton();
}

/**
 * Signs the current user out and resets UI.
 * @returns {Promise<void>}
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
  // Auth state listener will handle UI update
}

/**
 * Returns the current authenticated user or null.
 * @returns {import('firebase/auth').User|null}
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Checks if an email is in the allowed list.
 * @param {string} email - Email to check
 * @param {string[]} allowedEmails - Array of allowed emails
 * @returns {boolean}
 */
export function isEmailAllowed(email, allowedEmails) {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase();
  return allowedEmails.some(
    (allowed) => allowed.toLowerCase() === normalizedEmail
  );
}

/**
 * Sets up the Firebase Auth state listener.
 * Detects sign-in, sign-out, and session expiry.
 */
function setupAuthListener() {
  if (unsubscribeAuthListener) {
    unsubscribeAuthListener();
  }

  unsubscribeAuthListener = onAuthStateChanged(auth, (user) => {
    if (user) {
      handleUserSignedIn(user);
    } else {
      handleUserSignedOut();
    }
  }, (error) => {
    console.error('Auth state listener error:', error);
    showAuthError();
  });
}

/**
 * Handles a signed-in user — checks email against allowed email.
 * @param {import('firebase/auth').User} user
 */
function handleUserSignedIn(user) {
  const allowedEmails = authConfig?.allowedEmails || AUTH_CONFIG.allowedEmails;

  if (isEmailAllowed(user.email, allowedEmails)) {
    // Authorized user
    currentUser = user;
    showView('app');

    if (authConfig?.onAuthenticated) {
      authConfig.onAuthenticated(user);
    }
  } else {
    // Unauthorized user — show access denied and auto sign-out
    currentUser = null;
    showAccessDenied();

    setTimeout(() => {
      firebaseSignOut(auth).catch((err) => {
        console.error('Auto sign-out failed:', err);
      });
    }, AUTH_CONFIG.autoSignOutDelay);
  }
}

/**
 * Handles user signed out — shows sign-in screen.
 */
function handleUserSignedOut() {
  currentUser = null;

  // Restore the sign-in screen content (may have been replaced by Access Denied)
  restoreSignInScreen();

  showView('sign-in');

  if (authConfig?.onSignedOut) {
    authConfig.onSignedOut();
  }
}

/**
 * Wires up the Google sign-in button click handler.
 */
function setupSignInButton() {
  const signInBtn = document.getElementById('google-sign-in-btn');
  if (!signInBtn) return;

  signInBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();

    try {
      signInBtn.disabled = true;
      signInBtn.textContent = 'Signing in...';
      await signInWithPopup(auth, provider);
      // Auth state listener will handle the rest
    } catch (error) {
      console.error('Sign-in error:', error);
      signInBtn.disabled = false;
      signInBtn.textContent = 'Sign in with Google';

      // Handle popup blocked or closed
      if (error.code === 'auth/popup-blocked') {
        showSignInError('Pop-up was blocked. Please allow pop-ups for this site.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup — no error needed
      } else {
        showSignInError('Sign-in failed. Please try again.');
      }
    }
  });
}

/**
 * Shows the specified view and hides others.
 * @param {'loading' | 'sign-in' | 'app'} view
 */
function showView(view) {
  const loadingEl = authConfig?.loadingContainer || document.getElementById('view-loading');
  const signInEl = authConfig?.signInContainer || document.getElementById('view-sign-in');
  const appEl = authConfig?.appContainer || document.getElementById('view-app');
  const navEl = document.getElementById('admin-nav');

  if (loadingEl) loadingEl.classList.toggle('hidden', view !== 'loading');
  if (signInEl) signInEl.classList.toggle('hidden', view !== 'sign-in');
  if (appEl) appEl.classList.toggle('hidden', view !== 'app');
  if (navEl) navEl.classList.toggle('hidden', view !== 'app');
}

/**
 * Restores the sign-in screen to its original state (after Access Denied was shown).
 */
function restoreSignInScreen() {
  const signInEl = authConfig?.signInContainer || document.getElementById('view-sign-in');
  if (!signInEl) return;

  const content = signInEl.querySelector('.w-full');
  if (content) {
    content.innerHTML = `
      <img src="../assets/hirefound-signature.svg" alt="HireFound" class="w-16 h-16 mx-auto mb-6 nav-logo">
      <h1 class="font-accent text-3xl font-bold text-primary mb-2">Admin Panel</h1>
      <p class="text-muted text-sm mb-8">Sign in to manage job posts</p>
      <button
        id="google-sign-in-btn"
        type="button"
        class="inline-flex items-center justify-center min-w-[44px] min-h-[44px] w-full px-6 py-3 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-light transition-all duration-300 shadow-warm"
      >
        Sign in with Google
      </button>
    `;
    // Re-wire the sign-in button
    setupSignInButton();
  }
}

/**
 * Shows the Access Denied message in the sign-in container.
 */
function showAccessDenied() {
  const signInEl = authConfig?.signInContainer || document.getElementById('view-sign-in');
  if (!signInEl) return;

  showView('sign-in');

  const content = signInEl.querySelector('.w-full');
  if (content) {
    content.innerHTML = `
      <img src="../assets/hirefound-signature.svg" alt="HireFound" class="w-16 h-16 mx-auto mb-6 nav-logo">
      <h1 class="font-accent text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
      <p class="text-muted text-sm mb-4">This account is not authorized to access the admin panel.</p>
      <p class="text-muted text-xs">Signing out automatically...</p>
    `;
  }
}

/**
 * Shows a sign-in error message below the sign-in button.
 * @param {string} message
 */
function showSignInError(message) {
  const signInEl = authConfig?.signInContainer || document.getElementById('view-sign-in');
  if (!signInEl) return;

  // Remove any existing error message
  const existingError = signInEl.querySelector('.sign-in-error');
  if (existingError) existingError.remove();

  const errorEl = document.createElement('p');
  errorEl.className = 'sign-in-error text-red-600 text-sm mt-4';
  errorEl.textContent = message;

  const btn = signInEl.querySelector('#google-sign-in-btn');
  if (btn && btn.parentNode) {
    btn.parentNode.appendChild(errorEl);
  }
}

/**
 * Shows the Firebase Auth initialization error with retry button.
 */
function showAuthError() {
  const loadingEl = authConfig?.loadingContainer || document.getElementById('view-loading');
  if (!loadingEl) return;

  showView('loading');

  loadingEl.innerHTML = `
    <div class="text-center">
      <div class="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-50">
        <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <h2 class="font-accent text-xl font-bold text-text-main mb-2">Authentication Unavailable</h2>
      <p class="text-muted text-sm mb-6">Unable to connect to the authentication service. Please try again.</p>
      <button
        id="auth-retry-btn"
        type="button"
        class="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-6 py-3 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-light transition-all duration-300"
      >
        Retry
      </button>
    </div>
  `;

  const retryBtn = loadingEl.querySelector('#auth-retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      // Reload the page to retry Firebase initialization
      window.location.reload();
    });
  }
}
