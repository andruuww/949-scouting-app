'use client';

import * as React from 'react';

import { ReloadIcon } from '@radix-ui/react-icons';

export default function LoadingElement() {
    return (
        <div className='flex flex-col w-full h-screen justify-center items-center'>
            <ReloadIcon className='p-8 h-32 w-32 animate-spin' />
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>Loading...</div>
        </div>
    );
}
