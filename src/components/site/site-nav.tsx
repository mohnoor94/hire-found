"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  ArrowUpRightIcon,
  CalendarIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { withBasePath } from "@/lib/base-path";
import { DEFAULTS } from "@/lib/jobs/types";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/site/theme-toggle";

const NAV_ITEMS = [
  {
    label: "About",
    descriptor: "The founder and the matchmaking standard",
    homepageHref: "#about",
    otherHref: "/#about",
    sectionId: "about",
  },
  {
    label: "Find Your Match",
    descriptor: "Open roles across Jordan and the Gulf",
    homepageHref: "#vacancies",
    otherHref: "/jobs/",
    sectionId: "vacancies",
  },
  {
    label: "Services",
    descriptor: "Hiring support and career matchmaking",
    homepageHref: "#services",
    otherHref: "/#services",
    sectionId: "services",
  },
  {
    label: "Process",
    descriptor: "From first call to first day",
    homepageHref: "#how-it-works",
    otherHref: "/#how-it-works",
    sectionId: "how-it-works",
  },
] as const;

const WHATSAPP_URL = `https://wa.me/${DEFAULTS.whatsApp}?text=${encodeURIComponent(
  "Hi Yasmin! I found you through your website.",
)}`;

function isHomepagePath(pathname: string) {
  return pathname === "/" || pathname === "";
}

function isJobsPath(pathname: string) {
  return pathname === "/jobs" || pathname.startsWith("/jobs/");
}

function useCondensedNav() {
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setCondensed(window.scrollY > 28);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return condensed;
}

function useActiveSection(onHomepage: boolean) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!onHomepage) return;
    if (typeof IntersectionObserver === "undefined") return;

    const targets = NAV_ITEMS.map((item) =>
      document.getElementById(item.sectionId),
    ).filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [onHomepage]);

  return onHomepage ? activeSection : null;
}

const desktopLinkClass = (active: boolean) =>
  cn(
    "inline-flex min-h-10 touch-manipulation items-center rounded-full px-4 text-sm font-semibold transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    active
      ? "bg-primary text-warm shadow-warm"
      : "text-muted hover:bg-primary/5 hover:text-primary active:scale-[0.98]",
  );

const desktopBookClass =
  "group inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-warm shadow-warm select-none transition-all duration-200 hover:bg-primary-light hover:shadow-glow active:scale-[0.98] active:bg-primary-dark";

const mobileCardClass = (active: boolean) =>
  cn(
    "group flex items-center gap-4 rounded-3xl border p-4 transition-all duration-200 active:scale-[0.99]",
    active
      ? "border-primary bg-primary text-warm shadow-warm"
      : "border-primary/10 bg-white/80 hover:border-primary/25 hover:shadow-card",
  );

