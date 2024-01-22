import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { CounterSettings, CounterStyles, JSONFormElement } from '@/lib/types';
import { Button } from './ui/button';
import { FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { Input } from './ui/input';
import Settings from '@/lib/settings';
import { cn } from '@/lib/utils';

const CounterField = React.forwardRef<
    HTMLInputElement,
    {
        className?: string;
        containerRef?: React.RefObject<HTMLDivElement>;
        field: ControllerRenderProps<{ [x: string]: any }, string>;
        counterSettings: CounterSettings;
        element: JSONFormElement;
        form: UseFormReturn<{ [x: string]: any }, any, undefined>;
    }
>(({ className, containerRef, field, counterSettings, element, form }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (containerRef && containerRef.current && inputRef.current) {
            const containerHeight = containerRef.current.clientHeight;
            inputRef.current.style.height = `${containerHeight}px`;
        }
    }, [containerRef, inputRef]);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, [inputRef]);

    return (
        <div className='flex-1'>
            <label className='hidden' htmlFor={element.label}></label>
            <Input
                type='number'
                {...field}
                className={cn('text-center w-full', className)}
                id={element.name}
                ref={inputRef}
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
    );
});

CounterField.displayName = 'CounterField';

function CounterButton({ onClick, symbol }: { onClick: () => void; symbol: string }) {
    return (
        <div className='flex items-center'>
            <Button variant='secondary' type='button' className='h-10 w-10' onClick={onClick}>
                {symbol}
            </Button>
        </div>
    );
}

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
    form: UseFormReturn<{ [x: string]: any }, any, undefined>;
}) {
    const style = Settings.getCounterStyle();
    const container = useRef<HTMLDivElement>(null);

    return (
        <FormField
            control={form.control}
            name={element.name!}
            render={({ field }) => {
                const handleCountChange = (increment: number) => {
                    const current = parseFloat(field.value);
                    const updatedCount: number = isNaN(current) ? 0 : current + increment;

                    if (updatedCount < counterSettings.min! || updatedCount > counterSettings.max!) {
                        return;
                    }

                    form.setValue(element.name!, updatedCount);
                    form.trigger(element.name!);
                };

                return (
                    <FormItem>
                        <FormLabel className='text-base'>{element.label}</FormLabel>
                        <div ref={container} className='flex flex-row items-center w-full space-x-4'>
                            {style === CounterStyles.LEFT && (
                                <>
                                    <div className='flex flex-col space-y-2'>
                                        <CounterButton
                                            onClick={() => handleCountChange(counterSettings.increment!)}
                                            symbol='+'
                                        />
                                        <CounterButton
                                            onClick={() => handleCountChange(-counterSettings.increment!)}
                                            symbol='-'
                                        />
                                    </div>
                                    <CounterField
                                        className=''
                                        containerRef={container}
                                        field={field}
                                        form={form}
                                        element={element}
                                        counterSettings={counterSettings}
                                    />
                                </>
                            )}
                            {style === CounterStyles.RIGHT && (
                                <>
                                    <CounterField
                                        className=''
                                        containerRef={container}
                                        field={field}
                                        form={form}
                                        element={element}
                                        counterSettings={counterSettings}
                                    />
                                    <div className='flex flex-col space-y-2'>
                                        <CounterButton
                                            onClick={() => handleCountChange(counterSettings.increment!)}
                                            symbol='+'
                                        />
                                        <CounterButton
                                            onClick={() => handleCountChange(-counterSettings.increment!)}
                                            symbol='-'
                                        />
                                    </div>
                                </>
                            )}
                            {style !== CounterStyles.LEFT && style !== CounterStyles.RIGHT && (
                                <>
                                    <CounterButton
                                        onClick={() => handleCountChange(-counterSettings.increment!)}
                                        symbol='-'
                                    />
                                    <CounterField
                                        className=''
                                        containerRef={container}
                                        field={field}
                                        form={form}
                                        element={element}
                                        counterSettings={counterSettings}
                                    />
                                    <CounterButton
                                        onClick={() => handleCountChange(counterSettings.increment!)}
                                        symbol='+'
                                    />
                                </>
                            )}
                        </div>
                        <FormMessage className='text-xs' />
                    </FormItem>
                );
            }}
        />
    );
}
