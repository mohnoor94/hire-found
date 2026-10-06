/**
 * Port of yasmin/__tests__/dashboard-filters.test.js
 */
import { describe, it, expect } from "vitest";
import { filterJobs } from "./filters";

const sampleJobs = [
  {
    id: "1",
    title: "Hotel Manager",
    companyName: "Marriott",
    location: "Dubai",
    category: "hospitality",
    isActive: true,
  },
  {
    id: "2",
    title: "Software Engineer",
    companyName: "TechCorp",
    location: "Abu Dhabi",
    category: "tech",
    isActive: true,
  },
  {
    id: "3",
    title: "Head Chef",
    companyName: "Nobu",
    location: "Dubai",
    category: "fnb",
    isActive: false,
  },
  {
    id: "4",
    title: "Pilot",
    companyName: "Emirates",
    location: "Dubai",
    category: "aviation",
    isActive: true,
  },
  {
    id: "5",
    title: "Receptionist",
    companyName: "Hilton",
    location: "Sharjah",
    category: "hospitality",
    isActive: false,
  },
];

describe("filterJobs", () => {
  describe("search filter", () => {
    it("returns all jobs when search text is empty", () => {
      expect(filterJobs(sampleJobs, { searchText: "" })).toHaveLength(5);
    });

    it("filters by title (case-insensitive)", () => {
      const result = filterJobs(sampleJobs, { searchText: "hotel" });
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("1");
    });

    it("filters by companyName (case-insensitive)", () => {
      const result = filterJobs(sampleJobs, { searchText: "nobu" });
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("3");
    });

    it("filters by location (case-insensitive)", () => {
      expect(filterJobs(sampleJobs, { searchText: "dubai" })).toHaveLength(3);
    });

    it("trims whitespace from search text", () => {
      const result = filterJobs(sampleJobs, { searchText: "  pilot  " });
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("4");
    });
  });

  describe("category filter", () => {
    it('returns all jobs when category is "all"', () => {
      expect(filterJobs(sampleJobs, { category: "all" })).toHaveLength(5);
    });

    it("filters by specific category", () => {
      const result = filterJobs(sampleJobs, { category: "hospitality" });
      expect(result).toHaveLength(2);
      expect(result.every((j) => j.category === "hospitality")).toBe(true);
    });

    it("returns empty array for category with no matches", () => {
      expect(filterJobs(sampleJobs, { category: "other" })).toHaveLength(0);
    });
  });

  describe("status filter", () => {
    it('returns all jobs when status is "all"', () => {
      expect(filterJobs(sampleJobs, { status: "all" })).toHaveLength(5);
    });

    it("filters active jobs only", () => {
      const result = filterJobs(sampleJobs, { status: "active" });
      expect(result).toHaveLength(3);
      expect(result.every((j) => j.isActive !== false)).toBe(true);
    });

    it("filters inactive jobs only", () => {
      const result = filterJobs(sampleJobs, { status: "inactive" });
      expect(result).toHaveLength(2);
      expect(result.every((j) => j.isActive === false)).toBe(true);
    });
  });

  describe("combined filters (AND logic)", () => {
    it("applies search + category simultaneously", () => {
      const result = filterJobs(sampleJobs, {
        searchText: "dubai",
        category: "hospitality",
      });
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("1");
    });

    it("applies search + status simultaneously", () => {
      const result = filterJobs(sampleJobs, {
        searchText: "dubai",
        status: "inactive",
      });
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("3");
    });

    it("applies category + status simultaneously", () => {
      const result = filterJobs(sampleJobs, {
        category: "hospitality",
        status: "active",
      });
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("1");
    });

    it("applies all three filters simultaneously", () => {
      const result = filterJobs(sampleJobs, {
        searchText: "dubai",
        category: "fnb",
        status: "inactive",
      });
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("3");
    });

    it("returns empty when combined filters exclude everything", () => {
      const result = filterJobs(sampleJobs, {
        searchText: "dubai",
        category: "tech",
        status: "active",
      });
      expect(result).toHaveLength(0);
    });
  });

  describe("edge cases", () => {
    it("handles empty jobs array", () => {
      expect(filterJobs([], { searchText: "test" })).toHaveLength(0);
    });

    it("handles jobs with missing fields", () => {
      const jobs = [
        { id: "1", title: "Test", isActive: true },
        {
          id: "2",
          title: "Another",
          companyName: null,
          location: undefined,
          isActive: false,
        },
      ];
      const result = filterJobs(jobs, { searchText: "test" });
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("1");
    });

    it("treats jobs without isActive field as active", () => {
      const jobs = [{ id: "1", title: "Test" }];
      expect(filterJobs(jobs, { status: "active" })).toHaveLength(1);
    });

    it("uses default filters when no options provided", () => {
      expect(filterJobs(sampleJobs)).toHaveLength(5);
    });
  });
});
