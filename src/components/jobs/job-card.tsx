"use client";

import type { Job } from "@/lib/jobs";
import {
  categoryColors,
  categoryLabel,
  getRelativeTime,
  truncateText,
} from "@/lib/jobs";

type JobCardProps = {
  job: Job;
  index: number;
  onSelect: (slug: string) => void;
};

export function JobCard({ job, index, onSelect }: JobCardProps) {
  const colors = categoryColors(job.category);
  const label = categoryLabel(job.category);

  return (
    <article
      role="link"
      tabIndex={0}
      className="premium-card shadow-card reveal min-h-[44px] min-w-[44px] cursor-pointer p-7"
      style={{ transitionDelay: `${index * 0.1}s` }}
      aria-label={`View details for ${job.title}`}
      onClick={() => onSelect(job.slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(job.slug);
        }
      }}
    >
      <div className="mb-3 flex items-start justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.bg} ${colors.text}`}
        >
          {label}
        </span>
      </div>
      <h3 className="mb-1 text-lg font-bold">{job.title}</h3>
      {job.titleAr?.trim() ? (
        <p
          className="mb-2 text-sm font-semibold text-secondary"
          dir="rtl"
          lang="ar"
        >
          {job.titleAr}
        </p>
      ) : null}
      <p className="mb-3 text-sm leading-relaxed text-muted">
        {truncateText(job.shortDescription, 120)}
      </p>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <span>📍 {job.location || ""}</span>
        <span>•</span>
        <span>{getRelativeTime(job.createdAt)}</span>
        <span>•</span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          {job.employmentType || ""}
        </span>
      </div>
    </article>
  );
}
