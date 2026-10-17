"use client";

import { useEffect, useRef } from "react";
import { CalendarIcon } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { withBasePath } from "@/lib/base-path";

const heroCta =
  "inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground select-none shadow-warm [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1),background-color_160ms_ease-out] hover:bg-primary-light hover:shadow-glow active:scale-[0.97] active:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto";

const verseClass =
  "font-accent text-[1.7rem] leading-[1.14] tracking-[-0.03em] text-primary sm:text-4xl lg:text-[2.65rem]";

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

function CoverStill() {
  return (
    <figure className="overflow-hidden rounded-xl border border-secondary/40 bg-card shadow-card lg:flex lg:h-full lg:min-h-[32rem] lg:flex-col">
      <img
        src={withBasePath("/assets/room/panel.webp")}
        alt="Yasmin Blasi speaking on a panel at the Digital Graduates Industry Meetup"
        width={1600}
        height={1205}
        className="aspect-[4/3] w-full object-cover object-[center_20%] lg:aspect-auto lg:min-h-0 lg:flex-1"
        decoding="async"
      />
      <figcaption className="border-t border-secondary/25 px-4 py-3.5 text-sm leading-snug text-text-main sm:px-5">
        That&apos;s me, speaking at the Digital Graduates Industry Meetup.
      </figcaption>
    </figure>
  );
}

export function Hero() {
  const { open } = useBookingModal();
  const heroRef = useRef<HTMLElement>(null);
  useHeroPointer(heroRef);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative isolate flex flex-col justify-center overflow-hidden bg-background pt-[calc(var(--site-nav-offset)+1.5rem)] pb-16 lg:min-h-[min(100svh,54rem)] lg:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55] blur-2xl will-change-transform motion-safe:transition-[background-position] motion-safe:duration-200"
        style={{
          background:
            "radial-gradient(720px circle at var(--mx,50%) var(--my,50%), color-mix(in oklch, var(--primary) 18%, transparent), transparent 60%), radial-gradient(560px circle at calc(100% - var(--mx,50%)) calc(100% - var(--my,50%)), color-mix(in oklch, var(--secondary) 12%, transparent), transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.14)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-4 left-6 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(122,30,74,0.06)_0%,transparent_70%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-10">
        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-x-14 lg:gap-y-8 xl:gap-x-16">
          <div className="hf-fold lg:col-start-1 lg:row-start-1">
            <h1 className="font-accent text-5xl leading-[1.02] tracking-[-0.03em] text-primary sm:text-6xl lg:text-7xl">
              HireFound
            </h1>
            <p className="mt-2 text-sm font-semibold tracking-[0.08em] text-muted uppercase">
              by Yasmin Blasi
            </p>

            <div className="mt-8 flex flex-col gap-5">
              <p className={verseClass}>
                You want a hire?
                <br />
                We got you found.
              </p>
              <div className="h-px w-12 bg-secondary" aria-hidden="true" />
              <p className={verseClass}>
                I speak and teach.
                <br />
                I&apos;ll move the chairs.
              </p>
            </div>

            <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-muted sm:text-lg">
              Talks, workshops, and time with people just starting out.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4">
              <button
                type="button"
                id="hero-book"
                onClick={(e) => open(e.currentTarget)}
                className={heroCta}
              >
                <CalendarIcon className="size-4 shrink-0" aria-hidden="true" />
                <span>Let&apos;s Talk</span>
              </button>

              <p className="text-sm text-muted">
                Hiring, speaking, or workshops. Looking for a role?{" "}
                <a
                  id="hero-explore"
                  href="#vacancies"
                  className="font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:text-primary-light"
                >
                  Explore open roles
                </a>
              </p>
            </div>
          </div>

          <div className="hf-atelier-deck lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <CoverStill />
          </div>

          <p className="flex items-start gap-2.5 text-sm leading-relaxed text-muted lg:col-start-1 lg:row-start-2 lg:self-end">
            <span
              className="mt-2 size-1.5 shrink-0 rounded-full bg-success"
              aria-hidden="true"
            />
            <span>
              <span className="font-semibold text-text-main">
                Direct founder access
              </span>
              <span aria-hidden="true"> · </span>
              10+ years
              <span aria-hidden="true"> · </span>
              MENA
              <span aria-hidden="true"> · </span>
              Junior to C-suite
              <span aria-hidden="true"> · </span>
              TEDx speaker
            </span>
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-warm"
        aria-hidden="true"
      />
    </section>
  );
}
