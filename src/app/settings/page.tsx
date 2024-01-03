'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import MenuBar from '@/components/menu-bar';
import { ReloadIcon } from '@radix-ui/react-icons';
import { SWStatus } from '@/lib/types';
import useIsConnected from '@/components/connection-hook';
import { useTheme } from 'next-themes';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';

export default function SettingsForm() {
    const { theme, setTheme } = useTheme();

    const ping = useIsConnected();

    const [isUnregistering, setIsUnregistering] = useState(false);
    const [isLoading, setLoading] = useState(true);
    let prevPath = useRef('');
    useEffect(() => {
        const storage = globalThis?.sessionStorage;
        prevPath.current = storage!.getItem('settingsBackPath')!;
        setLoading(false);
    }, []);

    async function unregisterSW() {
        setIsUnregistering(true);
        if ('serviceWorker' in navigator) {
            if (await ping()) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                registrations.forEach((registration) => {
                    registration.unregister();
                });

                window.location.replace('/');
            }
            setIsUnregistering(false);
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsUnregistering(false);
    }

    async function reloadCache() {
        if (await ping()) {
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: SWStatus.START_PRECACHE });
            }
        }
    }

    function clearAllData() {
        if (typeof window !== 'undefined') {
            localStorage.clear();
            globalThis?.sessionStorage.clear();
            if ('caches' in window) {
                caches
                    .keys()
                    .then(function (cacheNames) {
                        cacheNames.forEach(function (cacheName) {
                            caches.delete(cacheName);
                        });
                    })
                    .then(function () {
                        console.log('Cache cleared successfully');
                    })
                    .catch(function (error) {
                        console.error('Error clearing cache:', error);
                    });
            }
            toast({
                title: 'Deleted all data',
            });
        }
    }

    function update(data: z.infer<typeof formSchema>) {
        setTheme(data.theme!);
    }

    const formSchema = z.object({
        theme: z
            .enum(['light', 'dark'])
            .optional()
            .transform((e) => (e === undefined ? theme : e)),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    if (isLoading) {
        return null;
    }

    return (
        <main className='flex flex-col p-7 min-h-screen mx-auto'>
            <MenuBar backButtonPage={prevPath.current} />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(update)} className='space-y-8'>
                    <FormField
                        control={form.control}
                        name='theme'
                        render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>Theme</FormLabel>
                                <FormDescription>Select the theme for the app.</FormDescription>
                                <FormMessage />
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className='grid w-full grid-cols-2 gap-8 pt-2'
                                >
                                    <FormItem>
                                        <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                                            <FormControl>
                                                <RadioGroupItem value='light' className='sr-only' />
                                            </FormControl>
                                            <div className='items-center rounded-md border-2 border-muted p-1 hover:border-accent'>
                                                <div className='space-y-2 rounded-sm bg-[#ecedef] p-2'>
                                                    <div className='space-y-2 rounded-md bg-white p-2 shadow-sm'>
                                                        <div className='h-2 w-[40px] rounded-lg bg-[#ecedef]' />
                                                        <div className='h-2 w-[60px] rounded-lg bg-[#ecedef]' />
                                                    </div>
                                                    <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
                                                        <div className='h-4 w-4 rounded-full bg-[#ecedef] flex-shrink-0' />
                                                        <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                                                    </div>
                                                    <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
                                                        <div className='h-4 w-4 rounded-full bg-[#ecedef] flex-shrink-0' />
                                                        <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                                                    </div>
                                                </div>
                                            </div>
                                            <span className='block w-full p-2 text-center font-normal'>Light</span>
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                                            <FormControl>
                                                <RadioGroupItem value='dark' className='sr-only' />
                                            </FormControl>
                                            <div className='items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground'>
                                                <div className='space-y-2 rounded-sm bg-slate-950 p-2'>
                                                    <div className='space-y-2 rounded-md bg-slate-800 p-2 shadow-sm'>
                                                        <div className='h-2 w-[40px] rounded-lg bg-slate-400' />
                                                        <div className='h-2 w-[60px] rounded-lg bg-slate-400' />
                                                    </div>
                                                    <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm'>
                                                        <div className='h-4 w-4 rounded-full bg-slate-400 flex-shrink-0' />
                                                        <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                                                    </div>
                                                    <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm'>
                                                        <div className='h-4 w-4 rounded-full bg-slate-400 flex-shrink-0' />
                                                        <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                                                    </div>
                                                </div>
                                            </div>
                                            <span className='block w-full p-2 text-center font-normal'>Dark</span>
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                                <Button type='submit' className='w-full'>
                                    Update Theme
                                </Button>
                            </FormItem>
                        )}
                    />

                    <div className='space-y-2'>
                        <div>
                            <FormLabel>Service Worker and Cache</FormLabel>

                            <div className='basis-full h-0'></div>
                            <FormDescription className='text-muted-foreground'>
                                The SW manages the cache. Unregister to update the SW or to try to fix strange issues.
                            </FormDescription>
                        </div>
                        <div className='flex flex-row items-center justify-between rounded-lg border p-4 align-center'>
                            <div className='flex-col flex-wrap'>
                                <FormLabel>Reload SW</FormLabel>
                                <div className='basis-full h-0'></div>
                                <FormDescription className='text-muted-foreground'>
                                    WIFI + Restart Required
                                </FormDescription>
                            </div>
                            <Button
                                type='button'
                                variant='destructive'
                                onClick={() => unregisterSW()}
                                className='min-w-[40%]'
                            >
                                {isUnregistering ? <ReloadIcon className='animate-spin' /> : 'Unregister'}
                            </Button>
                        </div>
                        <div className='flex flex-row items-center justify-between rounded-lg border p-4 align-center'>
                            <div className='flex-col flex-wrap'>
                                <FormLabel>Reload Cache</FormLabel>
                                <div className='basis-full h-0'></div>
                                <FormDescription className='text-muted-foreground'>WIFI Required</FormDescription>
                            </div>
                            <Button
                                type='button'
                                variant='destructive'
                                onClick={() => reloadCache()}
                                className='min-w-[40%]'
                            >
                                Reload
                            </Button>
                        </div>
                        {globalThis.sessionStorage.getItem('settingsBackPath') === '/' && (
                            <div className='flex flex-row items-center justify-between rounded-lg border p-4 align-center'>
                                <div className='flex-col flex-wrap'>
                                    <FormLabel>Delete All Data</FormLabel>
                                    <div className='basis-full h-0'></div>
                                    <FormDescription className='text-muted-foreground'>
                                        Including scout data
                                    </FormDescription>
                                </div>
                                <Button
                                    type='button'
                                    variant='destructive'
                                    onClick={() => clearAllData()}
                                    className='min-w-[40%]'
                                >
                                    Clear
                                </Button>
                            </div>
                        )}
                    </div>
                </form>
            </Form>
        </main>
    );
}
