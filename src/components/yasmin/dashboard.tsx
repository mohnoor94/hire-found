"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "firebase/auth";
import type { Job } from "@/lib/jobs/types";
import { filterJobs } from "@/lib/jobs/filters";
import { formatCategoryLabel } from "@/lib/yasmin/labels";
import { GreetingCard } from "./greeting-card";
import { QuickLinks } from "./quick-links";
import { DashboardJobCard } from "./dashboard-job-card";
import { Input } from "@/components/ui/input";

const DEBOUNCE_MS = 300;
const SKELETON_COUNT = 6;

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
  const [status, setStatus] = useState("all");
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

  const activeCount = jobs.filter((j) => j.isActive === true).length;
  const countLabel =
    jobs.length === filtered.length
      ? `${activeCount} active of ${jobs.length}`
      : `${filtered.length} of ${jobs.length}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <GreetingCard key={user.uid} user={user} />
      <QuickLinks />

      <div className="dashboard-header mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-accent text-xl font-bold text-text-main">
            Your Listings
          </h2>
          <span className="inline-flex items-center rounded-full bg-butterfly-lavender/15 px-2.5 py-0.5 text-xs font-medium text-[#7C3AED]">
            {loading ? "Loading..." : error ? "Unable to load jobs" : countLabel}
          </span>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#6B6560] transition-all duration-200 hover:bg-gray-100 hover:text-text-main"
            aria-label="Refresh job listings"
            title="Refresh"
          >
            <RefreshIcon />
          </button>
        </div>
        <button
          type="button"
          onClick={onNewJob}
          title="Press N to create new job"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-warm transition-all duration-300 hover:bg-butterfly-rose hover:text-text-main sm:ml-auto"
          aria-label="Create new job post"
        >
          <PlusIcon className="mr-2" />
          New Job
        </button>
      </div>

      <div className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#6B6560]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by title, company, or location..."
              aria-label="Search jobs"
              className="min-h-[44px] rounded-xl border-gray-200 bg-white pr-4 pl-10 focus-visible:border-butterfly-lavender focus-visible:ring-butterfly-lavender/30"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="min-h-[44px] min-w-[44px] cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all duration-200 focus:border-butterfly-lavender focus:ring-2 focus:ring-butterfly-lavender/30 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategoryLabel(cat)}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
            className="min-h-[44px] min-w-[44px] cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all duration-200 focus:border-butterfly-lavender focus:ring-2 focus:ring-butterfly-lavender/30 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-card"
              aria-hidden="true"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-5 w-9 rounded-full bg-gray-200" />
              </div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-5 w-20 rounded-full bg-gray-200" />
                <div className="h-4 w-14 rounded bg-gray-200" />
              </div>
              <div className="mb-4 space-y-2">
                <div className="h-3 w-2/3 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                <div className="h-8 w-16 rounded-lg bg-gray-200" />
                <div className="h-8 w-16 rounded-lg bg-gray-200" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="mb-1 text-base font-semibold text-text-main">
              Failed to load jobs
            </h3>
            <p className="mb-6 max-w-xs text-sm text-[#6B6560]">
              Something went wrong while fetching job posts. Please check your
              connection and try again.
            </p>
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-warm transition-all duration-300 hover:bg-[#E879A8]"
            >
              <RefreshIcon className="mr-2" />
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-warm-dark">
              <svg className="h-10 w-10 text-butterfly-lavender/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mb-1 text-base font-semibold text-text-main">
              No jobs found
            </h3>
            <p className="mb-6 max-w-xs text-sm text-[#6B6560]">
              No job posts match your current filters. Try adjusting your search
              or create a new listing.
            </p>
            <button
              type="button"
              onClick={onNewJob}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-warm transition-all duration-300 hover:bg-[#E879A8]"
            >
              <PlusIcon className="mr-2" />
              Create New Job
            </button>
          </div>
        ) : (
          filtered.map((job) => (
            <DashboardJobCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
              togglingId={togglingId}
            />
          ))
        )}
      </div>
    </div>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 ${className || ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 ${className || ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
    </svg>
  );
}
