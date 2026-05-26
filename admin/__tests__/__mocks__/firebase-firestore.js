/**
 * Mock for Firebase Firestore CDN module.
 * Provides stub exports so dashboard.js and app.js can be imported in Node.js tests.
 */

export function collection() { return {}; }
export function getDocs() { return Promise.resolve({ forEach() {}, empty: true }); }
export function query() { return {}; }
export function orderBy() { return {}; }
export function addDoc() { return Promise.resolve({ id: 'mock-id' }); }
export function where() { return {}; }
export function serverTimestamp() { return { _type: 'serverTimestamp' }; }
