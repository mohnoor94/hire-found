import type { Reel } from "./types";

/**
 * Editorial starter reels showcasing Yasmin's executive recruiting perspective.
 * Used as high-fidelity fallbacks when Firestore is empty or offline.
 */
export const SEED_REELS: Reel[] = [
  {
    id: "seed-1",
    instagramUrl: "https://www.instagram.com/reel/C8f01Executive/",
    shortcode: "C8f01Executive",
    title: "Why 90% of job posts fail to attract true executive leaders",
    category: "Executive Search",
    duration: "0:48",
    takeaway:
      "Senior executives do not browse job boards looking for laundry lists of requirements. They look for mandate, trust, and cultural freedom.",
    isActive: true,
    order: 1,
    createdAt: new Date("2026-03-01T10:00:00Z"),
    updatedAt: new Date("2026-03-01T10:00:00Z"),
  },
  {
    id: "seed-2",
    instagramUrl: "https://www.instagram.com/reel/C8f02CultureFit/",
    shortcode: "C8f02CultureFit",
    title: "Culture fit vs credentials: The 3 questions founders forget to ask",
    category: "Culture & Match",
    duration: "0:56",
    takeaway:
      "A candidate can check every box on paper and still paralyze your team. Ask how they disagree, how they listen, and what makes them proud.",
    isActive: true,
    order: 2,
    createdAt: new Date("2026-03-05T10:00:00Z"),
    updatedAt: new Date("2026-03-05T10:00:00Z"),
  },
  {
    id: "seed-3",
    instagramUrl: "https://www.instagram.com/reel/C8f03Leadership/",
    shortcode: "C8f03Leadership",
    title: "The subtle signals senior candidates watch for in interviews",
    category: "Leadership Advice",
    duration: "1:08",
    takeaway:
      "Executive interviews are a two-way evaluation. Top talent assesses your leadership clarity just as thoroughly as you assess their track record.",
    isActive: true,
    order: 3,
    createdAt: new Date("2026-03-10T10:00:00Z"),
    updatedAt: new Date("2026-03-10T10:00:00Z"),
  },
  {
    id: "seed-4",
    instagramUrl: "https://www.instagram.com/reel/C8f04BehindTheMatch/",
    shortcode: "C8f04BehindTheMatch",
    title: "What happens after the offer letter: The matchmaker's journey",
    category: "Behind the Match",
    duration: "0:42",
    takeaway:
      "A placement does not end when the contract is signed. The first ninety days determine whether a great hire becomes an enduring partnership.",
    isActive: true,
    order: 4,
    createdAt: new Date("2026-03-15T10:00:00Z"),
    updatedAt: new Date("2026-03-15T10:00:00Z"),
  },
];
