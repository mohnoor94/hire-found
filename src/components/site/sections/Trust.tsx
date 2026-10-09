const PRESS = [
  "TEDx Zarqa University",
  "Leaders of Arabia",
  "Arab Icons",
  "Career Spotlight Jordan",
] as const;

/**
 * Modernized, still not visible. Unhide only after Yasmin signs off on the
 * press line and this testimonial (Stage D2).
 */
export function Trust() {
  return (
    <section id="trust" hidden className="bg-warm px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-accent text-3xl tracking-[-0.02em] text-primary md:text-4xl">
          As seen in
        </h2>
        <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
          {PRESS.map((name) => (
            <li key={name} className="font-accent text-xl text-text-main">
              {name}
            </li>
          ))}
        </ul>

        <blockquote className="mt-16 border-t border-secondary pt-10">
          <p className="font-accent text-2xl leading-snug text-pretty text-text-main italic md:text-3xl">
            Yasmin didn&apos;t just find us a candidate, she found us a team
            member. Someone who gets our culture, our speed, our vision.
            That&apos;s rare.
          </p>
          <footer className="mt-6 text-sm text-muted">
            <cite className="font-semibold text-text-main not-italic">
              Sarah A.
            </cite>
            <span aria-hidden="true"> · </span>
            CEO, Tech Startup
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
