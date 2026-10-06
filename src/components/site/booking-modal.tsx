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

type CalFunction = {
  (...args: unknown[]): void;
  loaded?: boolean;
  ns?: Record<string, unknown>;
  q?: unknown[];
};

declare global {
  interface Window {
    Cal?: CalFunction;
    BookingModal?: {
      open: (trigger?: HTMLElement | null) => void;
      close: () => void;
      isOpen: boolean;
    };
  }
}

function loadCalSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Cal?.loaded) {
      resolve();
      return;
    }

    (function (C: Window, A: string, L: string) {
      const p = function (...args: unknown[]) {
        const cal = (p as unknown as { q: unknown[] }).q;
        cal.push(args);
      } as CalFunction;
      p.q = [];
      C.Cal = C.Cal || function (...args: unknown[]) {
        const cal = C.Cal as CalFunction;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          const script = C.document.createElement("script");
          script.src = A;
          script.async = true;
          script.onload = () => {
            if (C.Cal) C.Cal.loaded = true;
            resolve();
          };
          script.onerror = () => reject(new Error("Cal.com SDK failed to load"));
          C.document.head.appendChild(script);
          cal.loaded = true;
        }
        if (args[0] === L) {
          const api: CalFunction = function (...apiArgs: unknown[]) {
            p(api, apiArgs);
          };
          const namespace = args[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns![namespace] = (cal.ns![namespace] as unknown) || api;
            p(cal.ns![namespace], args);
            p(cal, ["initNamespace", namespace]);
          } else {
            p(cal, args);
          }
          return;
        }
        p(cal, args);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    // Trigger load immediately
    window.Cal!("init", "booking", { origin: "https://cal.com" });
  });
}

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
    if (typeof window !== "undefined") {
      window.BookingModal = { open, close, isOpen };
    }
  }, [open, close, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let timeoutTimer: ReturnType<typeof setTimeout> | null = null;

    (async () => {
      try {
        await loadCalSdk();
        if (cancelled) return;
        if (typeof window.Cal !== "function") {
          setStatus("error");
          return;
        }

        const cal = window.Cal as CalFunction;
        const calNsBooking = (cal.ns?.booking || cal) as (...args: unknown[]) => void;

        // Custom HireFound palette matching vanilla
        calNsBooking("ui", {
          theme: "light",
          cssVarsPerTheme: {
            light: {
              "cal-brand": "#8B2252",
              "cal-brand-emphasis": "#A63B6B",
              "cal-brand-text": "#FFFFFF",
              "cal-bg": "#FFFAF5",
              "cal-bg-emphasis": "#F8F0EA",
              "cal-text": "#2D2926",
              "cal-text-emphasis": "#1A1A2E",
              "cal-text-subtle": "#8A8380",
              "cal-border": "rgba(139, 34, 82, 0.15)",
              "cal-border-booker": "transparent",
              "cal-border-booker-width": "0px",
            },
          },
        });

        calNsBooking("preload", { calLink: "yasminblasi" });

        calNsBooking("on", {
          action: "linkReady",
          callback: () => {
            if (!cancelled) setStatus("ready");
          },
        });

        calNsBooking("on", {
          action: "linkFailed",
          callback: () => {
            if (!cancelled) setStatus("error");
          },
        });

        const container = document.getElementById("booking-cal-container");
        if (container) {
          container.innerHTML = "";
          calNsBooking("inline", {
            elementOrSelector: "#booking-cal-container",
            calLink: "yasminblasi",
          });
        }

        // Fallback polling for iframe presence if linkReady is missed
        let pollCount = 0;
        pollInterval = setInterval(() => {
          pollCount++;
          const iframe = document.querySelector("#booking-cal-container iframe");
          if (iframe && !cancelled) {
            setStatus("ready");
            if (pollInterval) clearInterval(pollInterval);
          } else if (pollCount >= 40) {
            if (pollInterval) clearInterval(pollInterval);
          }
        }, 200);

        // 8-second safety timeout
        timeoutTimer = setTimeout(() => {
          if (!cancelled) {
            const hasIframe = !!document.querySelector(
              "#booking-cal-container iframe",
            );
            setStatus(hasIframe ? "ready" : "error");
          }
        }, 8000);
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      if (pollInterval) clearInterval(pollInterval);
      if (timeoutTimer) clearTimeout(timeoutTimer);
    };
  }, [isOpen]);

  // Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
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
        ref={modalRef}
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
                <div
                  id="booking-error"
                  className="flex flex-col items-center justify-center px-6 py-16 text-center"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="size-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                      />
                    </svg>
                  </div>
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
