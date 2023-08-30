const STATIC_CACHE_NAME = 'site-static';
const ASSETS = [
    `/swe-worker-${self.__WB_MANIFEST ? self.__WB_MANIFEST[0].hash : 'development'}.js`,
    '/icons/manifest-icon-192.maskable.png',
    '/icons/manifest-icon-512.maskable.png',
    '/favicon.ico',
    '/',
    '/manifest.json',
    '/pit',
    '/pit/export',
    
];

self.addEventListener('install', evt => {
    self.__WB_DISABLE_DEV_LOGS = true;
    // console.log('service worker installed');
    evt.waitUntil(caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('caching page assets');
        return cache.addAll(ASSETS);
    }).then(() => {
        console.log('done caching')
    }).catch(err => {
        console.log(ASSETS);
        console.log('error caching', err);
    }));
});

self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then((response) => {
            return response || fetch(evt.request);
        })
    );
});