// JK WASHING CENTER - Custom Service Worker
const CACHE_NAME = 'jk-washing-v1.0.0';

// Only safe, public static assets and the offline fallback page are cached.
// Sensitive admin endpoints, customer records, and payment routes are EXPLICITLY excluded from cache.
const STATIC_PRECACHE = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/icons/logo.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch((err) => {
        console.warn('Pre-cache warning (some assets may load dynamically):', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Never cache non-GET requests (e.g. POST booking, payments)
  if (event.request.method !== 'GET') {
    return;
  }

  // 2. NEVER cache private admin pages, customer data APIs, payment webhooks, or Supabase auth calls
  const isPrivateOrApi =
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('razorpay.com');

  if (isPrivateOrApi) {
    // Pass directly to network; if network fails, let fetch error naturally without caching sensitive data
    return;
  }

  // 3. For navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedOffline = await cache.match('/offline');
        return cachedOffline || new Response('Offline: Please reconnect to internet to access JK Washing Center.', {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      })
    );
    return;
  }

  // 4. Stale-while-revalidate for safe static assets (CSS, JS chunks, icons)
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => null);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
