import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { JobEditor } from "./job-editor";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

vi.mock("@/components/yasmin/rich-text-editor", () => ({
  RichTextEditor: ({
    value,
    onChange,
    "aria-label": ariaLabel,
  }: {
    value: string;
    onChange: (v: string) => void;
    "aria-label"?: string;
  }) =>
    React.createElement("textarea", {
      "aria-label": ariaLabel,
      value,
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChange(event.target.value),
    }),
  createYasminEditorExtensions: () => [],
}));

describe("JobEditor", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("shows a title error and keeps the draft when required fields are empty", () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    act(() => {
      root.render(
        <JobEditor job={null} saving={false} onSave={onSave} onCancel={onCancel} />,
      );
    });

    const save = container.querySelector("#editor-save-btn") as HTMLButtonElement;
    act(() => {
      save.click();
    });

    expect(onSave).not.toHaveBeenCalled();
    expect(container.textContent).toContain("Title is required");
    expect(container.textContent).toContain(
      "Check the highlighted fields before publishing.",
    );
    expect(document.activeElement).toBe(container.querySelector("#field-title"));
  });

  it("asks before discarding a typed draft", () => {
    const onCancel = vi.fn();

    act(() => {
      root.render(
        <JobEditor job={null} saving={false} onSave={vi.fn()} onCancel={onCancel} />,
      );
    });

    const title = container.querySelector("#field-title") as HTMLInputElement;
    act(() => {
      setNativeValue(title, "Front Desk Agent");
    });

    const cancel = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Cancel",
    );
    expect(cancel).toBeTruthy();

    act(() => {
      cancel!.click();
    });

    expect(onCancel).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain("Discard this draft?");

    const discard = Array.from(document.body.querySelectorAll("button")).find(
      (button) => button.textContent === "Discard",
    );
    expect(discard).toBeTruthy();

    act(() => {
      discard!.click();
    });

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("leaves immediately when nothing has changed", () => {
    const onCancel = vi.fn();

    act(() => {
      root.render(
        <JobEditor job={null} saving={false} onSave={vi.fn()} onCancel={onCancel} />,
      );
    });

    const cancel = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Cancel",
    );

    act(() => {
      cancel!.click();
    });

    expect(onCancel).toHaveBeenCalledOnce();
    expect(document.body.textContent).not.toContain("Discard this draft?");
  });
});

function setNativeValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}
