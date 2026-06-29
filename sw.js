const CACHE_NAME = 'svoz-palet-v2'; // Zvýšení verze při úpravě logiky
const urlsToCache = [
  '/GEIS-2.1/',
  '/GEIS-2.1/index.html',
  '/GEIS-2.1/manifest.json'
];

// Instalace a uložení do paměti (cache)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Vynutí okamžitou aktivaci nové verze
  );
});

// Zajištění načítání offline & odstranění staré cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch handler
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
