"use client";

import type { Job } from "@/lib/jobs/types";
import { getRelativeTime } from "@/lib/jobs/display";
import { formatCategoryLabel, formatEmploymentType } from "@/lib/yasmin/labels";
import { withBasePath } from "@/lib/base-path";
import { Switch } from "@/components/ui/switch";

type DashboardJobCardProps = {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onToggleActive: (job: Job) => void;
  togglingId: string | null;
};

const rowAction =
  "inline-flex min-h-11 touch-manipulation items-center px-3 text-sm font-semibold text-primary underline-offset-4 select-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-warm-dark";

const deleteAction =
  "inline-flex min-h-11 touch-manipulation items-center px-3 text-sm font-semibold text-destructive underline-offset-4 select-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive active:bg-warm-dark";

function formatExpiry(date: Date | null | undefined): string | null {
  if (!date) return null;
  return `Expires ${date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

export function DashboardJobCard({
  job,
  onEdit,
  onDelete,
  onToggleActive,
  togglingId,
}: DashboardJobCardProps) {
  const isActive = job.isActive !== false;
  const toggling = togglingId === job.id;
  const title = job.title || "Untitled";
  const posted = getRelativeTime(job.createdAt);
  const updated =
    job.updatedAt &&
    job.createdAt &&
    job.updatedAt.getTime() !== job.createdAt.getTime()
      ? getRelativeTime(job.updatedAt)
      : "";
  const meta = [
    formatCategoryLabel(job.category),
    job.companyName?.trim() || null,
    job.location?.trim() || null,
    formatEmploymentType(
      typeof job.employmentType === "string" ? job.employmentType : undefined,
    ) || null,
    posted ? `Posted ${posted}` : null,
    updated ? `Updated ${updated}` : null,
    formatExpiry(job.expiresAt),
  ].filter(Boolean);

  return (
    <article
      data-job-id={job.id}
      className={`border-t border-secondary py-5 last:border-b ${
        isActive ? "" : "opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <button
              type="button"
              onClick={() => onEdit(job)}
              className={`inline-flex min-h-11 items-center text-left font-accent text-2xl leading-snug text-balance touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isActive ? "text-primary" : "text-muted"
              }`}
            >
              {title}
            </button>
            {!isActive ? (
              <span className="text-xs font-semibold tracking-wide text-muted uppercase">
                Inactive
              </span>
            ) : null}
          </div>
          {job.titleAr?.trim() ? (
            <p
              className={`text-sm leading-snug ${isActive ? "text-text-main" : "text-muted"}`}
              dir="rtl"
              lang="ar"
            >
              {job.titleAr}
            </p>
          ) : null}
          {meta.length > 0 ? (
            <p className="mt-1 text-xs font-medium tracking-wide text-muted">
              {meta.join(" · ")}
            </p>
          ) : null}
        </div>
        <div className="flex min-h-11 min-w-11 shrink-0 items-center justify-center">
          <Switch
            checked={isActive}
            disabled={toggling}
            onCheckedChange={() => onToggleActive(job)}
            aria-label={`Toggle active status for ${title}`}
            className="after:-inset-y-3.5"
          />
        </div>
      </div>
      <div className="mt-1 -ml-3 flex flex-wrap">
        {isActive && job.slug ? (
          <a
            href={withBasePath(`/jobs/?id=${encodeURIComponent(job.slug)}`)}
            target="_blank"
            rel="noopener noreferrer"
            className={rowAction}
            aria-label={`View ${title} on site`}
          >
            View
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
        <button
          type="button"
          className={rowAction}
          aria-label={`Edit ${title}`}
          onClick={() => onEdit(job)}
        >
          Edit
        </button>
        <button
          type="button"
          className={deleteAction}
          aria-label={`Delete ${title}`}
          onClick={() => onDelete(job)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
