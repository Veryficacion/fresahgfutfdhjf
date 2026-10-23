const CACHE_NAME = 'fresapp-v2';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icono.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(url).catch(err => {
            console.log('Archivo omitido en caché:', url);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.onactivate = self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).catch(() => {
        // Modo offline: si no hay red, evita que falle
        return caches.match('./index.html');
      });
    })
  );
});