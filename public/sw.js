// Service worker for the installed app (PWA).
//
// Deliberately small: a voice meeting can't work offline, so this only
// - keeps content-hashed build assets and the ~15 MB RNNoise model in a cache,
//   so reopening the app (and every rejoin) doesn't download them again;
// - shows an offline page instead of the browser's error when a page can't load.
// Pages and /api responses always go to the network: they're per-user and live.
//
// Bump VERSION whenever this file's caching rules change; old caches are
// deleted on activate.

const VERSION = "v1";
const STATIC_CACHE = `meetsync-static-${VERSION}`;
const PAGES_CACHE = `meetsync-pages-${VERSION}`;
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/icons/icon-192.png"];
// Each deploy adds new hashed chunks; keep the cache from growing forever.
const MAX_STATIC_ENTRIES = 300;

async function trimStaticCache(cache) {
  const keys = await cache.keys();
  // keys() lists entries oldest first.
  await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_STATIC_ENTRIES)).map((key) => cache.delete(key)));
}

// Safe to serve from cache forever: their URLs change whenever their content does.
function isImmutableAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    /^\/rnnoise-[^/]+\.(wasm|js)$/.test(url.pathname)
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("meetsync-") && key !== STATIC_CACHE && key !== PAGES_CACHE)
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
  if (url.origin !== self.location.origin) return;

  if (isImmutableAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        // Only whole successful responses; a 206 range reply can't be cached.
        if (response.status === 200) {
          event.waitUntil(cache.put(request, response.clone()).then(() => trimStaticCache(cache)));
        }
        return response;
      }),
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match(OFFLINE_URL)) ?? Response.error()),
    );
  }
});
