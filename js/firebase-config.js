/**
 * firebase-config.js — Firebase initialization module.
 * Initializes Firebase v9+ modular SDK via CDN ESM imports.
 * Exports the Firestore database instance for use by other modules.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBYBL38_wVPeNmjl4C0ci22Np5Tw7YaNzw",
  authDomain: "hire-found.firebaseapp.com",
  projectId: "hire-found",
  storageBucket: "hire-found.firebasestorage.app",
  messagingSenderId: "812389969333",
  appId: "1:812389969333:web:cbed15aa6153609a523dfc",
  measurementId: "G-F5CWDK4XEK"
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
