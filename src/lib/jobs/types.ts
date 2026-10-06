/**
 * Shared job domain types and constants.
 * Field names match the Firestore `jobs` data contract in docs/platform-plan.md.
 */

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "freelance";

export type JobStatusFilter = "all" | "active" | "inactive";

/** Firestore Timestamp-like shape with toDate(). */
export type FirestoreTimestampLike = {
  toDate: () => Date;
};

export type Job = {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  category: string;
  location: string;
  employmentType: EmploymentType | string;
  shortDescription?: string;
  fullDescription?: string;
  fullDescriptionAr?: string;
  companyName?: string;
  salary?: string;
  contactWhatsApp?: string;
  contactEmail?: string;
  tallyFormId?: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  expiresAt: Date | null;
  isActive: boolean;
  [key: string]: unknown;
};

export const DEFAULTS = {
  whatsApp: "962793001043",
  email: "yasmin@hirefound.com",
  calLink: "https://cal.com/yasminblasi",
  queryTimeout: 10_000,
} as const;

export const EMPLOYMENT_TYPES: readonly EmploymentType[] = [
  "full-time",
  "part-time",
  "contract",
  "freelance",
];

export const CATEGORIES = [
  "hospitality",
  "tech",
  "fnb",
  "aviation",
  "retail",
  "healthcare",
  "education",
  "finance",
  "marketing",
  "engineering",
  "design",
  "customer-service",
  "logistics",
  "real-estate",
  "media",
] as const;

export const LOCATIONS = [
  "Jordan",
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Egypt",
  "Remote",
] as const;

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
