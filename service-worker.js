// service-worker.js - Enhanced PWA service worker with improved caching and error handling

const CACHE_VERSION = 'tv-portfolio-cache-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Assets that should be available offline (critical path resources)
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './css-variables.css',
  './script.js',
  './utils.js',
  './channelManager.js',
  './youtube-setup.js',
  './manifest.json',
  './visuals/Lvvvdy.otf',
  './visuals/Merova.otf',
  './visuals/static.gif',
  './visuals/static.png',
  './visuals/tv-grain.png',
  './audio/click.mp3',
  './audio/ka-ching.mp3',
  './audio/ticker-hum.mp3',
  './audio/whoosh.mp3',
  './channels/ch1/home.js',
  './channels/ch1/modals.html',
  './channels/ch2/ch2.js',
  './channels/ch2/infomercial.html',
  './channels/ch3/ch3.js',
  './channels/ch3/gameshow.html',
  './channels/ch4/ch4.js',
  './channels/ch4/index.html'
];

// Additional click sound assets (loaded on demand)
const CHANNEL_CLICK_ASSETS = Array.from({ length: 12 }, (_, i) => 
  `./audio/channel-click${i + 1}.aif`
);

// Queue to store failed requests for background sync
const backgroundSyncQueue = new Map();

/**
 * Helper: Log with timestamp
 */
function logWithTime(message, error = null) {
  const timestamp = new Date().toISOString();
  if (error) {
    console.error(`[SW ${timestamp}] ${message}`, error);
  } else {
    console.log(`[SW ${timestamp}] ${message}`);
  }
}

/**
 * Helper: Cache a network response
 */
async function cacheResponse(request, response, cacheName = DYNAMIC_CACHE) {
  if (request.method !== 'GET' || !response || !response.ok) {
    return;
  }
  
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  } catch (error) {
    logWithTime('Error caching response', error);
  }
}

/**
 * Installation: Cache all static assets
 */
self.addEventListener('install', event => {
  logWithTime('Installing Service Worker...');
  
  event.waitUntil(
    (async () => {
      try {
        // Open static cache and add core assets
        const staticCache = await caches.open(STATIC_CACHE);
        await staticCache.addAll(STATIC_ASSETS);
        
        // Create dynamic cache
        await caches.open(DYNAMIC_CACHE);
        
        // Skip waiting to activate immediately
        await self.skipWaiting();
        
        logWithTime('Service Worker installation complete');
      } catch (error) {
        logWithTime('Service Worker installation failed', error);
      }
    })()
  );
});

/**
 * Activation: Clean up old caches
 */
self.addEventListener('activate', event => {
  logWithTime('Activating Service Worker...');
  
  event.waitUntil(
    (async () => {
      try {
        // Get all cache keys
        const cacheKeys = await caches.keys();
        
        // Delete old caches
        const deletePromises = cacheKeys
          .filter(key => key.startsWith('tv-portfolio-cache-') && 
                          !key.startsWith(CACHE_VERSION))
          .map(key => {
            logWithTime(`Deleting old cache: ${key}`);
            return caches.delete(key);
          });
        
        await Promise.all(deletePromises);
        
        // Claim all clients
        await self.clients.claim();
        
        logWithTime('Service Worker activation complete');
      } catch (error) {
        logWithTime('Service Worker activation failed', error);
      }
    })()
  );
});

/**
 * Fetch: Apply different caching strategies based on resource type
 */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests or non-HTTP(S) requests
  if (event.request.method !== 'GET' || 
      !url.protocol.startsWith('http')) {
    return;
  }
  
  // Skip third-party requests (YouTube, analytics, etc.)
  if (!url.origin.includes('kayron') && 
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Choose caching strategy based on request
  let strategy;
  
  // HTML files: Network first, then cache
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    strategy = networkFirstStrategy;
  }
  // Static resources: Cache first, then network
  else if (url.pathname.match(/\.(js|css|otf|woff2?|ttf|jpg|jpeg|png|gif|svg|webp)$/)) {
    strategy = cacheFirstStrategy;
  }
  // Audio files: Cache first, then network
  else if (url.pathname.match(/\.(mp3|aif|wav|ogg)$/)) {
    strategy = cacheFirstStrategy;
  }
  // API requests or data: Network only
  else if (url.pathname.includes('/api/')) {
    strategy = networkOnlyStrategy;
  }
  // Default: Network first
  else {
    strategy = networkFirstStrategy;
  }
  
  event.respondWith(strategy(event.request));
});

/**
 * Strategy: Cache first, then network fallback
 */
