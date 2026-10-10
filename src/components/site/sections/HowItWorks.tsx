const STEPS = [
  {
    title: "We Talk",
    body: "Tell me everything. The role, the culture, the dream. I listen like it matters, because it does.",
  },
  {
    title: "We Match",
    body: "I go find your person. Not the most available, but the most right.",
  },
  {
    title: "You Grow",
    body: "The hire sticks. The career takes off. And I'm still just a message away.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-accent text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
          How It Works
        </h2>
        <p className="mt-4 max-w-[36rem] text-lg text-muted">
          Three steps. One promise: I&apos;ll find your match.
        </p>

        <ol className="hiw-list relative mt-14 flex flex-col gap-0 border-l border-secondary pl-8">
          {STEPS.map((step, index) => (
            <li key={step.title} className="hiw-step relative pb-12 last:pb-0">
              <span
                className="hiw-dot absolute top-1.5 -left-8 size-2.5 -translate-x-1/2 rounded-full bg-secondary/50"
                aria-hidden="true"
              />
              <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                Step {index + 1}
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
