// Phase 5 Optimization: Deferred Firebase initialization using requestIdleCallback
// This prevents Firebase from blocking the main thread during page load
// Firebase will only initialize when the browser is idle

let firebaseInitPromise = null;
let firebaseReady = false;

export const initializeFirebaseDeferred = () => {
  // Return cached promise if already initiated
  if (firebaseInitPromise) return firebaseInitPromise;

  // Create promise that will resolve when Firebase is ready
  firebaseInitPromise = new Promise((resolve) => {
    if (typeof window === 'undefined') {
      // SSR: Initialize immediately
      const { getAuthInstance, getDbInstance, getRtdbInstance } = require('./firebase');
      firebaseReady = true;
      resolve({ getAuthInstance, getDbInstance, getRtdbInstance });
      return;
    }

    // Browser: Defer using requestIdleCallback (or setTimeout fallback)
    const initCallback = () => {
      const { getAuthInstance, getDbInstance, getRtdbInstance } = require('./firebase');
      firebaseReady = true;
      resolve({ getAuthInstance, getDbInstance, getRtdbInstance });
    };

    // Use requestIdleCallback if available (Chrome/Edge), fallback to setTimeout
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(initCallback, { timeout: 2000 }); // Max 2s wait
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(initCallback, 0);
    }
  });

  return firebaseInitPromise;
};

// Get auth with deferred initialization
export const getDeferredAuth = async () => {
  const { getAuthInstance } = await initializeFirebaseDeferred();
  return getAuthInstance();
};

// Get Firestore with deferred initialization
export const getDeferredDb = async () => {
  const { getDbInstance } = await initializeFirebaseDeferred();
  return getDbInstance();
};

// Get RTDB with deferred initialization
export const getDeferredRtdb = async () => {
  const { getRtdbInstance } = await initializeFirebaseDeferred();
  return getRtdbInstance();
};

export const isFirebaseReady = () => firebaseReady;
