import { SWStatus } from '@/lib/types';

// production
const ASSETS = [
    '/',
    '/pit',
    '/pit/export',

    '/manifest.json',
    '/icons/manifest-icon-192.maskable.png',
    '/icons/manifest-icon-512.maskable.png',
    '/favicon.ico',
];
const PRECACHE_NAME = 'ASSET-PRECACHE-OFFLINE';
let precacheChannel;

async function precacheAssets() {
    if (navigator.onLine) {
        try {
            await caches.delete(PRECACHE_NAME);

            const cache = await caches.open(PRECACHE_NAME);
            precacheChannel.postMessage({
                type: SWStatus.PENDING,
            });

            await cache.addAll(ASSETS);
            precacheChannel.postMessage({
                type: SWStatus.SUCCESS,
            });
        } catch (err) {
            precacheChannel.postMessage({
                type: err,
            });
        }
    } else {
        precacheChannel.postMessage({
            type: SWStatus.OFFLINE,
        });
    }
}

self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        Promise.all([
            new Promise((resolve) => {
                precacheChannel = new BroadcastChannel('precache-messages');
                resolve();
            }),
            self.clients.claim(),
            precacheAssets(),
        ])
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === SWStatus.START) {
        precacheAssets();
    }
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
