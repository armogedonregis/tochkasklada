const CACHE_NAME = 'tochka-sklada-v1.0.1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/cell-rentals',
  '/clients',
  '/free-cells',
  '/payments',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                if (event.request.url.includes('/_next/static/')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
            return new Response('Offline');
          });
      })
  );
});


self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
  }
});

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/favicon.svg'
      })
    );
  }
});