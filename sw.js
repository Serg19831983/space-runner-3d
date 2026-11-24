const CACHE_NAME = 'cyber-runner-apex-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cloudflare.com'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
