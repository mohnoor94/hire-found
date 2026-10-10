import {
  VignetteConsultationDesk,
  VignetteAlignmentCompass,
  VignetteFlourishingLaurel,
} from "@/components/illustrations";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <span className="text-xs font-semibold tracking-[0.14em] text-secondary uppercase">
          The Matchmaking Process
        </span>
        <h2 className="font-accent mt-2 text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
          How It Works
        </h2>
        <p className="mt-4 max-w-[36rem] text-lg text-muted">
          Three steps. One promise: I&apos;ll find your match.
        </p>

        {/* Asymmetrical Atelier Grid */}
        <div className="mt-14 flex flex-col gap-6">
          {/* Step 1: Featured Wide Hero Card (We Talk) */}
          <div className="group rounded-2xl border border-secondary/35 bg-card/40 p-1.5 shadow-card transition-all duration-300 hover:shadow-card-hover">
            <div className="flex flex-col items-center justify-between gap-8 rounded-xl border border-secondary/20 bg-card p-6 sm:p-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-warm px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                  Step 01
                </span>
                <h3 className="font-accent mt-3 text-3xl text-primary sm:text-4xl">
                  We Talk
                </h3>
                <p className="mt-3 max-w-[48ch] text-base leading-relaxed text-muted sm:text-lg">
                  Tell me everything: the mandate, the leadership dynamic, the
                  vision. I listen like it matters, because it does.
                </p>
              </div>
              <div className="shrink-0 overflow-hidden rounded-lg bg-warm/50 p-2">
                <VignetteConsultationDesk
                  width={200}
                  height={155}
                  className="transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>

          {/* Steps 2 & 3: Paired Editorial Double-Bezel Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Step 2: We Match */}
            <div className="group flex flex-col rounded-2xl border border-secondary/35 bg-card/40 p-1.5 shadow-card transition-all duration-300 hover:shadow-card-hover">
              <div className="flex flex-1 flex-col justify-between rounded-xl border border-secondary/20 bg-card p-6 sm:p-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-warm px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                    Step 02
                  </span>
                  <h3 className="font-accent mt-3 text-2xl text-primary sm:text-3xl">
                    We Match
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    Discreet headhunting, cultural vetting, and DISC behavioral
                    profiling. You only meet vetted finalists who fit.
                  </p>
                </div>
                <div className="mt-6 flex justify-center overflow-hidden rounded-lg bg-warm/50 p-3">
                  <VignetteAlignmentCompass
                    width={180}
                    height={155}
                    className="transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: You Grow */}
            <div className="group flex flex-col rounded-2xl border border-secondary/35 bg-card/40 p-1.5 shadow-card transition-all duration-300 hover:shadow-card-hover">
              <div className="flex flex-1 flex-col justify-between rounded-xl border border-secondary/20 bg-card p-6 sm:p-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-warm px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                    Step 03
                  </span>
                  <h3 className="font-accent mt-3 text-2xl text-primary sm:text-3xl">
                    You Grow
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    The hire sticks. The leadership team gains momentum. And I
                    stay closely connected for ongoing retention.
                  </p>
                </div>
                <div className="mt-6 flex justify-center overflow-hidden rounded-lg bg-warm/50 p-3">
                  <VignetteFlourishingLaurel
                    width={180}
                    height={155}
                    className="transition-transform duration-300 group-hover:scale-[1.02]"
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
