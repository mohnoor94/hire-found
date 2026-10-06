import { describe, expect, it, vi, beforeEach } from "vitest";
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
} from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import {
  fetchAllJobs,
  createJob,
  updateJob,
  deleteJob,
  toggleJobActive,
} from "./admin";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  where: vi.fn(),
  serverTimestamp: vi.fn(() => "SERVER_TS"),
}));

vi.mock("@/lib/firebase", () => ({
  db: {},
}));

const mockDb = {} as Firestore;

function makeSnapshot(
  docs: Array<{ id: string; data: Record<string, unknown> }>,
) {
  return {
    empty: docs.length === 0,
    forEach: (
      cb: (doc: { id: string; data: () => Record<string, unknown> }) => void,
    ) => {
      docs.forEach((d) =>
        cb({
          id: d.id,
          data: () => d.data,
        }),
      );
    },
  };
}

describe("admin job ops", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(query).mockImplementation((...args) => args as never);
    vi.mocked(collection).mockReturnValue("jobsRef" as never);
    vi.mocked(orderBy).mockReturnValue("order" as never);
    vi.mocked(where).mockReturnValue("where" as never);
    vi.mocked(doc).mockReturnValue("jobRef" as never);
    vi.mocked(serverTimestamp).mockReturnValue("SERVER_TS" as never);
  });

  it("fetchAllJobs returns active and inactive jobs", async () => {
    vi.mocked(getDocs).mockResolvedValue(
      makeSnapshot([
        {
          id: "1",
          data: {
            title: "Active Role",
            slug: "active-role",
            isActive: true,
            createdAt: null,
          },
        },
        {
          id: "2",
          data: {
            title: "Inactive Role",
            slug: "inactive-role",
            isActive: false,
            createdAt: null,
          },
        },
      ]) as never,
    );

    const jobs = await fetchAllJobs({ db: mockDb });
    expect(jobs).toHaveLength(2);
    expect(jobs[0]!.isActive).toBe(true);
    expect(jobs[1]!.isActive).toBe(false);
    expect(jobs[1]!.title).toBe("Inactive Role");
  });

  it("createJob dedupes slug when collision exists", async () => {
    vi.mocked(getDocs)
      .mockResolvedValueOnce(
        makeSnapshot([{ id: "x", data: { slug: "barista" } }]) as never,
      )
      .mockResolvedValueOnce(
        makeSnapshot([
          { id: "x", data: { slug: "barista" } },
          { id: "y", data: { slug: "barista-2" } },
        ]) as never,
      );
    vi.mocked(addDoc).mockResolvedValue({ id: "new-id" } as never);

    const result = await createJob(
      {
        title: "Barista",
        slug: "barista",
        category: "fnb",
        location: "Jordan",
        employmentType: "full-time",
      },
      { db: mockDb },
    );

    expect(result.slug).toBe("barista-3");
    expect(addDoc).toHaveBeenCalled();
    const payload = vi.mocked(addDoc).mock.calls[0]![1] as Record<
      string,
      unknown
    >;
    expect(payload.slug).toBe("barista-3");
    expect(payload.isActive).toBe(true);
    expect(payload.createdAt).toBe("SERVER_TS");
  });

  it("updateJob writes updatedAt", async () => {
    vi.mocked(updateDoc).mockResolvedValue(undefined);
    await updateJob(
      "abc",
      { title: "Updated", slug: "updated" },
      { db: mockDb },
    );
    expect(updateDoc).toHaveBeenCalled();
    const payload = vi.mocked(updateDoc).mock.calls[0]![1] as unknown as Record<
      string,
      unknown
    >;
    expect(payload.updatedAt).toBe("SERVER_TS");
    expect(payload.title).toBe("Updated");
  });

  it("deleteJob removes the document", async () => {
    vi.mocked(deleteDoc).mockResolvedValue(undefined);
    await deleteJob("abc", { db: mockDb });
    expect(deleteDoc).toHaveBeenCalled();
  });

  it("toggleJobActive updates isActive", async () => {
    vi.mocked(updateDoc).mockResolvedValue(undefined);
    await toggleJobActive("abc", false, { db: mockDb });
    expect(updateDoc).toHaveBeenCalledWith("jobRef", { isActive: false });
  });
});
