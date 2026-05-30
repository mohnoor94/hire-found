/**
 * Keyboard Shortcuts Module
 * Registers global keyboard shortcuts for the admin panel.
 * Shortcuts are only active when appropriate (dashboard visible, no modal, no text input focused).
 */

/**
 * Determines whether a keyboard shortcut should be suppressed.
 * Returns true if focus is in a text input, textarea, select, contenteditable,
 * or if a modal/editor is currently visible, or if a modifier key is pressed.
 * @param {KeyboardEvent} event
 * @param {Object} viewState - { isEditorOpen, isModalOpen }
 * @returns {boolean}
 */
export function shouldSuppressShortcut(event, viewState) {
  // Suppress if editor or modal is open
  if (viewState.isEditorOpen || viewState.isModalOpen) {
    return true;
  }

  // Suppress if any modifier key is pressed
  if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
    return true;
  }

  // Suppress if focus is in a text input, textarea, select, or contenteditable element
  const target = event.target;
  if (target) {
    const tagName = target.tagName && target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
      return true;
    }
    if (target.isContentEditable || target.getAttribute?.('contenteditable') === 'true') {
      return true;
    }
  }

  return false;
}

/**
 * Initializes keyboard shortcut listeners.
 * @param {Object} config
 * @param {Function} config.onNewJob - Callback to open create editor
 * @param {Function} config.getViewState - Returns current view state { isEditorOpen, isModalOpen }
 */
export function initShortcuts(config) {
  document.addEventListener('keydown', (event) => {
    // Only respond to the "N" key
    if (event.key !== 'n' && event.key !== 'N') {
      return;
    }

    const viewState = config.getViewState();

    if (shouldSuppressShortcut(event, viewState)) {
      return;
    }

    // All conditions met — trigger new job creation
    config.onNewJob();
  });
}
