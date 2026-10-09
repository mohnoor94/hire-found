"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useBookingModal } from "@/components/site/booking-modal";
import { withBasePath } from "@/lib/base-path";

const NAV_ITEMS = [
  {
    label: "About",
    homepageHref: "#about",
    otherHref: "/#about",
    isHomepageSection: true,
  },
  {
    label: "Find Your Match",
    homepageHref: "#vacancies",
    otherHref: "/jobs/",
    isHomepageSection: false,
  },
  {
    label: "Services",
    homepageHref: "#services",
    otherHref: "/#services",
    isHomepageSection: true,
  },
  {
    label: "Process",
    homepageHref: "#how-it-works",
    otherHref: "/#how-it-works",
    isHomepageSection: true,
  },
] as const;

function isHomepagePath(pathname: string) {
  return pathname === "/" || pathname === "";
}

export function SiteNav() {
  const pathname = usePathname();
  const onHomepage = isHomepagePath(pathname);
  const { open } = useBookingModal();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!onHomepage || !navRef.current) return;
    const container = navRef.current;
    container.classList.add(
      "translate-y-[-100%]",
      "transition-transform",
      "duration-500",
    );

    const hero = document.getElementById("hero");
    if (!hero) return;

    const navObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        container.style.transform = entry.isIntersecting
          ? "translateY(-100%)"
          : "translateY(0)";
      },
      { threshold: 0 },
    );
    navObserver.observe(hero);
    return () => navObserver.disconnect();
  }, [onHomepage]);

  return (
    <nav
      ref={navRef}
      id="navbar"
      className="fixed top-0 right-0 left-0 z-50 nav-glass"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href={onHomepage ? "#hero" : "/"}
          className="inline-flex items-center"
          aria-label={
            onHomepage ? "HireFound - Go to top" : "HireFound - Go to homepage"
          }
        >
          <img
            src={withBasePath("/assets/hirefound-signature-primary.svg")}
            alt="HireFound"
            className="nav-logo h-8 w-auto"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const href = onHomepage ? item.homepageHref : item.otherHref;
            const active =
              item.otherHref === "/jobs/" &&
              (pathname === "/jobs" || pathname.startsWith("/jobs/"));
            return (
              <Link
                key={item.label}
                href={href}
                className={
                  active
                    ? "border-b-2 border-primary pb-0.5 text-sm font-semibold text-primary"
                    : "text-sm text-muted transition-colors duration-200 hover:text-primary"
                }
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          {onHomepage ? (
            <button
              type="button"
              id="nav-get-started-desktop"
              className="magnetic inline-flex cursor-pointer items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-warm transition-colors duration-200 hover:bg-primary-light"
              aria-label="Get Started - Contact us"
              onClick={(e) => open(e.currentTarget)}
            >
              Get Started
            </button>
          ) : (
            <Link
              href="/#contact"
              className="magnetic inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-warm transition-colors duration-200 hover:bg-primary-light"
              aria-label="Get Started - Contact us"
            >
              Get Started
            </Link>
          )}
        </div>

        <Link
          href={onHomepage ? "#vacancies" : "/jobs/"}
          className="magnetic inline-flex min-h-[44px] min-w-[44px] items-center rounded-full bg-primary px-4 py-2 text-base font-semibold text-white shadow-warm md:hidden"
          aria-label="View open job positions"
        >
          Job Posts
        </Link>
      </div>
    </nav>
  );
}
