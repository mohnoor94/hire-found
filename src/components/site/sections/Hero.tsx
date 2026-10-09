"use client";

import { CalendarIcon } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { withBasePath } from "@/lib/base-path";

const primaryCta =
  "inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground select-none active:bg-primary-dark sm:w-auto";

const secondaryCta =
  "inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full border border-primary/35 px-6 text-base font-semibold text-primary select-none active:bg-primary/10 sm:w-auto";

export function Hero() {
  const { open } = useBookingModal();

  return (
    <section
      id="hero"
      className="flex min-h-svh items-center bg-warm px-6 pt-[calc(var(--site-nav-offset)+1.25rem)] pb-16"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-x-16 lg:gap-y-8">
        <div className="max-w-xl lg:col-start-1 lg:row-start-1">
          <h1 className="font-accent text-5xl leading-[1.05] tracking-[-0.03em] text-balance text-primary md:text-6xl lg:text-7xl">
            HireFound
          </h1>
          <p className="font-accent mt-3 text-2xl text-primary italic md:text-3xl">
            Yasmin Blasi
          </p>
          <p className="mt-5 max-w-[40rem] text-lg leading-relaxed text-pretty text-muted">
            Matchmakers for meaningful careers. You want a hire? We got you
            found.
          </p>
          <div
            className="mt-6 h-px w-12 bg-secondary"
            aria-hidden="true"
          />
        </div>

        <figure className="hf-portrait lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-self-end">
          <img
            src={withBasePath("/assets/yasmin-blasi.png")}
            alt="Yasmin Blasi, founder of HireFound"
            width={800}
            height={800}
            className="aspect-square w-[min(100%,16rem)] rounded-2xl object-cover shadow-card sm:w-72 lg:w-80"
            loading="eager"
            fetchPriority="high"
          />
        </figure>

        <div className="flex flex-col gap-3 sm:flex-row lg:col-start-1 lg:row-start-2">
          <button
            type="button"
            id="hero-hiring"
            onClick={(e) => open(e.currentTarget)}
            className={primaryCta}
          >
            <CalendarIcon className="size-5" aria-hidden="true" />
            I&apos;m Hiring Executive Talent
          </button>
          <a href="#vacancies" id="hero-explore" className={secondaryCta}>
            Explore Open Roles
          </a>
        </div>
      </div>
    </section>
  );
}
