'use client';

import MenuBar from '@/components/menu-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { SWStatus } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);
    const [alreadyLoggedInAs, setAlreadyLoggedInAs] = useState<null | string>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHasLoaded(true);
            if (localStorage.getItem('scoutName')) {
                setAlreadyLoggedInAs(localStorage.getItem('scoutName')!);
            }
        }
    }, []);

    const precacheChannel = new BroadcastChannel('precache-messages');

    precacheChannel.addEventListener('message', (event) => {
        toast({
            title: `Cache status: ${event.data.type}`,
        });
    });

    useEffect(() => {
        if (navigator.serviceWorker.controller !== null) {
            navigator.serviceWorker.controller!.postMessage({
                type: SWStatus.START,
            });
        }
    }, []);

    const onSubmit = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('scoutName', name);
        }
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
                    <Button type='submit' className='mt-3' variant='default' onClick={onSubmit}>
                        Continue as {alreadyLoggedInAs}
                    </Button>
                )}
            </div>
        </main>
    );
}
