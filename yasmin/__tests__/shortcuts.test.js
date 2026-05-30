import { describe, it, expect, vi } from 'vitest';
import { shouldSuppressShortcut, initShortcuts } from '../js/shortcuts.js';

describe('shouldSuppressShortcut', () => {
  function makeEvent(overrides = {}) {
    return {
      target: overrides.target || document.createElement('div'),
      ctrlKey: false,
      altKey: false,
      metaKey: false,
      shiftKey: false,
      ...overrides,
    };
  }

  it('returns true when editor is open', () => {
    const event = makeEvent();
    const viewState = { isEditorOpen: true, isModalOpen: false };
    expect(shouldSuppressShortcut(event, viewState)).toBe(true);
  });

  it('returns true when modal is open', () => {
    const event = makeEvent();
    const viewState = { isEditorOpen: false, isModalOpen: true };
    expect(shouldSuppressShortcut(event, viewState)).toBe(true);
  });

  it('returns true when ctrlKey is pressed', () => {
    const event = makeEvent({ ctrlKey: true });
    const viewState = { isEditorOpen: false, isModalOpen: false };
    expect(shouldSuppressShortcut(event, viewState)).toBe(true);
  });

  it('returns true when altKey is pressed', () => {
    const event = makeEvent({ altKey: true });
    const viewState = { isEditorOpen: false, isModalOpen: false };
    expect(shouldSuppressShortcut(event, viewState)).toBe(true);
  });

  it('returns true when metaKey is pressed', () => {
    const event = makeEvent({ metaKey: true });
    const viewState = { isEditorOpen: false, isModalOpen: false };
    expect(shouldSuppressShortcut(event, viewState)).toBe(true);
  });

  it('returns true when shiftKey is pressed', () => {
    const event = makeEvent({ shiftKey: true });
    const viewState = { isEditorOpen: false, isModalOpen: false };
    expect(shouldSuppressShortcut(event, viewState)).toBe(true);
  });

  it('returns true when target is an input element', () => {
    const input = document.createElement('input');
    const event = makeEvent({ target: input });
    const viewState = { isEditorOpen: false, isModalOpen: false };
    expect(shouldSuppressShortcut(event, viewState)).toBe(true);
  });

  it('returns true when target is a textarea element', () => {
    const textarea = document.createElement('textarea');
    const event = makeEvent({ target: textarea });
    const viewState = { isEditorOpen: false, isModalOpen: false };
    expect(shouldSuppressShortcut(event, viewState)).toBe(true);
  });

  it('returns true when target is a select element', () => {
    const select = document.createElement('select');
    const event = makeEvent({ target: select });
    const viewState = { isEditorOpen: false, isModalOpen: false };
    expect(shouldSuppressShortcut(event, viewState)).toBe(true);
  });

  it('returns true when target is contenteditable', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', 'true');
    const event = makeEvent({ target: div });
    const viewState = { isEditorOpen: false, isModalOpen: false };
    expect(shouldSuppressShortcut(event, viewState)).toBe(true);
  });

  it('returns false when no suppression conditions are met', () => {
    const event = makeEvent();
    const viewState = { isEditorOpen: false, isModalOpen: false };
    expect(shouldSuppressShortcut(event, viewState)).toBe(false);
  });
});

describe('initShortcuts', () => {
  it('calls onNewJob when N key is pressed with no suppression conditions', () => {
    const onNewJob = vi.fn();
    const getViewState = vi.fn(() => ({ isEditorOpen: false, isModalOpen: false }));

    initShortcuts({ onNewJob, getViewState });

    const event = new KeyboardEvent('keydown', { key: 'n', bubbles: true });
    document.dispatchEvent(event);

    expect(onNewJob).toHaveBeenCalledTimes(1);
  });

  it('does not call onNewJob when editor is open', () => {
    const onNewJob = vi.fn();
    const getViewState = vi.fn(() => ({ isEditorOpen: true, isModalOpen: false }));

    initShortcuts({ onNewJob, getViewState });

    const event = new KeyboardEvent('keydown', { key: 'n', bubbles: true });
    document.dispatchEvent(event);

    expect(onNewJob).not.toHaveBeenCalled();
  });

  it('does not call onNewJob for non-N keys', () => {
    const onNewJob = vi.fn();
    const getViewState = vi.fn(() => ({ isEditorOpen: false, isModalOpen: false }));

    initShortcuts({ onNewJob, getViewState });

    const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
    document.dispatchEvent(event);

    expect(onNewJob).not.toHaveBeenCalled();
  });

  it('responds to uppercase N key as well', () => {
    const onNewJob = vi.fn();
    const getViewState = vi.fn(() => ({ isEditorOpen: false, isModalOpen: false }));

    initShortcuts({ onNewJob, getViewState });

    const event = new KeyboardEvent('keydown', { key: 'N', bubbles: true });
    document.dispatchEvent(event);

    expect(onNewJob).toHaveBeenCalledTimes(1);
  });
});
