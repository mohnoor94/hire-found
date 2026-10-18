"use client";

import { withBasePath } from "@/lib/base-path";
import {
  PillarArmchair,
  PillarManuscript,
  PillarDoorway,
} from "@/components/illustrations";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const FACTS = [
  "10+ years of experience",
  "MENA region",
  "Junior to C-suite",
  "TEDx speaker",
] as const;

const PILLARS = [
  {
    title: "Matchmaking, Not Seat-Filling",
    body: "I find people who fit your culture, not just your job description.",
    Emblem: PillarArmchair,
  },
  {
    title: "Your Story, Not Just Keywords",
    body: "Every candidate is more than a CV. Every company is more than a job post.",
    Emblem: PillarManuscript,
  },
  {
    title: "From First Call to First Day",
    body: "I don't disappear after the offer letter. I'm here for the whole journey.",
    Emblem: PillarDoorway,
  },
] as const;

export function About() {
  const containerRef = useScrollReveal<HTMLElement>({
    selector: ".reveal-on-scroll",
    staggerMs: 65,
  });

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative px-6 py-20 lg:py-28"
    >
      <div className="section-divider mx-auto mb-16 max-w-5xl opacity-50" aria-hidden="true" />
      <div className="mx-auto max-w-5xl">
        {/* Top: Founder Story & Portrait Inset Panel */}
        <div className="reveal-on-scroll rounded-3xl border border-secondary/30 bg-warm-dark/45 p-7 sm:p-10 lg:p-12 shadow-xs backdrop-blur-xs">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14 xl:gap-18">
            {/* Founder Editorial Portrait */}
            <figure className="relative mx-auto w-full max-w-sm lg:max-w-none">
              <div
                className="absolute -inset-2 -rotate-1 rounded-3xl border border-secondary/35 bg-card/40 sm:-inset-2.5"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-2xl border border-secondary/40 bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
                <img
                  src={withBasePath("/assets/yasmin-blasi.png")}
                  alt="Yasmin Blasi, founder of HireFound"
                  width={800}
                  height={800}
                  className="aspect-[4/4.5] w-full object-cover object-[center_12%]"
                  loading="lazy"
                />
                <div className="border-t border-secondary/25 bg-card/95 p-4 sm:p-5">
                  <figcaption className="font-accent text-lg font-bold text-primary">
                    Yasmin Blasi
                  </figcaption>
                  <p className="text-xs text-muted">
                    Founder &amp; Executive Matchmaker
                  </p>
                </div>
              </div>
            </figure>

            {/* Founder Story and Philosophy */}
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                Meet the Founder
              </p>
              <h2 className="font-accent mt-2 text-4xl leading-[1.1] tracking-[-0.02em] text-balance text-primary md:text-5xl">
                I&apos;m not your usual recruiter.
              </h2>
              <p className="mt-3 text-lg text-muted">
                And that&apos;s exactly the point.
              </p>

              <div className="mt-6 flex max-w-[65ch] flex-col gap-4 text-lg leading-relaxed text-text-main">
                <p>
                  I&apos;ve spent more than ten years in HR and recruitment,
                  across Jordan and the wider region: talent acquisition, senior
                  leadership, coaching executives, and more CVs than I can count.
                </p>
                <p>
                  HireFound is the practice I built after I left corporate HR.
                  Fewer seats filled, more matches that last, and a direct line
                  to me.
                </p>
                <p>
                  That same work is what I bring into{" "}
                  <a
                    href="#talks"
                    className="font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:text-primary-light"
                  >
                    talks and workshops
                  </a>
                  , and into rooms full of people who are just starting out.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2.5">
                {FACTS.map((fact) => (
                  <span
                    key={fact}
                    className="rounded-full border border-primary/15 bg-card/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary shadow-xs"
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* My story - compact career timeline */}
        <div className="mt-16 border-t border-secondary/35 pt-12 lg:mt-20 lg:pt-14">
          <div className="max-w-3xl">
            <h3 className="font-accent text-3xl leading-tight text-primary md:text-4xl">
              My story
            </h3>
            <ol
              className="relative mt-6 space-y-6 pl-7 before:absolute before:left-1 before:top-0.5 before:bottom-0.5 before:w-px before:bg-secondary/40"
              aria-label="Career timeline"
            >
              <li className="relative pl-6 reveal-on-scroll">
                <span
                  className="absolute left-0 top-2.5 h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-warm-dark"
                  aria-hidden="true"
                />
                <time className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  2013 to 2017
                </time>
                <p className="mt-1 text-base leading-relaxed text-text-main">
                  Advertising, operations, VIP sales, and business support.
                </p>
              </li>
              <li className="relative pl-6 reveal-on-scroll">
                <span
                  className="absolute left-0 top-2.5 h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-warm-dark"
                  aria-hidden="true"
                />
                <time className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  2017 to 2019
                </time>
                <p className="mt-1 text-base leading-relaxed text-text-main">
                  Senior HR Officer, Manaseer Group - Magnesia.
                </p>
              </li>
              <li className="relative pl-6 reveal-on-scroll">
                <span
                  className="absolute left-0 top-2.5 h-3 w-3 -translate-x-1/2 rounded-full bg-secondary ring-4 ring-warm-dark"
                  aria-hidden="true"
                />
                <time className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  2019 to 2023
                </time>
                <p className="mt-1 text-base leading-relaxed text-text-main">
                  Four years at home raising my daughters, then back to work with fresh focus.
                </p>
              </li>
              <li className="relative pl-6 reveal-on-scroll">
                <span
                  className="absolute left-0 top-2.5 h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-warm-dark"
                  aria-hidden="true"
                />
                <time className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  2024
                </time>
                <p className="mt-1 text-base leading-relaxed text-text-main">
                  Back to recruiting with HCDmena as a part-time Recruitment Specialist.
                </p>
              </li>
              <li className="relative pl-6 reveal-on-scroll">
                <span
                  className="absolute left-0 top-2.5 h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-warm-dark"
                  aria-hidden="true"
                />
                <time className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  May 2025 to present
                </time>
                <p className="mt-1 text-base leading-relaxed text-text-main">
                  Founded HireFound. A boutique recruiting practice focused on lasting matches.
                </p>
              </li>
            </ol>
          </div>
        </div>

        {/* Bottom: The Matchmaking Standard (3 Pillars) */}
        <div className="mt-16 pt-4 lg:mt-20">
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {PILLARS.map((point) => {
              const EmblemComponent = point.Emblem;
              return (
                <div
                  key={point.title}
                  className="reveal-on-scroll card-interactive-sheen group flex flex-col justify-between rounded-2xl border border-secondary/30 bg-card/80 p-6 shadow-xs backdrop-blur-xs hover:bg-card hover:shadow-card"
                >
                  <div>
                    <div className="mb-4 inline-flex rounded-xl border border-secondary/20 bg-warm/50 p-2 shadow-xs transition-transform duration-300 group-hover:scale-105">
                      <EmblemComponent width={48} height={48} />
                    </div>
                    <h3 className="font-accent text-2xl leading-snug text-balance text-primary">
                      {point.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-muted">
                      {point.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
