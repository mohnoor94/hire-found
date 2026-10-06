"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type BookingModalContextValue = {
  open: (trigger?: HTMLElement | null) => void;
  close: () => void;
  isOpen: boolean;
};

const BookingModalContext = createContext<BookingModalContextValue | null>(
  null,
);

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error("useBookingModal must be used within BookingModalProvider");
  }
  return ctx;
}

declare global {
  interface Window {
    Cal?: {
      (...args: unknown[]): void;
      loaded?: boolean;
      ns?: Record<string, unknown>;
      q?: unknown[];
    };
  }
}

function loadCalSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Cal?.loaded) {
      resolve();
      return;
    }

    (function (C: Window, A: string) {
      const p = function (...args: unknown[]) {
        const cal = (p as unknown as { q: unknown[] }).q;
        cal.push(args);
      } as Window["Cal"] & { q: unknown[] };
      p.q = [];
      C.Cal = p;
      const n = C.document.createElement("script");
      n.src = A;
      n.async = true;
      n.onload = () => {
        if (C.Cal) C.Cal.loaded = true;
        resolve();
      };
      n.onerror = () => reject(new Error("Cal.com SDK failed to load"));
      const r = C.document.getElementsByTagName("script")[0];
      r?.parentNode?.insertBefore(n, r);
    })(window, "https://app.cal.com/embed/embed.js");
  });
}

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setStatus("loading");
    triggerRef.current?.focus();
  }, []);

  const open = useCallback((trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? null;
    setIsOpen(true);
    setStatus("loading");
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    (async () => {
      try {
        await loadCalSdk();
        if (cancelled) return;
        if (typeof window.Cal !== "function") {
          setStatus("error");
          return;
        }
        window.Cal("init", { origin: "https://cal.com" });
        const container = document.getElementById("booking-cal-container");
        if (container) {
          container.innerHTML = "";
          window.Cal("inline", {
            elementOrSelector: "#booking-cal-container",
            calLink: "yasminblasi",
            layout: "month_view",
            config: { layout: "month_view" },
          });
        }
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const value = useMemo(
    () => ({ open, close, isOpen }),
    [open, close, isOpen],
  );

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      <div
        id="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className={`fixed inset-0 z-[60] ${isOpen ? "" : "hidden"}`}
        data-state={isOpen ? "open" : "closed"}
      >
        <div
          id="booking-backdrop"
          className={`absolute inset-0 bg-dark/60 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={close}
        />
        <div
          id="booking-content"
          className="absolute inset-0 flex items-center justify-center p-4 max-md:p-0 md:p-6"
        >
          <div
            id="booking-card"
            className={`relative flex max-h-[90vh] w-full max-w-[480px] flex-col overflow-hidden rounded-xl bg-warm shadow-2xl transition-all duration-300 md:rounded-2xl max-md:!h-full max-md:!max-h-full max-md:!w-full max-md:!max-w-none max-md:!rounded-none ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          >
            <div className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-primary/10 px-4 py-3">
              <img
                src="/assets/yasmin-blasi.png"
                alt=""
                className="size-10 rounded-full object-cover"
              />
              <h2
                id="booking-modal-title"
                className="font-accent flex-1 text-lg font-bold text-primary"
              >
                Book a Call with Yasmin
              </h2>
              <button
                ref={closeBtnRef}
                id="booking-close-btn"
                type="button"
                className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
                aria-label="Close booking modal"
                onClick={close}
              >
                <svg
                  className="size-5 text-text-main"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              id="booking-body"
              className="flex-1 overflow-x-hidden overflow-y-auto"
              style={{ minHeight: 400 }}
            >
              {status === "loading" && (
                <div
                  id="booking-loading"
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="mb-4 size-10 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
                  <p className="text-sm text-muted">Loading calendar...</p>
                </div>
              )}
              <div
                id="booking-cal-container"
                className={`w-full overflow-x-hidden ${status === "ready" ? "" : "hidden"}`}
              />
              {status === "error" && (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <p className="mb-2 font-semibold text-text-main">
                    Calendar unavailable
                  </p>
                  <p className="mb-6 text-sm text-muted">
                    The scheduling service couldn&apos;t be loaded right now.
                  </p>
                  <a
                    href="https://cal.com/yasminblasi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-light"
                  >
                    Book on Cal.com →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BookingModalContext.Provider>
  );
}
