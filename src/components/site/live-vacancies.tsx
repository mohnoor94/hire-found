"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { fetchJobs, getCategories, type Job } from "@/lib/jobs";
import { formatCategoryLabel } from "@/lib/yasmin/labels";
import { useBookingModal } from "@/components/site/cal-dialog";
import { useServicesTab } from "@/components/site/services-tab";
import { JobCard } from "@/components/jobs/job-card";

export function LiveVacancies() {
  const { open } = useBookingModal();
  const servicesTab = useServicesTab();
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("all");

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
      className="bg-warm px-6 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h2 className="font-accent text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
            Find Your Match
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Open roles I&apos;m hiring for right now. Something catch your eye?
            Let&apos;s talk.
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
                <div key={i} className="animate-pulse border-t border-secondary py-7">
                  <div className="h-7 w-2/3 rounded bg-warm-dark" />
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
            <div className="flex flex-col items-start px-0 py-12">
              <p className="mb-2 text-lg font-semibold text-text-main">
                {category === "all"
                  ? "No open roles right now"
                  : `No jobs available in ${formatCategoryLabel(category)}`}
              </p>
              <p className="max-w-md text-sm text-muted">
                New roles are posted as client mandates open. Check back soon or select another category above.
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-start py-12">
              <p className="mb-2 text-lg font-semibold text-text-main">
                Jobs temporarily unavailable
              </p>
              <p className="max-w-md text-sm text-muted">
                We are having trouble loading open roles right now. Please refresh the page or check back shortly.
              </p>
            </div>
          )}
        </div>

        {jobs && jobs.length > 0 && (
          <div className="mt-10">
            <Link
              href="/jobs/"
              className="inline-flex min-h-12 touch-manipulation items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground select-none active:bg-primary-dark"
            >
              View All Open Roles
            </Link>
          </div>
        )}

        <div className="mt-16 max-w-xl border-t border-secondary pt-10">
          <h3 className="font-accent text-2xl text-primary">
            Need to fill a role like one of these?
          </h3>
          <p className="mt-3 max-w-[42rem] text-sm leading-relaxed text-muted">
            I partner directly with founders and hiring teams to recruit and
            assess leadership talent across Jordan and the Gulf.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="vacancies-hire-talent"
              onClick={(e) => open(e.currentTarget)}
              className="inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground select-none transition-all duration-200 hover:bg-primary-light active:bg-primary-dark shadow-warm"
            >
              <CalendarIcon className="size-4" aria-hidden="true" />
              <span>Hire with Yasmin</span>
            </button>
            <a
              href="#services"
              className="career-bridge inline-flex min-h-11 touch-manipulation items-center text-sm font-semibold text-primary underline decoration-primary/40 underline-offset-4"
            >
              View Employer Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
