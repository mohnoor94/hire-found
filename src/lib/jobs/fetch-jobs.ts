import {
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  type Firestore,
  type QuerySnapshot,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { db as defaultDb } from "@/lib/firebase";
import {
  DEFAULTS,
  type Job,
  type FirestoreTimestampLike,
} from "./types";

export type FetchJobsOptions = {
  limit?: number;
  /** Override Firestore instance (tests). Defaults to the app client db. */
  db?: Firestore | undefined;
  /** Override now for expiry checks (tests). */
  now?: Date;
  /** Bypass in-memory cache to force a fresh server query. */
  bypassCache?: boolean;
  /** Delay between retries in ms. Defaults to 800ms in production, 0ms in test. */
  retryDelay?: number;
  /** Max retry attempts. Defaults to 1. */
  retries?: number;
};

let memoryCache: Job[] | null = null;

export function clearJobsCache(): void {
  memoryCache = null;
}

function toDate(
  value: FirestoreTimestampLike | Date | null | undefined,
): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  return null;
}

/**
 * Public job list: isActive == true, newest first, optional limit,
 * 15s timeout with automatic retry, then drop expired jobs client-side.
 * Mirrors js/jobs.js fetchJobs.
 */
export async function fetchJobs(
  options: FetchJobsOptions = {},
): Promise<Job[]> {
  const db = options.db ?? defaultDb;

  if (!db) {
    throw new Error(
      "Firestore database is not initialized. Check Firebase configuration.",
    );
  }

  const constraints: QueryConstraint[] = [
    where("isActive", "==", true),
    orderBy("createdAt", "desc"),
  ];

  if (options.limit) {
    constraints.push(firestoreLimit(options.limit));
  }

  const jobsRef = collection(db, "jobs");
  const q = query(jobsRef, ...constraints);

  const maxRetries = options.retries ?? 1;
  const delayMs =
    options.retryDelay ?? (process.env.NODE_ENV === "test" ? 0 : 800);
  const now = options.now ?? new Date();
  const totalTimeout = DEFAULTS.queryTimeout;
  const attemptTimeout =
    maxRetries > 0
      ? Math.max(6_000, Math.floor(totalTimeout / (maxRetries + 1)))
      : totalTimeout;

  let lastError: unknown;
  let snapshot: QuerySnapshot<DocumentData> | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(
            new Error(
              `Query timed out after ${Math.round(attemptTimeout / 1000)} seconds.`,
            ),
          );
        }, attemptTimeout);
      });

      snapshot = (await Promise.race([
        getDocs(q),
        timeoutPromise,
      ])) as QuerySnapshot<DocumentData>;
      break;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  if (!snapshot) {
    if (memoryCache && !options.bypassCache) {
      const fresh = memoryCache.filter(
        (job) => !job.expiresAt || job.expiresAt >= now,
      );
      if (fresh.length > 0) {
        return options.limit ? fresh.slice(0, options.limit) : fresh;
      }
    }
    throw lastError;
  }

  const jobs: Job[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const createdAt = toDate(data.createdAt as FirestoreTimestampLike);
    const updatedAt = toDate(data.updatedAt as FirestoreTimestampLike);
    const expiresAt = toDate(data.expiresAt as FirestoreTimestampLike);

    if (expiresAt && expiresAt < now) {
      return;
    }

    jobs.push({
      id: docSnap.id,
      ...data,
      createdAt,
      updatedAt,
      expiresAt,
      isActive: data.isActive === true,
    } as Job);
  });

  if (!options.limit) {
    memoryCache = jobs;
  } else if (!memoryCache || memoryCache.length === 0) {
    memoryCache = jobs;
  }

  return jobs;
}