async function cacheFirstStrategy(request) {
  try {
    // Try to find in cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not found, get from network
    const networkResponse = await fetch(request);
    
    // Clone response for caching
    const responseToCache = networkResponse.clone();
    
    // Cache the network response (non-blocking)
    cacheResponse(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    logWithTime(`Cache-first strategy failed for ${request.url}`, error);
    
    // If all fails, return a fallback
    return createFallbackResponse(request);
  }
}

/**
 * Strategy: Network first, then cache fallback
 */
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Clone response for caching if successful
    if (networkResponse && networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      cacheResponse(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    logWithTime(`Network request failed for ${request.url}, falling back to cache`, error);
    
    // Try from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If all fails, return a fallback
    return createFallbackResponse(request);
  }
}

/**
 * Strategy: Network only (no caching)
 */
async function networkOnlyStrategy(request) {
  try {
    return await fetch(request);
  } catch (error) {
    logWithTime(`Network-only request failed for ${request.url}`, error);
    
    // For API requests that fail, queue for background sync if applicable
    if (request.url.includes('/analytics') || request.url.includes('/error-log')) {
      await queueForBackgroundSync(request);
    }
    
    // Return a JSON error response for API requests
    if (request.url.includes('/api/')) {
      return new Response(JSON.stringify({ 
        error: 'Network request failed',
        offline: true 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Otherwise return generic fallback
    return createFallbackResponse(request);
  }
}

/**
 * Create a fallback response for failed requests
 */
function createFallbackResponse(request) {
  // For images
  if (request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
    return caches.match('./visuals/static.png');
  }
  
  // For audio files
  if (request.url.match(/\.(mp3|aif|wav|ogg)$/)) {
    return new Response('', { status: 200, headers: { 'Content-Type': 'audio/mp3' } });
  }
  
  // For HTML pages
  if (request.url.match(/\.html$/) || request.url.endsWith('/')) {
    return caches.match('./index.html');
  }
  
  // Generic fallback
  return new Response('Network Error. App is running in offline mode.', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

/**
 * Queue a request for background sync
 */
async function queueForBackgroundSync(request) {
  const timestamp = Date.now();
  const requestDetails = {
    url: request.url,
    method: request.method,
    headers: Array.from(request.headers.entries()),
    timestamp
  };
  
  // For POST requests, try to clone and extract the body
  if (request.method === 'POST' && request.clone().body) {
    try {
      const clone = request.clone();
      const body = await clone.text();
      requestDetails.body = body;
    } catch (error) {
      logWithTime('Could not extract body from request for background sync', error);
    }
  }
  
  // Add to queue
  backgroundSyncQueue.set(timestamp.toString(), requestDetails);
  logWithTime(`Request queued for background sync: ${request.url}`);
  
  // Register a sync if supported
  if ('sync' in self.registration) {
    try {
      await self.registration.sync.register('analytics-sync');
    } catch (error) {
      logWithTime('Failed to register background sync', error);
    }
  }
}

/**
 * Background sync event handler
 */
self.addEventListener('sync', event => {
  if (event.tag === 'analytics-sync') {
    logWithTime('Background sync triggered for analytics');
    
    event.waitUntil(
      processBackgroundSyncQueue()
    );
  }
});

/**
 * Process the background sync queue
 */
async function processBackgroundSyncQueue() {
  if (backgroundSyncQueue.size === 0) {
    logWithTime('Background sync queue is empty');
    return;
  }
  
  logWithTime(`Processing ${backgroundSyncQueue.size} items in background sync queue`);
  
  const queue = Array.from(backgroundSyncQueue.entries());
  
  for (const [id, requestDetails] of queue) {
    try {
      // Rebuild the request
      const request = new Request(requestDetails.url, {
        method: requestDetails.method,
        headers: requestDetails.headers,
        body: requestDetails.body,
        mode: 'cors'
      });
      
      // Try to send the request
      const response = await fetch(request);
      
      if (response && response.ok) {
        logWithTime(`Successfully sent queued request to ${requestDetails.url}`);
        backgroundSyncQueue.delete(id);
      } else {
        logWithTime(`Failed to send queued request to ${requestDetails.url}`);
      }
    } catch (error) {
      logWithTime(`Error processing background sync for ${requestDetails.url}`, error);
      
      // Keep old requests, but not too old (24 hours)
      const now = Date.now();
      if (now - requestDetails.timestamp > 24 * 60 * 60 * 1000) {
        backgroundSyncQueue.delete(id);
        logWithTime(`Removed old queued request to ${requestDetails.url}`);
      }
    }
  }
}

/**
 * Periodic sync for updating content
 */
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-update') {
    logWithTime('Periodic sync triggered for content update');
    
    event.waitUntil(
      updateCachedContent()
    );
  }
});

/**
 * Update cached content periodically
 */
async function updateCachedContent() {
  try {
    // Refresh the main HTML page
    const mainPageCache = await caches.open(STATIC_CACHE);
    await mainPageCache.add('./index.html');
    
    // You can add more critical assets to refresh here
    
    logWithTime('Successfully updated cached content');
  } catch (error) {
    logWithTime('Failed to update cached content', error);
  }
}

/**
 * Handle push notifications
 */
self.addEventListener('push', event => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New notification',
      icon: './visuals/icon-192.png',
      badge: './visuals/badge-96.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'TV Portfolio', options)
    );
  } catch (error) {
    logWithTime('Error handling push notification', error);
  }
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window open
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});