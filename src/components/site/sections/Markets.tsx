"use client";
import { useI18n } from "@/components/site/i18n";
import type { Messages } from "@/i18n/en";

export function Markets() {
  const t: Messages = useI18n();
  const markets = t.markets;
  const isRtl = t.dir === "rtl";

  return (
    <section id="markets" className="bg-warm-dark px-6 py-16 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-accent text-3xl tracking-[-0.02em] text-balance text-primary md:text-4xl">
          {markets.heading}
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold tracking-[0.14em] text-muted uppercase">
              {markets.countriesHeading}
            </h3>
            <div className="flex flex-wrap gap-2">
              {markets.countries.map((c: string) => (
                <span
                  key={c}
                  className="rounded-full border border-primary/15 bg-white/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary shadow-xs"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold tracking-[0.14em] text-muted uppercase">
              {markets.industriesHeading}
            </h3>
            <div className="flex flex-wrap gap-2">
              {markets.industries.map((i: string) => (
                <span
                  key={i}
                  className="rounded-md border border-primary/10 bg-warm px-3 py-1 text-xs font-medium text-text-main"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

