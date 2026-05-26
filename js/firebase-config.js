/**
 * firebase-config.js — Firebase initialization module.
 * Initializes Firebase v9+ modular SDK via CDN ESM imports.
 * Exports the Firestore database instance for use by other modules.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyExample-placeholder",
  authDomain: "hirefound.firebaseapp.com",
  projectId: "hirefound",
  storageBucket: "hirefound.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000"
};

let db;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization failed:', error);
  db = undefined;
}

export { db };
