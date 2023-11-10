// devleopment
// the array below is crazy sensitive??? so much time went into figuring out this array please don't touch it
// 16 entries
// rules of the array
// 1) the main app pretty much shouldn't be touched, but if you must:
// the page must come before the layout, the main-app comes after both
// 2) the routes go first, and then the js page files
// 3) the order of sections should be preserved
// const ASSETS = [
//     // main app
//     '/',
//     '/_next/static/css/app/layout.css',
//     '/_next/static/chunks/app/page.js',
//     '/_next/static/chunks/app/layout.js',
//     '/_next/static/chunks/main-app.js',
//     '/_next/static/chunks/app-pages-internals.js',

//     // routes
//     '/pit',
//     '/pit/export',
//     '/_next/static/chunks/app/pit/page.js',
//     '/_next/static/chunks/app/pit/export/page.js',

//     // other
//     '',
//     '/_next/static/chunks/webpack.js',
//     '/manifest.json',
//     '/icons/manifest-icon-192.maskable.png',
//     '/icons/manifest-icon-512.maskable.png',
//     '/favicon.ico',
// ];

// production
const ASSETS = [
    '/pit',
    '/pit/export',

    '/manifest.json',
    '/icons/manifest-icon-192.maskable.png',
    '/icons/manifest-icon-512.maskable.png',
    '/favicon.ico'
];
const PRECACHE_NAME = 'ASSET-PRECACHE-OFFLINE';
const precacheChannel = new BroadcastChannel('precache-messages');

function precacheAssets() {
    caches.open(PRECACHE_NAME).then((cache) => {
        return cache.keys().then((keys) => {
            if (keys.length !== ASSETS.length) {
                return caches.delete(PRECACHE_NAME).then(() => {
                    console.log('deleted cache');

                    precacheChannel.postMessage({
                        type: 'Success!',
                        data: 'Successfuly deleted failed cache.'
                    });

                    return caches
                        .open(PRECACHE_NAME)
                        .then((newCache) => {
                            console.log('caching');
                            precacheChannel.postMessage({
                                type: 'Pending',
                                data: 'Caching page assets for offline use...'
                            });
                            return newCache.addAll(ASSETS);
                        })
                        .then(() => {
                            precacheChannel.postMessage({
                                type: 'Success!',
                                data: 'Now ready for offline use!'
                            });
                            console.log('done caching');
                        })
                        .catch((err) => {
                            precacheChannel.postMessage({
                                type: 'ERR',
                                data: 'Unable to cache. Are you connected to the internet?'
                            });
                            console.log(ASSETS);
                            console.log('error caching', err);
                        });
                });
            } else {
                console.log('cache already exists');
                precacheChannel.postMessage({
                    type: 'Success!',
                    data: 'App already ready for offline use!'
                });
            }
        });
    });
}

self.addEventListener('activate', (evt) => {
    evt.waitUntil(precacheAssets());
});

self.addEventListener('installed', (evt) => {
    self.__WB_DISABLE_DEV_LOGS = true;
    console.log('service worker installing');

    evt.waitUntil(precacheAssets());
});

self.addEventListener('fetch', (event) => {
    const requestUrlWithoutQuery = new URL(event.request.url);
    requestUrlWithoutQuery.search = '';

    event.respondWith(
        caches.match(requestUrlWithoutQuery).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PRECACHE-ASSETS') {
        precacheAssets();
    }
});
