/**
 * Bug Condition Exploration Property Test
 * Feature: book-a-call-modal-consistency
 * Property 1: Bug Condition - Book a Call CTAs Render as External Links
 *
 * This test encodes the EXPECTED behavior: "Book a Call" CTAs should invoke
 * BookingModal.open() on click instead of navigating externally.
 *
 * On UNFIXED code, this test MUST FAIL — failure confirms the bug exists.
 * The CTAs are currently <a href="https://cal.com/yasminblasi" target="_blank"> links.
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { initFooter } from '../js/footer.js';
import { renderEmpty, renderJobDetail, DEFAULTS } from '../js/jobs.js';

/**
 * Generator for the three concrete bug condition cases:
 * - "footer": initFooter() Book a Call CTA
 * - "emptyState": renderEmpty() Book a Call CTA
 * - "jobDetailNoTally": renderJobDetail() (no Tally form) Book a Call CTA
 */
const bugConditionCaseArb = fc.constantFrom('footer', 'emptyState', 'jobDetailNoTally');

describe('Feature: book-a-call-modal-consistency, Property 1: Bug Condition - Book a Call CTAs Open Modal', () => {
  let container;

  beforeEach(() => {
    // Set up a fresh DOM container for each test
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);

    // Set up window.BookingModal mock to track calls
    window.BookingModal = {
      open: vi.fn(),
    };
  });

  it('Book a Call CTAs should NOT be external links with target="_blank" (bug condition)', () => {
    fc.assert(
      fc.property(
        bugConditionCaseArb,
        (sourceCase) => {
          // Reset container
          container.innerHTML = '';

          // Render the appropriate component
          switch (sourceCase) {
            case 'footer':
              initFooter(container);
              break;
            case 'emptyState':
              renderEmpty(container, 'No jobs found');
              break;
            case 'jobDetailNoTally': {
              const job = {
                title: 'Test Job',
                category: 'tech',
                location: 'Remote',
                employmentType: 'Full-time',
                fullDescription: 'A test job description.',
                slug: 'test-job',
                createdAt: new Date(),
                // No tallyFormId — triggers the "no Tally" branch
              };
              renderJobDetail(job, container);
              break;
            }
          }

          // Find the "Book a Call" element
          const allElements = container.querySelectorAll('a, button');
          let bookACallEl = null;
          for (const el of allElements) {
            if (el.textContent.trim().includes('Book a Call')) {
              bookACallEl = el;
              break;
            }
          }

          // The "Book a Call" element must exist
          expect(bookACallEl).not.toBeNull();

          // BUG CONDITION CHECK: The element should NOT be an anchor tag
          // linking to cal.com with target="_blank".
          // Expected behavior: it should be a button (or similar) that invokes
          // BookingModal.open() — NOT an external navigation link.
          const isExternalLink =
            bookACallEl.tagName === 'A' &&
            bookACallEl.getAttribute('href') === 'https://cal.com/yasminblasi' &&
            bookACallEl.getAttribute('target') === '_blank';

          // This assertion encodes the EXPECTED (fixed) behavior:
          // The CTA should NOT be an external link.
          expect(isExternalLink).toBe(false);
        }
      ),
      { numRuns: 3 }
    );
  });

  it('Book a Call CTAs should invoke BookingModal.open() on click (expected behavior)', () => {
    fc.assert(
      fc.property(
        bugConditionCaseArb,
        (sourceCase) => {
          // Reset container and mock
          container.innerHTML = '';
          window.BookingModal.open.mockClear();

          // Render the appropriate component
          switch (sourceCase) {
            case 'footer':
              initFooter(container);
              break;
            case 'emptyState':
              renderEmpty(container, 'No jobs found');
              break;
            case 'jobDetailNoTally': {
              const job = {
                title: 'Test Job',
                category: 'tech',
                location: 'Remote',
                employmentType: 'Full-time',
                fullDescription: 'A test job description.',
                slug: 'test-job',
                createdAt: new Date(),
              };
              renderJobDetail(job, container);
              break;
            }
          }

          // Find the "Book a Call" element
          const allElements = container.querySelectorAll('a, button');
          let bookACallEl = null;
          for (const el of allElements) {
            if (el.textContent.trim().includes('Book a Call')) {
              bookACallEl = el;
              break;
            }
          }

          expect(bookACallEl).not.toBeNull();

          // Click the element
          bookACallEl.click();

          // Expected behavior: BookingModal.open() should have been called
          expect(window.BookingModal.open).toHaveBeenCalled();
        }
      ),
      { numRuns: 3 }
    );
  });
});
