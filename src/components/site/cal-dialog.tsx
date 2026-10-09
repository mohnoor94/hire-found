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
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowUpRightIcon, XIcon } from "lucide-react";
import { DEFAULTS } from "@/lib/jobs/types";
import { withBasePath } from "@/lib/base-path";

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
    throw new Error("useBookingModal must be used within CalDialogProvider");
  }
  return ctx;
}

declare global {
  interface Window {
    BookingModal?: {
      open: (trigger?: HTMLElement | null) => void;
      close: () => void;
      isOpen: boolean;
    };
  }
}

const CAL_BRAND = "7A1E4A";
const LOAD_TIMEOUT_MS = 12_000;

function calEmbedSrc(calLink: string) {
  const url = new URL(calLink);
  url.searchParams.set("embed", "true");
  url.searchParams.set("theme", "light");
  url.searchParams.set("brandColor", CAL_BRAND);
  return url.toString();
}

type LoadStatus = "loading" | "ready" | "error";

export function CalDialog({
  open,
  onOpenChange,
  status,
  onFrameLoad,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: LoadStatus;
  onFrameLoad: () => void;
}) {
  const embedSrc = calEmbedSrc(DEFAULTS.calLink);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-[#2D2926]/55 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Content
          id="booking-modal"
          aria-describedby="booking-modal-description"
          className="fixed inset-0 z-[70] flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-[#FCF9F5] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] outline-none sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[min(92dvh,840px)] sm:w-[min(calc(100%-2rem),32.5rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:card-surface sm:pt-0 sm:pb-0"
        >
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-primary/10 pr-[max(0.5rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))]">
            <img
              src={withBasePath("/assets/yasmin-blasi.png")}
              alt=""
              className="size-10 rounded-full object-cover"
            />
            <DialogPrimitive.Title
              id="booking-modal-title"
              className="font-accent flex-1 text-lg text-primary"
            >
              Book a Call with Yasmin
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <button
                id="booking-close-btn"
                type="button"
                className="inline-flex size-11 touch-manipulation items-center justify-center rounded-full text-text-main select-none active:bg-primary/10"
                aria-label="Close booking"
              >
                <XIcon className="size-5" />
              </button>
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description
            id="booking-modal-description"
            className="sr-only"
          >
            Choose a time to talk with Yasmin about hiring.
          </DialogPrimitive.Description>
          <div className="relative min-h-0 flex-1">
            {status === "error" ? (
              <div
                id="booking-error"
                className="flex flex-col items-center justify-center px-6 py-16 text-center"
              >
                <p className="font-accent text-xl text-text-main">
                  Calendar unavailable
                </p>
                <p className="mt-2 max-w-xs text-sm text-[#5E534C]">
                  The scheduling page didn&apos;t load. You can book on Cal.com
                  instead.
                </p>
                <a
                  href={DEFAULTS.calLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-[#FCF9F5] select-none active:bg-primary-dark"
                >
                  Book on Cal.com
                  <ArrowUpRightIcon className="size-4" />
                </a>
              </div>
            ) : (
              <>
                {status === "loading" ? (
                  <div
                    id="booking-loading"
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#FCF9F5]"
                  >
                    <div
                      className="size-10 rounded-full border-2 border-primary/20 border-t-primary motion-safe:animate-spin"
                      aria-hidden="true"
                    />
                    <p className="mt-4 text-sm text-[#5E534C]">
                      Loading calendar...
                    </p>
                  </div>
                ) : null}
                <iframe
                  id="booking-cal-container"
                  title="Book a call with Yasmin on Cal.com"
                  src={embedSrc}
                  onLoad={onFrameLoad}
                  className="h-[calc(100dvh-4rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full border-0 sm:h-[min(520px,calc(92dvh-4rem))]"
                />
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function CalDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const triggerRef = useRef<HTMLElement | null>(null);
  const loadedRef = useRef(false);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback((trigger?: HTMLElement | null) => {
    triggerRef.current =
      trigger ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null);
    loadedRef.current = false;
    setStatus("loading");
    setIsOpen(true);
  }, []);

  useEffect(() => {
    window.BookingModal = { open, close, isOpen };
  }, [open, close, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      if (!loadedRef.current) setStatus("error");
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const onOpenChange = useCallback(
    (next: boolean) => {
      if (!next) close();
    },
    [close],
  );

  const onFrameLoad = useCallback(() => {
    loadedRef.current = true;
    setStatus("ready");
  }, []);

  const value = useMemo(
    () => ({ open, close, isOpen }),
    [open, close, isOpen],
  );

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      <CalDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        status={status}
        onFrameLoad={onFrameLoad}
      />
    </BookingModalContext.Provider>
  );
}

export const BookingModalProvider = CalDialogProvider;
