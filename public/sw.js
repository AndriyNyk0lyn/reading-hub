const APP_SHELL_CACHE = "reading-hub-shell-v1";
const API_CACHE = "reading-hub-api-v1";

const APP_SHELL_ASSETS = [
  "/",
  "/saved",
  "/offline",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icons/icon-96.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => key !== APP_SHELL_CACHE && key !== API_CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  if (url.origin === self.location.origin) {
    if (APP_SHELL_ASSETS.includes(url.pathname)) {
      event.respondWith(cacheFirst(request, APP_SHELL_CACHE));
      return;
    }

    if (url.pathname.startsWith("/_next")) {
      event.respondWith(cacheFirst(request, APP_SHELL_CACHE));
      return;
    }
  }

  if (url.pathname.startsWith("/api/articles")) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE));
  }
});

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "CACHE_ARTICLE") return;

  const { pageUrl, apiUrl } = data.payload || {};

  event.waitUntil(
    (async () => {
      if (pageUrl) {
        const shellCache = await caches.open(APP_SHELL_CACHE);
        await shellCache.add(pageUrl);
      }
      if (apiUrl) {
        const apiCache = await caches.open(API_CACHE);
        await apiCache.add(apiUrl);
      }
    })(),
  );
});

async function handleNavigationRequest(request) {
  const cache = await caches.open(APP_SHELL_CACHE);
  try {
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;
    const offlineFallback = await cache.match("/offline");
    if (offlineFallback) return offlineFallback;
    throw error;
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    if (cacheName === API_CACHE) {
      throw error;
    }
    const offlineFallback = await cache.match("/offline");
    if (offlineFallback) return offlineFallback;
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  return cached || (await networkFetch) || new Response("", { status: 504 });
}

