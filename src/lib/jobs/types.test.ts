import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  DEFAULTS,
  EMPLOYMENT_TYPES,
  LOCATIONS,
  SLUG_PATTERN,
  type Job,
} from "./types";

describe("job domain types and constants", () => {
  it("keeps contact defaults aligned with the data contract", () => {
    expect(DEFAULTS.whatsApp).toBe("962793001043");
    expect(DEFAULTS.email).toBe("yasmin@hirefound.com");
    expect(DEFAULTS.calLink).toBe("https://cal.com/yasminblasi");
    expect(DEFAULTS.queryTimeout).toBe(15_000);
  });

  it("exposes the employment type enum from the data contract", () => {
    expect([...EMPLOYMENT_TYPES]).toEqual([
      "full-time",
      "part-time",
      "contract",
      "freelance",
    ]);
  });

  it("includes known categories from the data contract", () => {
    expect(CATEGORIES).toContain("hospitality");
    expect(CATEGORIES).toContain("customer-service");
    expect(CATEGORIES).toContain("real-estate");
  });

  it("includes location suggestions from the data contract", () => {
    expect(LOCATIONS).toContain("Jordan");
    expect(LOCATIONS).toContain("Remote");
  });

  it("accepts a Job object shaped like Firestore fields", () => {
    const job: Job = {
      id: "abc",
      title: "Hotel Manager",
      slug: "hotel-manager",
      category: "hospitality",
      location: "Jordan",
      employmentType: "full-time",
      createdAt: new Date(),
      updatedAt: null,
      expiresAt: null,
      isActive: true,
    };

    expect(job.slug).toMatch(SLUG_PATTERN);
    expect(job.isActive).toBe(true);
  });
});
