/**
 * Unit Tests for Dashboard Filter Logic
 * Tests the filterJobs function for search, category, and status filtering.
 *
 * **Validates: Requirements 2.3, 2.4, 2.5, 2.6, 2.7**
 */

import { describe, it, expect } from 'vitest';
import { filterJobs } from '../js/dashboard.js';

const sampleJobs = [
  { id: '1', title: 'Hotel Manager', companyName: 'Marriott', location: 'Dubai', category: 'hospitality', isActive: true },
  { id: '2', title: 'Software Engineer', companyName: 'TechCorp', location: 'Abu Dhabi', category: 'tech', isActive: true },
  { id: '3', title: 'Head Chef', companyName: 'Nobu', location: 'Dubai', category: 'fnb', isActive: false },
  { id: '4', title: 'Pilot', companyName: 'Emirates', location: 'Dubai', category: 'aviation', isActive: true },
  { id: '5', title: 'Receptionist', companyName: 'Hilton', location: 'Sharjah', category: 'hospitality', isActive: false },
];

describe('filterJobs', () => {
  describe('search filter', () => {
    it('returns all jobs when search text is empty', () => {
      const result = filterJobs(sampleJobs, { searchText: '' });
      expect(result).toHaveLength(5);
    });

    it('filters by title (case-insensitive)', () => {
      const result = filterJobs(sampleJobs, { searchText: 'hotel' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('filters by companyName (case-insensitive)', () => {
      const result = filterJobs(sampleJobs, { searchText: 'nobu' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('filters by location (case-insensitive)', () => {
      const result = filterJobs(sampleJobs, { searchText: 'dubai' });
      expect(result).toHaveLength(3);
    });

    it('trims whitespace from search text', () => {
      const result = filterJobs(sampleJobs, { searchText: '  pilot  ' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });
  });

  describe('category filter', () => {
    it('returns all jobs when category is "all"', () => {
      const result = filterJobs(sampleJobs, { category: 'all' });
      expect(result).toHaveLength(5);
    });

    it('filters by specific category', () => {
      const result = filterJobs(sampleJobs, { category: 'hospitality' });
      expect(result).toHaveLength(2);
      expect(result.every((j) => j.category === 'hospitality')).toBe(true);
    });

    it('returns empty array for category with no matches', () => {
      const result = filterJobs(sampleJobs, { category: 'other' });
      expect(result).toHaveLength(0);
    });
  });

  describe('status filter', () => {
    it('returns all jobs when status is "all"', () => {
      const result = filterJobs(sampleJobs, { status: 'all' });
      expect(result).toHaveLength(5);
    });

    it('filters active jobs only', () => {
      const result = filterJobs(sampleJobs, { status: 'active' });
      expect(result).toHaveLength(3);
      expect(result.every((j) => j.isActive !== false)).toBe(true);
    });

    it('filters inactive jobs only', () => {
      const result = filterJobs(sampleJobs, { status: 'inactive' });
      expect(result).toHaveLength(2);
      expect(result.every((j) => j.isActive === false)).toBe(true);
    });
  });

  describe('combined filters (AND logic)', () => {
    it('applies search + category simultaneously', () => {
      const result = filterJobs(sampleJobs, { searchText: 'dubai', category: 'hospitality' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('applies search + status simultaneously', () => {
      const result = filterJobs(sampleJobs, { searchText: 'dubai', status: 'inactive' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('applies category + status simultaneously', () => {
      const result = filterJobs(sampleJobs, { category: 'hospitality', status: 'active' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('applies all three filters simultaneously', () => {
      const result = filterJobs(sampleJobs, { searchText: 'dubai', category: 'fnb', status: 'inactive' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('returns empty when combined filters exclude everything', () => {
      const result = filterJobs(sampleJobs, { searchText: 'dubai', category: 'tech', status: 'active' });
      expect(result).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('handles empty jobs array', () => {
      const result = filterJobs([], { searchText: 'test' });
      expect(result).toHaveLength(0);
    });

    it('handles jobs with missing fields', () => {
      const jobs = [
        { id: '1', title: 'Test', isActive: true },
        { id: '2', title: 'Another', companyName: null, location: undefined, isActive: false },
      ];
      const result = filterJobs(jobs, { searchText: 'test' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('treats jobs without isActive field as active', () => {
      const jobs = [{ id: '1', title: 'Test' }];
      const result = filterJobs(jobs, { status: 'active' });
      expect(result).toHaveLength(1);
    });

    it('uses default filters when no options provided', () => {
      const result = filterJobs(sampleJobs);
      expect(result).toHaveLength(5);
    });
  });
});
