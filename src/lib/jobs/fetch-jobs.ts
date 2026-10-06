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
};

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
 * 10s timeout, then drop expired jobs client-side.
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

  const constraints = [
    where("isActive", "==", true),
    orderBy("createdAt", "desc"),
  ];

  if (options.limit) {
    constraints.push(firestoreLimit(options.limit));
  }

  const jobsRef = collection(db, "jobs");
  const q = query(jobsRef, ...constraints);

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Query timed out after 10 seconds."));
    }, DEFAULTS.queryTimeout);
  });

  const snapshot = (await Promise.race([
    getDocs(q),
    timeoutPromise,
  ])) as QuerySnapshot<DocumentData>;

  const now = options.now ?? new Date();
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

  return jobs;
}
