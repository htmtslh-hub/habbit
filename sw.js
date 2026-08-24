// ===== HABIT MASTERY - SERVICE WORKER =====
// Change CACHE_VERSION when deploying updates
const CACHE_VERSION = '5.0.9';
const CACHE_NAME = `habit-game-v${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/auth.html',
  '/admin.html',
  '/style.css',
  '/app.js',
  '/auth.css',
  '/auth.js',
  '/admin.css',
  '/admin.js',
  '/gotiengviet.js',
  '/nameplate_templates.js',
  '/avatar_frames.js',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// ===== INSTALL: Cache core assets and skip waiting =====
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ===== ACTIVATE: Clean old caches =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();

  // Notify all clients that the update is now active
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
    });
  });
});

// ===== MESSAGE: Handle skip-waiting from client =====
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ===== FETCH: Network-first for app, cache-first for fonts =====
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and external API requests
  if (event.request.method !== 'GET') return;
  if (url.hostname.includes('googleapis.com') && !url.hostname.includes('fonts')) return;
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('google.com') ||
      url.hostname.includes('firebaseapp.com')) {
    return;
  }

  // Google Fonts: cache-first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return resp;
        });
      })
    );
    return;
  }

  // App assets: network-first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return resp;
      })
      .catch(() => caches.match(event.request))
  );
});
