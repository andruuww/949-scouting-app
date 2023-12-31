'use client';
import { CounterSettings, JSONFormElement } from '@/lib/types';
import { Button } from './ui/button';
import { FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Input } from './ui/input';

export default function Counter({
    element,
    counterSettings = {
        increment: 1,
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
    },
    form,
}: {
    element: JSONFormElement;
    counterSettings?: CounterSettings;
    form: UseFormReturn<
        {
            [x: string]: any;
        },
        any,
        undefined
    >;
}) {
    function handleCountChange(increment: number, current: any) {
        // parseInt returns NaN if it isn't parsable
        current = parseFloat(current);
        const updatedCount: number = isNaN(current) ? 0 : current + increment;

        if (updatedCount < counterSettings.min! || updatedCount > counterSettings.max!) {
            return;
        }

        form.setValue(element.name!, updatedCount);
        form.trigger(element.name!);
    }

    return (
        <FormField
            control={form.control}
            name={element.name!}
            render={({ field }) => {
                return (
                    <FormItem>
                        <FormLabel className='text-base'>{element.label}</FormLabel>
                        <div className='flex flex-row items-center w-full space-x-5'>
                            <div className='flex items-center'>
                                <Button
                                    variant='secondary'
                                    type='button'
                                    className='h-10 w-10'
                                    onClick={() => {
                                        handleCountChange(-counterSettings.increment!, field.value);
                                    }}
                                >
                                    -
                                </Button>
                            </div>
                            <div className='flex-1'>
                                <label className='hidden' htmlFor={element.label}></label>
                                <Input
                                    type='number'
                                    {...field}
                                    className='text-center w-full'
                                    id={element.name}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (value < counterSettings.min! || value > counterSettings.max!) {
                                            return;
                                        }
                                        form.setValue(element.name!, isNaN(value) ? '' : value);
                                        form.trigger(element.name!);
                                    }}
                                />
                            </div>
                            <div className='flex items-center'>
                                <Button
                                    variant='secondary'
                                    type='button'
                                    className='h-10 w-10'
                                    onClick={() => {
                                        handleCountChange(counterSettings.increment!, field.value);
                                    }}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                        <FormMessage className='text-xs' />
                    </FormItem>
                );
            }}
        />
    );
}
