/**
 * Mock for Firebase Firestore CDN module.
 * Provides stub exports so dashboard.js can be imported in Node.js tests.
 */

export function collection() { return {}; }
export function getDocs() { return Promise.resolve({ forEach() {} }); }
export function query() { return {}; }
export function orderBy() { return {}; }
