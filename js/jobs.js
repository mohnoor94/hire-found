/**
 * jobs.js — Shared logic for fetching, filtering, and rendering jobs.
 * Used by both the Jobs page (/jobs/index.html) and the Homepage (/index.html).
 * 
 * This module is a vanilla JavaScript ES module (no build step, no npm).
 */

import { collection, query, where, orderBy, limit as firestoreLimit, getDocs } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';
import { db } from './firebase-config.js';

// ─── Constants ───────────────────────────────────────────────────────────────

export const DEFAULTS = {
  whatsApp: '962793001043',
  email: 'yasmin@hirefound.com',
  calLink: 'https://cal.com/yasminblasi',
  queryTimeout: 10000 // 10 seconds
};

export const CATEGORY_COLORS = {
  hospitality: { bg: 'bg-primary/10', text: 'text-primary' },
  tech:        { bg: 'bg-blue-50', text: 'text-blue-700' },
  fnb:         { bg: 'bg-amber-50', text: 'text-amber-700' },
  aviation:    { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  other:       { bg: 'bg-gray-100', text: 'text-gray-600' }
};

// ─── Utility Functions ───────────────────────────────────────────────────────

/**
 * Detects whether a string contains at least one Arabic character.
 * Checks Unicode range \u0600-\u06FF.
 * @param {string} text - The text to check.
 * @returns {boolean} True if the text contains Arabic characters.
 */
export function containsArabic(text) {
  if (!text) return false;
  return /[\u0600-\u06FF]/.test(text);
}

/**
 * Truncates text to a maximum length, appending an ellipsis character "…" if needed.
 * If the text length is at or below maxLength, returns the original string unchanged.
 * Otherwise returns a string of exactly maxLength characters where the last character
 * is "…" and the preceding characters are a prefix of the original.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum allowed length (including ellipsis).
 * @returns {string} The original or truncated text.
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

/**
 * Converts a Date object to a relative time string.
 * Returns strings like "just now", "1 minute ago", "2 hours ago", "3 days ago",
 * "1 month ago", "1 year ago", etc.
 * @param {Date} timestamp - The date to convert.
 * @returns {string} A human-readable relative time string.
 */
export function getRelativeTime(timestamp) {
  if (!timestamp) return '';

  const now = new Date();
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes === 1) return '1 minute ago';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  if (diffYears === 1) return '1 year ago';
  return `${diffYears} years ago`;
}

/**
 * Extracts distinct category values from a list of jobs.
 * @param {Array} jobs - Array of job objects with a `category` field.
 * @returns {string[]} Array of distinct category strings.
 */
export function getCategories(jobs) {
  if (!jobs || !Array.isArray(jobs)) return [];
  return [...new Set(jobs.map(job => job.category).filter(Boolean))];
}

/**
 * Filters jobs by category. When category is "all" (case-insensitive),
 * returns the full list. Otherwise returns only jobs whose category
 * field matches the given category.
 * @param {Array} jobs - Array of job objects.
 * @param {string} category - The category to filter by, or "all" for no filter.
 * @returns {Array} Filtered array of job objects.
 */
export function filterByCategory(jobs, category) {
  if (!jobs || !Array.isArray(jobs)) return [];
  if (!category || category.toLowerCase() === 'all') return jobs;
  return jobs.filter(job => job.category === category);
}

// ─── Data Fetching ───────────────────────────────────────────────────────────

/**
 * Fetches active, non-expired jobs from Firestore.
 * Queries the `jobs` collection where isActive === true, ordered by createdAt desc.
 * Supports an optional limit for homepage use (e.g., 4 jobs).
 * Implements a 10-second timeout using Promise.race.
 * Filters out expired jobs client-side (expiresAt < now).
 * Converts Firestore Timestamps to JavaScript Date objects.
 *
 * @param {Object} [options] - Fetch options.
 * @param {number} [options.limit] - Maximum number of jobs to fetch from Firestore.
 * @returns {Promise<Array>} Array of job objects with Date fields.
 * @throws {Error} If db is undefined or query fails/times out.
 */
export async function fetchJobs(options = {}) {
  // Handle undefined db gracefully — throw immediately
  if (!db) {
    throw new Error('Firestore database is not initialized. Check Firebase configuration.');
  }

  // Build query constraints
  const constraints = [
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  ];

  if (options.limit) {
    constraints.push(firestoreLimit(options.limit));
  }

  const jobsRef = collection(db, 'jobs');
  const q = query(jobsRef, ...constraints);

  // Create timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Query timed out after 10 seconds.'));
    }, DEFAULTS.queryTimeout);
  });

  // Race the Firestore query against the timeout
  const snapshot = await Promise.race([
    getDocs(q),
    timeoutPromise
  ]);

  // Convert documents to job objects and filter expired ones
  const now = new Date();
  const jobs = [];

  snapshot.forEach((doc) => {
    const data = doc.data();

    // Convert Firestore Timestamps to Date objects
    const createdAt = data.createdAt ? data.createdAt.toDate() : null;
    const updatedAt = data.updatedAt ? data.updatedAt.toDate() : null;
    const expiresAt = data.expiresAt ? data.expiresAt.toDate() : null;

    // Filter out expired jobs client-side
    if (expiresAt && expiresAt < now) {
      return; // Skip expired job
    }

    jobs.push({
      id: doc.id,
      ...data,
      createdAt,
      updatedAt,
      expiresAt
    });
  });

  return jobs;
}
