"use client";

import Link from "next/link";
import { VacanciesEmptyIllustration } from "@/components/jobs/vacancies-empty-illustration";

const primaryAction =
  "inline-flex min-h-12 touch-manipulation cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground select-none active:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type JobsEmptyStateProps = {
  message: string;
};

export function JobsEmptyState({ message }: JobsEmptyStateProps) {
  return (
    <div className="flex flex-col items-start py-10">
      <VacanciesEmptyIllustration />
      <p className="mt-6 mb-2 text-lg font-semibold text-text-main">{message}</p>
      <p className="max-w-[65ch] text-sm leading-relaxed text-muted">
        New openings show up here as they come in. Check back soon.
      </p>
    </div>
  );
}

type JobsErrorStateProps = {
  onRetry: () => void;
};

export function JobsErrorState({ onRetry }: JobsErrorStateProps) {
  return (
    <div className="flex flex-col items-start py-10">
      <p className="mb-2 text-lg font-semibold text-text-main">
        Unable to load jobs
      </p>
      <p className="mb-8 max-w-[65ch] text-sm leading-relaxed text-muted">
        Something went wrong while fetching job listings. Please try again.
      </p>
      <button
        type="button"
        className={primaryAction}
        aria-label="Retry loading jobs"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}

export function JobsNotFoundState() {
  return (
    <div className="flex flex-col items-start py-10">
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
