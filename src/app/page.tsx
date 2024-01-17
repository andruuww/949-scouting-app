'use client';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MenuBar from '@/components/menu-bar';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from '@/components/ui/drawer';

async function registerSW() {
    try {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(() => {
                const precacheChannel = new BroadcastChannel('precache-messages');
                precacheChannel.addEventListener('message', (event) => {
                    toast.info(`${event.data.type}`);
                });
            });
        }
    } catch (error) {
        console.log('Service Worker registration failed:', error);
    }
}

export default function Home() {
    const router = useRouter();

    const scoutName = typeof window !== 'undefined' ? localStorage.getItem('scoutName') || '' : '';

    useEffect(() => {
        registerSW();
    }, []);

    const schema = z.object({
        name: z
            .string()
            .optional()
            .refine((data) => data && data.length > 0, {
                message: 'Name is required',
            }),
    });

    const formResolver = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            name: scoutName,
        },
    });

    return (
        <main className='flex flex-col safe mx-auto justify-between h-screen'>
            <MenuBar />

            <div className='flex flex-col flex-1 justify-center space-y-2'>
                <Form {...formResolver}>
                    <form>
                        <div className='flex flex-col flex-1 justify-center space-y-2'>
                            <FormField
                                control={formResolver.control}
                                name='name'
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className='text-center'
                                                    placeholder='Enter your name'
                                                    autoComplete='off'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className='text-xs' />
                                        </FormItem>
                                    );
                                }}
                            />
                            <Button
                                type='submit'
                                onClick={formResolver.handleSubmit((values) => {
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem('scoutName', values.name!);
                                    }
                                    router.push('/pit');
                                })}
                                variant='default'
                                className='w-full'
                            >
                                Pit Scout
                            </Button>
                            <Button
                                type='submit'
                                onClick={formResolver.handleSubmit((values) => {
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem('scoutName', values.name!);
                                    }
                                    router.push('/match');
                                })}
                                variant='default'
                                className='w-full'
                            >
                                Match Scout
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <Button type='submit' variant='secondary' onClick={() => router.push('/scan')}>
                Aggregate Data
            </Button>
        </main>
    );
}
