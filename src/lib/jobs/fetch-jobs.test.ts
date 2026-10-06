import { describe, expect, it, vi } from "vitest";
import {
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
} from "firebase/firestore";
import { fetchJobs } from "./fetch-jobs";
import type { Firestore } from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => "jobs-ref"),
  query: vi.fn(() => "jobs-query"),
  where: vi.fn((...args: unknown[]) => ({ type: "where", args })),
  orderBy: vi.fn((...args: unknown[]) => ({ type: "orderBy", args })),
  limit: vi.fn((n: number) => ({ type: "limit", n })),
  getDocs: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  db: undefined,
}));

function makeSnapshot(
  docs: Array<{ id: string; data: Record<string, unknown> }>,
) {
  return {
    forEach(callback: (doc: { id: string; data: () => Record<string, unknown> }) => void) {
      for (const doc of docs) {
        callback({ id: doc.id, data: () => doc.data });
      }
    },
  };
}

describe("fetchJobs", () => {
  it("throws when Firestore is not initialized", async () => {
    await expect(fetchJobs({ db: undefined })).rejects.toThrow(
      /not initialized/i,
    );
  });

  it("queries active jobs newest-first and drops expired ones", async () => {
    const now = new Date("2026-10-06T12:00:00Z");
    const mockDb = {} as Firestore;

    vi.mocked(getDocs).mockResolvedValue(
      makeSnapshot([
        {
          id: "fresh",
          data: {
            title: "Fresh",
            slug: "fresh",
            category: "tech",
            location: "Remote",
            employmentType: "full-time",
            isActive: true,
            createdAt: { toDate: () => new Date("2026-10-05T00:00:00Z") },
            updatedAt: null,
            expiresAt: { toDate: () => new Date("2026-12-01T00:00:00Z") },
          },
        },
        {
          id: "expired",
          data: {
            title: "Expired",
            slug: "expired",
            category: "tech",
            location: "Remote",
            employmentType: "full-time",
            isActive: true,
            createdAt: { toDate: () => new Date("2026-09-01T00:00:00Z") },
            updatedAt: null,
            expiresAt: { toDate: () => new Date("2026-10-01T00:00:00Z") },
          },
        },
        {
          id: "no-expiry",
          data: {
            title: "No Expiry",
            slug: "no-expiry",
            category: "hospitality",
            location: "Jordan",
            employmentType: "part-time",
            isActive: true,
            createdAt: { toDate: () => new Date("2026-10-04T00:00:00Z") },
          },
        },
      ]) as never,
    );

    const jobs = await fetchJobs({ db: mockDb, limit: 4, now });

    expect(collection).toHaveBeenCalledWith(mockDb, "jobs");
    expect(where).toHaveBeenCalledWith("isActive", "==", true);
    expect(orderBy).toHaveBeenCalledWith("createdAt", "desc");
    expect(firestoreLimit).toHaveBeenCalledWith(4);
    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalledWith("jobs-query");

    expect(jobs.map((j) => j.id)).toEqual(["fresh", "no-expiry"]);
    expect(jobs[0]?.createdAt).toEqual(new Date("2026-10-05T00:00:00Z"));
    expect(jobs[0]?.expiresAt).toEqual(new Date("2026-12-01T00:00:00Z"));
  });
});
