"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "firebase/auth";
import type { Job } from "@/lib/jobs/types";
import { filterJobs } from "@/lib/jobs/filters";
import { formatCategoryLabel } from "@/lib/yasmin/labels";
import { GreetingCard } from "./greeting-card";
import { QuickLinks } from "./quick-links";
import { DashboardJobCard } from "./dashboard-job-card";

const DEBOUNCE_MS = 300;
const SKELETON_COUNT = 4;

const primaryButton =
  "inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground select-none active:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

const quietButton =
  "inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-primary/25 bg-white px-5 text-sm font-semibold text-primary select-none active:bg-warm-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const textButton =
  "inline-flex min-h-11 touch-manipulation items-center px-3 text-sm font-semibold text-primary select-none active:bg-warm-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

const fieldClass =
  "h-12 w-full rounded-full border border-primary/25 bg-white px-5 text-base text-text-main placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type DashboardProps = {
  user: User;
  jobs: Job[];
  loading: boolean;
  error: boolean;
  onRefresh: () => void;
  onNewJob: () => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onToggleActive: (job: Job) => void;
  togglingId: string | null;
};

type StatusFilter = "all" | "active" | "inactive";

export function YasminDashboard({
  user,
  jobs,
  loading,
  error,
  onRefresh,
  onNewJob,
  onEdit,
  onDelete,
  onToggleActive,
  togglingId,
}: DashboardProps) {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText]);

  const categories = useMemo(() => {
    return [...new Set(jobs.map((j) => j.category).filter(Boolean))].sort() as string[];
  }, [jobs]);

  const filtered = useMemo(
    () =>
      filterJobs(jobs, {
        searchText: debouncedSearch,
        category,
        status,
      }),
    [jobs, debouncedSearch, category, status],
  );

  const activeCount = jobs.filter((job) => job.isActive !== false).length;
  const inactiveCount = jobs.length - activeCount;
  const showSkeleton = loading && jobs.length === 0 && !error;

  const listLabel = loading
    ? jobs.length === 0
      ? "Loading listings"
      : "Refreshing listings"
    : error && jobs.length === 0
      ? "Unable to load jobs"
      : jobs.length === filtered.length
        ? `${jobs.length} ${jobs.length === 1 ? "listing" : "listings"}`
        : `Showing ${filtered.length} of ${jobs.length}`;

  function clearFilters() {
    setSearchText("");
    setDebouncedSearch("");
    setCategory("all");
    setStatus("all");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))] sm:pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <GreetingCard key={user.uid} user={user} />
        <button
          type="button"
          onClick={onNewJob}
          title="Press N to create new job"
          className={`${primaryButton} shrink-0`}
          aria-label="Create new job post"
          aria-keyshortcuts="N"
        >
          New job
          <kbd
            className="rounded border border-primary-foreground/40 px-1.5 py-0.5 font-sans text-[11px] leading-none font-medium"
            aria-hidden="true"
          >
            N
          </kbd>
        </button>
      </div>

      <div
        className="mt-5 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by status"
      >
        <StatusFilterPill
          count={jobs.length}
          label="All"
          pressed={status === "all"}
          onClick={() => setStatus("all")}
        />
        <StatusFilterPill
          count={activeCount}
          label="Active"
          pressed={status === "active"}
          onClick={() => setStatus("active")}
        />
        <StatusFilterPill
          count={inactiveCount}
          label="Inactive"
          pressed={status === "inactive"}
          onClick={() => setStatus("inactive")}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="listing-search"
            className="mb-2 block text-sm font-semibold text-text-main"
          >
            Search
          </label>
          <input
            id="listing-search"
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Title, company, or location"
            autoComplete="off"
            enterKeyHint="search"
            className={fieldClass}
          />
        </div>
        <div className="lg:w-56">
          <label
            htmlFor="listing-category"
            className="mb-2 block text-sm font-semibold text-text-main"
          >
            Category
          </label>
          <select
            id="listing-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={`${fieldClass} cursor-pointer`}
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategoryLabel(cat)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-accent text-2xl text-primary">Listings</h2>
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {listLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className={textButton}
        >
          Refresh
        </button>
      </div>

      {error && jobs.length > 0 ? (
        <div
          role="alert"
          className="mt-4 flex flex-col items-start gap-3 border border-primary/20 bg-warm-dark px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-text-main">
            Couldn&apos;t refresh listings. Showing the last copy that loaded.
          </p>
          <button type="button" onClick={onRefresh} className={quietButton}>
            Retry
          </button>
        </div>
      ) : null}

      <div className="mt-2" aria-busy={loading}>
        {showSkeleton ? (
          <div aria-hidden="true">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div key={index} className="animate-pulse border-t border-secondary py-5">
                <div className="h-6 w-2/5 rounded-sm bg-warm-dark" />
                <div className="mt-3 h-3 w-1/3 rounded-sm bg-warm-dark" />
              </div>
            ))}
          </div>
        ) : null}

        {!showSkeleton && error && jobs.length === 0 ? (
          <div className="border-t border-secondary py-10" role="alert">
            <h3 className="font-accent text-2xl text-primary">
              Couldn&apos;t load listings
            </h3>
            <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted">
              Check the connection and try again.
            </p>
            <button type="button" onClick={onRefresh} className={`${primaryButton} mt-6`}>
              Retry
            </button>
          </div>
        ) : null}

        {!showSkeleton && !error && filtered.length === 0 ? (
          <div className="border-t border-secondary py-10">
            <h3 className="font-accent text-2xl text-primary">
              {jobs.length === 0 ? "No listings yet" : "No listings match"}
            </h3>
            <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted">
              {jobs.length === 0
                ? "Publish a role and it shows up here. Press N anytime."
                : "Try another search, or clear the filters."}
            </p>
            {jobs.length === 0 ? (
              <button
                type="button"
                onClick={onNewJob}
                className={`${primaryButton} mt-6`}
              >
                New job
              </button>
            ) : (
              <button type="button" onClick={clearFilters} className={`${quietButton} mt-6`}>
                Clear filters
              </button>
            )}
          </div>
        ) : null}

        {!showSkeleton && !(error && jobs.length === 0) && filtered.length > 0
          ? filtered.map((job) => (
              <DashboardJobCard
                key={job.id}
                job={job}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
                togglingId={togglingId}
              />
            ))
          : null}
      </div>

      <QuickLinks />
    </div>
  );
}

function StatusFilterPill({
  count,
  label,
  pressed,
  onClick,
}: {
  count: number;
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      data-status={label.toLowerCase()}
      onClick={onClick}
      className={`filter-pill ${pressed ? "active" : ""}`}
    >
      {label}
      <span className="ms-1.5 tabular-nums opacity-70">{count}</span>
    </button>
  );
}
