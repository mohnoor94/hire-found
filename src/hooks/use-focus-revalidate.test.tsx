/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useFocusRevalidate } from "./use-focus-revalidate";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

function TestComponent({
  onRun,
  cooldownMs,
  enabled,
  onExposeRecordRun,
}: {
  onRun: () => void;
  cooldownMs?: number;
  enabled?: boolean;
  onExposeRecordRun?: (recordRun: () => void) => void;
}) {
  const { recordRun } = useFocusRevalidate(onRun, { cooldownMs, enabled });
  onExposeRecordRun?.(recordRun);
  return null;
}

describe("useFocusRevalidate", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.useRealTimers();
  });

  it("does not trigger callback immediately on mount", () => {
    const callback = vi.fn();
    act(() => {
      root.render(<TestComponent onRun={callback} />);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("triggers callback on window focus after cooldown has elapsed", () => {
    const callback = vi.fn();
    act(() => {
      root.render(<TestComponent onRun={callback} cooldownMs={60_000} />);
    });

    // Advance time past cooldown
    act(() => {
      vi.advanceTimersByTime(60_001);
    });

    act(() => {
      window.dispatchEvent(new Event("focus"));
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("suppresses callback if window focus occurs within cooldown", () => {
    const callback = vi.fn();
    act(() => {
      root.render(<TestComponent onRun={callback} cooldownMs={60_000} />);
    });

    // Only 30s elapsed
    act(() => {
      vi.advanceTimersByTime(30_000);
      window.dispatchEvent(new Event("focus"));
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("triggers on visibilitychange when tab becomes visible after cooldown", () => {
    const callback = vi.fn();
    act(() => {
      root.render(<TestComponent onRun={callback} cooldownMs={60_000} />);
    });

    act(() => {
      vi.advanceTimersByTime(65_000);
      (document as { visibilityState: string }).visibilityState = "visible";
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not trigger on visibilitychange if document is hidden", () => {
    const callback = vi.fn();
    act(() => {
      root.render(<TestComponent onRun={callback} cooldownMs={60_000} />);
    });

    act(() => {
      vi.advanceTimersByTime(65_000);
      (document as { visibilityState: string }).visibilityState = "hidden";
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("does not trigger when enabled is false", () => {
    const callback = vi.fn();
    act(() => {
      root.render(
        <TestComponent onRun={callback} cooldownMs={1_000} enabled={false} />,
      );
    });

    act(() => {
      vi.advanceTimersByTime(5_000);
      window.dispatchEvent(new Event("focus"));
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("resets cooldown when recordRun is called", () => {
    const callback = vi.fn();
    let recordRunFn: (() => void) | undefined;

    act(() => {
      root.render(
        <TestComponent
          onRun={callback}
          cooldownMs={60_000}
          onExposeRecordRun={(fn) => {
            recordRunFn = fn;
          }}
        />,
      );
    });

    // Advance 70s
    act(() => {
      vi.advanceTimersByTime(70_000);
    });

    // Manual run recorded
    act(() => {
      recordRunFn?.();
    });

    // Now try focus 10s later (within cooldown of manual run)
    act(() => {
      vi.advanceTimersByTime(10_000);
      window.dispatchEvent(new Event("focus"));
    });

    expect(callback).not.toHaveBeenCalled();

    // Advance another 55s (total 65s since recordRun)
    act(() => {
      vi.advanceTimersByTime(55_000);
      window.dispatchEvent(new Event("focus"));
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
