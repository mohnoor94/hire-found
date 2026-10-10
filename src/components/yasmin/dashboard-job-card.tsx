"use client";

import type { Job } from "@/lib/jobs/types";
import { getRelativeTime } from "@/lib/jobs/display";
import { formatCategoryLabel, formatEmploymentType } from "@/lib/yasmin/labels";
import { withBasePath } from "@/lib/base-path";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";

type DashboardJobCardProps = {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onToggleActive: (job: Job) => void;
  togglingId: string | null;
};

const rowAction =
  "inline-flex min-h-9 touch-manipulation items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[#7A1E4A] select-none transition-all duration-150 ease-out hover:bg-[#F3EBE3] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const deleteAction =
  "inline-flex min-h-9 touch-manipulation items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-rose-700 select-none transition-all duration-150 ease-out hover:bg-rose-50 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600";

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
      className={`group relative my-3 rounded-2xl border transition-all duration-200 ease-out p-5 sm:p-6 ${
        isActive
          ? "border-[#D4A574]/30 bg-linear-to-b from-[#FFFCF8] to-[#FCF9F5] shadow-[0_2px_12px_rgba(45,41,38,0.03)] hover:border-[#D4A574]/60 hover:shadow-[0_8px_24px_rgba(122,30,74,0.06)]"
          : "border-[#7A1E4A]/10 bg-[#FCF9F5]/60 opacity-75 hover:opacity-95"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <button
              type="button"
              onClick={() => onEdit(job)}
              className={`inline-flex items-center text-left font-accent text-xl leading-snug touch-manipulation transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-2xl ${
                isActive ? "text-[#7A1E4A]" : "text-[#5E534C]"
              }`}
            >
              {title}
            </button>
            {isActive ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-stone-300 bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-600 uppercase tracking-wider">
                Inactive
              </span>
            )}
          </div>

          {job.titleAr?.trim() ? (
            <p
              className={`mt-1 font-sans text-sm leading-snug ${
                isActive ? "text-[#2D2926]" : "text-[#5E534C]"
              }`}
              dir="rtl"
              lang="ar"
            >
              {job.titleAr}
            </p>
          ) : null}

          {meta.length > 0 ? (
            <p className="mt-2 text-xs font-medium tracking-wide text-[#5E534C]/80">
              {meta.join(" · ")}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-1">
          <label className="text-[11px] font-medium text-[#5E534C]/80 hidden sm:inline">
            {isActive ? "Live" : "Draft"}
          </label>
          <Switch
            checked={isActive}
            disabled={toggling}
            onCheckedChange={() => onToggleActive(job)}
            aria-label={`Toggle active status for ${title}`}
            className="after:-inset-y-3.5"
          />
        </div>
      </div>

      <div className="mt-4 -ml-2 flex flex-wrap items-center gap-1 border-t border-[#D4A574]/20 pt-3">
        {isActive && job.slug ? (
          <a
            href={withBasePath(`/jobs/?id=${encodeURIComponent(job.slug)}`)}
            target="_blank"
            rel="noopener noreferrer"
            className={rowAction}
            aria-label={`View ${title} on site`}
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span>View</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
        <button
          type="button"
          className={rowAction}
          aria-label={`Edit ${title}`}
          onClick={() => onEdit(job)}
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          <span>Edit</span>
        </button>
        <button
          type="button"
          className={deleteAction}
          aria-label={`Delete ${title}`}
          onClick={() => onDelete(job)}
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
}

export default DashboardJobCard;
