"use client";

import type { Job } from "@/lib/jobs/types";
import {
  adminCategoryColors,
  formatCategoryLabel,
  formatEmploymentType,
} from "@/lib/yasmin/labels";
import { Switch } from "@/components/ui/switch";

type DashboardJobCardProps = {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onToggleActive: (job: Job) => void;
  togglingId: string | null;
};

export function DashboardJobCard({
  job,
  onEdit,
  onDelete,
  onToggleActive,
  togglingId,
}: DashboardJobCardProps) {
  const isActive = job.isActive === true;
  const colors = adminCategoryColors(job.category);
  const toggling = togglingId === job.id;

  return (
    <div
      data-job-id={job.id}
      role="button"
      tabIndex={0}
      onClick={() => onEdit(job)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(job);
        }
      }}
      className={
        isActive
          ? "job-card flex cursor-pointer flex-col rounded-2xl border border-butterfly-lavender p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-butterfly-lavender hover:shadow-warm"
          : "job-card flex cursor-pointer flex-col rounded-2xl border border-rose-200 border-l-4 border-l-rose-400 bg-[#FEF2F2] p-5 opacity-75 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-warm"
      }
      style={
        isActive
          ? { background: "linear-gradient(135deg, #ffffff 0%, #fff5f9 100%)" }
          : undefined
      }
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 flex-1 text-sm leading-tight font-semibold text-text-main">
          {job.title || "Untitled"}
        </h3>
        <div
          className="flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Switch
            checked={isActive}
            disabled={toggling}
            onCheckedChange={() => onToggleActive(job)}
            aria-label={`Toggle active status for ${job.title || "this job"}`}
            className="data-[state=checked]:bg-butterfly-lavender"
          />
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          {formatCategoryLabel(job.category)}
        </span>
        <span className={`text-xs ${isActive ? "text-[#6B6560]" : "text-[#E11D48]"}`}>
          {isActive ? "● Active" : "○ Inactive"}
        </span>
      </div>

      <div className="mb-4 flex-1 space-y-1.5">
        {job.location ? (
          <p className="flex items-center gap-1.5 text-xs text-[#6B6560]">
            <LocationIcon />
            {job.location}
          </p>
        ) : null}
        {job.employmentType ? (
          <p className="flex items-center gap-1.5 text-xs text-[#6B6560]">
            <BriefcaseIcon />
            {formatEmploymentType(String(job.employmentType))}
          </p>
        ) : null}
        {job.companyName ? (
          <p className="flex items-center gap-1.5 text-xs text-[#6B6560]">
            <BuildingIcon />
            {job.companyName}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2 border-t border-butterfly-lavender/10 pt-3">
        {job.slug ? (
          <a
            href={`/jobs/?id=${encodeURIComponent(job.slug)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-text-main transition-all duration-200 hover:bg-gray-200"
            aria-label={`View ${job.title || "this job"} on site`}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalIcon className="mr-1" />
            View
          </a>
        ) : null}
        <button
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-butterfly-lavender/10 px-3 py-2 text-xs font-medium text-[#7C3AED] transition-all duration-200 hover:bg-butterfly-lavender/20"
          aria-label={`Edit ${job.title || "this job"}`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(job);
          }}
        >
          <EditIcon className="mr-1" />
          Edit
        </button>
        <button
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-all duration-200 hover:bg-red-100"
          aria-label={`Delete ${job.title || "this job"}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(job);
          }}
        >
          <TrashIcon className="mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
}

function LocationIcon() {
  return (
    <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-3.5 w-3.5 ${className || ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-3.5 w-3.5 ${className || ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-3.5 w-3.5 ${className || ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
