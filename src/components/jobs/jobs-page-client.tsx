"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchJobs, getCategories, type Job } from "@/lib/jobs";
import { useFocusRevalidate } from "@/hooks/use-focus-revalidate";
import { formatCategoryLabel } from "@/lib/yasmin/labels";
import { JobCard } from "@/components/jobs/job-card";
import { JobDetail } from "@/components/jobs/job-detail";
import {
  JobsEmptyState,
  JobsErrorState,
  JobsNotFoundState,
  JobsSkeletons,
} from "@/components/jobs/jobs-states";

function matchesQuery(job: Job, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    job.title,
    job.titleAr,
    job.companyName,
    job.location,
    job.shortDescription,
    job.category,
    formatCategoryLabel(job.category),
  ]
    .filter((part) => typeof part === "string" && part.trim())
    .join("\n")
    .toLowerCase();
  return haystack.includes(needle);
}

export function JobsPageClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("id");

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  const isMountedRef = useRef(true);
  const allJobsRef = useRef(allJobs);

  useEffect(() => {
    allJobsRef.current = allJobs;
  }, [allJobs]);

  useEffect(() => {
    isMountedRef.current = true;
    let cancelled = false;

    (async () => {
      try {
        const jobs = await fetchJobs({ bypassCache: retryKey > 0 });
        if (cancelled || !isMountedRef.current) return;
        setAllJobs(jobs);
        setError(false);
      } catch {
        if (cancelled || !isMountedRef.current) return;
        setAllJobs([]);
        setError(true);
      } finally {
        if (!cancelled && isMountedRef.current) {
          setLoading(false);
          setIsRetrying(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  function handleRetry() {
    setIsRetrying(true);
    setError(false);
    recordRun();
    setRetryKey((key) => key + 1);
  }

  const { recordRun } = useFocusRevalidate(async () => {
    try {
      const jobs = await fetchJobs({ bypassCache: true });
      if (!isMountedRef.current) return;
      setAllJobs(jobs);
      setError(false);
    } catch {
      // Resilience: keep existing open roles rendered if tab focus background fetch fails.
      if (!isMountedRef.current) return;
      if (allJobsRef.current.length === 0 && error) {
        // preserve current error state if we were already in an error state
      }
    }
  }, { cooldownMs: 60_000 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [slug]);

  const detailJob = slug
    ? loading
      ? undefined
      : (allJobs.find((job) => job.slug === slug) ?? null)
    : undefined;

  const categories = getCategories(allJobs);
  const filtered = allJobs.filter((job) => {
    if (activeCategory !== "all" && job.category !== activeCategory) return false;
    return matchesQuery(job, query);
  });
  const emptyMessage = query.trim()
    ? "No roles match that search."
    : activeCategory === "all"
      ? "Quiet on the board"
      : `Nothing in ${formatCategoryLabel(activeCategory)} just yet`;
  const countLabel =
    filtered.length === 1 ? "1 open role" : `${filtered.length} open roles`;

  return (
    <div key={slug || "directory"} className="job-view-transition">
      {!slug ? (
        <section className="bg-warm px-6 pt-6 pb-2 lg:pt-10">
          <div className="mx-auto max-w-5xl">
            <h1 className="font-accent text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
              Find Your Match
            </h1>
            <div className="mt-5 h-px w-12 bg-secondary" aria-hidden="true" />
            <p className="mt-5 max-w-[65ch] text-lg text-muted">
              Roles I&apos;m matching across the region. Search by role, city,
              or team.
            </p>
          </div>
        </section>
      ) : null}

      {slug ? (
        <section
          className="bg-warm px-6 py-10 lg:py-14"
          aria-label="Job details"
        >
          <div className="mx-auto max-w-5xl">
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
              <JobsErrorState onRetry={handleRetry} isRetrying={isRetrying} />
            ) : null}

            {!loading && !error && detailJob === null ? (
              <JobsNotFoundState />
            ) : null}

            {!loading && !error && detailJob ? (
              <JobDetail job={detailJob} />
            ) : null}
          </div>
        </section>
      ) : (
        <section
          className="bg-warm px-6 py-8 lg:py-12"
          aria-label="Job listings"
        >
          <div className="mx-auto max-w-5xl">
            {!loading && !error && allJobs.length > 0 ? (
              <>
                <div className="max-w-xl">
                  <label
                    htmlFor="job-search"
                    className="mb-2 block text-sm font-semibold text-text-main"
                  >
                    Search
                  </label>
                  <input
                    id="job-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Role, city, or company"
                    autoComplete="off"
                    enterKeyHint="search"
                    className="h-12 w-full rounded-full border border-primary/25 bg-card px-5 text-base text-text-main placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  />
                </div>

                <div
                  className="mt-6 flex flex-wrap gap-2"
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
                      {formatCategoryLabel(category)}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            <div className="mt-8" aria-label="Job listings grid" aria-live="polite">
              {loading ? <JobsSkeletons count={4} /> : null}

              {!loading && error ? (
                <JobsErrorState onRetry={handleRetry} isRetrying={isRetrying} />
              ) : null}

              {!loading && !error && filtered.length === 0 ? (
                <JobsEmptyState message={emptyMessage} />
              ) : null}

              {!loading && !error && filtered.length > 0 ? (
                <>
                  <p className="mb-2 text-sm text-muted">{countLabel}</p>
                  <div className="flex flex-col">
                    {filtered.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
