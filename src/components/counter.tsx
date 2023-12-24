import { CounterSettings, JSONFormElement } from '@/lib/types';
import { Button } from './ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from './ui/input';
import { set } from 'zod';

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
    const [count, setCount] = useState<number>(0);
    function handleCountChange(increment: number) {
        const updatedCount = isNaN(count) ? 0 : count + increment;

        if (updatedCount < counterSettings.min! || updatedCount > counterSettings.max!) {
            return;
        }

        form.setValue(element.name!, updatedCount);
        setCount(updatedCount);
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
                                        handleCountChange(-counterSettings.increment!);
                                    }}
                                >
                                    -
                                </Button>
                            </div>
                            <div className='flex-1'>
                                <Input
                                    type='number'
                                    {...field}
                                    className='text-center w-full'
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (value < counterSettings.min! || value > counterSettings.max!) {
                                            return;
                                        }
                                        setCount(value);
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
                                        handleCountChange(counterSettings.increment!);
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
