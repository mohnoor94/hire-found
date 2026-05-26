/**
 * Property-Based Tests for Form Validation
 * Feature: admin-job-panel, Property 4: Form validation rejects invalid data
 *
 * **Validates: Requirements 3.2, 3.8, 4.2, 4.3, 8.4**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateForm } from '../js/editor.js';

// ─── Valid data generators (used as base for creating invalid variants) ──────

const CATEGORIES = ['hospitality', 'tech', 'fnb', 'aviation', 'other'];
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'freelance'];

/** Generates a valid base form data object */
const validFormData = () =>
  fc.record({
    title: fc.string({ minLength: 1, maxLength: 120 }).filter((s) => s.trim().length >= 1),
    slug: fc
      .stringMatching(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      .filter((s) => s.length >= 1 && s.length <= 80),
    category: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length >= 1),
    location: fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length >= 1),
    employmentType: fc.constantFrom(...EMPLOYMENT_TYPES),
  });

// ─── Invalid field generators ────────────────────────────────────────────────

/** Generates an empty or whitespace-only string (invalid for required fields) */
const emptyOrWhitespace = () => fc.constantFrom('', '   ', '\t', '\n');

/** Generates a string whose trimmed length exceeds 120 characters */
const tooLongTitle = () =>
  fc.string({ minLength: 121, maxLength: 200 }).filter((s) => s.trim().length > 120);

/** Generates a string whose trimmed length exceeds 100 characters */
const tooLongLocation = () =>
  fc.string({ minLength: 101, maxLength: 200 }).filter((s) => s.trim().length > 100);

/** Generates a category value that's empty (the only invalid case now — free text allowed) */
const invalidCategory = () => emptyOrWhitespace();

/** Generates an employment type not in the allowed enum */
const invalidEmploymentType = () =>
  fc.string({ minLength: 1 }).filter((s) => !EMPLOYMENT_TYPES.includes(s.trim()));

/** Generates an invalid slug (contains uppercase, spaces, special chars, or exceeds max length) */
const invalidSlug = () =>
  fc.oneof(
    // Slug with uppercase letters
    fc.constantFrom('My-Slug', 'UPPER', 'mixedCase'),
    // Slug with spaces or special characters
    fc.constantFrom('has space', 'special!char', 'under_score', 'dot.slug'),
    // Slug starting or ending with hyphen
    fc.constantFrom('-leading', 'trailing-', '-both-'),
    // Slug with consecutive hyphens
    fc.constantFrom('double--hyphen', 'triple---hyphen'),
    // Slug exceeding 80 characters (valid chars but too long)
    fc.integer({ min: 81, max: 120 }).map((len) => 'a'.repeat(len)),
    // Random strings that fail the slug pattern
    fc.string({ minLength: 1, maxLength: 80 }).filter(
      (s) => s.trim().length > 0 && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.trim())
    )
  );

/** Generates an invalid WhatsApp number (non-digits, too short, or too long) */
const invalidWhatsApp = () =>
  fc.oneof(
    // Contains non-digit characters
    fc.string({ minLength: 7, maxLength: 15 }).filter((s) => s.trim().length >= 7 && !/^\d{7,15}$/.test(s.trim())),
    // Too short (1-6 digits)
    fc.stringMatching(/^\d{1,6}$/),
    // Too long (16+ digits)
    fc.stringMatching(/^\d{16,20}$/)
  );

/** Generates an invalid email address */
const invalidEmail = () =>
  fc.oneof(
    fc.constant('notanemail'),
    fc.constant('missing@domain'),
    fc.constant('@nodomain.com'),
    fc.constant('spaces in@email.com'),
    fc.string({ minLength: 1, maxLength: 30 }).filter(
      (s) => s.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
    )
  );

// ─── Property Tests ──────────────────────────────────────────────────────────

describe('Feature: admin-job-panel, Property 4: Form validation rejects invalid data', () => {
  it('rejects form data when title is missing or empty', () => {
    fc.assert(
      fc.property(validFormData(), emptyOrWhitespace(), (base, invalidTitle) => {
        const formData = { ...base, title: invalidTitle };
        const result = validateForm(formData);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty('title');
      }),
      { numRuns: 100 }
    );
  });

  it('rejects form data when title exceeds 120 characters', () => {
    fc.assert(
      fc.property(validFormData(), tooLongTitle(), (base, longTitle) => {
        const formData = { ...base, title: longTitle };
        const result = validateForm(formData);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty('title');
      }),
      { numRuns: 100 }
    );
  });

  it('rejects form data when category is missing or empty', () => {
    fc.assert(
      fc.property(validFormData(), invalidCategory(), (base, badCategory) => {
        const formData = { ...base, category: badCategory };
        const result = validateForm(formData);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty('category');
      }),
      { numRuns: 100 }
    );
  });

  it('rejects form data when location is missing or empty', () => {
    fc.assert(
      fc.property(validFormData(), emptyOrWhitespace(), (base, invalidLocation) => {
        const formData = { ...base, location: invalidLocation };
        const result = validateForm(formData);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty('location');
      }),
      { numRuns: 100 }
    );
  });

  it('rejects form data when location exceeds 100 characters', () => {
    fc.assert(
      fc.property(validFormData(), tooLongLocation(), (base, longLocation) => {
        const formData = { ...base, location: longLocation };
        const result = validateForm(formData);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty('location');
      }),
      { numRuns: 100 }
    );
  });

  it('rejects form data when employmentType is not in the allowed enum', () => {
    fc.assert(
      fc.property(validFormData(), invalidEmploymentType(), (base, badType) => {
        const formData = { ...base, employmentType: badType };
        const result = validateForm(formData);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty('employmentType');
      }),
      { numRuns: 100 }
    );
  });

  it('rejects form data when slug has invalid format', () => {
    fc.assert(
      fc.property(validFormData(), invalidSlug(), (base, badSlug) => {
        const formData = { ...base, slug: badSlug };
        const result = validateForm(formData);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty('slug');
      }),
      { numRuns: 100 }
    );
  });

  it('rejects form data when contactWhatsApp has invalid format', () => {
    fc.assert(
      fc.property(validFormData(), invalidWhatsApp(), (base, badWhatsApp) => {
        const formData = { ...base, contactWhatsApp: badWhatsApp };
        const result = validateForm(formData);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty('contactWhatsApp');
      }),
      { numRuns: 100 }
    );
  });

  it('rejects form data when contactEmail has invalid format', () => {
    fc.assert(
      fc.property(validFormData(), invalidEmail(), (base, badEmail) => {
        const formData = { ...base, contactEmail: badEmail };
        const result = validateForm(formData);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveProperty('contactEmail');
      }),
      { numRuns: 100 }
    );
  });

  it('returns error entries for each invalid field when multiple fields are invalid', () => {
    fc.assert(
      fc.property(
        emptyOrWhitespace(),
        emptyOrWhitespace(),
        emptyOrWhitespace(),
        invalidEmploymentType(),
        (badTitle, badCategory, badLocation, badType) => {
          const formData = {
            title: badTitle,
            slug: 'valid-slug',
            category: badCategory,
            location: badLocation,
            employmentType: badType,
          };
          const result = validateForm(formData);
          expect(result.valid).toBe(false);
          expect(result.errors).toHaveProperty('title');
          expect(result.errors).toHaveProperty('category');
          expect(result.errors).toHaveProperty('location');
          expect(result.errors).toHaveProperty('employmentType');
        }
      ),
      { numRuns: 100 }
    );
  });
});
