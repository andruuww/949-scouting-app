'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function HistoryProvider() {
    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => storePathValues, [pathName]);
    useEffect(() => {
        storePathValues();
    }, []);

    function storePathValues() {
        const storage = globalThis?.sessionStorage;
        const currentPath = globalThis.location.pathname;

        if (!storage) return;

        const prevPath = storage.getItem('currentPath');

        storage.setItem('prevPath', prevPath!);
        storage.setItem('currentPath', currentPath);

        if (currentPath !== '/settings') {
            storage.setItem('settingsBackPath', currentPath);
        } else {
            storage.setItem('settingsBackPath', prevPath!);
        }
    }

    return null;
}
