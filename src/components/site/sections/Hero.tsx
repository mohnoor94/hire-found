"use client";

import { CalendarIcon } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { withBasePath } from "@/lib/base-path";

const primaryCta =
  "inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground select-none active:bg-primary-dark sm:w-auto";

const secondaryCta =
  "inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full border border-primary/35 bg-warm/80 px-6 text-base font-semibold text-primary backdrop-blur-sm select-none active:bg-warm sm:w-auto";

export function Hero() {
  const { open } = useBookingModal();

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-svh items-end overflow-hidden bg-warm-dark px-6 pt-[calc(var(--site-nav-offset)+1.25rem)] pb-16 md:items-center"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_20%,color-mix(in_srgb,#D4A574_28%,transparent),transparent_55%),linear-gradient(115deg,#F3EBE3_0%,#FCF9F5_42%,color-mix(in_srgb,#7A1E4A_10%,#FCF9F5)_100%)]"
        aria-hidden="true"
      />

      <figure className="hf-portrait pointer-events-none absolute inset-y-0 right-0 hidden w-[min(52vw,36rem)] md:block">
        <img
          src={withBasePath("/assets/yasmin-blasi.png")}
          alt=""
          width={800}
          height={800}
          className="h-full w-full object-cover object-[center_18%] [mask-image:linear-gradient(90deg,transparent_0%,#000_22%,#000_100%)]"
          loading="eager"
          fetchPriority="high"
        />
      </figure>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-end gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-x-10">
        <div className="max-w-xl">
          <h1 className="font-accent text-5xl leading-[1.05] tracking-[-0.03em] text-balance text-primary md:text-6xl lg:text-7xl">
            HireFound
          </h1>
          <p className="mt-3 text-sm font-semibold tracking-[0.08em] text-muted uppercase">
            by Yasmin Blasi
          </p>
          <p className="mt-5 max-w-[36rem] text-lg leading-relaxed text-pretty text-text-main">
            Matchmakers for meaningful careers. You want a hire? We got you
            found.
          </p>
          <div
            className="mt-6 h-px w-12 bg-secondary"
            aria-hidden="true"
          />
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

        <figure className="hf-portrait md:hidden">
          <img
            src={withBasePath("/assets/yasmin-blasi.png")}
            alt="Yasmin Blasi, founder of HireFound"
            width={800}
            height={800}
            className="aspect-[4/5] w-full max-w-sm rounded-2xl object-cover object-top shadow-card"
            loading="eager"
            fetchPriority="high"
          />
        </figure>
      </div>
    </section>
  );
}
