import { z } from 'zod';

export interface CounterSettings {
    increment?: number;
    min?: number;
    max?: number;
}

export interface JSONFormElement {
    label?: string;
    placeholder?: string;
    type?: FormElementsType;
    name?: string;
    required?: boolean;
    errorMessage?: string;
    schema?: z.ZodTypeAny;
    options?: string[];
    elements?: JSONFormElement[];
    settings?: CounterSettings;
    signature?: string;
}

export enum FormElementsType {
    ROOT = 'root',
    TITLE = 'title',
    TEXT = 'text',
    NUMBER = 'number',
    SELECT = 'select',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    GROUP = 'group',
    INPUTS = 'inputs',
    RESET = 'reset',
    COUNTER = 'counter',
    SWITCH = 'switch',
    CLEAR_SUBMIT_BUTTONS = 'clear_submit_buttons',
}

export enum SWStatus {
    START_PRECACHE = 'START',
    PENDING = 'Precache Pending',
    SUCCESS = 'Precache Complete',
    FORCE_CLEAR = 'CLEAR',
    ERROR = 'ERROR',
    UNREGISTER = 'ServiceWorker Unregistered.',
    ACTIVATED = 'ServiceWorker Activated.',
}

export enum ProtobufOperation {
    SERALIZE = 'SERALIZE',
    PARSE = 'PARSE',
}

export enum SwitchStyles {
    NORMAL = 'normal',
    FULL_BOX = 'fullBox',
}

export enum CounterStyles {
    CENTER = 'center',
    LEFT = 'left',
    RIGHT = 'right',
}
