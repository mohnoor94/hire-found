"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { YASMIN_NOTES, type YasminNote } from "@/lib/yasmin/notes";
import { cn } from "@/lib/utils";

export function YasminNotes() {
  return (
    <section
      id="yasmins-notes"
      className="bg-warm px-6 pt-8 pb-20 lg:pt-10 lg:pb-28"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-accent bg-transparent text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
          Yasmin&apos;s Notes
        </h2>
        <p className="mt-4 max-w-[36rem] text-lg text-muted">
          Short advice from real posts: her words, with a quick gloss.
        </p>

        <NotesCarousel notes={YASMIN_NOTES} />

        <p
          className="mt-6 text-end text-sm text-muted/80"
          lang="ar"
          dir="rtl"
        >
          سلام ✌🏼
        </p>
      </div>
    </section>
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function NotesCarousel({ notes }: { notes: readonly YasminNote[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(dir: "prev" | "next") {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-note-card]");
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({
      left: dir === "next" ? amount : -amount,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  return (
    <div className="relative mt-10">
      <div
        ref={scrollerRef}
        data-notes-scroller=""
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2",
          "scroll-smooth motion-reduce:scroll-auto",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 md:snap-none",
        )}
        aria-label="Yasmin's advice notes"
      >
        {notes.map((note) => (
          <article
            key={note.id}
            data-note-card=""
            className={cn(
              "card-surface w-[min(85vw,22rem)] shrink-0 snap-center rounded-2xl border border-border p-5",
              "md:w-auto md:min-w-0 md:p-6",
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
              >
                {note.url.includes("/feed/update/")
                  ? "View post"
                  : "See on LinkedIn"}
                <ExternalLink size={16} aria-hidden />
              </a>
            </div>

            <blockquote
              dir="rtl"
              lang="ar"
              className="text-pretty text-xl leading-8 text-text-main"
            >
              {note.ar}
            </blockquote>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {note.gloss}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-2 md:hidden">
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-warm text-primary shadow-sm"
          onClick={() => scrollByAmount("prev")}
          aria-label="Previous notes"
        >
          <ChevronLeft size={20} aria-hidden />
        </button>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-warm text-primary shadow-sm"
          onClick={() => scrollByAmount("next")}
          aria-label="Next notes"
        >
          <ChevronRight size={20} aria-hidden />
        </button>
      </div>
    </div>
  );
}
