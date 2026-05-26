/**
 * Toast Notification Module
 * Provides animated notification messages for the Admin Panel.
 */

const MAX_VISIBLE = 3;
const DEFAULT_DURATION = 5000;
const TRANSITION_DURATION = 300; // ms

/** @type {HTMLElement|null} */
let container = null;

/** @type {Array<HTMLElement>} */
const activeToasts = [];

/**
 * Returns true if the user prefers reduced motion.
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets or creates the toast container element.
 * @returns {HTMLElement}
 */
function getContainer() {
  if (container && document.body.contains(container)) {
    return container;
  }

  container = document.createElement('div');
  container.id = 'toast-container';
  container.setAttribute('aria-label', 'Notifications');
  Object.assign(container.style, {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: '9999',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    pointerEvents: 'none',
    maxWidth: '400px',
    width: 'calc(100% - 32px)',
  });
  document.body.appendChild(container);
  return container;
}

/**
 * Creates the toast element with appropriate styling.
 * @param {'success' | 'error'} type
 * @param {string} message
 * @returns {HTMLElement}
 */
function createToastElement(type, message) {
  const toast = document.createElement('div');
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  const isError = type === 'error';

  const bgColor = isError ? '#FEF2F2' : '#F0FDF4';
  const borderColor = isError ? '#FCA5A5' : '#86EFAC';
  const textColor = isError ? '#991B1B' : '#166534';
  const iconColor = isError ? '#DC2626' : '#7A9E7E';

  const animDuration = prefersReducedMotion() ? '1ms' : `${TRANSITION_DURATION}ms`;

  Object.assign(toast.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '12px',
    background: bgColor,
    border: `1px solid ${borderColor}`,
    color: textColor,
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '1.4',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    pointerEvents: 'auto',
    opacity: '0',
    transform: 'translateX(100%)',
    transition: `opacity ${animDuration} var(--ease-out-quint), transform ${animDuration} var(--ease-out-expo)`,
    maxWidth: '100%',
    wordBreak: 'break-word',
  });

  // Icon
  const icon = document.createElement('span');
  icon.setAttribute('aria-hidden', 'true');
  Object.assign(icon.style, {
    flexShrink: '0',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  if (isError) {
    icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="${iconColor}" stroke-width="2"/>
      <path d="M7 7l6 6M13 7l-6 6" stroke="${iconColor}" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  } else {
    icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="${iconColor}" stroke-width="2"/>
      <path d="M6 10l3 3 5-5" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  // Message text
  const text = document.createElement('span');
  text.style.flex = '1';
  text.textContent = message;

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('aria-label', 'Dismiss notification');
  closeBtn.type = 'button';
  Object.assign(closeBtn.style, {
    flexShrink: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '4px',
    color: textColor,
    opacity: '0.6',
    padding: '0',
  });
  closeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;

  toast.appendChild(icon);
  toast.appendChild(text);
  toast.appendChild(closeBtn);

  return toast;
}

/**
 * Removes a toast with exit animation.
 * @param {HTMLElement} toast
 */
function dismissToast(toast) {
  if (!activeToasts.includes(toast)) return;

  const animDuration = prefersReducedMotion() ? '1ms' : `${TRANSITION_DURATION}ms`;
  toast.style.transition = `opacity ${animDuration} var(--ease-out-quint), transform ${animDuration} var(--ease-out-expo)`;
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(100%)';

  const removeDelay = prefersReducedMotion() ? 1 : TRANSITION_DURATION;

  setTimeout(() => {
    const index = activeToasts.indexOf(toast);
    if (index > -1) {
      activeToasts.splice(index, 1);
    }
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, removeDelay);
}

/**
 * Shows a toast notification.
 * @param {Object} options
 * @param {'success' | 'error'} options.type - Toast variant
 * @param {string} options.message - Display message
 * @param {number} [options.duration=5000] - Auto-dismiss time in ms
 */
export function showToast({ type = 'success', message, duration = DEFAULT_DURATION } = {}) {
  const toastContainer = getContainer();
  const toast = createToastElement(type, message);

  // Enforce max visible toasts — remove oldest if at limit
  while (activeToasts.length >= MAX_VISIBLE) {
    dismissToast(activeToasts[0]);
  }

  toastContainer.appendChild(toast);
  activeToasts.push(toast);

  // Trigger enter animation on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });
  });

  // Close button handler
  const closeBtn = toast.querySelector('button');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => dismissToast(toast));
  }

  // Auto-dismiss
  if (duration > 0) {
    setTimeout(() => dismissToast(toast), duration);
  }
}
