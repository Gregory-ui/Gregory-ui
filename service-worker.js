const CACHE_NAME = 'numiscan-ai-cache-v2'; // Bumped version
const APP_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/components/ImageUploader.tsx',
  '/components/AnalysisResult.tsx',
  '/components/HistorySidebar.tsx',
  '/components/ConfirmationModal.tsx',
  '/components/LicenseModal.tsx',
  '/components/Toast.tsx',
  '/components/CameraCapture.tsx',
  '/components/icons.tsx',
  '/utils/fileUtils.ts',
  '/utils/idb.ts',
  '/utils/fileSaver.ts',
  '/services/geminiService.ts',
  '/contexts/AppContext.tsx'
];
const CDN_URLS = [
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/marked@13.0.2/marked.min.js',
  'https://aistudiocdn.com/@google/genai@^1.28.0',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/'
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching assets');
        // Cache immutable CDN assets first
        const cdnPromise = cache.addAll(CDN_URLS).catch(err => {
            console.error('Failed to cache CDN resources:', err);
        });
        // Cache app assets that might change
        const appPromise = cache.addAll(APP_URLS).catch(err => {
            console.error('Failed to cache app resources:', err);
        });
        return Promise.all([cdnPromise, appPromise]);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strategy: Stale-While-Revalidate for app assets
  if (APP_URLS.includes(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            // If fetch is successful, update the cache
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
          // Return cached response immediately if available, otherwise wait for fetch
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
  
  // Strategy: Cache-First for CDN assets (they are versioned or rarely change)
  if (CDN_URLS.some(cdnUrl => url.href.startsWith(cdnUrl))) {
      event.respondWith(
        caches.match(event.request).then((response) => {
          return response || fetch(event.request).then(networkResponse => {
              if (networkResponse.ok) {
                  const cacheableResponse = networkResponse.clone();
                  caches.open(CACHE_NAME).then(cache => {
                      cache.put(event.request, cacheableResponse);
                  });
              }
              return networkResponse;
          });
        })
      );
      return;
  }
  
  // For all other requests, just fetch from the network
  event.respondWith(fetch(event.request));
});


self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});