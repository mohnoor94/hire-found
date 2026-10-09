const STEPS = [
  {
    title: "We Talk",
    body: "Tell me everything. The role, the culture, the dream. I listen like it matters — because it does.",
  },
  {
    title: "We Match",
    body: "I go find your person. Not the most available — the most right.",
  },
  {
    title: "You Grow",
    body: "The hire sticks. The career takes off. And I'm still just a message away.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-warm-dark px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-accent text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
          How It Works
        </h2>
        <p className="mt-4 max-w-[36rem] text-lg text-muted">
          Three steps. One promise: I&apos;ll find your match.
        </p>

        <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
          {STEPS.map((step, index) => (
            <li key={step.title} className="border-t border-secondary pt-6">
              <p className="font-accent text-2xl text-primary">{index + 1}</p>
              <h3 className="mt-3 text-xl font-semibold text-balance text-text-main">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[36ch] leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
