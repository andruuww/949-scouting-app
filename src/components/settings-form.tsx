'use client';

import * as z from 'zod';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Settings } from 'lucide-react';
import { ThemeSelector } from './ui/theme-selector';
import { toast } from './ui/use-toast';
import { useForm } from 'react-hook-form';
import useIsConnected from './connection-hook';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { zodResolver } from '@hookform/resolvers/zod';

export default function SettingsForm() {
    const { theme, setTheme } = useTheme();
    const ping = useIsConnected();
    const router = useRouter();

    async function unregisterSW() {
        if ('serviceWorker' in navigator) {
            if (await ping()) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                registrations.forEach((registration) => {
                    registration.unregister();
                });
                router.replace('/');
            } else {
                toast({
                    variant: 'destructive',
                    description: 'No internet connection.',
                });
            }
        }
    }

    function onSubmit(data: z.infer<typeof formSchema>) {
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
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='outline' size='icon' aria-label='Settings Button'>
                    <Settings className='h-[1.2rem] w-[1.2rem]' />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <AlertDialogTitle>Settings</AlertDialogTitle>
                    <Separator />
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                                        className='grid max-w-md grid-cols-2 gap-8 pt-2'
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
                                </FormItem>
                            )}
                        />

                        <div className='space-y-3'>
                            <FormLabel>Service Worker</FormLabel>
                            <div className='flex flex-row items-center justify-between rounded-lg border p-4 align-center'>
                                <div className='flex-col flex-wrap'>
                                    <Label>Update SW</Label>
                                    <div className='basis-full h-0'></div>
                                    <Label className='text-xs text-muted-foreground'>WIFI Required</Label>
                                </div>
                                <Button type='button' variant='destructive' onClick={unregisterSW}>
                                    Unregister
                                </Button>
                            </div>
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                            <Button type='submit'>Apply</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
