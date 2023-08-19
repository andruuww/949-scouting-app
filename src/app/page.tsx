'use client';

import MenuBar from '@/components/menu-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);
    const [alreadyLoggedInAs, setAlreadyLoggedInAs] = useState<null | string>(
        null
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHasLoaded(true);
            if (localStorage.getItem('scoutName')) {
                setAlreadyLoggedInAs(localStorage.getItem('scoutName')!);
            }
        }
    }, [typeof window]);

    const onSubmit = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('scoutName', name);
        }
        router.push('/pit');
    };

    return (
        <main className="flex flex-col p-7 min-h-screen max-w-md mx-auto">
            <MenuBar />
            <div className="flex flex-col flex-1 justify-center">
                <Input
                    className="text-center"
                    name="name"
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                />

                <Button
                    type="submit"
                    className="mt-3"
                    onClick={onSubmit}
                    variant="secondary"
                >
                    Login
                </Button>
                {hasLoaded && alreadyLoggedInAs && (
                    <Button
                        type="submit"
                        className="mt-3"
                        variant="default"
                        onClick={() => router.push('/pit')}
                    >
                        Continue as {alreadyLoggedInAs}
                    </Button>
                )}
            </div>
        </main>
    );
}
