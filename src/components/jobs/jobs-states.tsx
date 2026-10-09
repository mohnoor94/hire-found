"use client";

import { useBookingModal } from "@/components/site/cal-dialog";
import { DEFAULTS } from "@/lib/jobs";

type JobsEmptyStateProps = {
  message: string;
};

export function JobsEmptyState({ message }: JobsEmptyStateProps) {
  const { open } = useBookingModal();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-secondary/10">
        <svg
          className="size-8 text-secondary"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <p className="mb-2 text-lg font-semibold text-text-main">{message}</p>
      <p className="mb-8 max-w-md text-sm text-muted">
        Interested in opportunities? Reach out directly. I&apos;d love to hear
        from you.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <a
          href={`https://wa.me/${DEFAULTS.whatsApp}?text=${encodeURIComponent("Hi Yasmin! I'm interested in job opportunities.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="magnetic inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110"
          aria-label="Contact via WhatsApp"
        >
          <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
        <button
          type="button"
          className="magnetic inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-warm transition-colors duration-200 hover:bg-primary-light"
          aria-label="Book a call with Yasmin"
          onClick={(e) => open(e.currentTarget)}
        >
          <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          Book a Call
        </button>
      </div>
    </div>
  );
}

type JobsErrorStateProps = {
  onRetry: () => void;
};

export function JobsErrorState({ onRetry }: JobsErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
        <svg
          className="size-8 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <p className="mb-2 text-lg font-semibold text-text-main">
        Unable to load jobs
      </p>
      <p className="mb-8 max-w-md text-sm text-muted">
        Something went wrong while fetching job listings. Please try again.
      </p>
      <button
        type="button"
        className="magnetic inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-warm transition-colors duration-200 hover:bg-primary-light"
        aria-label="Retry loading jobs"
        onClick={onRetry}
      >
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
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
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
        <svg
          className="size-8 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-2xl font-bold text-text-main">Job Not Found</h2>
      <p className="mb-8 max-w-md text-sm text-muted">
        This role is no longer available or may have been removed. Browse our
        current openings below.
      </p>
      <button
        type="button"
        className="magnetic inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-warm transition-colors duration-200 hover:bg-primary-light"
        aria-label="Back to all job listings"
        data-back-link="true"
        onClick={onBack}
      >
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        View All Jobs
      </button>
    </div>
  );
}

export function JobsSkeletons({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-[20px] bg-white p-7 shadow-card"
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="size-[38px] rounded-[10px] bg-gray-200" />
            <div className="h-6 w-20 rounded-full bg-gray-200" />
          </div>
          <div className="mb-2 h-5 w-3/4 rounded bg-gray-200" />
          <div className="mb-3 h-4 w-1/2 rounded bg-gray-200" />
          <div className="mb-4 space-y-2">
            <div className="h-3 w-full rounded bg-gray-200" />
            <div className="h-3 w-5/6 rounded bg-gray-200" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="h-6 w-16 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
