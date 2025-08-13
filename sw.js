const CACHE_NAME = 'aqua-track-cache-v1';
const urlsToCache = [
  '/Aqua-Tracker-app/',
  '/Aqua-Tracker-app/index.html',
  '/Aqua-Tracker-app/style.css',
  '/Aqua-Tracker-app/script.js',
  '/Aqua-Tracker-app/manifest.json',
  '/Aqua-Tracker-app/icon.png'
];

// Install event: cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});

// Fetch event: serve cached files or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
