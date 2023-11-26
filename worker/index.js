import { SWStatus } from '@/lib/types';
import { request } from 'bwip-js';

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
    const ping = await fetch('/ping');
    if (ping.ok) {
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

self.addEventListener('install', (evt) => {
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('activated', evt);

    evt.waitUntil(
        Promise.all([
            new Promise((resolve) => {
                precacheChannel = new BroadcastChannel('precache-messages');
                precacheAssets();
                resolve();
            }),
            self.clients.claim(),
        ])
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === SWStatus.UNREGISTER) {
        self.registration.unregister({ immediate: true });
    }

    if (event.data && event.data.type === SWStatus.START) {
        precacheAssets();
    }

    if (event.data && event.data.type === SWStatus.CLEAR) {
        console.log('CLEARING CACHE');
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        });
    }
});

self.addEventListener('fetch', (event) => {
    const requestUrlWithoutQuery = new URL(event.request.url);
    requestUrlWithoutQuery.search = '';
    const requestPath = new URL(event.request.url).pathname;

    if (requestPath == '/') {
        precacheAssets();
    }

    event.respondWith(
        caches.match(requestUrlWithoutQuery).then((response) => {
            return response || fetch(event.request);
        })
    );
});
