// Service Worker for Shop Order Tracker PWA
const CACHE_NAME = 'shop-order-tracker-v3'; // Updated cache version for wget offline support
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/assets/index-CLaRkcQM.css',
  '/assets/index-CdjcC5ru.js'
];

// Pages to cache for offline use
const OFFLINE_URL = '/offline.html';

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - improved offline strategy with stale-while-revalidate pattern
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      // Try network first, then fall back to offline page
      fetch(event.request)
        .then(response => {
          // Cache the latest version of the page
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If navigation fails, show offline page
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }
  
  // For API requests (IndexedDB will handle data persistence)
  if (event.request.url.includes('/api/')) {
    // Let the browser handle these requests normally
    // IndexedDB operations will work offline without network
    return;
  }
  
  // For assets and other resources, use stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Create a promise that resolves with the network fetch
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              // Clone the response
              const responseToCache = networkResponse.clone();
              // Update the cache with the new response
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Network request failed, provide appropriate fallbacks
            if (event.request.destination === 'image') {
              return caches.match('/icons/icon.svg');
            } else if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            } else if (event.request.destination === 'style') {
              // Return an empty CSS response as fallback
              return new Response('', {headers: {'Content-Type': 'text/css'}});
            } else if (event.request.destination === 'script') {
              // For scripts, return an empty script to prevent errors
              return new Response('', {headers: {'Content-Type': 'application/javascript'}});
            }
            // For other types, let the error propagate
            throw new Error('Network request failed and no suitable fallback');
          });

        // Return the cached response immediately if we have one, otherwise wait for the network response
        return cachedResponse || fetchPromise;
      })
  );
});

// Add a message event listener to handle communication with the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});