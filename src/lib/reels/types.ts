import type { FirestoreTimestampLike } from "@/lib/jobs/types";

export type ReelCategory =
  | "Executive Search"
  | "Culture & Match"
  | "Leadership Advice"
  | "Candidate Craft"
  | "Behind the Match";

export interface Reel {
  id: string;
  instagramUrl: string;
  shortcode: string;
  title: string;
  category: ReelCategory | string;
  duration?: string;
  thumbnailUrl?: string;
  takeaway?: string;
  isActive: boolean;
  order: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ReelFormData {
  instagramUrl: string;
  title: string;
  category: string;
  duration?: string;
  thumbnailUrl?: string;
  takeaway?: string;
  isActive?: boolean;
  order?: number;
}

export const REEL_CATEGORIES: ReelCategory[] = [
  "Executive Search",
  "Culture & Match",
  "Leadership Advice",
  "Candidate Craft",
  "Behind the Match",
];
