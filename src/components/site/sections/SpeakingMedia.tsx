import { cn } from "@/lib/utils";
import {
  BookOpenIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  Mic2Icon,
  TvIcon,
  UsersIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AppearanceKind = "talk" | "tv" | "panel" | "conference" | "program";

type Appearance = {
  id: string;
  title: string;
  kind: AppearanceKind;
  details?: string;
  quote?: string;
  href?: string;
  cta?: string;
};

// Verified from LinkedIn research (Oct 10 2026). Do not invent details.
// TODO: "أثر 2" is mentioned in that research but details are unverified. Omit until confirmed.
const APPEARANCES: Appearance[] = [
  {
    id: "tedx-zarqa",
    title: "TEDx Zarqa University",
    kind: "talk",
    quote: "انت حر … ادعس ولا تسأل / اطلق العنان لأفكارك وطموحاتك",
  },
  {
    id: "almamlaka-tv-1",
    title: "Al Mamlaka TV",
    kind: "tv",
    details: "Live interview on the value of a university degree",
    href: "https://lnkd.in/dYzurw9H",
    cta: "Watch interview",
  },
  {
    id: "almamlaka-tv-2",
    title: "Al Mamlaka TV",
    kind: "tv",
    details: "Live interview on professionalism at work",
    quote: "المهنية يعني مهارات سلوكية ووزنها ٨٠% … الاحتراف يعني مهارات فنية ووزنها ٢٠%",
  },
  {
    id: "parachute16-meetup",
    title: "Parachute16 Digital Graduates Industry Meetup",
    kind: "panel",
    details: "Panelist · Sep 2026 · ~200 graduates · moderated by Ghassan Halawa",
  },
  {
    id: "graduates-conference-2025",
    title: "Graduates Conference 2025",
    kind: "conference",
    details: "مؤتمر الخريجين ٢٠٢٥ · Sat 22/11/2025",
  },
  {
    id: "800arabia-travel-to-learn",
    title: "800Arabia Travel To Learn",
    kind: "program",
    details: "Emotional intelligence & leadership · Doha · Oct 2026",
  },
];

const KIND_META: Record<
  AppearanceKind,
  { label: string; Icon: LucideIcon }
> = {
  talk: { label: "Talk", Icon: Mic2Icon },
  tv: { label: "Live TV", Icon: TvIcon },
  panel: { label: "Panel", Icon: UsersIcon },
  conference: { label: "Conference", Icon: GraduationCapIcon },
  program: { label: "Program", Icon: BookOpenIcon },
};

const cardClass =
  "group flex h-full flex-col rounded-2xl border border-secondary/30 bg-white/80 p-6 shadow-xs backdrop-blur-xs transition-all duration-300 motion-reduce:transition-none hover:bg-white hover:shadow-card";

function AppearanceBody({ item }: { item: Appearance }) {
  const { label, Icon } = KIND_META[item.kind];
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
          {label}
        </p>
      </div>
      <h3 className="font-accent mt-4 text-xl leading-snug text-pretty text-primary">
        {item.title}
      </h3>
      {item.details ? (
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.details}</p>
      ) : null}
      {item.quote ? (
        <blockquote
          dir="rtl"
          lang="ar"
          className="mt-3 text-sm leading-relaxed text-pretty text-text-main"
        >
          {item.quote}
        </blockquote>
      ) : null}
      {item.cta ? (
        <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-semibold text-primary">
          {item.cta}
          <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
        </span>
      ) : null}
    </>
  );
}

export function SpeakingMedia() {
  return (
    <section
      id="speaking-media"
      aria-labelledby="speaking-media-heading"
      className="bg-warm-dark px-6 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2
            id="speaking-media-heading"
            className="font-accent text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl"
          >
            Speaking & Media
          </h2>
          <p className="mt-4 max-w-[36rem] text-lg text-muted">
            Verified talks, live interviews, panels, and programs, from TEDx
            Zarqa University to Al Mamlaka TV.
          </p>
        </div>

        <ul className="mt-12 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {APPEARANCES.map((item) => (
            <li key={item.id} className="h-full">
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    cardClass,
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  )}
                >
                  <AppearanceBody item={item} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <div className={cardClass}>
                  <AppearanceBody item={item} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
