"use client";

import { withBasePath } from "@/lib/base-path";
import {
  PillarArmchair,
  PillarManuscript,
  PillarDoorway,
} from "@/components/illustrations";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useI18n } from "@/components/site/i18n";

const PILLAR_EMBLEMS = [PillarArmchair, PillarManuscript, PillarDoorway] as const;

export function About() {
  const t = useI18n();
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
        <div className="reveal-on-scroll rounded-3xl border border-secondary/30 bg-warm-dark/45 p-7 sm:p-10 lg:p-12 shadow-xs backdrop-blur-xs">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14 xl:gap-18">
            <figure className="relative mx-auto w-full max-w-sm lg:max-w-none">
              <div
                className="absolute -inset-2 -rotate-1 rounded-3xl border border-secondary/35 bg-card/40 sm:-inset-2.5"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-2xl border border-secondary/40 bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
                <img
                  src={withBasePath("/assets/yasmin-blasi.png")}
                  alt={t.hero.portraitAlt}
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
                    {t.about.founderRole}
                  </p>
                </div>
              </div>
            </figure>

            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                {t.about.meetTheFounder}
              </p>
              <h2 className="font-accent mt-2 text-4xl leading-[1.1] tracking-[-0.02em] text-balance text-primary md:text-5xl">
                {t.about.notUsual}
              </h2>
              <p className="mt-3 text-lg text-muted">
                {t.about.point}
              </p>

              <div className="mt-6 flex max-w-[65ch] flex-col gap-4 text-lg leading-relaxed text-text-main">
                <p>{t.about.p1}</p>
                <p>{t.about.p2}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2.5">
                {t.about.facts.map((fact) => (
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

        <div className="mt-16 pt-4 lg:mt-20">
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {t.about.pillars.map((point, index) => {
              const EmblemComponent = PILLAR_EMBLEMS[index];
              if (!EmblemComponent) return null;
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
