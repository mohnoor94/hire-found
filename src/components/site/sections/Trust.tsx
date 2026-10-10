/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TRUST_BENTO_ENABLED } from "@/lib/flags";

// Temporary gate: hide press marquee on live site while keeping testimonial and stats.
const SHOW_PRESS = false;

const PRESS = [
  "TEDx Zarqa University",
  "Al Mamlaka TV (two live interviews)",
  "parachute16 Digital Graduates Industry Meetup (panelist)",
] as const;

/**
 * Modernized, still not visible. Unhide only after Yasmin signs off on the
 * press line and this testimonial (Stage D2).
 */
// A11y: detect reduced motion to disable marquee and counters.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

// Observe when an element enters the viewport.
function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setInView(true);
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0, ...options },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);
  return { ref, inView } as const;
}

// Count up to a target value when in view.
function CountUp({
  target,
  durationMs = 1000,
  disabled,
  className,
}: {
  target: number;
  durationMs?: number;
  disabled?: boolean;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(0);
  const display = disabled ? target : value;
  useEffect(() => {
    if (disabled || !inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [disabled, durationMs, inView, target]);

  return (
    <span ref={ref} className={className} aria-live="polite">
      {display}
    </span>
  );
}

function PressMarquee() {
  const reduced = usePrefersReducedMotion();
  const items = useMemo(() => [...PRESS, ...PRESS], []);
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-secondary/30 bg-white/70 shadow-xs hover:shadow-card"
      aria-label="Press"
    >
      <div
        className={cn(
          "hf-marquee-track flex min-w-max gap-10 whitespace-nowrap py-5 px-6 text-primary",
          reduced && "hf-marquee-paused",
        )}
        aria-hidden={!reduced}
      >
        {items.map((name, idx) => (
          <span
            key={`${name}-${idx}`}
            className="font-accent text-lg md:text-xl"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Trust() {
  const reduced = usePrefersReducedMotion();
  if (!TRUST_BENTO_ENABLED) return null;
  return (
    <section id="trust" className="bg-warm px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {SHOW_PRESS && (
          <>
            <h2 className="font-accent text-3xl tracking-[-0.02em] text-primary md:text-4xl">
              As seen in
            </h2>
            <div className="mt-6">
              <PressMarquee />
            </div>
          </>
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-12 md:gap-6">
          {/* Testimonial - large tile */}
          <blockquote className="md:col-span-7 rounded-2xl border border-secondary/30 bg-white/80 p-6 shadow-xs backdrop-blur-xs transition-all duration-300 hover:bg-white hover:shadow-card">
            <p className="font-accent text-2xl leading-snug text-pretty text-text-main italic md:text-3xl">
              I appreciate your professional support and valuable advice. Thank
              you for taking the time to guide me.
            </p>
            <footer className="mt-6 text-sm text-muted">
              <cite className="font-semibold text-text-main not-italic">
                Kholoud Joudeh
              </cite>
              <span aria-hidden="true"> · </span>
              Client (Food Quality &amp; Safety / QA lead)
            </footer>
          </blockquote>

          {/* Right column - stats and TEDx */}
          <div className="md:col-span-5 grid grid-cols-2 gap-4 md:gap-5">
            {/* LinkedIn followers - numeric */}
            <div className="col-span-1 rounded-2xl border border-secondary/30 bg-white/80 p-5 shadow-xs transition-all duration-300 hover:bg-white hover:shadow-card">
              <div className="flex items-baseline gap-1">
                <CountUp
                  target={44}
                  durationMs={1200}
                  disabled={reduced}
                  className="font-accent text-4xl leading-none text-primary"
                />
                <span className="font-accent text-2xl leading-none text-primary">
                  K+
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-muted">
                LinkedIn followers
              </p>
              <p className="sr-only">44,016 LinkedIn followers</p>
            </div>

            {/* Junior to C-suite */}
            <div className="col-span-1 rounded-2xl border border-secondary/30 bg-white/80 p-5 shadow-xs transition-all duration-300 hover:bg-white hover:shadow-card">
              <p className="font-accent text-xl leading-snug text-primary">
                Junior to C-suite
              </p>
            </div>

            {/* MENA region */}
            <div className="col-span-1 rounded-2xl border border-secondary/30 bg-white/80 p-5 shadow-xs transition-all duration-300 hover:bg-white hover:shadow-card">
              <p className="font-accent text-xl leading-snug text-primary">
                MENA region
              </p>
            </div>

            {/* TEDx tile */}
            <div className="col-span-1 rounded-2xl border border-secondary/30 bg-white/85 p-5 shadow-xs transition-all duration-300 hover:bg-white hover:shadow-card">
              <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                Talk
              </p>
              <p className="font-accent mt-1.5 text-xl leading-snug text-primary">
                TEDx Zarqa University
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
