import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  type Firestore,
  type DocumentData,
} from "firebase/firestore";
import { db as defaultDb } from "@/lib/firebase";
import { DEFAULTS, type FirestoreTimestampLike } from "@/lib/jobs/types";
import type { Reel, ReelFormData } from "./types";
import { extractInstagramShortcode } from "./instagram-url";
import { SEED_REELS } from "./seed";

export type AdminReelsOptions = {
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

function requireDb(db: Firestore | undefined): Firestore {
  if (!db) {
    throw new Error(
      "Firestore database is not initialized. Check Firebase configuration.",
    );
  }
  return db;
}

function mapReelDoc(id: string, data: DocumentData): Reel {
  return {
    id,
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
  };
}

/**
 * Fetch all reels for Yasmin's desk (active and inactive).
 * Falls back to seed reels if collection is empty or offline.
 */
export async function fetchAllReels(
  options: AdminReelsOptions = {},
): Promise<Reel[]> {
  const db = options.db ?? defaultDb;
  if (!db) return SEED_REELS;

  try {
    const reelsRef = collection(db, "reels");
    const snapshot = await getDocs(reelsRef);

    if (snapshot.empty) {
      return SEED_REELS;
    }

    const list: Reel[] = [];
    snapshot.forEach((docSnap) => {
      list.push(mapReelDoc(docSnap.id, docSnap.data()));
    });

    list.sort((a, b) => a.order - b.order);
    return list;
  } catch (err) {
    console.warn("Failed to fetch admin reels, using seed fallbacks:", err);
    return SEED_REELS;
  }
}

/**
 * Create a new curated reel in Yasmin's studio.
 */
export async function createReel(
  data: ReelFormData,
  options: AdminReelsOptions = {},
): Promise<string> {
  const db = requireDb(options.db ?? defaultDb);
  const shortcode = extractInstagramShortcode(data.instagramUrl) || "";

  const docRef = await addDoc(collection(db, "reels"), {
    instagramUrl: data.instagramUrl.trim(),
    shortcode,
    title: data.title.trim(),
    category: data.category.trim(),
    duration: data.duration?.trim() || "",
    thumbnailUrl: data.thumbnailUrl?.trim() || "",
    takeaway: data.takeaway?.trim() || "",
    isActive: data.isActive !== false,
    order: typeof data.order === "number" ? data.order : 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Update an existing curated reel.
 */
export async function updateReel(
  id: string,
  data: Partial<ReelFormData>,
  options: AdminReelsOptions = {},
): Promise<void> {
  const db = requireDb(options.db ?? defaultDb);
  const docRef = doc(db, "reels", id);

  const updates: DocumentData = {
    updatedAt: serverTimestamp(),
  };

  if (typeof data.instagramUrl === "string") {
    updates.instagramUrl = data.instagramUrl.trim();
    updates.shortcode = extractInstagramShortcode(data.instagramUrl) || "";
  }
  if (typeof data.title === "string") updates.title = data.title.trim();
  if (typeof data.category === "string") updates.category = data.category.trim();
  if (typeof data.duration === "string") updates.duration = data.duration.trim();
  if (typeof data.thumbnailUrl === "string") updates.thumbnailUrl = data.thumbnailUrl.trim();
  if (typeof data.takeaway === "string") updates.takeaway = data.takeaway.trim();
  if (typeof data.isActive === "boolean") updates.isActive = data.isActive;
  if (typeof data.order === "number") updates.order = data.order;

  await updateDoc(docRef, updates);
}

/**
 * Toggle reel active status.
 */
export async function toggleReelActive(
  id: string,
  current: boolean,
  options: AdminReelsOptions = {},
): Promise<void> {
  const db = requireDb(options.db ?? defaultDb);
  const docRef = doc(db, "reels", id);
  await updateDoc(docRef, {
    isActive: !current,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a reel document.
 */
export async function deleteReel(
  id: string,
  options: AdminReelsOptions = {},
): Promise<void> {
  const db = requireDb(options.db ?? defaultDb);
  const docRef = doc(db, "reels", id);
  await deleteDoc(docRef);
}
