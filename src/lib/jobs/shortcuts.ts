/**
 * Keyboard shortcuts — from yasmin/js/shortcuts.js.
 */

export type ShortcutViewState = {
  isEditorOpen: boolean;
  isModalOpen: boolean;
};

export type ShortcutEventLike = {
  target: EventTarget | null;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
};

/** True when the N shortcut should not fire. */
export function shouldSuppressShortcut(
  event: ShortcutEventLike,
  viewState: ShortcutViewState,
): boolean {
  if (viewState.isEditorOpen || viewState.isModalOpen) {
    return true;
  }

  if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
    return true;
  }

  const target = event.target as HTMLElement | null;
  if (target) {
    const tagName = target.tagName && target.tagName.toLowerCase();
    if (tagName === "input" || tagName === "textarea" || tagName === "select") {
      return true;
    }
    if (
      target.isContentEditable ||
      target.getAttribute?.("contenteditable") === "true"
    ) {
      return true;
    }
  }

  return false;
}

export type ShortcutsConfig = {
  onNewJob: () => void;
  getViewState: () => ShortcutViewState;
};

/** Register global N → new job when not suppressed. */
export function initShortcuts(config: ShortcutsConfig): void {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "n" && event.key !== "N") {
      return;
    }

    const viewState = config.getViewState();

    if (shouldSuppressShortcut(event, viewState)) {
      return;
    }

    config.onNewJob();
  });
}
