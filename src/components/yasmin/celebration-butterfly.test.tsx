import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { CelebrationButterfly } from "./celebration-butterfly";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe("CelebrationButterfly", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
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

  it("renders nothing when show is false", async () => {
    await act(async () => {
      root.render(<CelebrationButterfly show={false} />);
    });
    expect(container.innerHTML).toBe("");
  });

  it("renders butterflies and sparkles when show is true", async () => {
    await act(async () => {
      root.render(<CelebrationButterfly show={true} />);
    });
    const rootEl = container.querySelector(".celebration-butterflies-root");
    expect(rootEl).toBeTruthy();
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0);
  });

  it("fires onComplete after timer expires", async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();

    await act(async () => {
      root.render(<CelebrationButterfly show={true} onComplete={onComplete} />);
    });

    expect(onComplete).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(2600);
    });

    expect(onComplete).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
