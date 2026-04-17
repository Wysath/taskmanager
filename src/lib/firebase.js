import { initializeApp, getApps } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "@firebase/firestore";
import { getDatabase } from "@firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Singleton pattern : garantit une seule instance Firebase par runtime
let authInstance;
let dbInstance;
let rtdbInstance;
let initialized = false;

const initializeFirebaseOnce = () => {
  if (initialized) {
    return { auth: authInstance, db: dbInstance, rtdb: rtdbInstance };
  }

  const existingApps = getApps();
  const app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);

  authInstance = getAuth(app);
  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  rtdbInstance = getDatabase(app);

  initialized = true;
  return { auth: authInstance, db: dbInstance, rtdb: rtdbInstance };
};

// Getters lazy pour initialisation à la demande
export const getAuthInstance = () => {
  const { auth } = initializeFirebaseOnce();
  return auth;
};

export const getDbInstance = () => {
  const { db } = initializeFirebaseOnce();
  return db;
};

export const getRtdbInstance = () => {
  const { rtdb } = initializeFirebaseOnce();
  return rtdb;
};

const { auth, db, rtdb } = initializeFirebaseOnce();
export { auth, db, rtdb };