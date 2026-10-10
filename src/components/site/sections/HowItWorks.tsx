import { useI18n } from "@/components/site/i18n";

export function HowItWorks() {
  const t = useI18n();
  const isRtl = t.dir === "rtl";
  return (
    <section id="how-it-works" className="bg-warm px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-accent text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
          {t.howItWorks.heading}
        </h2>
        <p className="mt-4 max-w-[36rem] text-lg text-muted">{t.howItWorks.subheading}</p>

        <ol
          className={
            isRtl
              ? "relative mt-14 flex flex-col gap-0 border-r border-secondary pr-8"
              : "relative mt-14 flex flex-col gap-0 border-l border-secondary pl-8"
          }
        >
          {t.howItWorks.steps.map((step, index) => (
            <li key={step.title} className="relative pb-12 last:pb-0">
              {isRtl ? (
                <span
                  className="absolute top-1.5 -right-8 size-2.5 translate-x-1/2 rounded-full bg-primary"
                  aria-hidden="true"
                />
              ) : (
                <span
                  className="absolute top-1.5 -left-8 size-2.5 -translate-x-1/2 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
              <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                {isRtl ? `الخطوة ${index + 1}` : `Step ${index + 1}`}
              </p>
              <h3 className="font-accent mt-2 text-3xl text-primary">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
