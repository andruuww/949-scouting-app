'use client';

import * as React from 'react';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { ReloadIcon } from '@radix-ui/react-icons';

const LoadingElement = React.forwardRef<HTMLInputElement>((props, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = `${pathname}?${searchParams}`;
        // console.log(url);
    }, [pathname, searchParams]);

    return (
        <div className='flex flex-col w-full h-screen justify-center items-center'>
            <ReloadIcon className='p-8 h-32 w-32 animate-spin' />
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>Loading...</div>
        </div>
    );
});

LoadingElement.displayName = 'Loading';

export { LoadingElement };