export function SiteNav() {
  const pathname = usePathname() || "/";
  const onHomepage = isHomepagePath(pathname);
  const onJobs = isJobsPath(pathname);
  const { open } = useBookingModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const condensed = useCondensedNav();
  const activeSection = useActiveSection(onHomepage);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 px-3 pt-[calc(env(safe-area-inset-top)+0.5rem)] sm:px-5">
        <nav
          id="navbar"
          aria-label="Main navigation"
          className={cn(
            "nav-glass mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-[1.75rem] border border-primary/10 pr-2 pl-4 shadow-card transition-all duration-300 sm:pl-5",
            condensed && "border-primary/20 shadow-card-hover",
          )}
        >
          <Link
            href={onHomepage ? "#hero" : "/"}
            className="inline-flex min-h-11 items-center"
            aria-label={
              onHomepage
                ? "HireFound - Go to top"
                : "HireFound - Go to homepage"
            }
          >
            <img
              src={withBasePath("/assets/hirefound-signature-primary.svg")}
              alt="HireFound"
              className="h-8 w-auto"
            />
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <div
              className="flex items-center gap-1 rounded-full bg-primary/[0.06] p-1"
              role="group"
              aria-label="Sections"
            >
              {NAV_ITEMS.map((item) => {
                const href = onHomepage ? item.homepageHref : item.otherHref;
                const jobsActive =
                  item.otherHref === "/jobs/" && onJobs;
                const sectionActive =
                  onHomepage && activeSection === item.sectionId;
                const active = jobsActive || sectionActive;
                return (
                  <Link
                    key={item.label}
                    href={href}
                    className={desktopLinkClass(active)}
                    aria-current={
                      active
                        ? jobsActive
                          ? "page"
                          : "location"
                        : undefined
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <button
              type="button"
              id="nav-book-a-call-desktop"
              className={desktopBookClass}
              aria-label="Book a Call"
              onClick={(e) => open(e.currentTarget)}
            >
              <CalendarIcon className="size-4" aria-hidden="true" />
              <span>Book a Call</span>
            </button>
            <ThemeToggle />
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 touch-manipulation items-center justify-center rounded-full border border-primary/15 bg-white/70 text-primary select-none transition-all duration-200 active:scale-[0.98] active:bg-primary/10 md:hidden"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon className="size-5" aria-hidden="true" />
          </button>
        </nav>
      </div>

      <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-text-main/50 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <DialogPrimitive.Content
            id="mobile-nav"
            aria-describedby="mobile-nav-description"
            className="fixed inset-x-3 top-[calc(env(safe-area-inset-top)+0.5rem)] bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] z-[60] flex flex-col overflow-hidden rounded-[2rem] border border-primary/10 bg-warm shadow-card-hover outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:inset-y-0 sm:top-[calc(env(safe-area-inset-top)+0.5rem)] sm:right-3 sm:bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:left-auto sm:w-[24rem] sm:data-open:slide-in-from-right-4 sm:data-closed:slide-out-to-right-4"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-primary/10 pr-2 pl-5">
              <img
                src={withBasePath("/assets/hirefound-signature-primary.svg")}
                alt=""
                className="h-7 w-auto"
              />
              <DialogPrimitive.Title className="sr-only">
                Menu
              </DialogPrimitive.Title>
              <DialogPrimitive.Description
                id="mobile-nav-description"
                className="sr-only"
              >
                Site sections and booking.
              </DialogPrimitive.Description>
              <DialogPrimitive.Close asChild>
                <button
                  type="button"
                  className="inline-flex size-11 touch-manipulation items-center justify-center rounded-full text-text-main select-none transition-all duration-200 active:scale-95 active:bg-primary/10"
                  aria-label="Close menu"
                >
                  <XIcon className="size-5" aria-hidden="true" />
                </button>
              </DialogPrimitive.Close>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
              <ul className="flex flex-col gap-3">
                {NAV_ITEMS.map((item, index) => {
                  const href = onHomepage ? item.homepageHref : item.otherHref;
                  const jobsActive =
                    item.otherHref === "/jobs/" && onJobs;
                  const sectionActive =
                    onHomepage && activeSection === item.sectionId;
                  const active = jobsActive || sectionActive;
                  return (
                    <li
                      key={item.label}
                      className="nav-mobile-card"
                      style={{ animationDelay: `${90 + index * 65}ms` }}
                    >
                      <Link
                        href={href}
                        className={mobileCardClass(active)}
                        aria-current={
                          active
                            ? jobsActive
                              ? "page"
                              : "location"
                            : undefined
                        }
                        onClick={() => setMenuOpen(false)}
                      >
                        <span
                          className={cn(
                            "font-accent w-8 shrink-0 text-sm",
                            active ? "text-warm/80" : "text-secondary",
                          )}
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-lg leading-tight font-semibold">
                            {item.label}
                          </span>
                          <span
                            className={cn(
                              "mt-1 block text-sm leading-snug",
                              active ? "text-warm/80" : "text-muted",
                            )}
                          >
                            {item.descriptor}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                            active
                              ? "bg-warm/20 text-warm"
                              : "bg-primary/5 text-primary",
                          )}
                          aria-hidden="true"
                        >
                          <ArrowUpRightIcon className="size-4" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="shrink-0 border-t border-primary/10 bg-warm/95 px-4 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-5">
              <button
                type="button"
                id="nav-book-a-call-mobile"
                className={cn(desktopBookClass, "w-full min-h-12 text-base")}
                onClick={() => {
                  setMenuOpen(false);
                  // Return focus to the menu button when booking closes.
                  open(menuButtonRef.current);
                }}
              >
                <CalendarIcon className="size-5" aria-hidden="true" />
                Book a Call
              </button>
              <a
                id="nav-whatsapp-mobile"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-primary/20 px-5 text-sm font-semibold text-primary select-none transition-all duration-200 active:scale-[0.99] active:bg-primary/10"
              >
                <svg
                  className="size-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
              <div className="mt-3 flex justify-end">
                <ThemeToggle />
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
