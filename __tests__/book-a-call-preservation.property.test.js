/**
 * Preservation Property Tests
 * Feature: book-a-call-modal-consistency
 * Property 2: Preservation - Non-Book-a-Call Interactions Unchanged
 *
 * These tests verify that non-"Book a Call" CTAs rendered by footer.js and jobs.js
 * retain their element type, href, and target attributes. They MUST PASS on unfixed
 * code — they capture existing behavior that must not regress after the fix.
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { initFooter } from '../js/footer.js';
import { renderEmpty, renderJobDetail, DEFAULTS } from '../js/jobs.js';

describe('Feature: book-a-call-modal-consistency, Property 2: Preservation - Non-Book-a-Call Interactions Unchanged', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('Footer non-Book-a-Call CTAs remain unchanged', () => {
    it('initFooter() renders "Chat on WhatsApp" as an <a> with correct href and target="_blank"', () => {
      fc.assert(
        fc.property(
          fc.constant('footer'),
          () => {
            container.innerHTML = '';
            initFooter(container);

            // Find the "Chat on WhatsApp" link
            const allLinks = container.querySelectorAll('a');
            let whatsAppLink = null;
            for (const link of allLinks) {
              if (link.textContent.trim().includes('Chat on WhatsApp')) {
                whatsAppLink = link;
                break;
              }
            }

            // Must exist as an anchor element
            expect(whatsAppLink).not.toBeNull();
            expect(whatsAppLink.tagName).toBe('A');

            // Must have correct href starting with https://wa.me/962793001043
            expect(whatsAppLink.getAttribute('href')).toContain('https://wa.me/962793001043');

            // Must open in new tab
            expect(whatsAppLink.getAttribute('target')).toBe('_blank');
          }
        ),
        { numRuns: 5 }
      );
    });

    it('initFooter() renders social links (LinkedIn, Instagram, Email) with correct hrefs', () => {
      fc.assert(
        fc.property(
          fc.constant('footer'),
          () => {
            container.innerHTML = '';
            initFooter(container);

            const allLinks = container.querySelectorAll('a');

            // Find LinkedIn link
            let linkedInLink = null;
            let instagramLink = null;
            let emailLink = null;

            for (const link of allLinks) {
              const href = link.getAttribute('href') || '';
              if (href.includes('linkedin.com/in/yasminblasi')) {
                linkedInLink = link;
              }
              if (href.includes('instagram.com/hirefound')) {
                instagramLink = link;
              }
              if (href.startsWith('mailto:yasmin@hirefound.com')) {
                emailLink = link;
              }
            }

            // LinkedIn: must be an <a> with target="_blank"
            expect(linkedInLink).not.toBeNull();
            expect(linkedInLink.tagName).toBe('A');
            expect(linkedInLink.getAttribute('target')).toBe('_blank');
            expect(linkedInLink.getAttribute('href')).toBe('https://www.linkedin.com/in/yasminblasi');

            // Instagram: must be an <a> with target="_blank"
            expect(instagramLink).not.toBeNull();
            expect(instagramLink.tagName).toBe('A');
            expect(instagramLink.getAttribute('target')).toBe('_blank');
            expect(instagramLink.getAttribute('href')).toBe('https://www.instagram.com/hirefound');

            // Email: must be an <a> with mailto: href (no target="_blank" needed)
            expect(emailLink).not.toBeNull();
            expect(emailLink.tagName).toBe('A');
            expect(emailLink.getAttribute('href')).toBe('mailto:yasmin@hirefound.com');
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('renderJobDetail() with Tally form does NOT render Book a Call', () => {
    /**
     * Generator for job objects WITH a tallyFormId.
     * For jobs with a Tally form, only WhatsApp + Email CTAs should appear.
     */
    const jobWithTallyArb = fc.record({
      title: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
      category: fc.constantFrom('hospitality', 'tech', 'fnb', 'aviation', 'other'),
      location: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
      employmentType: fc.constantFrom('Full-time', 'Part-time', 'Contract'),
      fullDescription: fc.string({ minLength: 1, maxLength: 100 }),
      slug: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/.test(s)),
      createdAt: fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }),
      tallyFormId: fc.string({ minLength: 3, maxLength: 10 }).filter(s => s.trim().length > 0),
    });

    it('renderJobDetail() with tallyFormId does NOT render a "Book a Call" CTA', () => {
      fc.assert(
        fc.property(
          jobWithTallyArb,
          (job) => {
            container.innerHTML = '';
            renderJobDetail(job, container);

            // Search for any element containing "Book a Call" text
            const allElements = container.querySelectorAll('a, button');
            let bookACallEl = null;
            for (const el of allElements) {
              if (el.textContent.trim().includes('Book a Call')) {
                bookACallEl = el;
                break;
              }
            }

            // When a Tally form is present, there should be NO "Book a Call" CTA
            expect(bookACallEl).toBeNull();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('renderJobDetail() with tallyFormId renders WhatsApp and Email CTAs', () => {
      fc.assert(
        fc.property(
          jobWithTallyArb,
          (job) => {
            container.innerHTML = '';
            renderJobDetail(job, container);

            const allLinks = container.querySelectorAll('a');

            // Find WhatsApp link
            let whatsAppLink = null;
            let emailLinkEl = null;
            for (const link of allLinks) {
              const href = link.getAttribute('href') || '';
              if (href.includes('wa.me/')) {
                whatsAppLink = link;
              }
              if (href.startsWith('mailto:')) {
                emailLinkEl = link;
              }
            }

            // WhatsApp must exist with target="_blank"
            expect(whatsAppLink).not.toBeNull();
            expect(whatsAppLink.tagName).toBe('A');
            expect(whatsAppLink.getAttribute('target')).toBe('_blank');

            // Email must exist with mailto: href
            expect(emailLinkEl).not.toBeNull();
            expect(emailLinkEl.tagName).toBe('A');
            expect(emailLinkEl.getAttribute('href')).toContain('mailto:');
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('renderJobDetail() without Tally form preserves WhatsApp and Email', () => {
    it('renderJobDetail() (no Tally form) renders WhatsApp link with target="_blank" and Email with mailto:', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            category: fc.constantFrom('hospitality', 'tech', 'fnb', 'aviation', 'other'),
            location: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
            employmentType: fc.constantFrom('Full-time', 'Part-time', 'Contract'),
            fullDescription: fc.string({ minLength: 1, maxLength: 100 }),
            slug: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/.test(s)),
            createdAt: fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }),
          }),
          (job) => {
            container.innerHTML = '';
            // No tallyFormId — triggers the "no Tally" branch
            renderJobDetail(job, container);

            const allLinks = container.querySelectorAll('a');

            // Find WhatsApp link
            let whatsAppLink = null;
            let emailLinkEl = null;
            for (const link of allLinks) {
              const href = link.getAttribute('href') || '';
              if (href.includes('wa.me/')) {
                whatsAppLink = link;
              }
              if (href.startsWith('mailto:')) {
                emailLinkEl = link;
              }
            }

            // WhatsApp must exist as <a> with target="_blank"
            expect(whatsAppLink).not.toBeNull();
            expect(whatsAppLink.tagName).toBe('A');
            expect(whatsAppLink.getAttribute('target')).toBe('_blank');

            // Email must exist as <a> with mailto: href
            expect(emailLinkEl).not.toBeNull();
            expect(emailLinkEl.tagName).toBe('A');
            expect(emailLinkEl.getAttribute('href')).toContain('mailto:');
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('renderEmpty() preserves WhatsApp link', () => {
    it('renderEmpty() renders WhatsApp link with target="_blank"', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          (message) => {
            container.innerHTML = '';
            renderEmpty(container, message);

            const allLinks = container.querySelectorAll('a');

            // Find WhatsApp link
            let whatsAppLink = null;
            for (const link of allLinks) {
              const href = link.getAttribute('href') || '';
              if (href.includes('wa.me/')) {
                whatsAppLink = link;
                break;
              }
            }

            // WhatsApp must exist as <a> with target="_blank"
            expect(whatsAppLink).not.toBeNull();
            expect(whatsAppLink.tagName).toBe('A');
            expect(whatsAppLink.getAttribute('target')).toBe('_blank');
            expect(whatsAppLink.getAttribute('href')).toContain('https://wa.me/962793001043');
          }
        ),
        { numRuns: 5 }
      );
    });
  });
});
