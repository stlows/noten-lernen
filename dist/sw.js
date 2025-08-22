var CACHE = "noten-lernen-cache-2";
var precacheFiles = [
  "/",
  "/index.html",
  "/static/manifest.json",
  "/static/favicon.png"
];

self.addEventListener("install", function(evt) {
  evt.waitUntil(
    precache().then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(evt) {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function(evt) {
  if (evt.request.method !== "GET") return;
  if (!evt.request.url.startsWith("http")) return; // Ignore chrome-extension:// or file://
  if (evt.request.url.includes("sockjs-node")) return; // Skip HMR WebSocket requests

  evt.respondWith(fromCache(evt.request).catch(() => fromServer(evt.request)));

  evt.waitUntil(update(evt.request));
});

function precache() {
  return caches.open(CACHE).then(function(cache) {
    return cache.addAll(precacheFiles);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function(cache) {
    return cache.match(request).then(function(matching) {
      if (matching) return matching;
      throw new Error("no-match");
    });
  });
}

function update(request) {
  return caches.open(CACHE).then(function(cache) {
    return fetch(request).then(function(response) {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    });
  });
}

function fromServer(request) {
  return fetch(request);
}
