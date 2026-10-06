/**
 * Port of yasmin/__tests__/shortcuts.test.js
 */
import { describe, it, expect, vi } from "vitest";
import { shouldSuppressShortcut, initShortcuts } from "./shortcuts";

describe("shouldSuppressShortcut", () => {
  function makeEvent(overrides: Record<string, unknown> = {}) {
    return {
      target: (overrides.target as EventTarget) || document.createElement("div"),
      ctrlKey: false,
      altKey: false,
      metaKey: false,
      shiftKey: false,
      ...overrides,
    };
  }

  it("returns true when editor is open", () => {
    expect(
      shouldSuppressShortcut(makeEvent(), {
        isEditorOpen: true,
        isModalOpen: false,
      }),
    ).toBe(true);
  });

  it("returns true when modal is open", () => {
    expect(
      shouldSuppressShortcut(makeEvent(), {
        isEditorOpen: false,
        isModalOpen: true,
      }),
    ).toBe(true);
  });

  it("returns true when ctrlKey is pressed", () => {
    expect(
      shouldSuppressShortcut(makeEvent({ ctrlKey: true }), {
        isEditorOpen: false,
        isModalOpen: false,
      }),
    ).toBe(true);
  });

  it("returns true when altKey is pressed", () => {
    expect(
      shouldSuppressShortcut(makeEvent({ altKey: true }), {
        isEditorOpen: false,
        isModalOpen: false,
      }),
    ).toBe(true);
  });

  it("returns true when metaKey is pressed", () => {
    expect(
      shouldSuppressShortcut(makeEvent({ metaKey: true }), {
        isEditorOpen: false,
        isModalOpen: false,
      }),
    ).toBe(true);
  });

  it("returns true when shiftKey is pressed", () => {
    expect(
      shouldSuppressShortcut(makeEvent({ shiftKey: true }), {
        isEditorOpen: false,
        isModalOpen: false,
      }),
    ).toBe(true);
  });

  it("returns true when target is an input element", () => {
    expect(
      shouldSuppressShortcut(makeEvent({ target: document.createElement("input") }), {
        isEditorOpen: false,
        isModalOpen: false,
      }),
    ).toBe(true);
  });

  it("returns true when target is a textarea element", () => {
    expect(
      shouldSuppressShortcut(
        makeEvent({ target: document.createElement("textarea") }),
        { isEditorOpen: false, isModalOpen: false },
      ),
    ).toBe(true);
  });

  it("returns true when target is a select element", () => {
    expect(
      shouldSuppressShortcut(
        makeEvent({ target: document.createElement("select") }),
        { isEditorOpen: false, isModalOpen: false },
      ),
    ).toBe(true);
  });

  it("returns true when target is contenteditable", () => {
    const div = document.createElement("div");
    div.setAttribute("contenteditable", "true");
    expect(
      shouldSuppressShortcut(makeEvent({ target: div }), {
        isEditorOpen: false,
        isModalOpen: false,
      }),
    ).toBe(true);
  });

  it("returns false when no suppression conditions are met", () => {
    expect(
      shouldSuppressShortcut(makeEvent(), {
        isEditorOpen: false,
        isModalOpen: false,
      }),
    ).toBe(false);
  });
});

describe("initShortcuts", () => {
  it("calls onNewJob when N key is pressed with no suppression conditions", () => {
    const onNewJob = vi.fn();
    const getViewState = vi.fn(() => ({
      isEditorOpen: false,
      isModalOpen: false,
    }));

    initShortcuts({ onNewJob, getViewState });

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "n", bubbles: true }),
    );

    expect(onNewJob).toHaveBeenCalledTimes(1);
  });

  it("does not call onNewJob when editor is open", () => {
    const onNewJob = vi.fn();
    const getViewState = vi.fn(() => ({
      isEditorOpen: true,
      isModalOpen: false,
    }));

    initShortcuts({ onNewJob, getViewState });

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "n", bubbles: true }),
    );

    expect(onNewJob).not.toHaveBeenCalled();
  });

  it("does not call onNewJob for non-N keys", () => {
    const onNewJob = vi.fn();
    const getViewState = vi.fn(() => ({
      isEditorOpen: false,
      isModalOpen: false,
    }));

    initShortcuts({ onNewJob, getViewState });

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "a", bubbles: true }),
    );

    expect(onNewJob).not.toHaveBeenCalled();
  });

  it("responds to uppercase N key as well", () => {
    const onNewJob = vi.fn();
    const getViewState = vi.fn(() => ({
      isEditorOpen: false,
      isModalOpen: false,
    }));

    initShortcuts({ onNewJob, getViewState });

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "N", bubbles: true }),
    );

    expect(onNewJob).toHaveBeenCalledTimes(1);
  });
});
