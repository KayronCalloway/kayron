// service-worker.js

const CACHE_VERSION = 'tv-portfolio-cache-v2';
const CACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './menu-manager.js',
  './visuals/Merova.otf',
  './visuals/static.gif',
  './visuals/static.png',
  './visuals/tv-grain.png',
  './audio/click.mp3',
  './audio/channel-click1.aif',
  './audio/channel-click2.aif',
  './audio/channel-click3.aif',
  './audio/channel-click4.aif',
  './audio/channel-click5.aif',
  './audio/channel-click6.aif',
  './audio/channel-click7.aif',
  './audio/channel-click8.aif',
  './audio/channel-click9.aif',
  './audio/channel-click10.aif',
  './audio/channel-click11.aif',
  './audio/gameshow.aif',
  './audio/ka-ching.mp3',
  './audio/ticker-hum.mp3',
  './audio/whoosh.mp3',
  './channels/ch1/home.js',
  './channels/ch2/ch2.js',
  './channels/ch3/ch3.js',
  './channels/ch4/ch4.js'
  // './static-resume.pdf' - commented until file exists
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
  // Check if the request is for an image
  const isImage = event.request.destination === 'image' || 
                  event.request.url.match(/\.(jpe?g|png|gif|webp|svg)$/i);
                  
  // Strategy: Network first for HTML and CSS, Cache first for images and static assets
  if (event.request.mode === 'navigate' || 
      event.request.destination === 'style' || 
      event.request.destination === 'script') {
    // Use network first strategy for HTML, CSS, JS
    event.respondWith((async () => {
      try {
        // Try network first
        const networkResponse = await fetch(event.request);
        // Cache the response for future
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          const cache = await caches.open(CACHE_VERSION);
          cache.put(event.request, responseClone);
        }
        return networkResponse;
      } catch (error) {
        // Fall back to cache if network fails
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })());
  } else if (isImage) {
    // Use cache first for images to improve mobile performance
    event.respondWith((async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        // Return cached image immediately
        // Then update cache in background
        fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const cache = caches.open(CACHE_VERSION);
              cache.then(c => c.put(event.request, networkResponse));
            }
          })
          .catch(error => console.log('Failed to update image cache:', error));
        
        return cachedResponse;
      }
      
      // If not in cache, get from network
      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          const cache = await caches.open(CACHE_VERSION);
          cache.put(event.request, responseClone);
        }
        return networkResponse;
      } catch (error) {
        // No fallback for uncached images
        console.log('Network error when fetching image:', error);
        return new Response('Image not available', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })());
  } else {
    // Default strategy for other requests
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
  }
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
