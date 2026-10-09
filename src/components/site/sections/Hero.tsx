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
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-warm px-6 pt-[calc(var(--site-nav-offset)+1.25rem)] pb-20"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_12%_18%,color-mix(in_srgb,#D4A574_22%,transparent),transparent_52%),radial-gradient(70%_60%_at_88%_78%,color-mix(in_srgb,#7A1E4A_10%,transparent),transparent_48%),linear-gradient(180deg,#FCF9F5_0%,#F3EBE3_100%)]"
        aria-hidden="true"
      />

      <img
        src={withBasePath("/assets/hirefound-signature-primary.svg")}
        alt=""
        aria-hidden="true"
        className="hf-mark pointer-events-none absolute top-1/2 right-[max(1rem,env(safe-area-inset-right))] hidden h-[min(70vh,28rem)] w-auto -translate-y-1/2 opacity-[0.07] md:block"
      />

      <div className="hf-fold relative z-10 mx-auto w-full max-w-3xl">
        <h1 className="font-accent text-5xl leading-[1.05] tracking-[-0.03em] text-balance text-primary md:text-6xl lg:text-7xl">
          HireFound
        </h1>
        <p className="mt-3 text-sm font-semibold tracking-[0.08em] text-muted uppercase">
          by Yasmin Blasi
        </p>
        <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-pretty text-text-main md:text-xl">
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
    </section>
  );
}
