"use client";

import { useEffect, useRef } from "react";
import { CalendarIcon, ArrowUpRightIcon } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { withBasePath } from "@/lib/base-path";
import { useServicesTab } from "@/components/site/services-tab";

const primaryCta =
  "group relative inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2.5 overflow-hidden rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground select-none transition-all duration-200 hover:bg-primary-light hover:shadow-glow active:scale-[0.98] active:bg-primary-dark sm:w-auto shadow-warm ring-1 ring-primary/0 hover:ring-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const secondaryCta =
  "group inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-primary/25 bg-card/70 px-6 text-base font-semibold text-primary select-none transition-all duration-200 hover:bg-card hover:border-primary/45 active:scale-[0.98] active:bg-card sm:w-auto";

function useHeroPointer(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduce) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--mx", `${x}%`);
        el.style.setProperty("--my", `${y}%`);
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
    };
  }, [ref]);
}

function RevealWords({ text }: { text: string }) {
  const hostRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduce) {
      hostRef.current?.querySelectorAll(".text-reveal").forEach((n) => {
        n.classList.add("visible");
      });
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      hostRef.current?.querySelectorAll(".text-reveal").forEach((n) => {
        n.classList.add("visible");
      });
      return;
    }
    const target = hostRef.current;
    if (!target) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]) return;
        if (entries[0].isIntersecting) {
          const words = target.querySelectorAll<HTMLElement>(".text-reveal");
          words.forEach((el, i) => {
            el.style.transitionDelay = `${Math.min(i * 70, 800)}ms`;
            requestAnimationFrame(() => el.classList.add("visible"));
          });
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);
  const words = text.split(" ");
  return (
    <p
      ref={hostRef}
      className="font-accent mt-6 max-w-[34rem] text-3xl leading-[1.12] tracking-[-0.02em] text-primary sm:text-4xl md:text-[2.75rem]"
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="text-reveal-wrap">
            <span className="text-reveal">{w}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

export function Hero() {
  const { open } = useBookingModal();
  const services = useServicesTab();
  const tab = services?.tab ?? "employers";
  const isEmployers = tab === "employers";
  const heroRef = useRef<HTMLElement>(null);
  useHeroPointer(heroRef);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative isolate flex min-h-[min(100svh,54rem)] flex-col justify-center overflow-hidden bg-background pt-[calc(var(--site-nav-offset)+1.5rem)] pb-16 md:py-20 lg:py-24"
    >
      {/* Animated gradient mesh that softly follows the cursor (desktop only) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55] blur-2xl will-change-transform motion-safe:transition-[background-position] motion-safe:duration-200"
        style={{
          background:
            "radial-gradient(720px circle at var(--mx,50%) var(--my,50%), color-mix(in oklch, var(--primary) 18%, transparent), transparent 60%), radial-gradient(560px circle at calc(100% - var(--mx,50%)) calc(100% - var(--my,50%)), color-mix(in oklch, var(--secondary) 12%, transparent), transparent 65%)",
        }}
        aria-hidden="true"
      />
      {/* Ambient background glow for warmth and depth */}
      <div
        className="pointer-events-none absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.14)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-4 left-6 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(122,30,74,0.06)_0%,transparent_70%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14 xl:gap-18">
          {/* Left Column: Clean Brand & Her Exact Tagline */}
          <div className="hf-fold">
            {/* Brand Title */}
            <h1 className="font-accent text-5xl leading-[1.02] tracking-[-0.03em] text-primary sm:text-6xl md:text-7xl">
              HireFound
            </h1>

            <p className="mt-2 text-sm font-semibold tracking-[0.08em] text-muted uppercase">
              by Yasmin Blasi
            </p>

            {/* Her Tagline with reveal */}
            <RevealWords text="You want a hire? We got you found." />

            {/* Audience toggle */}
            <div className="mt-5 inline-flex items-center gap-1 rounded-full bg-primary/[0.06] p-1">
              <button
                type="button"
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${isEmployers ? "bg-card text-primary shadow-sm" : "text-muted hover:text-primary"}`}
                aria-pressed={isEmployers}
                onClick={() => services?.setTab("employers")}
              >
                Employers
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${!isEmployers ? "bg-card text-primary shadow-sm" : "text-muted hover:text-primary"}`}
                aria-pressed={!isEmployers}
                onClick={() => services?.setTab("candidates")}
              >
                Candidates
              </button>
            </div>

            {/* Supporting Note (swaps by audience) */}
            <p className="mt-4 max-w-[32rem] text-base leading-relaxed text-muted sm:text-lg">
              {isEmployers
                ? "Executive search and culture-first hiring across Jordan and the Gulf."
                : "Career matchmaking and coaching for roles across Jordan and the Gulf."}
            </p>

            <div
              className="mt-6 h-px w-12 bg-secondary"
              aria-hidden="true"
            />

            {/* Dual CTAs - primary swaps by audience */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              {isEmployers ? (
                <button
                  type="button"
                  id="hero-hiring"
                  onClick={(e) => open(e.currentTarget)}
                  className={primaryCta}
                >
                  <CalendarIcon className="size-5 shrink-0" aria-hidden="true" />
                  <span>I&apos;m Hiring Executive Talent</span>
                  <span
                    className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary-dark/40 text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  >
                    <ArrowUpRightIcon className="size-3.5" />
                  </span>
                </button>
              ) : (
                <a href="#vacancies" id="hero-see-roles" className={primaryCta}>
                  <span>See Open Roles</span>
                  <span
                    className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-primary-dark/40 text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  >
                    <ArrowUpRightIcon className="size-3.5" />
                  </span>
                </a>
              )}
              {isEmployers ? (
                <a href="#vacancies" id="hero-explore" className={secondaryCta}>
                  <span>Explore Open Roles</span>
                  <span
                    className="size-2 rounded-full bg-secondary transition-transform duration-200 group-hover:scale-125"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <button
                  type="button"
                  id="hero-talk"
                  onClick={(e) => open(e.currentTarget)}
                  className={secondaryCta}
                >
                  <CalendarIcon className="size-5 shrink-0" aria-hidden="true" />
                  <span>Talk to Yasmin</span>
                </button>
              )}
            </div>

            {/* Authentic Facts (from About.tsx) with generous breathing room */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-secondary/35 pt-6 text-xs text-muted">
              <span className="flex items-center gap-1.5 font-semibold text-text-main">
                <span
                  className="size-1.5 rounded-full bg-success"
                  aria-hidden="true"
                />
                Direct Founder Access
              </span>
              <span>10+ Years of Experience</span>
              <span>MENA Region</span>
              <span>Junior to C-Suite</span>
              <span>TEDx Speaker</span>
            </div>
          </div>

          {/* Right Column: Spacious & Calm Atelier Cards (No giant photo, no cramped stats) */}
          <div className="hf-atelier-deck hidden flex-col gap-5 md:flex">
            {/* Atelier Card 1: Founder Cameo Seal */}
            <figure className="relative overflow-hidden rounded-xl border border-secondary/40 bg-card/90 p-6 shadow-card backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover">
              <div className="flex items-center gap-4">
                <div className="relative size-16 shrink-0 sm:size-20">
                  <div
                    className="absolute -inset-1 rounded-lg border border-secondary/60"
                    aria-hidden="true"
                  />
                  <img
                    src={withBasePath("/assets/yasmin-blasi.png")}
                    alt="Yasmin Blasi, founder of HireFound"
                    width={800}
                    height={800}
                    className="hf-hero-portrait size-full rounded-md object-cover object-[center_12%]"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <figcaption className="font-accent text-lg font-bold text-primary">
                      Yasmin Blasi
                    </figcaption>
                    <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
                      Founder
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted italic">
                    &ldquo;Fewer seats filled, more lasting matches, and a
                    direct line to the person you actually book.&rdquo;
                  </p>
                </div>
              </div>
            </figure>

            {/* Atelier Card 2: Simple Standard (from AntiPitch.tsx) */}
            <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover">
              <div className="flex items-center justify-between border-b border-warm-dark pb-3.5">
                <p className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
                  How We Work
                </p>
                <span className="text-[11px] font-semibold text-primary">
                  Jordan &amp; The Gulf
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <h2 className="font-accent text-xl text-primary">
                    Matchmaking, Not Seat-Filling
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Finding people who fit your culture, not just your job
                    description. Every candidate is more than a CV.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1.5">
                  <span className="rounded-md border border-primary/10 bg-warm px-3 py-1 text-xs font-medium text-text-main">
                    Executive Search
                  </span>
                  <span className="rounded-md border border-primary/10 bg-warm px-3 py-1 text-xs font-medium text-text-main">
                    DISC Profiling
                  </span>
                  <span className="rounded-md border border-primary/10 bg-warm px-3 py-1 text-xs font-medium text-text-main">
                    First Call to First Day
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
