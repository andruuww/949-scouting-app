'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function HistoryProvider() {
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

        if (currentPath === '/pit' || currentPath === '/match') {
            storage.setItem('exportBackPath', currentPath);
        }

        if (currentPath !== '/settings') {
            storage.setItem('settingsBackPath', currentPath);
        } else {
            storage.setItem('settingsBackPath', prevPath!);
        }
    }

    return null;
}
