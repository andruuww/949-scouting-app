'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import MenuBar from '@/components/menu-bar';
import { ReloadIcon } from '@radix-ui/react-icons';
import { SWStatus, SwitchStyles } from '@/lib/types';
import useIsConnected from '@/components/connection-hook';
import { useTheme } from 'next-themes';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Settings from '@/lib/settings';

export default function SettingsForm() {
    const { theme, setTheme } = useTheme();

    const ping = useIsConnected();

    const [isUnregistering, setIsUnregistering] = useState(false);

    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

    let prevPath = useRef('');
    useEffect(() => {
        const storage = globalThis?.sessionStorage;
        prevPath.current = storage!.getItem('settingsBackPath')!;

        if (navigator.mediaDevices) {
            navigator.mediaDevices
                .enumerateDevices()
                .then((devices) => {
                    devices.forEach((device) => {
                        if (device.kind == 'videoinput') {
                            setCameras((cameras) => [...cameras, device]);
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
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
                    .catch(function (error) {
                        console.error('Error clearing cache:', error);
                    });
            }
            toast.warning('All data has been cleared');
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

    return (
        <main className='flex flex-col safe min-h-screen mx-auto'>
            <MenuBar backButtonPage={prevPath.current} />
            <div className='space-y-16'>
                <div>
                    <span className='text-lg font-bold'>Appearance</span>
                    <div className='flex flex-col space-y-8 mt-2'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(update)} className='space-y-4'>
                                <FormField
                                    control={form.control}
                                    name='theme'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='space-y-1'>
                                                <FormLabel>Theme</FormLabel>
                                                <FormDescription>Select the theme for the app.</FormDescription>
                                            </div>
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
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormItem>
                                    )}
                                />
                                <Button type='submit' className='w-full mt-[20rem]'>
                                    Update Theme
                                </Button>
                            </form>
                        </Form>

                        <div className='flex flex-col justify-between rounded-md border p-4 align-center space-y'>
                            <span>Counter</span>
                            <p className='text-muted-foreground text-sm'>Select which side the + and - buttons go on</p>

                            <div>
                                <Select
                                    defaultValue={Settings.getCounterStyle()}
                                    onValueChange={(style) => {
                                        Settings.setCounterStyle(style);
                                    }}
                                >
                                    <SelectTrigger className='w-full mt-4'>
                                        <SelectValue></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='center'>Center</SelectItem>
                                        <SelectItem value='left'>Left</SelectItem>
                                        <SelectItem value='right'>Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className='flex flex-col justify-between rounded-md border p-4 align-center space-y'>
                            <span>Switch</span>
                            <p className='text-muted-foreground text-sm'>Select the switch style</p>

                            <div>
                                <Select
                                    defaultValue={Settings.getSwitchStyle()}
                                    onValueChange={(style) => {
                                        Settings.setSwitchStyle(style);
                                    }}
                                >
                                    <SelectTrigger className='w-full mt-4'>
                                        <SelectValue></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={SwitchStyles.NORMAL}>Normal</SelectItem>
                                        <SelectItem value={SwitchStyles.FULL_BOX}>Full Box</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className='flex flex-col justify-between rounded-md border p-4 align-center space-y'>
                            <span>Camera</span>
                            <p className='text-muted-foreground text-sm'>
                                Select the camera used for the scanning page
                            </p>

                            <div>
                                <Select
                                    disabled={cameras.length < 1 || (cameras[0] && cameras[0].label == '')}
                                    defaultValue={Settings.getCameraID()}
                                    onValueChange={(camera) => {
                                        Settings.setCameraID(camera);
                                    }}
                                >
                                    <SelectTrigger className='w-full mt-4'>
                                        {cameras.length < 1 || (cameras[0] && cameras[0].label == '') ? (
                                            <SelectValue>Permissions Denied</SelectValue>
                                        ) : (
                                            <SelectValue></SelectValue>
                                        )}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cameras.map((camera) => (
                                            <SelectItem key={camera.deviceId} value={camera.deviceId}>
                                                {camera.label.substring(0, window.innerWidth / 15) + '...'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='space-y-4'>
                    <div>
                        <span className='text-lg font-bold'>Service Worker and Cache</span>

                        <div className='basis-full h-0'></div>
                        <p className='text-muted-foreground text-sm'>
                            The SW manages the cache. Unregister to update the SW or to try to fix strange issues.
                        </p>
                    </div>
                    <div className='flex flex-row items-center justify-between rounded-md border p-4 align-center'>
                        <div className='flex-col flex-wrap'>
                            <span>Reload SW</span>
                            <div className='basis-full h-0'></div>
                            <p className='text-muted-foreground text-sm'>WIFI + Restart Required</p>
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
                    <div className='flex flex-row items-center justify-between rounded-md border p-4 align-center'>
                        <div className='flex-col flex-wrap'>
                            <span>Reload Cache</span>
                            <div className='basis-full h-0'></div>
                            <p className='text-muted-foreground text-sm'>WIFI Required</p>
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
                    <fieldset
                        disabled={
                            globalThis.sessionStorage && globalThis.sessionStorage.getItem('settingsBackPath') !== '/'
                        }
                        className='group'
                    >
                        <div className='flex flex-row items-center justify-between rounded-md border p-4 align-center'>
                            <div className='flex-col flex-wrap'>
                                <span>Delete All Data</span>
                                <div className='basis-full h-0'></div>
                                <p className='text-muted-foreground text-sm'>Including scout data</p>
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
                    </fieldset>
                </div>
            </div>
        </main>
    );
}
