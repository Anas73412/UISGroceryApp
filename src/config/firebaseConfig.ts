import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Set these in env or replace with your Firebase web app config.
 * When apiKey is empty, order tracking falls back to REST polling.
 */
export const FIREBASE_WEB_CONFIG = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    FIREBASE_WEB_CONFIG.apiKey?.trim() &&
      FIREBASE_WEB_CONFIG.projectId?.trim(),
  );
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length
      ? getApps()[0]
      : initializeApp(FIREBASE_WEB_CONFIG);
  }
  return app;
}

export function getFirebaseDb(): Firestore | null {
  if (!isFirebaseConfigured()) return null;
  if (!db) {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return null;
    db = getFirestore(firebaseApp);
  }
  return db;
}
