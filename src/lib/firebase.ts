/**
 * Firebase client module — same project as js/firebase-config.js.
 * Browser Auth + Firestore only. No Hosting, Functions, or Storage.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYBL38_wVPeNmjl4C0ci22Np5Tw7YaNzw",
  authDomain: "hire-found.firebaseapp.com",
  projectId: "hire-found",
  storageBucket: "hire-found.firebasestorage.app",
  messagingSenderId: "812389969333",
  appId: "1:812389969333:web:cbed15aa6153609a523dfc",
  measurementId: "G-F5CWDK4XEK",
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
  app = undefined;
  db = undefined;
  auth = undefined;
}

export { app, db, auth, firebaseConfig };
