import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { ReelsManager } from "./reels/reels-manager";
import { ReelEditorDialog } from "./reels/reel-editor-dialog";
import { SEED_REELS } from "@/lib/reels";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

if (typeof window !== "undefined" && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

describe("Admin Reels Experience", () => {
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

  it("renders the reels manager with active count and seed reels", async () => {
    await act(async () => {
      root.render(
        <ReelsManager
          reels={SEED_REELS}
          loading={false}
          onNewReel={vi.fn()}
          onEditReel={vi.fn()}
          onDeleteReel={vi.fn()}
          onToggleActive={vi.fn()}
          togglingId={null}
        />,
      );
    });

    expect(container.textContent).toContain("Featured Reel Notes");
    expect(container.textContent).toContain("staged in studio");
    expect(container.textContent).toContain("Feature in progress");
    expect(container.textContent).toContain("Executive Search");
    expect(container.textContent).toContain("Why 90% of job posts fail to attract true executive leaders");
  });

  it("triggers onNewReel callback when Add button is clicked", async () => {
    const onNewReel = vi.fn();
    await act(async () => {
      root.render(
        <ReelsManager
          reels={SEED_REELS}
          loading={false}
          onNewReel={onNewReel}
          onEditReel={vi.fn()}
          onDeleteReel={vi.fn()}
          onToggleActive={vi.fn()}
          togglingId={null}
        />,
      );
    });

    const addBtn = container.querySelector("button");
    expect(addBtn).not.toBeNull();
    act(() => {
      addBtn?.click();
    });

    expect(onNewReel).toHaveBeenCalled();
  });

  it("renders ReelEditorDialog with form fields and extracts shortcode", async () => {
    await act(async () => {
      root.render(
        <ReelEditorDialog
          open={true}
          onOpenChange={vi.fn()}
          reel={SEED_REELS[0]}
          onSave={vi.fn()}
          saving={false}
        />,
      );
    });

    const dialog = document.body;
    expect(dialog.textContent).toContain("Edit Featured Reel");
    expect(dialog.textContent).toContain("Instagram Reel Link");
    expect(dialog.textContent).toContain("Editorial Headline");
    expect(dialog.textContent).toContain("ID: C8f01Executive");
  });
});
