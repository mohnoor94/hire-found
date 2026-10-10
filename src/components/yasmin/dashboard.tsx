"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "firebase/auth";
import type { Job } from "@/lib/jobs/types";
import { filterJobs } from "@/lib/jobs/filters";
import { formatCategoryLabel } from "@/lib/yasmin/labels";
import { GreetingCard } from "./greeting-card";
import { QuickLinks } from "./quick-links";
import { DashboardJobCard } from "./dashboard-job-card";
import { ReelsManager } from "./reels/reels-manager";
import { ButterflyMicro } from "@/components/illustrations/butterfly-micro";
import {
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

const DEBOUNCE_MS = 300;
const SKELETON_COUNT = 3;

const primaryButton =
  "inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-full bg-[#7A1E4A] px-5 text-sm font-semibold text-[#FCF9F5] shadow-[0_4px_14px_rgba(122,30,74,0.2)] select-none transition-all duration-150 ease-out hover:bg-[#5E1639] hover:shadow-[0_6px_20px_rgba(122,30,74,0.28)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

const quietButton =
  "inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-[#D4A574]/40 bg-white/90 px-5 text-sm font-semibold text-[#7A1E4A] shadow-xs select-none transition-all duration-150 ease-out hover:border-[#D4A574] hover:bg-[#FCF9F5] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const textButton =
  "inline-flex min-h-10 touch-manipulation items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[#7A1E4A] select-none transition-all duration-150 ease-out hover:bg-[#F3EBE3] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

const fieldClass =
  "h-11 w-full rounded-full border border-[#D4A574]/30 bg-white/95 px-4 text-sm text-[#2D2926] shadow-2xs placeholder:text-[#5E534C]/60 transition-all duration-150 ease-out focus:border-[#7A1E4A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1E4A]";

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
  reels?: import("@/lib/reels/types").Reel[];
  onNewReel?: () => void;
  onEditReel?: (reel: import("@/lib/reels/types").Reel) => void;
  onDeleteReel?: (reel: import("@/lib/reels/types").Reel) => void;
  onToggleReelActive?: (reel: import("@/lib/reels/types").Reel) => void;
  togglingReelId?: string | null;
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
  reels = [],
  onNewReel,
  onEditReel,
  onDeleteReel,
  onToggleReelActive,
  togglingReelId,
}: DashboardProps) {
  const [deskTab, setDeskTab] = useState<"opportunities" | "reels">("opportunities");
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
      ? "Gathering listings..."
      : "Refreshing listings..."
    : error && jobs.length === 0
      ? "Unable to load jobs"
      : jobs.length === filtered.length
        ? `${jobs.length} ${jobs.length === 1 ? "opportunity" : "opportunities"}`
        : `Showing ${filtered.length} of ${jobs.length}`;

  function clearFilters() {
    setSearchText("");
    setDebouncedSearch("");
    setCategory("all");
    setStatus("all");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-6">
      {/* Centerpiece Greeting Masthead */}
      <GreetingCard
        key={user.uid}
        user={user}
        activeJobsCount={activeCount}
        totalJobsCount={jobs.length}
      />

      {/* Quick Access */}
      <QuickLinks />

      {/* Studio Desk View Switcher */}
      <div className="mt-8 flex items-center justify-start border-b border-[#D4A574]/20 pb-4">
        <div
          role="tablist"
          aria-label="Studio Views"
          className="inline-flex rounded-full border border-[#D4A574]/25 bg-white/70 p-1 shadow-2xs backdrop-blur-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={deskTab === "opportunities"}
            onClick={() => setDeskTab("opportunities")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              deskTab === "opportunities"
                ? "bg-[#7A1E4A] text-white shadow-xs"
                : "text-[#5E534C] hover:text-[#7A1E4A]"
            }`}
          >
            <span>Curated Opportunities</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                deskTab === "opportunities"
                  ? "bg-white/20 text-white"
                  : "bg-[#F3EBE3] text-[#5E534C]"
              }`}
            >
              {jobs.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={deskTab === "reels"}
            onClick={() => setDeskTab("reels")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              deskTab === "reels"
                ? "bg-[#7A1E4A] text-white shadow-xs"
                : "text-[#5E534C] hover:text-[#7A1E4A]"
            }`}
          >
            <ButterflyMicro className="size-3.5" />
            <span>Featured Reels</span>
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-900">
              In progress
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                deskTab === "reels"
                  ? "bg-white/20 text-white"
                  : "bg-[#F3EBE3] text-[#5E534C]"
              }`}
            >
              {reels.length}
            </span>
          </button>
        </div>
      </div>

      {deskTab === "reels" ? (
        <ReelsManager
          reels={reels}
          loading={loading}
          onNewReel={onNewReel ?? (() => {})}
          onEditReel={onEditReel ?? (() => {})}
          onDeleteReel={onDeleteReel ?? (() => {})}
          onToggleActive={onToggleReelActive ?? (() => {})}
          togglingId={togglingReelId ?? null}
        />
      ) : (
        <>
          {/* Action Header & Curation Desk */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-accent text-2xl tracking-tight text-[#7A1E4A] sm:text-3xl">
                  Curated Opportunities
                </h2>
            <span className="rounded-full bg-[#7A1E4A]/10 px-2 py-0.5 text-xs font-medium text-[#7A1E4A]">
              {listLabel}
            </span>
          </div>
          <p className="mt-1 font-serif text-xs italic text-[#5E534C] sm:text-sm">
            Manage, publish, and shape live roles for exceptional leaders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className={textButton}
            title="Refresh listings"
          >
            <RefreshCw
              className={`size-3.5 ${loading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={onNewJob}
            title="Press N to create new job"
            className={primaryButton}
            aria-label="Create new job post"
            aria-keyshortcuts="N"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>New job</span>
            <kbd
              className="rounded border border-white/30 bg-white/10 px-1.5 py-0.5 font-sans text-[10px] leading-none font-medium text-white/90"
              aria-hidden="true"
            >
              N
            </kbd>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 rounded-2xl border border-[#D4A574]/25 bg-white/80 p-4 shadow-xs backdrop-blur-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Status Pills */}
          <div
            className="flex flex-wrap items-center gap-1.5"
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

          {/* Search & Category Inputs */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative min-w-[220px] sm:w-64">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5E534C]/50"
                aria-hidden="true"
              />
              <input
                id="listing-search"
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Title, company, or location..."
                autoComplete="off"
                enterKeyHint="search"
                className={`${fieldClass} pl-9`}
              />
            </div>

            <div className="sm:w-48">
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
        </div>
      </div>

      {/* Error alert if refresh failed */}
      {error && jobs.length > 0 ? (
        <div
          role="alert"
          className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-xs text-rose-900 sm:text-sm">
            Couldn&apos;t refresh listings right now. Showing the last copy that loaded.
          </p>
          <button type="button" onClick={onRefresh} className={quietButton}>
            Retry
          </button>
        </div>
      ) : null}

      {/* Job list container */}
      <div className="mt-4" aria-busy={loading}>
        {showSkeleton ? (
          <div aria-hidden="true" className="space-y-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-[#D4A574]/20 bg-white/70 p-6"
              >
                <div className="h-6 w-2/5 rounded-md bg-[#F3EBE3]" />
                <div className="mt-3 h-3 w-1/3 rounded-md bg-[#F3EBE3]" />
                <div className="mt-4 h-4 w-1/4 rounded-md bg-[#F3EBE3]/70" />
              </div>
            ))}
          </div>
        ) : null}

        {!showSkeleton && error && jobs.length === 0 ? (
          <div
            className="rounded-3xl border border-[#D4A574]/30 bg-white/80 p-10 text-center shadow-xs"
            role="alert"
          >
            <h3 className="font-accent text-2xl text-[#7A1E4A]">
              Couldn&apos;t load listings
            </h3>
            <p className="mx-auto mt-2 max-w-[42ch] text-sm leading-relaxed text-[#5E534C]">
              Check the connection and try again.
            </p>
            <button
              type="button"
              onClick={onRefresh}
              className={`${primaryButton} mt-6`}
            >
              Retry
            </button>
          </div>
        ) : null}

        {!showSkeleton && !error && filtered.length === 0 ? (
          <div className="rounded-3xl border border-[#D4A574]/30 bg-white/80 p-10 text-center shadow-xs">
            <span className="text-3xl" aria-hidden="true">
              ✨
            </span>
            <h3 className="mt-3 font-accent text-2xl text-[#7A1E4A]">
              {jobs.length === 0 ? "No listings yet" : "No listings match"}
            </h3>
            <p className="mx-auto mt-2 max-w-[42ch] text-sm leading-relaxed text-[#5E534C]">
              {jobs.length === 0
                ? "Your canvas is waiting, Yasmin. Ready to open a new door for someone? Press N to begin."
                : "Try another keyword, or clear your search filters."}
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
              <button
                type="button"
                onClick={clearFilters}
                className={`${quietButton} mt-6`}
              >
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
        </>
      )}

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
      className={`inline-flex touch-manipulation items-center rounded-full px-3.5 py-1 text-xs font-semibold select-none transition-all duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        pressed
          ? "bg-[#7A1E4A] text-white shadow-xs"
          : "border border-[#D4A574]/30 bg-[#FCF9F5] text-[#5E534C] hover:border-[#D4A574] hover:bg-white hover:text-[#7A1E4A]"
      }`}
    >
      <span>{label}</span>
      <span
        className={`ms-1.5 rounded-full px-1.5 py-0.2 text-[10px] tabular-nums font-bold ${
          pressed
            ? "bg-white/20 text-white"
            : "bg-[#F3EBE3] text-[#5E534C]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export default YasminDashboard;
