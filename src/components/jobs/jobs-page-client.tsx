"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchJobs,
  filterByCategory,
  getCategories,
  type Job,
} from "@/lib/jobs";
import { JobCard } from "@/components/jobs/job-card";
import { JobDetail } from "@/components/jobs/job-detail";
import {
  JobsEmptyState,
  JobsErrorState,
  JobsNotFoundState,
  JobsSkeletons,
} from "@/components/jobs/jobs-states";

export function JobsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("id");

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const jobs = await fetchJobs();
        if (cancelled) return;
        setAllJobs(jobs);
        setError(false);
      } catch {
        if (cancelled) return;
        setAllJobs([]);
        setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  function handleRetry() {
    setLoading(true);
    setError(false);
    setRetryKey((key) => key + 1);
  }

  function backToListing() {
    setActiveCategory("all");
    router.push("/jobs/");
  }

  const detailJob = slug
    ? loading
      ? undefined
      : (allJobs.find((job) => job.slug === slug) ?? null)
    : undefined;

  const categories = getCategories(allJobs);
  const filtered = filterByCategory(allJobs, activeCategory);
  const emptyMessage =
    activeCategory === "all"
      ? "No open roles available right now."
      : `No jobs available in ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}.`;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-warm to-warm-dark/40 px-6 py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 right-20 size-40 rounded-full bg-secondary/[0.04] blur-3xl" />
          <div className="absolute bottom-10 left-1/4 size-32 rounded-full bg-primary/[0.03] blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h1 className="font-accent mb-4 text-4xl font-bold text-primary md:text-5xl lg:text-6xl">
            Find Your Match
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            Browse open roles I&apos;m currently hiring for. Your next career
            move might be one click away.
          </p>
        </div>
      </section>

      {slug ? (
        <section
          className="bg-warm px-6 py-12 lg:py-16"
          aria-label="Job details"
        >
          <div className="mx-auto max-w-3xl px-4">
            {loading || detailJob === undefined ? (
              <div className="flex justify-center py-16">
                <div
                  className="size-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary"
                  role="status"
                  aria-label="Loading job"
                />
              </div>
            ) : null}

            {!loading && error ? (
              <JobsErrorState onRetry={handleRetry} />
            ) : null}

            {!loading && !error && detailJob === null ? (
              <JobsNotFoundState onBack={backToListing} />
            ) : null}

            {!loading && !error && detailJob ? (
              <JobDetail job={detailJob} onBack={backToListing} />
            ) : null}
          </div>
        </section>
      ) : (
        <section
          className="bg-warm px-6 py-12 lg:py-16"
          aria-label="Job listings"
        >
          <div className="mx-auto max-w-5xl">
            {!loading && !error && allJobs.length > 0 ? (
              <div
                className="mb-10 flex flex-wrap justify-center gap-2"
                role="group"
                aria-label="Filter jobs by category"
              >
                <button
                  type="button"
                  className={`filter-pill ${activeCategory === "all" ? "active" : ""}`}
                  aria-label="Show all jobs"
                  aria-pressed={activeCategory === "all"}
                  onClick={() => setActiveCategory("all")}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`filter-pill ${activeCategory === category ? "active" : ""}`}
                    aria-label={`Filter by ${category}`}
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            ) : null}

            <div aria-label="Job listings grid" aria-live="polite">
              {loading ? <JobsSkeletons count={4} /> : null}

              {!loading && error ? (
                <JobsErrorState onRetry={handleRetry} />
              ) : null}

              {!loading && !error && filtered.length === 0 ? (
                <JobsEmptyState message={emptyMessage} />
              ) : null}

              {!loading && !error && filtered.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {filtered.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
