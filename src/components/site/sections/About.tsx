const FACTS = [
  "10+ years in HR",
  "MENA region",
  "Junior to C-suite",
  "TEDx speaker",
] as const;

export function About() {
  return (
    <section id="about" className="bg-warm-dark px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-accent text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
          Meet the Founder
        </h2>
        <div className="mt-6 flex max-w-[65ch] flex-col gap-4 text-lg leading-relaxed text-text-main">
          <p>
            Yasmin Blasi spent a decade in HR and recruitment — talent
            acquisition, senior leadership, coaching executives, and reading
            thousands of CVs across Jordan and the broader MENA region.
          </p>
          <p>
            HireFound is the practice she built after leaving corporate HR:
            fewer seats filled, more lasting matches — and a direct line to
            the person you actually book.
          </p>
        </div>
        <p className="mt-8 text-sm font-semibold text-primary">
          {FACTS.join(" · ")}
        </p>
      </div>
    </section>
  );
}
