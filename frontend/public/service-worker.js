self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('attendance-cache').then((cache) => {
      return cache.addAll(['/', '/index.html', '/models/faceRecognitionNet-weights_manifest.json']);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});