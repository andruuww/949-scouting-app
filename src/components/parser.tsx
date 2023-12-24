'use client';
import { FormElementsType, FormType, JSONFormElement } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from './ui/button';
import pitJSON from '@/jsons/2023/pitscoutingjson';
import Counter from './counter';
import { toast } from './ui/use-toast';
import React from 'react';

// TODO THIS CAN BE MULTITHREADED!!!
function generateFormSchemaArray(formElementData: JSONFormElement): { name: string; schema: z.ZodTypeAny }[] {
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
                            const nestedSchema = generateFormSchemaArray(field);
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
                            <FormLabel className='text-base'>{element.label}</FormLabel>
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
                                <Select onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={element.placeholder} />
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
                                <div className='w-full grid grid-cols-2 gap-6'>
                                    {element.options!.map((option, index) => (
                                        <FormField
                                            control={form.control}
                                            name={element.name!}
                                            key={option}
                                            render={({ field }) => {
                                                return (
                                                    <FormItem key={index}>
                                                        <div className='flex flex-row items-center space-x-10'>
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
        case FormElementsType.SUBMIT:
            return (
                <FormItem key={key}>
                    <Button type='submit' variant='default' className='w-full'>
                        {element.label}
                    </Button>
                </FormItem>
            );
        default:
            return <React.Fragment key={key}></React.Fragment>;
    }
}

export default function Parser({ formType }: { formType: FormType }) {
    let formJSON = {};
    switch (formType) {
        case FormType.PIT:
            formJSON = pitJSON;
    }

    const schema = z.object(
        generateFormSchemaArray(formJSON!).reduce(
            (acc, entry) => {
                acc[entry.name] = entry.schema;
                return acc;
            },
            {} as Record<string, z.ZodTypeAny>
        )
    );
    const formResolver = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema!),
        defaultValues: generateDefaultValues(formJSON),
        mode: 'onChange',
    });

    const formDOM = renderDOM(formJSON, formResolver);

    function onSubmit(values: z.infer<typeof schema>) {
        const scoutedTeams = localStorage.getItem('pitScoutedTeams')
            ? JSON.parse(localStorage.getItem('pitScoutedTeams')!)
            : [];
        console.log(values);
        const teams = [...scoutedTeams, values];
        if (typeof window !== 'undefined') localStorage.setItem('pitScoutedTeams', JSON.stringify(teams));
        toast({
            title: `Submitted!`,
            description: `Team ${values.teamNumber} has been scouted!`,
        });
    }

    if (!formResolver || !onSubmit) return null;
    return (
        <Form {...formResolver}>
            <form onSubmit={formResolver.handleSubmit(onSubmit)} autoComplete='off' className='space-y-8' noValidate>
                {formDOM.map((element) => element)}
            </form>
        </Form>
    );
}
