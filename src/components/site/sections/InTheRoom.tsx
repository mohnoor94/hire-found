"use client";

import { CalendarIcon } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { withBasePath } from "@/lib/base-path";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const OFFERS = [
  {
    title: "Speaking",
    body: "Panels and talks on leadership, workplace culture, generations at work, and what hiring feels like from both sides of the table.",
  },
  {
    title: "Workshops",
    body: "Practical sessions for teams: interviewing, hiring, personal brand, and how people communicate at work.",
  },
  {
    title: "Graduates",
    body: "Time with students on what employers actually expect, and how to walk into a first role ready.",
  },
] as const;

const PAIR = [
  {
    src: "/assets/room/panel.webp",
    width: 1600,
    height: 1205,
    alt: "Yasmin Blasi speaking on a panel at the parachute16 Digital Graduates Industry Meetup",
    caption: "parachute16 Digital Graduates Industry Meetup",
    frame: "aspect-[4/3] object-[center_22%]",
    span: "lg:col-span-7",
  },
  {
    src: "/assets/room/tedx.webp",
    width: 1600,
    height: 1111,
    alt: "Yasmin Blasi holding her TEDx Zarqa University award",
    caption: "TEDx Zarqa University",
    frame: "aspect-[4/3] object-[center_42%]",
    span: "lg:col-span-5",
  },
] as const;

const ROW = [
  {
    src: "/assets/room/mamlaka.webp",
    width: 900,
    height: 391,
    alt: "Yasmin Blasi during an interview on Al Mamlaka TV",
    caption: "Al Mamlaka TV",
    frame: "object-[center_45%]",
  },
  {
    src: "/assets/room/expo.webp",
    width: 540,
    height: 700,
    alt: "Yasmin Blasi, speaker at AI Expo",
    caption: "AI Expo, speaker",
    frame: "object-[center_18%]",
  },
  {
    src: "/assets/room/summit.webp",
    width: 420,
    height: 1080,
    alt: "Yasmin Blasi at the Impactful Minds Summit",
    caption: "Impactful Minds Summit",
    frame: "object-[center_12%]",
  },
] as const;

const bookCta =
  "inline-flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground select-none shadow-warm [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1),background-color_160ms_ease-out] hover:bg-primary-light hover:shadow-glow active:scale-[0.97] active:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function InTheRoom() {
  const { open } = useBookingModal();
  const containerRef = useScrollReveal<HTMLElement>({
    selector: ".reveal-on-scroll",
    staggerMs: 70,
  });

  return (
    <section
      id="talks"
      ref={containerRef}
      className="relative px-6 py-20 lg:py-28"
    >
      <div
        className="section-divider mx-auto mb-16 max-w-6xl opacity-50"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl">
        <div className="reveal-on-scroll max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.14em] text-secondary uppercase">
            In the room
          </p>
          <h2 className="font-accent mt-2 text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
            The same work, with the chairs turned around.
          </h2>
          <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted">
            I spend most of my days inside companies, with leaders and with
            people deciding what comes next. Some of that becomes a talk. Some
            of it becomes a workshop. Some of it is an hour with students who
            are about to send their first CV.
          </p>
        </div>

        <ul className="mt-10 max-w-3xl">
          {OFFERS.map((offer) => (
            <li
              key={offer.title}
              className="reveal-on-scroll border-t border-border py-7 first:border-t-0 first:pt-0"
            >
              <h3 className="font-accent text-2xl text-primary">{offer.title}</h3>
              <p className="mt-2 max-w-[62ch] leading-relaxed text-muted">
                {offer.body}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-4 lg:grid-cols-12 lg:items-start">
          {PAIR.map((photo) => (
            <figure
              key={photo.src}
              className={`reveal-on-scroll group flex flex-col overflow-hidden rounded-xl border border-secondary/35 bg-card shadow-card ${photo.span}`}
            >
              <div className="overflow-hidden">
                <img
                  src={withBasePath(photo.src)}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  className={`w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03] ${photo.frame}`}
                />
              </div>
              <figcaption className="px-4 py-3.5 text-sm leading-snug text-text-main">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {ROW.map((photo) => (
            <figure
              key={photo.src}
              className="reveal-on-scroll group flex flex-col overflow-hidden rounded-xl border border-secondary/35 bg-card shadow-card"
            >
              <div className="overflow-hidden">
                <img
                  src={withBasePath(photo.src)}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  className={`aspect-[3/4] w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03] ${photo.frame}`}
                />
              </div>
              <figcaption className="px-4 py-3.5 text-sm leading-snug text-text-main">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="reveal-on-scroll mt-12">
          <button
            type="button"
            id="talks-book"
            onClick={(e) => open(e.currentTarget)}
            className={bookCta}
          >
            <CalendarIcon className="size-4" aria-hidden="true" />
            <span>Book me to speak</span>
          </button>
        </div>
      </div>
    </section>
  );
}
