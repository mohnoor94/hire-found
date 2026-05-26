/**
 * Property-Based Tests for Slug Generation
 * Feature: admin-job-panel, Property 5: Slug generation structural invariants
 *
 * **Validates: Requirements 3.5, 8.5**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateSlug } from '../js/editor.js';

describe('Feature: admin-job-panel, Property 5: Slug generation structural invariants', () => {
  it('slug contains only lowercase alphanumeric characters and hyphens', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (title) => {
          const slug = generateSlug(title);
          // If the title produces a non-empty slug, it must only contain valid chars
          if (slug.length > 0) {
            expect(slug).toMatch(/^[a-z0-9-]+$/);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('slug does not start or end with a hyphen', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (title) => {
          const slug = generateSlug(title);
          if (slug.length > 0) {
            expect(slug[0]).not.toBe('-');
            expect(slug[slug.length - 1]).not.toBe('-');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('slug does not contain consecutive hyphens', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (title) => {
          const slug = generateSlug(title);
          expect(slug).not.toMatch(/--/);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('slug length is at most 80 characters', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (title) => {
          const slug = generateSlug(title);
          expect(slug.length).toBeLessThanOrEqual(80);
        }
      ),
      { numRuns: 100 }
    );
  });
});
