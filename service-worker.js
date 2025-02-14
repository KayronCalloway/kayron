const CACHE_VERSION = 'tv-portfolio-cache-v1';
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/youtube-setup.js',
  '/visuals/Merova.woff2',
  // Removed Merova.otf (if not available)
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      console.log('Opened cache');
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_VERSION) return caches.delete(key);
      }))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        const clone = networkResponse.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        return networkResponse;
      });
      return cached || fetchPromise;
    })
  );
});
