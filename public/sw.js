/*
  Code for All's service worker. Registered by components/service-worker.tsx
  as /sw.js?v=<build id>, so every deploy is a new worker with its own cache.

  What it does:
  - Pages the learner opens (lessons, quizzes, the course page…) are kept, so
    they still load with no connection. Online, a page always comes from the
    network first; the copy in the cache is only used when the network fails.
  - Hashed build files (/_next/static/…) never change, so they come from the
    cache first.
  - Images, fonts and the search index (/search-index.json) come from the
    cache when they're there, and are fetched again in the background to keep
    the copy fresh. With the search panel's own script (a /_next/static file),
    that's all search needs, so once opened online it works offline too.
  - A new deploy means a new build id, a new worker and a new cache. When it
    takes over it deletes every older cache, so nothing from an old deploy is
    served after the next online visit.
  - Nothing is cached for /api/ (practice feedback) or for other sites.
  - A page that was never opened shows /offline instead of a browser error.
*/

const VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const CACHE = `cfa-${VERSION}`;
const OFFLINE_PAGE = "/offline";

/** The build files a page's HTML loads: its scripts, styles and preloaded fonts. */
function assetsIn(html) {
  const urls = new Set();
  for (const match of html.matchAll(/(?:src|href)="(\/(?:_next\/static|fonts)\/[^"]+)"/g)) urls.add(match[1]);
  return [...urls];
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // The offline page and everything it needs, so it works even if it's
      // the first thing this device shows without a connection.
      const response = await fetch(OFFLINE_PAGE, { headers: { Accept: "text/html" } });
      if (!response.ok) throw new Error(`Couldn't fetch ${OFFLINE_PAGE}`);
      await cache.put(OFFLINE_PAGE, response.clone());
      await cache.addAll(assetsIn(await response.text()));
      await self.skipWaiting();
    })(),
  );
});

// A page asks for itself to be kept (components/service-worker.tsx does this
// for the page that installed the worker, which loaded before the worker
// could see it).
self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "keep") return;
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const url = new URL(event.data.url, self.location.origin);
      if (url.origin !== self.location.origin) return;
      const response = await fetch(url.pathname + url.search, { headers: { Accept: "text/html" } });
      if (!keepable(response)) return;
      await cache.put(url.pathname + url.search, response.clone());
      const assets = assetsIn(await response.text());
      await Promise.all(
        assets.map(async (asset) => {
          if (await cache.match(asset)) return;
          const got = await fetch(asset).catch(() => null);
          if (keepable(got)) await cache.put(asset, got);
        }),
      );
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) if (name !== CACHE) await caches.delete(name);
      await self.clients.claim();
    })(),
  );
});

/** Only complete, direct, same-origin successes are worth keeping. */
function keepable(response) {
  return response && response.ok && !response.redirected && response.type === "basic";
}

async function put(request, response) {
  // Copy it straight away: once the page has read the response, it can't be copied.
  const copy = response.clone();
  try {
    const cache = await caches.open(CACHE);
    await cache.put(request, copy);
  } catch {
    // Storage full or blocked: the page still works, it just won't be there offline.
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (keepable(response)) await put(request, response);
  return response;
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (keepable(response)) put(request, response);
      return response;
    })
    .catch(() => cached);
  return cached || refresh;
}

async function networkFirst(request, { fallback } = {}) {
  try {
    const response = await fetch(request);
    if (keepable(response)) await put(request, response);
    return response;
  } catch (error) {
    const cached = await caches.match(request, { ignoreVary: true });
    if (cached) return cached;
    if (fallback) {
      const page = await caches.match(fallback);
      if (page) return page;
    }
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname === "/sw.js") return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, { fallback: OFFLINE_PAGE }));
    return;
  }
  if (request.headers.get("RSC") === "1") {
    // A client-side move to another page. If it fails, Next.js falls back to
    // a full page load, which the navigate branch above answers from the cache.
    event.respondWith(networkFirst(request).catch(() => new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } })));
    return;
  }
  // Images (including /_next/image), fonts, the manifest, icons and the search index.
  event.respondWith(staleWhileRevalidate(request).catch(() => Response.error()));
});
