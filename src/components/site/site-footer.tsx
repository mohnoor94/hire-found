"use client";

import { CalendarIcon } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { DEFAULTS } from "@/lib/jobs/types";
import { withBasePath } from "@/lib/base-path";

const FOOTER_CONFIG = {
  whatsAppNumber: DEFAULTS.whatsApp,
  whatsAppMessage: "Hi Yasmin! I found you through your website.",
  linkedIn: "https://www.linkedin.com/in/yasminblasi",
  instagram: "https://www.instagram.com/hirefound",
  email: DEFAULTS.email,
  tagline: "Looking for a Hire? We've got you Found.",
  italicTagline: "Find your match. Find your future.",
  credit: { text: "by Noor", url: "https://bynoor.io" },
  copyright: "© 2026 HireFound. All rights reserved.",
};

const socialClass =
  "inline-flex size-11 touch-manipulation items-center justify-center rounded-full border border-warm/35 text-warm select-none active:bg-warm/10";

export function SiteFooter() {
  const { open } = useBookingModal();
  const whatsAppUrl = `https://wa.me/${FOOTER_CONFIG.whatsAppNumber}?text=${encodeURIComponent(FOOTER_CONFIG.whatsAppMessage)}`;

  return (
    <footer
      id="contact"
      className="bg-primary-dark px-6 pt-20 pb-[calc(5rem+env(safe-area-inset-bottom))] text-warm lg:pt-28"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-accent text-4xl leading-[1.15] tracking-[-0.02em] text-balance md:text-5xl">
          Your next game-changer is
          <br />
          just a conversation away.
        </h2>
        <p className="mt-4 text-lg text-warm/80">
          Let&apos;s find them together.
        </p>
        <div
          className="mx-auto mt-6 h-px w-12 bg-secondary"
          aria-hidden="true"
        />

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            id="footer-book-a-call"
            onClick={(e) => open(e.currentTarget)}
            className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-warm px-7 text-base font-semibold text-primary select-none active:bg-warm-dark sm:w-auto"
          >
            <CalendarIcon className="size-5" />
            Book a Call
          </button>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-warm/40 px-7 text-base font-semibold text-warm select-none active:bg-warm/10 sm:w-auto"
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
        <p className="mt-5 text-sm text-warm/80">
          Book a call for a set time — or message me on WhatsApp if you prefer
          chat.
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

        <div className="mt-16 border-t border-warm/20 pt-10">
          <img
            src={withBasePath("/assets/hirefound-signature.svg")}
            alt="HireFound"
            className="mx-auto mb-6 h-12 w-auto brightness-0 invert md:h-14"
          />
          <p className="text-lg text-warm/80">{FOOTER_CONFIG.tagline}</p>
          <p className="font-accent mt-2 text-base text-warm/70 italic">
            {FOOTER_CONFIG.italicTagline}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
            <p className="text-sm text-warm/80">
              Built{" "}
              <a
                href={FOOTER_CONFIG.credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-warm/50 underline-offset-4 hover:text-warm"
              >
                {FOOTER_CONFIG.credit.text}
              </a>
            </p>
            <span className="hidden text-warm/50 sm:inline" aria-hidden="true">
              ·
            </span>
            <p className="text-sm text-warm/80">{FOOTER_CONFIG.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
