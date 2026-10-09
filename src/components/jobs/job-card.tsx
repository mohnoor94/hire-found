"use client";

import Link from "next/link";
import type { Job } from "@/lib/jobs";
import { getRelativeTime, truncateText } from "@/lib/jobs";
import { formatCategoryLabel, formatEmploymentType } from "@/lib/yasmin/labels";

type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  const meta = [
    formatCategoryLabel(job.category),
    job.companyName?.trim() || null,
    job.location?.trim() || null,
    formatEmploymentType(
      typeof job.employmentType === "string" ? job.employmentType : undefined,
    ) || null,
    getRelativeTime(job.createdAt) || null,
  ].filter(Boolean);

  return (
    <Link
      href={`/jobs/?id=${job.slug}`}
      className="group block min-h-11 border-t border-secondary py-7 transition-colors last:border-b hover:bg-warm-dark/40 focus-visible:bg-warm-dark/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-warm-dark/50"
      aria-label={`View details for ${job.title}`}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
        <h3 className="font-accent text-2xl leading-snug text-balance text-primary transition-colors group-hover:text-primary-light">
          {job.title}
        </h3>
        {job.titleAr?.trim() ? (
          <p
            className="text-base leading-snug text-text-main sm:max-w-[16rem] sm:shrink-0 sm:text-end"
            dir="rtl"
            lang="ar"
          >
            {job.titleAr}
          </p>
        ) : null}
      </div>
      {job.shortDescription?.trim() ? (
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted">
          {truncateText(job.shortDescription, 120)}
        </p>
      ) : null}
      <p className="mt-4 text-xs font-medium tracking-wide text-muted">
        {meta.join(" · ")}
      </p>
    </Link>
  );
}
