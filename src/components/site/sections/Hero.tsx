"use client";

import { CalendarIcon } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { withBasePath } from "@/lib/base-path";

const primaryCta =
  "inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground select-none active:bg-primary-dark sm:w-auto";

const secondaryCta =
  "inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full border border-primary/35 bg-warm/70 px-6 text-base font-semibold text-primary backdrop-blur-sm select-none active:bg-warm sm:w-auto";

export function Hero() {
  const { open } = useBookingModal();

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-svh items-end overflow-hidden bg-primary-dark px-6 pt-[calc(var(--site-nav-offset)+1.5rem)] pb-16 md:items-center md:pb-20"
    >
      <figure className="absolute inset-0" aria-hidden="true">
        <img
          src={withBasePath("/assets/yasmin-blasi.png")}
          alt=""
          width={800}
          height={800}
          className="hf-hero-photo h-full w-full object-cover object-[center_18%] md:object-[68%_16%]"
          loading="eager"
          fetchPriority="high"
        />
        {/* Brand wash: burgundy multiply + linen scrim so type owns the left. */}
        <div className="absolute inset-0 bg-primary/45 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,#FCF9F5_0%,#FCF9F5_34%,color-mix(in_srgb,#FCF9F5_72%,transparent)_48%,transparent_68%),linear-gradient(180deg,color-mix(in_srgb,#5E1639_35%,transparent)_0%,transparent_38%,color-mix(in_srgb,#5E1639_55%,transparent)_100%)]" />
        <div
          className="absolute top-0 bottom-0 left-[min(42%,28rem)] hidden w-px bg-secondary/80 md:block"
          aria-hidden="true"
        />
      </figure>

      <div className="hf-fold relative z-10 mx-auto w-full max-w-6xl">
        <div className="max-w-xl">
          <h1 className="font-accent text-5xl leading-[1.05] tracking-[-0.03em] text-balance text-primary md:text-6xl lg:text-7xl">
            HireFound
          </h1>
          <p className="mt-3 text-sm font-semibold tracking-[0.08em] text-muted uppercase">
            by Yasmin Blasi
          </p>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-pretty text-text-main md:text-xl">
            Matchmakers for meaningful careers. You want a hire? We got you
            found.
          </p>
          <div className="mt-6 h-px w-12 bg-secondary" aria-hidden="true" />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
      </div>

      {/* Real alt for AT; visual is decorative in the figure above. */}
      <span className="sr-only">
        Portrait of Yasmin Blasi, founder of HireFound
      </span>
    </section>
  );
}
