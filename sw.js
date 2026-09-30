const CACHE_NAME = "groww-pwa-v12";
const APP_SHELL = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/login.html",
  "/holdings/",
  "/positions/",
  "/orders.html",
  "/watchlist/",
  "/help/",
  "/bank-details.html",
  "/user/profile/report/",
  "/user/balance/inr/",
  "/user/balance/inr/transactions/",
  "/favicon.png",
  "/image.png",
  "/Sbi.png",
  "/responsive.css",
  "/dashboard.css",
  "/login.css",
  "/style.css",
  "/section.css",
  "/orders.css",
  "/bank-details.css",
  "/user/balance/inr/styles.css",
  "/user/balance/inr/transactions/styles.css",
  "/user/profile/report/styles.css",
  "/help/styles.css",
  "/script.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match("/index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached =>
      cached ||
      fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
    )
  );
});