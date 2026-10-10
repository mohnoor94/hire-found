"use client";

import { CalendarIcon } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { DEFAULTS } from "@/lib/jobs/types";
import {
  SealExecutiveSearch,
  SealRecruitmentMatch,
  SealDiscProfiling,
  SealDirectPartnership,
} from "@/components/illustrations";

const EMPLOYER_SERVICES = [
  {
    title: "Executive Search & Headhunting",
    body: "I find leaders who don't just fill a seat: they transform your business. C-suite, directors, the people who move the needle.",
    Seal: SealExecutiveSearch,
  },
  {
    title: "Recruitment & Job Matching",
    body: "From specialized individual contributors to department heads. I handle sourcing, rigorous screening, and culture matching, so you just meet the finalists.",
    Seal: SealRecruitmentMatch,
  },
  {
    title: "DISC Assessments",
    body: "Understand how your candidates think, communicate, and lead. Certified behavioral insights mean better hires that stick long-term.",
    Seal: SealDiscProfiling,
  },
] as const;

const EMPLOYER_WHATSAPP_URL = `https://wa.me/${DEFAULTS.whatsApp}?text=${encodeURIComponent(
  "Hi Yasmin! I'm reaching out regarding hiring for my company.",
)}`;

export function Services() {
  const { open } = useBookingModal();

  return (
    <section id="services" className="bg-warm-dark px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs font-semibold tracking-[0.14em] text-secondary uppercase">
          Employer Services
        </span>
        <h2 className="font-accent mt-2 text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
          How I Help Companies Hire
        </h2>
        <p className="mt-4 max-w-[36rem] text-lg text-muted">
          Boutique executive search, talent recruitment, and leadership
          assessments across Jordan and the Gulf.
        </p>

        <div className="mt-10">
          <ul className="flex flex-col">
            {EMPLOYER_SERVICES.map((item) => {
              const SealComponent = item.Seal;
              return (
                <li
                  key={item.title}
                  className="reveal-on-scroll flex flex-col gap-4 border-t border-border py-8 first:border-t-0 first:pt-0 sm:flex-row sm:items-start sm:gap-6"
                >
                  <div className="shrink-0 self-start rounded-xl border border-secondary/25 bg-card/70 p-2 shadow-xs">
                    <SealComponent width={48} height={48} />
                  </div>
                  <div>
                    <h3 className="font-accent text-2xl text-primary">{item.title}</h3>
                    <p className="mt-2 max-w-[65ch] leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Dedicated Employer Conversion Card */}
        <div className="mt-12 rounded-2xl border border-primary/20 bg-white/85 p-6 sm:p-8 shadow-card">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="hidden shrink-0 sm:block">
                <SealDirectPartnership width={64} height={64} />
              </div>
              <div className="max-w-md">
                <span className="text-[11px] font-bold tracking-[0.14em] text-secondary uppercase">
                  Direct Partnership
                </span>
                <h3 className="font-accent mt-1 text-2xl text-primary">
                  Have an open role or leadership search?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Book a discovery call directly with Yasmin to review
                  your mandate, culture, and hiring timeline.
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2.5 shrink-0 sm:w-52">
              <button
                type="button"
                id="services-book-employer"
                onClick={(e) => open(e.currentTarget)}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground select-none transition-all duration-200 hover:bg-primary-light active:bg-primary-dark shadow-warm"
              >
                <CalendarIcon className="size-4" aria-hidden="true" />
                <span>Book Consultation</span>
              </button>
              <a
                id="services-whatsapp-employer"
                href={EMPLOYER_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-primary/25 bg-white px-5 text-sm font-semibold text-primary select-none transition-all duration-200 hover:bg-warm-dark active:bg-warm"
              >
                <span>Discuss on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Job Seeker Link */}
        <p className="mt-6 text-center text-xs text-muted">
          Looking for open roles? Explore all active positions on our{" "}
          <a
            href="#vacancies"
            className="font-semibold text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary-light"
          >
            Open Roles board
          </a>
          .
        </p>
      </div>
    </section>
  );
}
