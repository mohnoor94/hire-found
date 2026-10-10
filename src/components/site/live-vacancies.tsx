"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchJobs, getCategories, type Job } from "@/lib/jobs";
import { formatCategoryLabel } from "@/lib/yasmin/labels";
import { JobCard } from "@/components/jobs/job-card";
import { VacanciesEmptyIllustration } from "@/components/jobs/vacancies-empty-illustration";
import { ArrowUpRightIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function LiveVacancies() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("all");
  const containerRef = useScrollReveal<HTMLElement>({
    selector: ".reveal-on-scroll",
    staggerMs: 60,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchJobs({ limit: 4 });
        if (!cancelled) {
          setJobs(list);
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setJobs([]);
          setError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = ["all", ...getCategories(jobs || [])];
  const filtered =
    category === "all"
      ? jobs || []
      : (jobs || []).filter((j) => j.category === category);

  return (
    <section
      id="vacancies"
      ref={containerRef}
      className="relative px-6 py-20 lg:py-28"
    >
      <div className="section-divider mx-auto mb-16 max-w-5xl opacity-50" aria-hidden="true" />
      <div className="mx-auto max-w-5xl">
        <div className="reveal-on-scroll mb-10">
          <h2 className="font-accent text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
            Find Your Match
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Roles I&apos;m actively matching for. If one feels right, let&apos;s talk.
          </p>
        </div>

        {jobs && jobs.length > 0 && categories.length > 1 && (
          <div
            className="mb-8 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter jobs by category"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={category === cat}
                className={`filter-pill ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat === "all" ? "All" : formatCategoryLabel(cat)}
              </button>
            ))}
          </div>
        )}

        <div id="vacancy-grid">
          {jobs === null && (
            <div
              className="flex flex-col"
              aria-busy="true"
              aria-label="Loading open roles"
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="mb-3 animate-pulse rounded-xl border border-secondary/25 bg-card/50 p-6 last:mb-0"
                >
                  <div className="mb-3 h-4 w-24 rounded-full bg-warm-dark" />
                  <div className="h-7 w-2/3 rounded-md bg-warm-dark" />
                  <div className="mt-3 h-4 w-full max-w-md rounded bg-warm-dark" />
                  <div className="mt-4 h-3 w-40 rounded bg-warm-dark" />
                </div>
              ))}
            </div>
          )}

          {jobs && !error && filtered.length > 0 && (
            <div className="flex flex-col">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {jobs && !error && filtered.length === 0 && (
            <div className="my-2 rounded-2xl border border-secondary/35 bg-card/40 p-2 shadow-xs">
              <div className="flex flex-col items-center justify-center rounded-xl border border-secondary/30 bg-card/80 px-6 py-12 text-center backdrop-blur-xs">
                <div className="mb-5 flex justify-center">
                  <VacanciesEmptyIllustration />
                </div>
                <h3 className="font-accent text-2xl text-primary">
                  {category === "all"
                    ? "Quiet on the board"
                    : `Nothing in ${formatCategoryLabel(category)} just yet`}
                </h3>
                <p className="mt-2 max-w-[50ch] text-sm leading-relaxed text-muted">
                  {category === "all"
                    ? "New openings show up here as they come in. Check back soon."
                    : `There are currently no active openings filed under ${formatCategoryLabel(category)}.`}
                </p>
                {category !== "all" && (
                  <button
                    type="button"
                    onClick={() => setCategory("all")}
                    className="mt-5 inline-flex min-h-10 touch-manipulation cursor-pointer items-center justify-center rounded-full border border-primary/25 bg-warm px-5 text-xs font-semibold text-primary transition-all duration-200 hover:border-primary/40 hover:bg-card active:scale-[0.98]"
                  >
                    Show all active roles
                  </button>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="my-2 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8">
              <p className="mb-2 text-lg font-semibold text-text-main">
                Jobs temporarily unavailable
              </p>
              <p className="max-w-md text-sm text-muted">
                We are having trouble loading open roles right now. Please refresh the page or check back shortly.
              </p>
            </div>
          )}
        </div>

        {/* Permanently rendered directory link bar across all states */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-secondary/30 pt-8 sm:flex-row sm:items-center">
          <p className="max-w-md text-sm text-muted">
            Looking for a different role or city? Browse the full directory.
          </p>
          <Link
            href="/jobs/"
            className="group inline-flex min-h-12 shrink-0 touch-manipulation items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-warm transition-all duration-200 hover:bg-primary-light hover:shadow-glow active:scale-[0.98] active:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary select-none"
          >
            <span>View All Open Roles</span>
            <ArrowUpRightIcon
              className="size-4 opacity-80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
