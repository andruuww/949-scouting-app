'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function TeamsList({
    teamsJSON,
    label,
    mode,
    cacheName,
    displayDataStringArray,
    jsonKeyDisplayName,
    setFormValues,
    update = () => {},
    className,
}: {
    teamsJSON: Record<string, any>[];
    label: string;
    mode: 'edit' | 'mark' | 'view' | 'delete';
    cacheName?: string;
    displayDataStringArray?: string[];
    jsonKeyDisplayName?: string;
    setFormValues?: (index: number) => void;
    update?: () => void;
    className?: string;
}) {
    if (!displayDataStringArray && !jsonKeyDisplayName) {
        throw new Error('jsonKeyDisplayName cannot be undefined without displayDataStringArray');
    }
    if (mode === 'edit' && !setFormValues) {
        throw new Error('setFormValues cannot be undefined in edit mode');
    }
    if (mode === 'mark' && !cacheName) {
        throw new Error('cacheName cannot be undefined in mark mode');
    }
    if (mode === 'delete' && !cacheName) {
        throw new Error('cacheName cannot be undefined in delete mode');
    }

    const teamsArray: string[] = displayDataStringArray
        ? displayDataStringArray
        : teamsJSON!.map((i: Record<string, any>) => i[jsonKeyDisplayName!].toString());
    const [, forceUpdate] = useState<boolean>(false);

    return (
        <>
            <div className={cn('border rounded-md border-input p-4', className)}>
                {teamsJSON && teamsJSON.length > 0 ? (
                    <>
                        <div className='text-center flex justify-center items-center'>
                            <span className='font-bold'>{label}</span>
                        </div>
                        <div className='py-2 flex flex-row flex-wrap gap-3 justify-center'>
                            {teamsArray.map((i, key) => (
                                <Button
                                    variant={teamsJSON[key].marked ? 'outline' : 'default'}
                                    className='pl-4 pr-4 h-8 ext-xs rounded-md select-none'
                                    key={key}
                                    onClick={() => {
                                        if (mode === 'edit') {
                                            if (setFormValues) {
                                                setFormValues(key);
                                            }
                                        } else if (mode === 'mark') {
                                            teamsJSON[key].marked = !teamsJSON[key].marked;
                                            localStorage.setItem(cacheName!, JSON.stringify(teamsJSON));
                                            forceUpdate((i) => !i);
                                            update();
                                        } else if (mode === 'delete') {
                                            teamsJSON.splice(key, 1);
                                            localStorage.setItem(cacheName!, JSON.stringify(teamsJSON));
                                            forceUpdate((i) => !i);
                                            update();
                                        }
                                    }}
                                >
                                    {i}
                                </Button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className='text-center flex justify-center items-center'>
                        <span className='text-muted-foreground text-sm font-medium'>No {label}</span>
                    </div>
                )}
                {mode === 'mark' && (
                    <div className='flex justify-center items-center mt-4 gap-3'>
                        <Button
                            variant='secondary'
                            className='w-full'
                            onClick={() => {
                                teamsJSON!.forEach((i: Record<string, any>) => (i.marked = true));
                                localStorage.setItem(cacheName!, JSON.stringify(teamsJSON));
                                forceUpdate((i) => !i);
                                update();
                            }}
                        >
                            Mark All Done
                        </Button>
                        <Button
                            variant='secondary'
                            className='w-full'
                            onClick={() => {
                                teamsJSON!.forEach((i: Record<string, any>) => (i.marked = false));
                                localStorage.setItem(cacheName!, JSON.stringify(teamsJSON));
                                forceUpdate((i) => !i);
                                update();
                            }}
                        >
                            Unmark All
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
