/**
 * Port of yasmin/__tests__/slug.property.test.js
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { generateSlug, deduplicateSlug } from "./slug";

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
