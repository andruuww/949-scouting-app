'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MenuBar from '@/components/menu-bar';
import { SWStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

async function registerSW() {
    try {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(() => {
                const precacheChannel = new BroadcastChannel('precache-messages');
                precacheChannel.addEventListener('message', (event) => {
                    toast({
                        description: `Cache status: ${event.data.type}`,
                    });
                });
            });
        }
    } catch (error) {
        console.log('Service Worker registration failed:', error);
    }
}

export default function Home() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);
    const [alreadyLoggedInAs, setAlreadyLoggedInAs] = useState<null | string>(null);

    useEffect(() => {
        registerSW();

        if (typeof window !== 'undefined') {
            setHasLoaded(true);
            if (localStorage.getItem('scoutName')) {
                setAlreadyLoggedInAs(localStorage.getItem('scoutName')!);
            }
        }
    }, []);

    const onSubmit = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('scoutName', name);
        }
        router.replace('/pit');
    };

    const continueSubmit = () => {
        router.replace('/pit');
    };

    return (
        <main className='flex flex-col p-7 min-h-screen max-w-md mx-auto'>
            <MenuBar />
            <div className='flex flex-col flex-1 justify-center'>
                <Input
                    className='text-center'
                    name='name'
                    placeholder='Enter your name'
                    onChange={(e) => setName(e.target.value)}
                    autoComplete='off'
                />
                <Button type='submit' className='mt-3' onClick={onSubmit} variant='secondary'>
                    Login
                </Button>
                {hasLoaded && alreadyLoggedInAs && (
                    <Button type='submit' className='mt-3' variant='default' onClick={continueSubmit}>
                        Continue as {alreadyLoggedInAs}
                    </Button>
                )}
            </div>
        </main>
    );
}
