'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormElementsType, JSONFormElement } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useImperativeHandle } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import Counter from './counter';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

// TODO THIS CAN BE MULTITHREADED!!!
function generateSchemaArray(formElementData: JSONFormElement): { name: string; schema: z.ZodTypeAny }[] {
    let schema: { name: string; schema: z.ZodTypeAny }[] = [];

    if (!formElementData) return schema;

    for (const [key, field] of Object.entries(formElementData.elements || {})) {
        const type = field.type;
        const name = field.name;
        const errorMessage = field.errorMessage || `${field.label} is required`;

        if (name) {
            let fieldSchema: z.ZodTypeAny | undefined;

            if (field.schema) {
                fieldSchema = field.schema;
            } else {
                switch (type) {
                    case FormElementsType.GROUP:
                        if (field.elements) {
                            const nestedSchema = generateSchemaArray(field);
                            schema = [...schema, ...nestedSchema];
                        }
                        break;

                    case FormElementsType.TEXT:
                    case FormElementsType.TEXTAREA:
                        fieldSchema = z.string().trim().min(1, {
                            message: errorMessage,
                        });
                        break;

                    case FormElementsType.NUMBER:
                        fieldSchema = z.coerce
                            .number()
                            .min(0)
                            .refine((data: any) => data, {
                                message: errorMessage,
                            });
                        break;

                    case FormElementsType.COUNTER:
                        fieldSchema = z
                            .number()
                            .or(z.string())
                            .refine((data: any) => (data || data === 0) && data !== '', {
                                message: errorMessage,
                            });
                        break;

                    case FormElementsType.CHECKBOX:
                        fieldSchema = z.array(z.enum([field.options![0], ...field.options!.slice(1)])).nonempty({
                            message: errorMessage,
                        });
                        break;

                    case FormElementsType.SELECT:
                        fieldSchema = z.string().refine((data) => field.options!.includes(data), {
                            message: errorMessage,
                        });
                        break;

                    case FormElementsType.SWITCH:
                        fieldSchema = z.coerce.boolean();
                        break;

                    default:
                        break;
                }
            }

            if (fieldSchema) {
                if (field.required === false) {
                    fieldSchema = fieldSchema
                        .optional()
                        .or(z.literal(''))
                        .or(z.array(z.literal('')))
                        .or(z.array(z.number()));
                }

                schema.push({ name, schema: fieldSchema });
            }
        }
    }

    return schema;
}

export function generateSchemaObject(formJSON: JSONFormElement): z.ZodObject<Record<string, z.ZodTypeAny>> {
    const schema = z.object(
        generateSchemaArray(formJSON!).reduce(
            (acc, entry) => {
                acc[entry.name] = entry.schema;
                return acc;
            },
            {} as Record<string, z.ZodTypeAny>
        )
    );

    return schema;
}

function generateDefaultValues(formElementData: JSONFormElement): Record<string, any> {
    let defaultValues: Record<string, any> = {};

    if (!formElementData) return {};

    for (const [key, field] of Object.entries(formElementData.elements!)) {
        const type = field.type;
        const name = field.name;

        if (name) {
            switch (type) {
                case FormElementsType.GROUP:
                    if (field.elements) {
                        const nestedDefaultValues = generateDefaultValues(field);
                        defaultValues = { ...defaultValues, ...nestedDefaultValues };
                    }
                    break;

                case FormElementsType.TEXT:
                case FormElementsType.TEXTAREA:
                case FormElementsType.SELECT:
                case FormElementsType.NUMBER:
                    defaultValues[name] = '';
                    break;

                case FormElementsType.COUNTER:
                    defaultValues[name] = 0;
                    break;

                case FormElementsType.CHECKBOX:
                    defaultValues[name] = [];
                    break;

                case FormElementsType.SWITCH:
                    defaultValues[name] = false;
                    break;

                default:
                    break;
            }
        }
    }

    return defaultValues;
}

function renderDOM(
    formElement: JSONFormElement,
    form: UseFormReturn<{ [x: string]: any }, any, undefined>
): JSX.Element[] {
    if (!formElement) return [];
    if ('elements' in formElement) {
        return Object.entries(formElement.elements || {}).map(([key, element]) => renderItem(element, key, form));
    }
    return [];
}

