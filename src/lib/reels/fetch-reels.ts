import {
  collection,
  query,
  where,
  getDocs,
  type Firestore,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db as defaultDb } from "@/lib/firebase";
import { DEFAULTS, type FirestoreTimestampLike } from "@/lib/jobs/types";
import type { Reel } from "./types";
import { SEED_REELS } from "./seed";

export type FetchReelsOptions = {
  db?: Firestore | undefined;
  limit?: number;
};

function toDate(
  value: FirestoreTimestampLike | Date | null | undefined,
): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  return null;
}

function getFallbackReels(limit?: number): Reel[] {
  if (limit && limit > 0) {
    return SEED_REELS.slice(0, limit);
  }
  return SEED_REELS;
}

/**
 * Public reel query: isActive == true, sorted by order asc or createdAt desc.
 * Falls back to curated seed reels if Firestore is uninitialized, empty, or times out.
 */
export async function fetchReels(
  options: FetchReelsOptions = {},
): Promise<Reel[]> {
  const db = options.db ?? defaultDb;

  if (!db) {
    return getFallbackReels(options.limit);
  }

  try {
    const reelsRef = collection(db, "reels");
    const q = query(reelsRef, where("isActive", "==", true));

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Query timed out"));
      }, DEFAULTS.queryTimeout);
    });

    const snapshot = (await Promise.race([
      getDocs(q),
      timeoutPromise,
    ])) as QuerySnapshot<DocumentData>;

    if (snapshot.empty) {
      return getFallbackReels(options.limit);
    }

    const list: Reel[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        instagramUrl: data.instagramUrl || "",
        shortcode: data.shortcode || "",
        title: data.title || "",
        category: data.category || "Executive Search",
        duration: data.duration,
        thumbnailUrl: data.thumbnailUrl,
        takeaway: data.takeaway,
        isActive: data.isActive === true,
        order: typeof data.order === "number" ? data.order : 99,
        createdAt: toDate(data.createdAt as FirestoreTimestampLike),
        updatedAt: toDate(data.updatedAt as FirestoreTimestampLike),
      });
    });

    list.sort((a, b) => a.order - b.order);

    if (options.limit && options.limit > 0) {
      return list.slice(0, options.limit);
    }

    return list;
  } catch (err) {
    console.warn("Failed to fetch reels from Firestore, using seed fallbacks:", err);
    return getFallbackReels(options.limit);
  }
}
