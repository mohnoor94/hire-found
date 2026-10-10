"use client";

import Link from "next/link";
import { VacanciesEmptyIllustration } from "@/components/jobs/vacancies-empty-illustration";
import {
  LoupeSearchEmptyIllustration,
  FolderArchivedJobIllustration,
  BoardPauseIllustration,
} from "@/components/illustrations";
import { RefreshCwIcon } from "lucide-react";

const primaryAction =
  "inline-flex min-h-12 touch-manipulation cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground select-none active:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type JobsEmptyStateProps = {
  message: string;
};

export function JobsEmptyState({ message }: JobsEmptyStateProps) {
  const isSearchFilter =
    message.toLowerCase().includes("search") ||
    message.toLowerCase().includes("match");

  return (
    <div className="flex flex-col items-start py-10">
      {isSearchFilter ? (
        <LoupeSearchEmptyIllustration width={140} height={122} />
      ) : (
        <VacanciesEmptyIllustration />
      )}
      <p className="mt-6 mb-2 text-lg font-semibold text-text-main">{message}</p>
      <p className="max-w-[65ch] text-sm leading-relaxed text-muted">
        {isSearchFilter
          ? "Try a different search term or clear filters to see all live openings."
          : "New openings show up here as they come in. Check back soon."}
      </p>
    </div>
  );
}

type JobsErrorStateProps = {
  onRetry: () => void;
  isRetrying?: boolean;
};

export function JobsErrorState({
  onRetry,
  isRetrying = false,
}: JobsErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="my-4 rounded-2xl border border-secondary/35 bg-card/40 p-2 shadow-xs"
    >
      <div className="flex flex-col items-center justify-center rounded-xl border border-secondary/30 bg-card/80 px-6 py-12 text-center backdrop-blur-xs">
        <div className="mb-5 flex justify-center">
          <BoardPauseIllustration width={140} height={122} />
        </div>
        <h3 className="font-accent text-2xl text-primary text-balance">
          The board is taking a breath
        </h3>
        <p className="mt-2 max-w-[50ch] text-sm leading-relaxed text-muted text-pretty">
          We are having trouble connecting to live roles right now. Give it a moment, or try checking again below.
        </p>
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-6 inline-flex min-h-11 touch-manipulation cursor-pointer items-center justify-center gap-2 rounded-full border border-primary/25 bg-warm px-6 text-sm font-semibold text-primary shadow-xs transition-all duration-200 hover:border-primary/40 hover:bg-card active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 select-none"
          aria-label={isRetrying ? "Checking for open roles" : "Check again for open roles"}
        >
          <RefreshCwIcon
            className={`size-4 transition-transform ${isRetrying ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          <span>{isRetrying ? "Checking..." : "Check again"}</span>
        </button>
      </div>
    </div>
  );
}

export function JobsNotFoundState() {
  return (
    <div className="flex flex-col items-start py-10">
      <div className="mb-6">
        <FolderArchivedJobIllustration width={140} height={122} />
      </div>
      <h1 className="font-accent mb-2 text-3xl text-primary">Job Not Found</h1>
      <p className="mb-8 max-w-[65ch] text-sm leading-relaxed text-muted">
        This role is no longer available or may have been removed. Browse the
        current openings.
      </p>
      <Link
        href="/jobs/"
        className={primaryAction}
        aria-label="Back to all job listings"
        data-back-link="true"
      >
        View all jobs
      </Link>
    </div>
  );
}

export function JobsSkeletons({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse border-t border-secondary py-7">
          <div className="h-7 w-2/3 rounded bg-warm-dark" />
          <div className="mt-3 h-4 w-full max-w-md rounded bg-warm-dark" />
          <div className="mt-4 h-3 w-48 rounded bg-warm-dark" />
        </div>
      ))}
    </div>
  );
}
