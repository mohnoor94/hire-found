"use client";

import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { YASMIN_NOTES, type YasminNote } from "@/lib/yasmin/notes";
import { useServicesTab } from "@/components/site/services-tab";
import { cn } from "@/lib/utils";

export function YasminNotes() {
  const shared = useServicesTab();
  const audience = shared?.tab ?? "employers";

  const notes = useMemo(
    () => YASMIN_NOTES.filter((n) => n.audience === audience),
    [audience],
  );

  return (
    <section id="yasmins-notes" className="bg-warm px-6 pt-12 pb-20 md:pt-16 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 md:mb-8">
          <h2 className="font-accent select-none text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
            Yasmin&apos;s Notes
          </h2>
          <p className="mt-3 max-w-[48rem] text-lg text-muted">
            Short advice from real posts: her words with a quick gloss.
          </p>
        </header>

        <NotesCarousel notes={notes} />
      </div>
    </section>
  );
}

function NotesCarousel({ notes }: { notes: YasminNote[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(dir: "prev" | "next") {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-note-card="true"]');
    const amount = card ? card.offsetWidth + 16 /* gap */ : el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div className="group relative">
        {/*
          On mobile: horizontal flex carousel with snap.
          On desktop: responsive grid. Use 1/2/3 columns based on note count to avoid awkward empty space.
        */}
        <div
          ref={scrollerRef}
          className={cn({
            // Mobile: horizontal snap carousel
            ["flex snap-x snap-mandatory overflow-x-auto -mx-6 px-6 gap-4 pb-4"]:
              true,
            // Desktop: grid with dynamic columns
            ["md:mx-0 md:px-0 md:grid md:gap-6 md:overflow-visible md:snap-none"]:
              true,
            ["md:grid-cols-1"]: notes.length === 1,
            ["md:grid-cols-2"]: notes.length === 2,
            ["md:grid-cols-3"]: notes.length >= 3,
          })}
          aria-label="Yasmin's advice notes"
        >
          {notes.map((note) => (
            <article
              key={note.id}
              data-note-card="true"
              className={cn(
                "card-surface shrink-0 snap-center rounded-2xl border border-border p-5 md:p-6",
                "min-w-[85%] sm:min-w-[70%] md:min-w-0",
              )}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {note.tag}
                </span>
                <a
                  href={note.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-primary underline decoration-primary/40 underline-offset-4"
                  aria-label="Open original post"
                >
                  View post <ExternalLink size={16} aria-hidden />
                </a>
              </div>

              <blockquote
                dir="rtl"
                lang="ar"
                className="text-pretty text-xl leading-8 text-foreground/90"
              >
                {note.ar}
              </blockquote>
              <p className="mt-3 text-sm leading-relaxed text-muted">{note.gloss}</p>
              <div className="mt-4 text-right text-sm text-muted" aria-hidden="true">
                سلام ✌🏼
              </div>
            </article>
          ))}
        </div>

        {/* Controls - hidden on md+ where we show a grid */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between md:hidden">
          <button
            type="button"
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-warm/95 text-primary shadow-sm"
            onClick={() => scrollByAmount("prev")}
            aria-label="Scroll previous"
          >
            <ChevronLeft size={20} aria-hidden />
          </button>
          <button
            type="button"
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-warm/95 text-primary shadow-sm"
            onClick={() => scrollByAmount("next")}
            aria-label="Scroll next"
          >
            <ChevronRight size={20} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

