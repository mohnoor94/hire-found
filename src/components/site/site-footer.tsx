"use client";

import { useCallback, useRef, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { DEFAULTS } from "@/lib/jobs/types";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";
import { FooterButterfly } from "@/components/site/footer-butterfly";
import { FooterPresenceBadge } from "@/components/site/footer-presence-badge";

const FOOTER_CONFIG = {
  whatsAppNumber: DEFAULTS.whatsApp,
  whatsAppMessage: "Hi Yasmin! I found you through your website.",
  linkedIn: "https://www.linkedin.com/in/yasminblasi",
  instagram: "https://www.instagram.com/hirefound",
  email: DEFAULTS.email,
  tagline: "Looking for a Hire? We've got you Found.",
  italicTagline: "Find your match. Find your future.",
  credit: { name: "Noor", url: "https://bynoor.io" },
  copyright: "© 2026 HireFound. All rights reserved.",
};

const socialClass =
  "inline-flex size-11 touch-manipulation items-center justify-center rounded-full border border-linen/35 text-linen select-none transition-all duration-200 hover:border-linen/70 hover:bg-linen/10 hover:scale-105 active:scale-95 active:bg-linen/15";

export function SiteFooter() {
  const { open } = useBookingModal();
  const whatsAppUrl = `https://wa.me/${FOOTER_CONFIG.whatsAppNumber}?text=${encodeURIComponent(FOOTER_CONFIG.whatsAppMessage)}`;
  const footerRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = footerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = Math.max(90, e.clientY - rect.top);
    el.style.setProperty("--footer-x", `${x.toFixed(1)}px`);
    el.style.setProperty("--footer-y", `${y.toFixed(1)}px`);
  }, []);

  return (
    <footer
      id="contact"
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group/footer relative overflow-hidden bg-primary-dark px-6 pt-20 pb-[calc(5rem+env(safe-area-inset-bottom))] text-linen lg:pt-28"
    >
      {/* Ambient warm radial glow (feathered softly away from the top wave seam) */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 overflow-hidden opacity-60"
        aria-hidden="true"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, transparent 40px, black 160px)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 40px, black 160px)",
        }}
      >
        <div
          className="absolute left-1/2 top-12 size-[34rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #D4A574 0%, #7A1E4A 45%, transparent 70%)",
          }}
        />
      </div>

      {/* Interactive cursor-tracking spotlight (delicate warm ember aura) */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 -z-0 transition-opacity duration-700 ease-out",
          isHovered ? "opacity-75" : "opacity-0"
        )}
        style={{
          background:
            "radial-gradient(380px circle at var(--footer-x, 50%) var(--footer-y, 30%), rgba(212, 165, 116, 0.065), transparent 65%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, transparent 40px, black 160px)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 40px, black 160px)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Brand butterfly companion */}
        <div className="mb-4 flex items-center justify-center">
          <FooterButterfly className="size-8 -rotate-6 transition-transform duration-300 hover:rotate-0" />
        </div>

        <h2 className="font-accent text-4xl leading-[1.15] tracking-[-0.02em] text-balance md:text-5xl">
          Your next game-changer is
          <br />
          just a conversation away.
        </h2>
        <p className="mt-4 text-lg text-linen/80">
          Let&apos;s find them together.
        </p>
        <div
          className="mx-auto mt-6 h-px w-12 bg-secondary"
          aria-hidden="true"
        />

        {/* Founder Presence Badge */}
        <div className="mt-8 flex justify-center">
          <FooterPresenceBadge href={whatsAppUrl} />
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button
            type="button"
            id="footer-book-a-call"
            onClick={(e) => open(e.currentTarget)}
            className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-linen px-8 text-base font-semibold text-primary-dark select-none shadow-xs [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1),background-color_160ms_ease-out] hover:bg-linen/95 active:scale-[0.97] active:bg-linen/90 sm:w-auto"
          >
            <CalendarIcon className="size-5" />
            Book a Call
          </button>
        </div>
        <p className="mt-5 text-sm text-linen/80">
          Employers: Book a discovery call, or message me directly on WhatsApp.
        </p>
        <p className="mt-2 text-xs text-linen/60">
          Looking for open positions?{" "}
          <a
            href="/jobs/"
            className="underline decoration-linen/40 underline-offset-2 hover:text-linen"
          >
            Browse all open roles
          </a>
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href={FOOTER_CONFIG.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className={socialClass}
            aria-label="LinkedIn"
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href={FOOTER_CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={socialClass}
            aria-label="Instagram"
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <a
            href={`mailto:${FOOTER_CONFIG.email}`}
            className={socialClass}
            aria-label="Email"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>
        </div>

        <div className="mt-16 border-t border-linen/20 pt-10">
          <div className="group relative mx-auto mb-6 inline-block">
            <img
              src={withBasePath("/assets/hirefound-signature.svg")}
              alt="HireFound"
              className="h-12 w-auto brightness-0 invert transition-all duration-300 md:h-14 group-hover:scale-105 group-hover:opacity-95"
            />
          </div>
          <p className="text-lg text-linen/80">{FOOTER_CONFIG.tagline}</p>
          <p className="font-accent mt-2 text-base text-linen/70 italic">
            {FOOTER_CONFIG.italicTagline}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-xs tracking-wide text-linen/55 sm:flex-row sm:gap-4">
            <p className="group/heart inline-flex items-center gap-1.5 cursor-default select-none">
              <span>Built with</span>
              <svg
                className="hf-heart-beat size-3.5 shrink-0 text-linen/75 transition-colors duration-250 ease-out group-hover/heart:text-butterfly-rose hover:text-butterfly-rose"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="sr-only">love</span>
              <a
                href={FOOTER_CONFIG.credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-linen/75 underline decoration-linen/35 underline-offset-4 transition-colors hover:text-linen hover:decoration-linen/60"
              >
                by {FOOTER_CONFIG.credit.name}
              </a>
            </p>
            <span className="hidden text-linen/35 sm:inline" aria-hidden="true">
              ·
            </span>
            <p>{FOOTER_CONFIG.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
