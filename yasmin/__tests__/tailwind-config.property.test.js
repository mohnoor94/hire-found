/**
 * Property-Based Tests for Tailwind Config Preservation
 * Feature: yasmin-admin-experience, Property 4: Original Tailwind color tokens are preserved alongside butterfly tokens
 *
 * **Validates: Requirements 4.5, 4.1**
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fc from 'fast-check';

// The Tailwind config is a side-effect script that sets `tailwind.config` on the global scope.
// We simulate the global `tailwind` object and then load the config.
let colors;

beforeAll(async () => {
  globalThis.tailwind = {};
  await import('../../js/tailwind-config.js');
  colors = globalThis.tailwind.config.theme.extend.colors;
});

// ─── Expected original color tokens with their values ────────────────────────

const ORIGINAL_TOKENS = {
  primary: '#8B2252',
  'primary-light': '#A63B6B',
  'primary-dark': '#6D1A3F',
  secondary: '#D4A574',
  'secondary-light': '#E0BA92',
  warm: '#FFFAF5',
  'warm-dark': '#F8F0EA',
  dark: '#1A1A2E',
  'dark-light': '#252540',
  'text-main': '#2D2926',
  muted: '#8A8380',
  success: '#7A9E7E',
  whatsapp: '#25D366',
};

// ─── Expected butterfly color tokens ─────────────────────────────────────────

const BUTTERFLY_TOKENS = {
  'butterfly-lavender': '#C4B5FD',
  'butterfly-rose': '#FDA4AF',
  'butterfly-gold': '#FCD34D',
};

// ─── Property Tests ──────────────────────────────────────────────────────────

describe('Feature: yasmin-admin-experience, Property 4: Original Tailwind color tokens are preserved alongside butterfly tokens', () => {
  it('every original color token is present with its original value', () => {
    const originalTokenNames = Object.keys(ORIGINAL_TOKENS);

    fc.assert(
      fc.property(
        fc.constantFrom(...originalTokenNames),
        (tokenName) => {
          expect(colors).toHaveProperty(tokenName);
          expect(colors[tokenName]).toBe(ORIGINAL_TOKENS[tokenName]);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('butterfly-lavender, butterfly-rose, and butterfly-gold are present with correct values', () => {
    const butterflyTokenNames = Object.keys(BUTTERFLY_TOKENS);

    fc.assert(
      fc.property(
        fc.constantFrom(...butterflyTokenNames),
        (tokenName) => {
          expect(colors).toHaveProperty(tokenName);
          expect(colors[tokenName]).toBe(BUTTERFLY_TOKENS[tokenName]);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no original token has been overwritten or removed by butterfly additions', () => {
    const allExpectedTokens = { ...ORIGINAL_TOKENS, ...BUTTERFLY_TOKENS };
    const allTokenNames = Object.keys(allExpectedTokens);

    fc.assert(
      fc.property(
        fc.constantFrom(...allTokenNames),
        (tokenName) => {
          expect(colors[tokenName]).toBe(allExpectedTokens[tokenName]);
        }
      ),
      { numRuns: 100 }
    );
  });
});
