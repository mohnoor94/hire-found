const POINTS = [
  {
    title: "Matchmaking, Not Seat-Filling",
    body: "I find people who fit your culture, not just your job description.",
  },
  {
    title: "Your Story, Not Just Keywords",
    body: "Every candidate is more than a CV. Every company is more than a job post.",
  },
  {
    title: "From First Call to First Day",
    body: "I don't disappear after the offer letter. I'm here for the whole journey.",
  },
] as const;

export function AntiPitch() {
  return (
    <section id="anti-pitch" className="bg-warm-dark px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-accent max-w-[16ch] text-4xl leading-[1.1] tracking-[-0.02em] text-balance text-primary md:text-5xl">
          I&apos;m not your usual recruiter.
        </h2>
        <p className="mt-4 max-w-[36rem] text-lg text-muted">
          And that&apos;s exactly the point.
        </p>

        <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
          {POINTS.map((point) => (
            <div key={point.title} className="border-t border-secondary pt-6">
              <h3 className="font-accent text-2xl leading-snug text-balance text-primary">
                {point.title}
              </h3>
              <p className="mt-3 max-w-[36ch] text-base leading-relaxed text-muted">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
