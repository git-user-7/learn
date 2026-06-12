const CACHE_NAME = "learn-v2";

const PRECACHE_URLS = [
  "/learn/",
  "/learn/index.html",
  "/learn/404.html",
  "/learn/manifest.json",
  "/learn/icon-128x128.png",
  "/learn/icon-192x192.png",
  "/learn/icon-512x512.png",
  "/learn/assets/index-C4JXE4nx.js", 
  "/learn/assets/index-1n_WS7mg.css",
  "/learn/fonts/inter-latin.woff2",
  "/learn/fonts/inter-latin-ext.woff2",
  "/learn/fonts/jetbrains-mono-latin.woff2",
  "/learn/fonts/jetbrains-mono-latin-ext.woff2",
  "/learn/fonts/dancing-script-latin.woff2",
  "/learn/fonts/libre-baskerville-italic-x.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use a map to try each file individually
      return Promise.allSettled(
        PRECACHE_URLS.map(url => 
          cache.add(url).catch(err => console.warn(`Failed to cache: ${url}`, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests for our own origin
  if (event.request.method !== "GET") return;
  
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Return cached file if found, otherwise try network
      return cached || fetch(event.request).catch(() => {
        // If both fail (offline and not in cache), return the app shell
        if (event.request.mode === "navigate") {
          return caches.match("/learn/index.html");
        }
      });
    })
  );
});