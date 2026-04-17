// Service Worker - Cache static assets for better performance
const CACHE_NAME = 'taskmanager-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Ignore failures for optional assets
      });
    })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // ✅ IMPORTANT: Exclure les requêtes qui ne peuvent pas être cachées
  const url = event.request.url;
  
  // Ne pas cacher les extensions Chrome
  if (url.startsWith('chrome-extension://')) {
    return;
  }

  // Ne pas cacher les requêtes API ou Firebase
  if (
    url.includes('/api/') ||
    url.includes('firebaseio') ||
    url.includes('googleapis')
  ) {
    event.respondWith(fetch(event.request).catch(() => null));
    return;
  }

  // For static assets: cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        // Don't cache if not a success response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // Clone the response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // ✅ Vérifier que c'est cacheable avant de mettre en cache
          if (response.ok && response.headers.get('content-type')) {
            cache.put(event.request, responseToCache).catch(() => {
              // Silently fail if caching fails (e.g., storage full)
            });
          }
        });
        return response;
      });
    }).catch(() => {
      // Offline fallback
      return caches.match('/');
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
