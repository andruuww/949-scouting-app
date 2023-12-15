import { SWStatus } from '@/lib/types';
import { prefetch } from 'webpack';
import { request } from 'bwip-js';

// production
const ASSETS = [
    '/',
    '/pit',
    '/pit/export',
    '/scan',
    '/settings',

    '/manifest.json',
    '/icons/manifest-icon-192.maskable.png',
    '/icons/manifest-icon-512.maskable.png',
    '/favicon.ico',
];
const PRECACHE_NAME = 'ASSET-PRECACHE-OFFLINE';
const PRECACHE_TEMP_NAME = 'ASSET-PRECACHE-OFFLINE-TEMP';
let precacheChannel;

async function replaceDataWithTemp() {
    try {
        const oldCache = await caches.open(PRECACHE_TEMP_NAME);
        const newCache = await caches.open(PRECACHE_NAME);

        const requests = await oldCache.keys();

        await Promise.all(
            requests.map(async (request) => {
                const response = await oldCache.match(request);
                if (response) {
                    await newCache.put(request, response);
                }
            })
        );

        // await new Promise((resolve) => {
        //     setTimeout(resolve, 5000);
        // });

        await caches.delete(PRECACHE_TEMP_NAME);
    } catch (error) {
        console.error('Error replacing data with temp:', error);
    }
}

async function precacheAssets() {
    const ping = await fetch('/ping');
    console.log('attempting to precache assets');
    if (navigator.onLine && ping.ok) {
        try {
            precacheChannel.postMessage({
                type: SWStatus.PENDING,
            });

            // const cache = await caches.open(PRECACHE_NAME);
            const cacheTemp = await caches.open(PRECACHE_TEMP_NAME);

            await cacheTemp.addAll(ASSETS);

            await replaceDataWithTemp();

            precacheChannel.postMessage({
                type: SWStatus.SUCCESS,
            });
        } catch (err) {
            precacheChannel.postMessage({
                type: err,
            });
        }
    }
}

self.addEventListener('install', (evt) => {
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    precacheChannel = new BroadcastChannel('precache-messages');
    precacheChannel.postMessage({
        type: SWStatus.ACTIVATED,
    });

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

    if (event.data && event.data.type === SWStatus.START_PRECACHE) {
        precacheAssets();
    }

    if (event.data && event.data.type === SWStatus.FORCE_CLEAR) {
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
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
