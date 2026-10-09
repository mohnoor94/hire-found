"use client";

import { Calendar } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import { DEFAULTS } from "@/lib/jobs";

const primaryAction =
  "inline-flex min-h-12 touch-manipulation cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground select-none active:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const quietAction =
  "inline-flex min-h-12 touch-manipulation items-center gap-2 rounded-full border border-primary/30 px-6 text-sm font-semibold text-primary select-none active:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type JobsEmptyStateProps = {
  message: string;
};

export function JobsEmptyState({ message }: JobsEmptyStateProps) {
  const { open } = useBookingModal();

  return (
    <div className="flex flex-col items-start py-10">
      <p className="mb-2 text-lg font-semibold text-text-main">{message}</p>
      <p className="mb-8 max-w-[65ch] text-sm leading-relaxed text-muted">
        Interested in opportunities? Reach out directly. I&apos;d love to hear
        from you.
      </p>
      <div className="flex flex-col items-start gap-3 sm:flex-row">
        <button
          type="button"
          className={primaryAction}
          aria-label="Book a call with Yasmin"
          onClick={(event) => open(event.currentTarget)}
        >
          <Calendar className="size-4" aria-hidden="true" />
          Book a Call
        </button>
        <a
          href={`https://wa.me/${DEFAULTS.whatsApp}?text=${encodeURIComponent("Hi Yasmin! I'm interested in job opportunities.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={quietAction}
          aria-label="Contact via WhatsApp"
        >
          <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
      </div>
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

type JobsNotFoundStateProps = {
  onBack: () => void;
};

export function JobsNotFoundState({ onBack }: JobsNotFoundStateProps) {
  return (
    <div className="flex flex-col items-start py-10">
      <h1 className="font-accent mb-2 text-3xl text-primary">Job Not Found</h1>
      <p className="mb-8 max-w-[65ch] text-sm leading-relaxed text-muted">
        This role is no longer available or may have been removed. Browse the
        current openings.
      </p>
      <button
        type="button"
        className={primaryAction}
        aria-label="Back to all job listings"
        data-back-link="true"
        onClick={onBack}
      >
        View all jobs
      </button>
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
