"use client";

import {
  VignetteConsultationDesk,
  VignetteAlignmentCompass,
  VignetteFlourishingLaurel,
} from "@/components/illustrations";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useI18n } from "@/components/site/i18n";

export function HowItWorks() {
  const t = useI18n();
  const containerRef = useScrollReveal<HTMLElement>({
    selector: ".reveal-on-scroll",
    staggerMs: 70,
  });
  const [step1, step2, step3] = t.howItWorks.steps;
  const [label1, label2, label3] = t.howItWorks.stepLabels;

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="relative px-6 py-20 lg:py-28"
    >
      <div className="section-divider mx-auto mb-16 max-w-5xl opacity-50" aria-hidden="true" />
      <div className="mx-auto max-w-5xl">
        <div className="reveal-on-scroll">
          <span className="text-xs font-semibold tracking-[0.14em] text-secondary uppercase">
            {t.howItWorks.eyebrow}
          </span>
          <h2 className="font-accent mt-2 text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
            {t.howItWorks.heading}
          </h2>
          <p className="mt-4 max-w-[36rem] text-lg text-muted">
            {t.howItWorks.subheading}
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-6">
          <div className="reveal-on-scroll card-interactive-sheen group rounded-2xl border border-secondary/35 bg-card/60 p-1.5 shadow-card hover:shadow-card-hover">
            <div className="flex flex-col items-center justify-between gap-8 rounded-xl border border-secondary/20 bg-card p-6 sm:p-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-warm px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                  {label1}
                </span>
                <h3 className="font-accent mt-3 text-3xl text-primary sm:text-4xl">
                  {step1?.title}
                </h3>
                <p className="mt-3 max-w-[48ch] text-base leading-relaxed text-muted sm:text-lg">
                  {step1?.body}
                </p>
              </div>
              <div className="shrink-0 overflow-hidden rounded-lg bg-warm/50 p-2">
                <VignetteConsultationDesk
                  width={200}
                  height={155}
                  className="transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="reveal-on-scroll card-interactive-sheen group flex flex-col rounded-2xl border border-secondary/35 bg-card/60 p-1.5 shadow-card hover:shadow-card-hover">
              <div className="flex flex-1 flex-col justify-between rounded-xl border border-secondary/20 bg-card p-6 sm:p-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-warm px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                    {label2}
                  </span>
                  <h3 className="font-accent mt-3 text-2xl text-primary sm:text-3xl">
                    {step2?.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {step2?.body}
                  </p>
                </div>
                <div className="mt-6 flex justify-center overflow-hidden rounded-lg bg-warm/50 p-3">
                  <VignetteAlignmentCompass
                    width={180}
                    height={155}
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </div>

            <div className="reveal-on-scroll card-interactive-sheen group flex flex-col rounded-2xl border border-secondary/35 bg-card/60 p-1.5 shadow-card hover:shadow-card-hover">
              <div className="flex flex-1 flex-col justify-between rounded-xl border border-secondary/20 bg-card p-6 sm:p-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-warm px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                    {label3}
                  </span>
                  <h3 className="font-accent mt-3 text-2xl text-primary sm:text-3xl">
                    {step3?.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {step3?.body}
                  </p>
                </div>
                <div className="mt-6 flex justify-center overflow-hidden rounded-lg bg-warm/50 p-3">
                  <VignetteFlourishingLaurel
                    width={180}
                    height={155}
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
