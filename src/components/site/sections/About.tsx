import { withBasePath } from "@/lib/base-path";

const FACTS = [
  "10+ years in HR",
  "MENA region",
  "Junior to C-suite",
  "TEDx speaker",
] as const;

export function About() {
  return (
    <section id="about" className="bg-warm-dark px-6 py-20 lg:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
        <img
          src={withBasePath("/assets/yasmin-blasi.png")}
          alt="Yasmin Blasi"
          width={800}
          height={800}
          className="aspect-square w-full max-w-72 rounded-2xl object-cover shadow-card lg:max-w-none"
          loading="lazy"
        />

        <div>
          <h2 className="font-accent text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
            Meet the Founder
          </h2>
          <div className="mt-6 flex max-w-[65ch] flex-col gap-4 text-lg leading-relaxed text-text-main">
            <p>
              10+ years in HR and recruitment. From talent acquisition to
              senior HR leadership, across Jordan and the broader MENA region.
              Built teams from scratch. Coached executives. Reviewed thousands
              of CVs.
            </p>
            <p>And then one day, I realized something.</p>
            <p className="font-semibold text-primary">
              I wasn&apos;t meant to work in corporate HR. I was meant to
              connect people with where they belong.
            </p>
            <p>
              That&apos;s why I built HireFound. Not just another recruitment
              agency. A boutique matchmaker for meaningful careers and lasting
              team success. Quality always comes before quantity.
            </p>
          </div>
          <p className="mt-8 text-sm font-semibold text-primary">
            {FACTS.join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}
