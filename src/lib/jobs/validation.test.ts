/**
 * Port of yasmin/__tests__/validation.property.test.js
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { validateForm } from "./validation";

const EMPLOYMENT_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "freelance",
] as const;

const validFormData = () =>
  fc.record({
    title: fc
      .string({ minLength: 1, maxLength: 120 })
      .filter((s) => s.trim().length >= 1),
    slug: fc
      .stringMatching(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      .filter((s) => s.length >= 1 && s.length <= 80),
    category: fc
      .string({ minLength: 1, maxLength: 50 })
      .filter((s) => s.trim().length >= 1),
    location: fc
      .string({ minLength: 1, maxLength: 100 })
      .filter((s) => s.trim().length >= 1),
    employmentType: fc.constantFrom(...EMPLOYMENT_TYPES),
  });

const emptyOrWhitespace = () => fc.constantFrom("", "   ", "\t", "\n");

const tooLongTitle = () =>
  fc
    .string({ minLength: 121, maxLength: 200 })
    .filter((s) => s.trim().length > 120);

const tooLongLocation = () =>
  fc
    .string({ minLength: 101, maxLength: 200 })
    .filter((s) => s.trim().length > 100);

const invalidCategory = () => emptyOrWhitespace();

const invalidEmploymentType = () =>
  fc
    .string({ minLength: 1 })
    .filter((s) => !(EMPLOYMENT_TYPES as readonly string[]).includes(s.trim()));

const invalidSlug = () =>
  fc.oneof(
    fc.constantFrom("My-Slug", "UPPER", "mixedCase"),
    fc.constantFrom("has space", "special!char", "under_score", "dot.slug"),
    fc.constantFrom("-leading", "trailing-", "-both-"),
    fc.constantFrom("double--hyphen", "triple---hyphen"),
    fc.integer({ min: 81, max: 120 }).map((len) => "a".repeat(len)),
    fc
      .string({ minLength: 1, maxLength: 80 })
      .filter(
        (s) =>
          s.trim().length > 0 &&
          !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.trim()),
      ),
  );

const invalidWhatsApp = () =>
  fc.oneof(
    fc
      .string({ minLength: 7, maxLength: 15 })
      .filter(
        (s) => s.trim().length >= 7 && !/^\d{7,15}$/.test(s.trim()),
      ),
    fc.stringMatching(/^\d{1,6}$/),
    fc.stringMatching(/^\d{16,20}$/),
  );

const invalidEmail = () =>
  fc.oneof(
    fc.constant("notanemail"),
    fc.constant("missing@domain"),
    fc.constant("@nodomain.com"),
    fc.constant("spaces in@email.com"),
    fc
      .string({ minLength: 1, maxLength: 30 })
      .filter(
        (s) =>
          s.trim().length > 0 &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim()),
      ),
  );

describe("form validation rejects invalid data", () => {
  it("rejects form data when title is missing or empty", () => {
    fc.assert(
      fc.property(validFormData(), emptyOrWhitespace(), (base, invalidTitle) => {
        const result = validateForm({ ...base, title: invalidTitle });
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty("title");
      }),
      { numRuns: 100 },
    );
  });

  it("rejects form data when title exceeds 120 characters", () => {
    fc.assert(
      fc.property(validFormData(), tooLongTitle(), (base, longTitle) => {
        const result = validateForm({ ...base, title: longTitle });
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty("title");
      }),
      { numRuns: 100 },
    );
  });

  it("rejects form data when category is missing or empty", () => {
    fc.assert(
      fc.property(validFormData(), invalidCategory(), (base, badCategory) => {
        const result = validateForm({ ...base, category: badCategory });
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty("category");
      }),
      { numRuns: 100 },
    );
  });

  it("rejects form data when location is missing or empty", () => {
    fc.assert(
      fc.property(
        validFormData(),
        emptyOrWhitespace(),
        (base, invalidLocation) => {
          const result = validateForm({ ...base, location: invalidLocation });
          expect(result.valid).toBe(false);
          expect(result.errors).toHaveProperty("location");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("rejects form data when location exceeds 100 characters", () => {
    fc.assert(
      fc.property(validFormData(), tooLongLocation(), (base, longLocation) => {
        const result = validateForm({ ...base, location: longLocation });
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty("location");
      }),
      { numRuns: 100 },
    );
  });

  it("rejects form data when employmentType is not in the allowed enum", () => {
    fc.assert(
      fc.property(
        validFormData(),
        invalidEmploymentType(),
        (base, badType) => {
          const result = validateForm({ ...base, employmentType: badType });
          expect(result.valid).toBe(false);
          expect(result.errors).toHaveProperty("employmentType");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("rejects form data when slug has invalid format", () => {
    fc.assert(
      fc.property(validFormData(), invalidSlug(), (base, badSlug) => {
        const result = validateForm({ ...base, slug: badSlug });
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty("slug");
      }),
      { numRuns: 100 },
    );
  });

  it("rejects form data when contactWhatsApp has invalid format", () => {
    fc.assert(
      fc.property(validFormData(), invalidWhatsApp(), (base, badWhatsApp) => {
        const result = validateForm({
          ...base,
          contactWhatsApp: badWhatsApp,
        });
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty("contactWhatsApp");
      }),
      { numRuns: 100 },
    );
  });

  it("rejects form data when contactEmail has invalid format", () => {
    fc.assert(
      fc.property(validFormData(), invalidEmail(), (base, badEmail) => {
        const result = validateForm({ ...base, contactEmail: badEmail });
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty("contactEmail");
      }),
      { numRuns: 100 },
    );
  });

  it("returns error entries for each invalid field when multiple fields are invalid", () => {
    fc.assert(
      fc.property(
        emptyOrWhitespace(),
        emptyOrWhitespace(),
        emptyOrWhitespace(),
        invalidEmploymentType(),
        (badTitle, badCategory, badLocation, badType) => {
          const result = validateForm({
            title: badTitle,
            slug: "valid-slug",
            category: badCategory,
            location: badLocation,
            employmentType: badType,
          });
          expect(result.valid).toBe(false);
          expect(result.errors).toHaveProperty("title");
          expect(result.errors).toHaveProperty("category");
          expect(result.errors).toHaveProperty("location");
          expect(result.errors).toHaveProperty("employmentType");
        },
      ),
      { numRuns: 100 },
    );
  });
});
