import { cn } from "@/lib/utils";
import { ExternalLinkIcon, TvIcon, Mic2Icon, UsersIcon, GraduationCapIcon, BookOpenIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Appearance = {
  id: string;
  title: string;
  kind: "talk" | "tv" | "panel" | "conference" | "program";
  details?: string;
  href?: string;
};

const APPEARANCES: Appearance[] = [
  {
    id: "tedx-zarqa",
    title: "TEDx Zarqa University",
    kind: "talk",
    details:
      'Message: "انت حر … ادعس ولا تسأل / اطلق العنان لأفكارك وطموحاتك"',
  },
  {
    id: "almamlaka-tv-1",
    title: "Al Mamlaka TV - Live interview",
    kind: "tv",
    details:
      "Value of a university degree",
    href: "https://lnkd.in/dYzurw9H",
  },
  {
    id: "almamlaka-tv-2",
    title: "Al Mamlaka TV - Live interview",
    kind: "tv",
    details:
      "Professionalism at work",
  },
  {
    id: "parachute16-meetup",
    title: "Digital Graduates Industry Meetup - Parachute16",
    kind: "panel",
    details: "Panelist · Sep 2026 · ~200 graduates",
  },
  {
    id: "graduates-conference-2025",
    title: "Graduates Conference 2025",
    kind: "conference",
    details: "Sat 22/11/2025",
  },
  {
    id: "800arabia-travel-to-learn",
    title: "800Arabia - Travel To Learn",
    kind: "program",
    details: "Emotional intelligence & leadership · Doha · Oct 2026",
  },
];

function KindIcon({ kind }: { kind: Appearance["kind"] }) {
  switch (kind) {
    case "tv":
      return <TvIcon className="size-4" aria-hidden="true" />;
    case "talk":
      return <Mic2Icon className="size-4" aria-hidden="true" />;
    case "panel":
      return <UsersIcon className="size-4" aria-hidden="true" />;
    case "conference":
      return <GraduationCapIcon className="size-4" aria-hidden="true" />;
    case "program":
      return <BookOpenIcon className="size-4" aria-hidden="true" />;
    default:
      return null;
  }
}

export function SpeakingMedia() {
  return (
    <section
      id="speaking-media"
      aria-labelledby="speaking-media-heading"
      className="bg-warm px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2
            id="speaking-media-heading"
            className="font-accent text-3xl tracking-[-0.02em] text-primary md:text-4xl"
          >
            Speaking & Media
          </h2>
          <p className="mt-3 text-base text-muted">
            Selected verified appearances: TEDx, live TV interviews, industry panels, and programs.
          </p>
        </div>

        <ul
          className={cn(
            "mt-8 grid gap-4",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {APPEARANCES.map((item, index) => {
            return (
              <li
                key={item.id}
                className="nav-mobile-card opacity-100 [animation-delay:calc(80ms+var(--i)*40ms)]"
                style={
                  {
                    // used to stagger entry; disabled by prefers-reduced-motion rules below
                    ["--i" as string]: String(index),
                  } as React.CSSProperties
                }
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group block rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-card transition-colors duration-200 hover:border-primary/20 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                        <KindIcon kind={item.kind} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <h3 className="min-w-0 flex-1 text-base leading-snug font-semibold text-text-main">
                            {item.title}
                          </h3>
                          <span
                            className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                            title="Opens in new tab"
                          >
                            <ExternalLinkIcon className="size-3.5" />
                          </span>
                        </div>
                        {item.details ? (
                          <p className="mt-1 text-sm leading-snug text-muted">
                            {item.details}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    className={cn(
                      "group block rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-card",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                        <KindIcon kind={item.kind} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <h3 className="min-w-0 flex-1 text-base leading-snug font-semibold text-text-main">
                            {item.title}
                          </h3>
                        </div>
                        {item.details ? (
                          <p className="mt-1 text-sm leading-snug text-muted">
                            {item.details}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

