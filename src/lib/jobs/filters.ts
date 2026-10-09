/**
 * Dashboard filters - from yasmin/js/dashboard.js filterJobs.
 */
import type { JobStatusFilter } from "./types";

export type FilterableJob = {
  title?: string | null;
  companyName?: string | null;
  location?: string | null;
  category?: string | null;
  isActive?: boolean;
  [key: string]: unknown;
};

export type JobFilters = {
  searchText?: string;
  category?: string;
  status?: JobStatusFilter | string;
};

/** Filter jobs by search, category, and status (AND). */
export function filterJobs<T extends FilterableJob>(
  jobs: T[],
  {
    searchText: search = "",
    category = "all",
    status = "all",
  }: JobFilters = {},
): T[] {
  const normalizedSearch = search.trim().toLowerCase();

  return jobs.filter((job) => {
    if (normalizedSearch) {
      const title = (job.title || "").toLowerCase();
      const companyName = (job.companyName || "").toLowerCase();
      const location = (job.location || "").toLowerCase();
      const matchesSearch =
        title.includes(normalizedSearch) ||
        companyName.includes(normalizedSearch) ||
        location.includes(normalizedSearch);
      if (!matchesSearch) return false;
    }

    if (category !== "all") {
      if (job.category !== category) return false;
    }

    if (status !== "all") {
      const isActive = job.isActive !== false;
      if (status === "active" && !isActive) return false;
      if (status === "inactive" && isActive) return false;
    }

    return true;
  });
}
