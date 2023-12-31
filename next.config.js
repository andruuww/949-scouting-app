const withPWA = require('@ducanh2912/next-pwa').default({
    dest: 'public',
    // disable: process.env.NODE_ENV === 'development',
    // cacheOnFrontEndNav: true,
    // aggressiveFrontEndNavCaching: true,
    cacheStartUrl: false,
    dynamicStartUrl: false,
    skipWaiting: true,
    reloadOnOnline: false,
    register: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
    ...withPWA(nextConfig),
};
