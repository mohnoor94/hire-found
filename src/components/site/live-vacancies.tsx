"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchJobs, getCategories, type Job } from "@/lib/jobs";
import { formatCategoryLabel } from "@/lib/yasmin/labels";
import { useBookingModal } from "@/components/site/cal-dialog";
import { useServicesTab } from "@/components/site/services-tab";
import { JobCard } from "@/components/jobs/job-card";
import { useI18n } from "@/components/site/i18n";

export function LiveVacancies() {
  const t = useI18n();
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
            {t.liveVacancies.heading}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted">
            {t.liveVacancies.subheading}
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
                {cat === "all" ? t.liveVacancies.all : formatCategoryLabel(cat)}
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
            <div className="flex flex-col items-start px-0 py-16">
              <p className="mb-2 text-lg font-semibold text-text-main">
                {category === "all"
                  ? t.liveVacancies.noneAll
                  : t.liveVacancies.noneCategoryPattern.replace(
                      "{category}",
                      formatCategoryLabel(category),
                    )}
              </p>
              <p className="mb-8 max-w-md text-sm text-muted">
                {t.liveVacancies.interest}
              </p>
              <div className="flex flex-col items-start gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={(e) => open(e.currentTarget)}
                  className="inline-flex min-h-12 touch-manipulation cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground select-none active:bg-primary-dark"
                  aria-label="Book a call with Yasmin"
                >
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  {t.liveVacancies.bookCall}
                </button>
                <a
                  href="https://wa.me/962793001043?text=Hi%20Yasmin!%20I'm%20interested%20in%20job%20opportunities."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 touch-manipulation items-center gap-2 rounded-full border border-primary/30 px-6 text-sm font-semibold text-primary select-none active:bg-primary/10"
                  aria-label="Contact via WhatsApp"
                >
                  <svg
                    className="size-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t.liveVacancies.whatsapp}
                </a>
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-start py-12">
              <p className="mb-2 text-lg font-semibold text-text-main">
                Jobs temporarily unavailable
              </p>
              <p className="mb-6 max-w-md text-sm text-muted">
                We&apos;re having trouble loading jobs right now. Reach out
                directly. I&apos;d love to hear from you.
              </p>
              <div className="flex flex-col items-start gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={(e) => open(e.currentTarget)}
                  className="inline-flex min-h-12 touch-manipulation cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground select-none active:bg-primary-dark"
                  aria-label="Book a call with Yasmin"
                >
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  Book a Call
                </button>
                <a
                  href="https://wa.me/962793001043?text=Hi%20Yasmin!%20I'm%20interested%20in%20job%20opportunities."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 touch-manipulation items-center gap-2 rounded-full border border-primary/30 px-6 text-sm font-semibold text-primary select-none active:bg-primary/10"
                  aria-label="Contact via WhatsApp"
                >
                  <svg
                    className="size-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>

        {jobs && jobs.length > 0 && (
          <div className="mt-10">
            <Link
              href="/jobs/"
              className="inline-flex min-h-12 touch-manipulation items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground select-none active:bg-primary-dark"
            >
              {/* Keep English here for consistency, not critical to translate */}
              View All Open Roles
            </Link>
          </div>
        )}

        <div className="mt-16 max-w-xl border-t border-secondary pt-10">
          <h3 className="font-accent text-2xl text-primary">
            {t.liveVacancies.bridgeHeading}
          </h3>
          <p className="mt-3 max-w-[42rem] text-sm leading-relaxed text-muted">
            {t.liveVacancies.bridgeBody}
          </p>
          <a
            href="#services"
            className="career-bridge mt-5 inline-flex min-h-11 touch-manipulation items-center text-sm font-semibold text-primary underline decoration-primary/40 underline-offset-4"
            onClick={() => servicesTab?.setTab("candidates")}
          >
            {t.liveVacancies.bridgeCta}
          </a>
        </div>
      </div>
    </section>
  );
}