function renderItem(
    element: JSONFormElement,
    key: string,
    form: UseFormReturn<
        {
            [x: string]: any;
        },
        any,
        undefined
    >
) {
    switch (element.type) {
        case FormElementsType.TITLE:
            return (
                <div key={key} className='text-2xl font-bold'>
                    <div className='mt-8'>{element.label}</div>
                </div>
            );

        case FormElementsType.TEXTAREA:
            return (
                <FormField
                    control={form.control}
                    name={element.name!}
                    key={key}
                    render={({ field }) => {
                        return (
                            <FormItem key={key}>
                                <FormLabel className='text-base'>{element.label}</FormLabel>
                                <FormControl>
                                    <Textarea placeholder={element.placeholder} {...field} />
                                </FormControl>
                                <FormMessage className='text-xs' />
                            </FormItem>
                        );
                    }}
                />
            );
        case FormElementsType.NUMBER:
            return (
                <FormField
                    control={form.control}
                    name={element.name!}
                    key={key}
                    render={({ field }) => {
                        return (
                            <FormItem key={key}>
                                <FormLabel className='text-base'>{element.label}</FormLabel>
                                <FormControl>
                                    <Input type='number' placeholder={element.placeholder} {...field} />
                                </FormControl>
                                <FormMessage className='text-xs' />
                            </FormItem>
                        );
                    }}
                />
            );
        case FormElementsType.TEXT:
            return (
                <FormField
                    control={form.control}
                    name={element.name!}
                    key={key}
                    render={({ field }) => {
                        return (
                            <FormItem key={key}>
                                <FormLabel className='text-base'>{element.label}</FormLabel>
                                <FormControl>
                                    <Input placeholder={element.placeholder} {...field} />
                                </FormControl>
                                <FormMessage className='text-xs' />
                            </FormItem>
                        );
                    }}
                />
            );
        case FormElementsType.GROUP:
            // RECURSIVE NIGHTMARE
            const groupItems = renderDOM(element, form);

            return (
                <FormField
                    control={form.control}
                    name={element.name!}
                    key={key}
                    render={({ field }) => (
                        <FormItem key={key}>
                            {element.label && <FormLabel className='text-base'>{element.label}</FormLabel>}
                            <div key={`group-div-${key}`} className='flex space-x-4 flex-grow'>
                                {groupItems.map((item, index) => (
                                    <React.Fragment key={`group-item-${index}`}>
                                        {/* {index > 0 && (
                                            <div key={`separator-div-${index}`} className='h-14'>
                                                <Separator orientation='vertical' />
                                            </div>
                                        )} */}
                                        <div key={`group-item-${index}`} className='w-full'>
                                            {React.cloneElement(item, { field })}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </FormItem>
                    )}
                />
            );
        case FormElementsType.SELECT:
            return (
                <FormField
                    control={form.control}
                    name={element.name!}
                    key={key}
                    render={({ field }) => {
                        return (
                            <FormItem key={key}>
                                <FormLabel className='text-base'>{element.label}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue='' value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={element.placeholder}>
                                                {field.value === '' ? element.placeholder : field.value}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {element.options!.map((option, index) => (
                                            <SelectItem key={index} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                    <FormMessage className='text-xs' />
                                </Select>
                            </FormItem>
                        );
                    }}
                />
            );
        case FormElementsType.SWITCH:
            return (
                <FormField
                    control={form.control}
                    name={element.name!}
                    key={key}
                    render={({ field }) => {
                        return (
                            <FormItem key={key} className='h-full'>
                                <div className='flex flex-row items-center justify-between border h-full rounded-xl border-gray-300 dark:border-gray-800 p-4'>
                                    <FormLabel className='leading-relaxed'>{element.label}</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={(checked) => field.onChange(checked)}
                                            className='ml-2'
                                        />
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </div>
                            </FormItem>
                        );
                    }}
                />
            );
        case FormElementsType.CHECKBOX:
            return (
                <FormField
                    control={form.control}
                    name={element.name!}
                    key={key}
                    render={() => {
                        return (
                            <FormItem key={key}>
                                <FormLabel className='text-base'>{element.label}</FormLabel>
                                <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
                                    {element.options!.map((option, index) => (
                                        <FormField
                                            control={form.control}
                                            name={element.name!}
                                            key={option}
                                            render={({ field }) => {
                                                return (
                                                    <FormItem key={index}>
                                                        <div className='flex flex-row items-center space-x-4'>
                                                            <div className='flex items-center'>
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(option)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([
                                                                                      ...field.value,
                                                                                      option,
                                                                                  ])
                                                                                : field.onChange(
                                                                                      field.value?.filter(
                                                                                          (value: any) =>
                                                                                              value !== option
                                                                                      )
                                                                                  );
                                                                        }}
                                                                        className='h-10 w-10'
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <FormLabel>{option}</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage className='text-xs' />
                            </FormItem>
                        );
                    }}
                />
            );
        case FormElementsType.COUNTER:
            return <Counter element={element} counterSettings={element.settings} form={form} key={key} />;
        case FormElementsType.CLEAR_SUBMIT_BUTTONS:
            return (
                <div key={key}>
                    <div className='space-y-2 mt-4'>
                        <Button type='button' variant='default' className='w-full' onClick={form.reset}>
                            {element.options![0]}
                        </Button>
                        <Button type='submit' variant='default' className='w-full'>
                            {element.options![1]}
                        </Button>
                    </div>
                </div>
            );
        default:
            return <React.Fragment key={key}></React.Fragment>;
    }
}

const Parser = React.forwardRef(({ formJSON, update }: { formJSON: JSONFormElement; update?: () => void }, ref) => {
    const defaultValues = generateDefaultValues(formJSON);

    function areFormValuesDefault() {
        const formValues = formResolver.getValues();
        for (const key in defaultValues) {
            if (defaultValues.hasOwnProperty(key)) {
                const defaultValue = defaultValues[key];
                const formValue = formValues[key];

                if (JSON.stringify(formValue) !== JSON.stringify(defaultValue)) {
                    toast.warning(`Data Loss!`, {
                        description: `Please submit or clear the form.`,
                        action: {
                            label: 'Clear',
                            onClick: () => {
                                formResolver.reset();
                            },
                        },
                    });
                    return false;
                }
            }
        }
        return true;
    }

    useImperativeHandle(ref, () => {
        return {
            setValues: (teamIndex: number) => {
                if (formResolver) {
                    if (areFormValuesDefault()) {
                        setTimeout(() => {
                            const teams = JSON.parse(
                                localStorage.getItem(formJSON.name!) ? localStorage.getItem(formJSON.name!)! : '[]'
                            );
                            const team = teams ? teams[teamIndex] : null;
                            formResolver.reset(team);
                            teams.splice(teamIndex, 1);
                            localStorage.setItem(formJSON.name!, JSON.stringify(teams));
                            if (update) update();
                        }, 0);
                    }
                }
            },
            clearForm: () => {
                if (formResolver) {
                    formResolver.reset(defaultValues);
                }
            },
            isFormClear: () => areFormValuesDefault(),
        };
    });

    const schema = generateSchemaObject(formJSON);
    const formResolver = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema!),
        defaultValues: defaultValues,
        mode: 'onChange',
    });

    const formDOM = renderDOM(formJSON, formResolver);

    function onSubmit(values: z.infer<typeof schema>) {
        values['marked'] = false;

        const cacheName = formJSON.name!;
        const scoutedTeams = localStorage.getItem(cacheName) ? JSON.parse(localStorage.getItem(cacheName)!) : [];
        const teams = [...scoutedTeams, values];
        if (typeof window !== 'undefined') localStorage.setItem(cacheName, JSON.stringify(teams));
        if (update) update();
        formResolver.reset(generateDefaultValues(formJSON));
    }

    if (!formResolver || !onSubmit) return null;
    return (
        <Form {...formResolver}>
            <form onSubmit={formResolver.handleSubmit(onSubmit)} autoComplete='off' className='space-y-8' noValidate>
                <div className='flex flex-col space-y-4'>{formDOM.map((element) => element)}</div>
            </form>
        </Form>
    );
});

Parser.displayName = 'Parser';
export default Parser;
