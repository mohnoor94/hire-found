export {
  DEFAULTS,
  EMPLOYMENT_TYPES,
  CATEGORIES,
  LOCATIONS,
  SLUG_PATTERN,
  type EmploymentType,
  type Job,
  type JobStatusFilter,
  type FirestoreTimestampLike,
} from "./types";

export { fetchJobs, type FetchJobsOptions } from "./fetch-jobs";
export {
  fetchAllJobs,
  createJob,
  updateJob,
  deleteJob,
  toggleJobActive,
  fetchExistingSlugs,
  type AdminFetchOptions,
  type CreateJobResult,
} from "./admin";
export {
  generateSlug,
  randomSlugSuffix,
  slugFromTitle,
  deduplicateSlug,
} from "./slug";
export {
  validateForm,
  type JobFormData,
  type ValidationResult,
} from "./validation";
export {
  filterJobs,
  type FilterableJob,
  type JobFilters,
} from "./filters";
export {
  shouldSuppressShortcut,
  initShortcuts,
  type ShortcutViewState,
  type ShortcutsConfig,
} from "./shortcuts";
export {
  CATEGORY_COLORS,
  containsArabic,
  truncateText,
  getRelativeTime,
  getCategories,
  filterByCategory,
  categoryLabel,
  categoryColors,
  formatRichText,
} from "./display";
