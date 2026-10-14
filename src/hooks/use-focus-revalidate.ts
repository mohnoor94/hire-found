"use client";

import { useEffect, useRef } from "react";

export type FocusRevalidateOptions = {
  /** Cooldown in milliseconds between revalidations. Defaults to 60,000ms (60s). */
  cooldownMs?: number;
  /** Whether the revalidation listener is active. Defaults to true. */
  enabled?: boolean;
};

/**
 * Revalidates data when the browser tab gains focus or returns to visible state.
 * Enforces a cooldown window to prevent rapid-fire requests when tab switching.
 */
export function useFocusRevalidate(
  callback: () => void | Promise<void>,
  options: FocusRevalidateOptions = {},
): { recordRun: () => void } {
  const { cooldownMs = 60_000, enabled = true } = options;
  const lastRunRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (lastRunRef.current === null) {
      lastRunRef.current = Date.now();
    }
  }, []);

  const recordRun = () => {
    lastRunRef.current = Date.now();
  };

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (lastRunRef.current === null) {
      lastRunRef.current = Date.now();
    }

    function checkAndRun() {
      if (document.visibilityState === "hidden") {
        return;
      }

      const now = Date.now();
      const lastRun = lastRunRef.current ?? now;
      if (now - lastRun >= cooldownMs) {
        lastRunRef.current = now;
        void callbackRef.current();
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        checkAndRun();
      }
    }

    function onFocus() {
      checkAndRun();
    }

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [cooldownMs, enabled]);

  return { recordRun };
}
