/* Astro Ashwini — service worker.
   Cache-first for static assets, network-first for HTML so content stays fresh. */
const VERSION = 'astro-v2';
const CORE = [
  'index.html', 'shop.html', 'product.html', 'services.html',
  'about.html', 'contact.html', 'checkout.html',
  'assets/css/app.css', 'assets/css/fonts.css',
  'assets/fonts/GeneralSans-variable.woff2', 'assets/fonts/Fraunces-latin.woff2',
  'assets/js/config.js', 'assets/js/data.js', 'assets/js/icons.js', 'assets/js/app.js', 'assets/js/cards.js',
  'assets/img/logo-mark.webp', 'assets/img/logo-lockup.webp',
  'manifest.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => Promise.allSettled(CORE.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;           // let the network handle CDNs
  if (url.pathname.includes('/api/')) return;           // never cache payment calls

  const isHTML = req.mode === 'navigate' ||
                 (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
