// service-worker.js

const CACHE_VERSION = 'tv-portfolio-cache-v1';
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/visuals/Merova.woff2',
  '/visuals/Merova.otf',
  '/audio/channel-click1.aif',
  '/audio/channel-click2.aif',
  '/audio/channel-click3.aif',
  '/audio/channel-click4.aif',
  '/audio/channel-click5.aif',
  '/audio/channel-click6.aif',
  '/audio/channel-click7.aif',
  '/audio/channel-click8.aif',
  '/audio/channel-click9.aif',
  '/audio/channel-click10.aif',
  '/audio/channel-click11.aif',
  '/static-resume.pdf'
];

// Installation: Cache all necessary assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(CACHE_ASSETS);
      })
      .catch(error => console.error('Failed to cache assets during install:', error))
  );
});

// Activation: Remove old caches and claim control of clients immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_VERSION)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Serve requests from cache, falling back to network if not cached
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cachedResponse = await caches.match(event.request);
    try {
      const networkResponse = await fetch(event.request);
      // Cache only GET requests with successful responses
      if (event.request.method === 'GET' && networkResponse && networkResponse.status === 200) {
        const responseClone = networkResponse.clone();
        const cache = await caches.open(CACHE_VERSION);
        cache.put(event.request, responseClone);
      }
      return networkResponse;
    } catch (error) {
      // If network fails, return cached version (if available)
      return cachedResponse;
    }
  })());
});

// Background Sync for Analytics
self.addEventListener('sync', event => {
  if (event.tag === 'analytics') {
    event.waitUntil(sendAnalyticsData());
  }
});

async function sendAnalyticsData() {
  console.log("Background Sync: Analytics data sent.");
  // Implement sending queued analytics data here if needed.
  return Promise.resolve();
}

// Periodic Sync for Content Updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-update') {
    event.waitUntil(updateCachedContent());
  }
});

async function updateCachedContent() {
  console.log("Periodic Sync: Content updated.");
  // Implement periodic cache updates if needed.
  return Promise.resolve();
}
