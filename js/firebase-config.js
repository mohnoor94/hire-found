/**
 * firebase-config.js — Firebase initialization module.
 * Initializes Firebase v9+ modular SDK via CDN ESM imports.
 * Exports the Firebase app, Firestore database, and Auth instances for use by other modules.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyBYBL38_wVPeNmjl4C0ci22Np5Tw7YaNzw",
  authDomain: "hire-found.firebaseapp.com",
  projectId: "hire-found",
  storageBucket: "hire-found.firebasestorage.app",
  messagingSenderId: "812389969333",
  appId: "1:812389969333:web:cbed15aa6153609a523dfc",
  measurementId: "G-F5CWDK4XEK"
};

let app;
let db;
let auth;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization failed:', error);
  app = undefined;
  db = undefined;
  auth = undefined;
}

export { app, db, auth };
