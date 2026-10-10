"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import type { Job } from "@/lib/jobs";
import { getRelativeTime, truncateText } from "@/lib/jobs";
import { formatCategoryLabel, formatEmploymentType } from "@/lib/yasmin/labels";

type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  const meta = [
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
      className="group block min-h-11 rounded-xl border border-secondary/30 bg-card/75 p-6 shadow-xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card hover:shadow-card active:translate-y-0 active:scale-[0.99] mb-3 last:mb-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Category Pill Tag */}
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-secondary/40 bg-warm px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary">
              {formatCategoryLabel(job.category)}
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
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
            <p className="mt-2.5 max-w-[65ch] text-sm leading-relaxed text-muted">
              {truncateText(job.shortDescription, 120)}
            </p>
          ) : null}

          {meta.length > 0 ? (
            <p className="mt-4 text-xs font-medium tracking-wide text-muted">
              {meta.join(" · ")}
            </p>
          ) : null}
        </div>

        {/* Trailing Spring Arrow Button */}
        <span
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-secondary/35 bg-warm text-primary transition-all duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-xs"
          aria-hidden="true"
        >
          <ArrowUpRightIcon className="size-4" />
        </span>
      </div>
    </Link>
  );
}
