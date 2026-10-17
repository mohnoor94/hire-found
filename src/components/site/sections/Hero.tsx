"use client";

import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { withBasePath } from "@/lib/base-path";

const heroCta =
  "inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground select-none shadow-warm [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1),background-color_160ms_ease-out] hover:bg-primary-light hover:shadow-glow active:scale-[0.97] active:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto";

const PROOF = ["10+ years", "MENA", "Junior to C-suite", "TEDx speaker"] as const;

function CoverPhoto() {
  return (
    <figure className="relative">
      <div
        className="absolute -inset-2 -rotate-1 rounded-[18px] border border-secondary/50 bg-warm-dark/60 sm:-inset-2.5"
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-[16px] bg-card shadow-card">
        <img
          src={withBasePath("/assets/room/panel.webp")}
          alt="Yasmin Blasi speaking on a panel at the Digital Graduates Industry Meetup"
          width={1600}
          height={1205}
          className="aspect-[4/3] w-full object-cover object-[center_20%] lg:aspect-auto lg:h-[34rem] lg:min-h-[30rem]"
          decoding="async"
        />
        <figcaption className="absolute inset-x-3 bottom-3 rounded-[12px] bg-primary px-4 py-3 text-primary-foreground sm:inset-x-4 sm:bottom-4 sm:px-5 sm:py-3.5">
          <span className="font-accent block text-base leading-tight font-bold sm:text-lg">
            Yasmin Blasi
          </span>
          <span className="mt-0.5 block text-[13px] leading-snug text-primary-foreground/85">
            That&apos;s me, speaking at the Digital Graduates Industry Meetup.
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

export function Hero() {
  const { open } = useBookingModal();

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-background pt-[calc(var(--site-nav-offset)+2rem)] pb-14 sm:pb-16 lg:flex lg:min-h-[min(100svh,56rem)] lg:flex-col lg:justify-center lg:py-20"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-x-14 xl:gap-x-20">
          <div className="hf-fold">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-accent text-[1.65rem] leading-none font-bold tracking-[-0.02em] text-primary">
                HireFound
              </span>
              <span className="text-sm font-medium text-muted">
                by Yasmin Blasi
              </span>
              <span
                className="mb-1 hidden h-px flex-1 bg-secondary/60 sm:block"
                aria-hidden="true"
              />
            </p>

            <h1 className="font-accent mt-7 text-[2.95rem] leading-[1.02] font-bold tracking-[-0.03em] text-balance text-primary sm:mt-9 sm:text-6xl lg:text-[4.6rem] xl:text-[5.15rem]">
              You want a hire?
              <br />
              We got you{" "}
              <span className="underline decoration-secondary decoration-[0.09em] underline-offset-[0.14em]">
                found.
              </span>
            </h1>

            <p className="font-accent mt-7 text-[1.55rem] leading-[1.18] tracking-[-0.02em] text-text-main sm:text-[1.8rem]">
              I speak and teach.
              <br />
              People leave with a plan.
            </p>

            <p className="mt-4 max-w-[34rem] text-base leading-relaxed text-muted sm:text-lg">
              Talks, workshops, and time with people just starting out.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                id="hero-book"
                onClick={(e) => open(e.currentTarget)}
                className={heroCta}
              >
                <CalendarIcon className="size-4 shrink-0" aria-hidden="true" />
                <span>Let&apos;s Talk</span>
              </button>
              <a
                id="hero-explore"
                href="#vacancies"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/25 px-6 text-sm font-semibold text-primary [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1),background-color_160ms_ease-out,border-color_160ms_ease-out] hover:border-primary/45 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.97] sm:w-auto"
              >
                <span>Explore open roles</span>
                <ArrowRightIcon
                  className="size-4 shrink-0 [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>

            <p className="mt-4 text-sm text-muted">
              Hiring, speaking, or workshops. Looking for a role? The board is
              just below.
            </p>
          </div>

          <div className="hf-atelier-deck">
            <CoverPhoto />
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-secondary/45 pt-5 text-sm text-muted lg:mt-16">
          <span className="inline-flex items-center gap-2 font-semibold text-text-main">
            <span className="size-1.5 rounded-full bg-secondary" aria-hidden="true" />
            Direct founder access
          </span>
          {PROOF.map((item) => (
            <span key={item} className="inline-flex items-center gap-3">
              <span className="text-secondary" aria-hidden="true">
                /
              </span>
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
