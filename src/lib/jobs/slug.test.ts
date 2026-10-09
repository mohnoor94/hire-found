/**
 * Port of yasmin/__tests__/slug.property.test.js
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  generateSlug,
  randomSlugSuffix,
  slugFromTitle,
  deduplicateSlug,
} from "./slug";

describe("slug generation structural invariants", () => {
  it("slug contains only lowercase alphanumeric characters and hyphens", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (title) => {
        const slug = generateSlug(title);
        if (slug.length > 0) {
          expect(slug).toMatch(/^[a-z0-9-]+$/);
        }
      }),
      { numRuns: 100 },
    );
  });

  it("slug does not start or end with a hyphen", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (title) => {
        const slug = generateSlug(title);
        if (slug.length > 0) {
          expect(slug[0]).not.toBe("-");
          expect(slug[slug.length - 1]).not.toBe("-");
        }
      }),
      { numRuns: 100 },
    );
  });

  it("slug does not contain consecutive hyphens", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (title) => {
        const slug = generateSlug(title);
        expect(slug).not.toMatch(/--/);
      }),
      { numRuns: 100 },
    );
  });

  it("slug length is at most 80 characters", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (title) => {
        const slug = generateSlug(title);
        expect(slug.length).toBeLessThanOrEqual(80);
      }),
      { numRuns: 100 },
    );
  });
});

describe("slugFromTitle", () => {
  it("appends a stable suffix and stays within 80 characters", () => {
    const slug = slugFromTitle("Front Desk Agent", "a1b2c3");
    expect(slug).toBe("front-desk-agent-a1b2c3");
    expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("keeps the same suffix when the title changes", () => {
    const suffix = "x9y8z7";
    expect(slugFromTitle("Barista", suffix)).toBe("barista-x9y8z7");
    expect(slugFromTitle("Senior Barista", suffix)).toBe(
      "senior-barista-x9y8z7",
    );
  });

  it("truncates a long title so the suffix still fits", () => {
    const title = "A".repeat(120);
    const slug = slugFromTitle(title, "abcd12");
    expect(slug.endsWith("-abcd12")).toBe(true);
    expect(slug.length).toBeLessThanOrEqual(80);
  });

  it("randomSlugSuffix is lowercase alphanumeric of the requested length", () => {
    const suffix = randomSlugSuffix(6);
    expect(suffix).toMatch(/^[a-z0-9]{6}$/);
  });
});

describe("slug deduplication uniqueness", () => {
  const baseSlugArb = fc
    .stringMatching(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    .filter((s) => s.length >= 1 && s.length <= 80);

  const existingSlugsArb = (baseSlug: string) =>
    fc
      .uniqueArray(fc.integer({ min: 2, max: 100 }), {
        minLength: 0,
        maxLength: 20,
      })
      .map((suffixes) => [
        baseSlug,
        ...suffixes.map((n) => `${baseSlug}-${n}`),
      ]);

  it("returned slug is not in the existing slugs set", () => {
    fc.assert(
      fc.property(
        baseSlugArb.chain((baseSlug) =>
          existingSlugsArb(baseSlug).map((existingSlugs) => ({
            baseSlug,
            existingSlugs,
          })),
        ),
        ({ baseSlug, existingSlugs }) => {
          const result = deduplicateSlug(baseSlug, existingSlugs);
          expect(existingSlugs).not.toContain(result);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("returned slug preserves the base slug as a prefix", () => {
    fc.assert(
      fc.property(
        baseSlugArb.chain((baseSlug) =>
          existingSlugsArb(baseSlug).map((existingSlugs) => ({
            baseSlug,
            existingSlugs,
          })),
        ),
        ({ baseSlug, existingSlugs }) => {
          const result = deduplicateSlug(baseSlug, existingSlugs);
          expect(result.startsWith(baseSlug)).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });
});
