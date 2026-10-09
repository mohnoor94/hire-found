/**
 * Admin Firestore ops for Yasmin - all jobs (incl. inactive), CRUD, toggle.
 */
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  serverTimestamp,
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
import { deduplicateSlug } from "./slug";
import type { JobFormData } from "./validation";

export type AdminFetchOptions = {
  db?: Firestore | undefined;
};

function toDate(
  value: FirestoreTimestampLike | Date | null | undefined,
): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  return null;
}

function mapJobDoc(
  id: string,
  data: DocumentData,
): Job {
  return {
    id,
    ...data,
    createdAt: toDate(data.createdAt as FirestoreTimestampLike),
    updatedAt: toDate(data.updatedAt as FirestoreTimestampLike),
    expiresAt: toDate(data.expiresAt as FirestoreTimestampLike),
    isActive: data.isActive === true,
  } as Job;
}

function requireDb(db: Firestore | undefined): Firestore {
  if (!db) {
    throw new Error(
      "Firestore database is not initialized. Check Firebase configuration.",
    );
  }
  return db;
}

/** All jobs for the admin dashboard (active + inactive), newest first. */
export async function fetchAllJobs(
  options: AdminFetchOptions = {},
): Promise<Job[]> {
  const db = requireDb(options.db ?? defaultDb);

  const jobsRef = collection(db, "jobs");
  const q = query(jobsRef, orderBy("createdAt", "desc"));

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Fetch timeout: exceeded 10 seconds"));
    }, DEFAULTS.queryTimeout);
  });

  const snapshot = (await Promise.race([
    getDocs(q),
    timeoutPromise,
  ])) as QuerySnapshot<DocumentData>;

  const jobs: Job[] = [];
  snapshot.forEach((docSnap) => {
    jobs.push(mapJobDoc(docSnap.id, docSnap.data()));
  });
  return jobs;
}

/** Collect every slug currently in the jobs collection. */
export async function fetchExistingSlugs(
  options: AdminFetchOptions = {},
): Promise<string[]> {
  const db = requireDb(options.db ?? defaultDb);
  const snapshot = await getDocs(collection(db, "jobs"));
  const slugs: string[] = [];
  snapshot.forEach((docSnap) => {
    const slug = docSnap.data().slug;
    if (typeof slug === "string" && slug) slugs.push(slug);
  });
  return slugs;
}

async function resolveUniqueSlug(
  db: Firestore,
  desiredSlug: string,
): Promise<string> {
  const jobsRef = collection(db, "jobs");
  const slugSnapshot = await getDocs(
    query(jobsRef, where("slug", "==", desiredSlug)),
  );

  if (slugSnapshot.empty) return desiredSlug;

  const existingSlugs = await fetchExistingSlugs({ db });
  return deduplicateSlug(desiredSlug, existingSlugs);
}

export type CreateJobResult = { id: string; slug: string };

/** Create a job. Dedupes slug. Sets createdAt + isActive true. */
export async function createJob(
  formData: JobFormData,
  options: AdminFetchOptions = {},
): Promise<CreateJobResult> {
  const db = requireDb(options.db ?? defaultDb);
  const desiredSlug = String(formData.slug || "").trim();
  const uniqueSlug = await resolveUniqueSlug(db, desiredSlug);

  const payload: Record<string, unknown> = {
    ...formData,
    slug: uniqueSlug,
    createdAt: serverTimestamp(),
    isActive: true,
  };

  // Trim string fields
  for (const [key, val] of Object.entries(payload)) {
    if (typeof val === "string") {
      payload[key] = val.trim();
    }
  }

  const ref = await addDoc(collection(db, "jobs"), payload);
  return { id: ref.id, slug: uniqueSlug };
}

/** Update an existing job. Does not change createdAt / isActive unless provided. */
export async function updateJob(
  jobId: string,
  formData: JobFormData,
  options: AdminFetchOptions = {},
): Promise<void> {
  const db = requireDb(options.db ?? defaultDb);
  const payload: Record<string, unknown> = {
    ...formData,
    updatedAt: serverTimestamp(),
  };

  for (const [key, val] of Object.entries(payload)) {
    if (typeof val === "string") {
      payload[key] = val.trim();
    }
  }

  await updateDoc(doc(db, "jobs", jobId), payload);
}

/** Delete a job document. */
export async function deleteJob(
  jobId: string,
  options: AdminFetchOptions = {},
): Promise<void> {
  const db = requireDb(options.db ?? defaultDb);
  await deleteDoc(doc(db, "jobs", jobId));
}

/** Toggle isActive with a 10s timeout (vanilla parity). */
export async function toggleJobActive(
  jobId: string,
  isActive: boolean,
  options: AdminFetchOptions = {},
): Promise<void> {
  const db = requireDb(options.db ?? defaultDb);

  const updatePromise = updateDoc(doc(db, "jobs", jobId), { isActive });
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Toggle timeout: exceeded 10 seconds"));
    }, DEFAULTS.queryTimeout);
  });

  await Promise.race([updatePromise, timeoutPromise]);
}
