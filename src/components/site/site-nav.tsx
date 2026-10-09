"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { MenuIcon, XIcon } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "About",
    homepageHref: "#about",
    otherHref: "/#about",
  },
  {
    label: "Find Your Match",
    homepageHref: "#vacancies",
    otherHref: "/jobs/",
  },
  {
    label: "Services",
    homepageHref: "#services",
    otherHref: "/#services",
  },
  {
    label: "Process",
    homepageHref: "#how-it-works",
    otherHref: "/#how-it-works",
  },
] as const;

function isHomepagePath(pathname: string) {
  return pathname === "/" || pathname === "";
}

function isJobsPath(pathname: string) {
  return pathname === "/jobs" || pathname.startsWith("/jobs/");
}

const linkClass = (active: boolean) =>
  cn(
    "inline-flex min-h-11 touch-manipulation items-center text-sm font-medium",
    active
      ? "text-primary underline decoration-2 underline-offset-8"
      : "text-[#5E534C] hover:text-primary",
  );

const bookClass =
  "inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-[#FCF9F5] select-none hover:bg-primary-light active:bg-primary-dark";

export function SiteNav() {
  const pathname = usePathname() || "/";
  const onHomepage = isHomepagePath(pathname);
  const { open } = useBookingModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <nav
        id="navbar"
        className="nav-glass fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1.25rem,env(safe-area-inset-left))]">
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

          <div className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => {
              const href = onHomepage ? item.homepageHref : item.otherHref;
              const active = item.otherHref === "/jobs/" && isJobsPath(pathname);
              return (
                <Link
                  key={item.label}
                  href={href}
                  className={linkClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              id="nav-get-started-desktop"
              className={bookClass}
              aria-label="Get Started - Contact us"
              onClick={(e) => open(e.currentTarget)}
            >
              Get Started
            </button>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 touch-manipulation items-center justify-center rounded-full text-text-main select-none active:bg-primary/10 md:hidden"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon className="size-5" />
          </button>
        </div>
      </nav>

      <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-[#2D2926]/45 data-open:animate-in data-open:fade-in-0" />
          <DialogPrimitive.Content
            id="mobile-nav"
            aria-describedby="mobile-nav-description"
            className="fixed inset-0 z-[60] flex h-dvh w-full flex-col bg-[#FCF9F5] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] outline-none sm:inset-y-0 sm:left-auto sm:w-[22rem] sm:shadow-[-12px_0_40px_rgba(45,41,38,0.12)]"
          >
            <div className="flex h-16 shrink-0 items-center justify-between pr-[max(0.5rem,env(safe-area-inset-right))] pl-[max(1.25rem,env(safe-area-inset-left))]">
              <img
                src={withBasePath("/assets/hirefound-signature-primary.svg")}
                alt=""
                className="h-8 w-auto"
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
                  className="inline-flex size-11 touch-manipulation items-center justify-center rounded-full text-text-main select-none active:bg-primary/10"
                  aria-label="Close menu"
                >
                  <XIcon className="size-5" />
                </button>
              </DialogPrimitive.Close>
            </div>
            <div className="flex flex-1 flex-col gap-1 px-4">
              {NAV_ITEMS.map((item) => {
                const href = onHomepage ? item.homepageHref : item.otherHref;
                const active =
                  item.otherHref === "/jobs/" && isJobsPath(pathname);
                return (
                  <Link
                    key={item.label}
                    href={href}
                    className={cn(linkClass(active), "text-lg")}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="px-4 pb-6">
              <button
                type="button"
                className={cn(bookClass, "w-full")}
                onClick={() => {
                  setMenuOpen(false);
                  // Return focus to the menu button — drawer trigger unmounts.
                  open(menuButtonRef.current);
                }}
              >
                Get Started
              </button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
