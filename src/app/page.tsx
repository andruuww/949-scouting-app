'use client';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MenuBar from '@/components/menu-bar';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

async function registerSW() {
    try {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(() => {
                const precacheChannel = new BroadcastChannel('precache-messages');
                precacheChannel.addEventListener('message', (event) => {
                    toast({
                        description: `${event.data.type}`,
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
        router.push('/pit');
    };

    const continueSubmit = () => {
        router.push('/pit');
    };

    return (
        <main className='flex flex-col p-7 min-h-screen mx-auto'>
            <MenuBar />
            <div className='flex flex-col flex-1 justify-center space-y-3'>
                <Input
                    className='text-center'
                    name='name'
                    placeholder='Enter your name'
                    onChange={(e) => setName(e.target.value)}
                    autoComplete='off'
                />
                <Button type='submit' onClick={onSubmit} variant='default'>
                    Login
                </Button>
                {hasLoaded && alreadyLoggedInAs && (
                    <Button type='submit' className='mt-3' variant='secondary' onClick={continueSubmit}>
                        Continue as {alreadyLoggedInAs}
                    </Button>
                )}
            </div>
            <Button type='submit' variant='secondary' onClick={() => router.push('/scan')}>
                Aggregate Data
            </Button>
        </main>
    );
}
