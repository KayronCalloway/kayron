// service-worker.js

const CACHE_VERSION = 'tv-portfolio-cache-v3';
const CACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './youtube-setup.js',
  './menu-manager.js',
  './robots.txt',
  './sitemap.xml',
  './visuals/Merova.otf',
  './visuals/favicon.svg',
  './visuals/icon-192.png',
  './visuals/icon-512.png',
  './visuals/full-logo.svg',
  './audio/channel-click1.mp3',
  './audio/channel-click2.mp3',
  './audio/channel-click3.mp3',
  './audio/channel-click4.mp3',
  './audio/channel-click5.mp3',
  './audio/channel-click6.mp3',
  './audio/channel-click7.mp3',
  './audio/channel-click8.mp3',
  './audio/channel-click9.mp3',
  './audio/channel-click10.mp3',
  './audio/channel-click11.mp3',
  './audio/click.mp3',
  './resume_v2.html'
];

// Installation: Cache all necessary assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => {
        return cache.addAll(CACHE_ASSETS);
      })
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
  // Implement periodic cache updates if needed.
  return Promise.resolve();
}
