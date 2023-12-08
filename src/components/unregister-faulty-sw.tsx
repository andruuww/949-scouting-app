'use client';

import { SWStatus } from '@/lib/types';
import { useEffect } from 'react';

export default function UnregisterFaultySW() {
    // not sure if this works

    // useEffect(() => {
    //     try {
    //         fetch('_next/static/chunks/app/layout.js');
    //     } catch {
    //         console.log('Unregistering faulty service workers');

    //         navigator.serviceWorker.ready.then((registration) => {
    //             registration.active?.postMessage(SWStatus.FORCE_CLEAR);
    //         });
    //         navigator.serviceWorker.getRegistrations().then((registrations) => {
    //             registrations.forEach((registration) => {
    //                 registration.unregister();
    //             });
    //         });
    //     }
    // }, []);

    return null;
}
