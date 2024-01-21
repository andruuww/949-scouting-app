import { FormElementsType, JSONFormElement, ProtobufOperation } from '@/lib/types';
import * as fflate from 'fflate';
import * as protobuf from 'protobufjs';

const ROOT_NAME = 'root';
const ITEM_NAME = 'item';
const REPEATED_ITEM_NAME = 'repeatedItem';

function toPascalCase(inputString: string) {
    return inputString
        .replace(/\b\w/g, function (match) {
            return match.toUpperCase();
        })
        .replace(/\s/g, '');
}

function generateProtoSchemaArray(json: JSONFormElement): Record<string, string>[] {
    let result: Record<string, string>[] = [];
    if (json.elements && json.elements.length > 0) {
        for (const element of json.elements) {
            const fieldName = element.name || '';
            // flatten checkbox options
            if (element.type === FormElementsType.CHECKBOX) {
                element.options?.forEach((option) => {
                    result.push({ name: `${fieldName}${toPascalCase(option)}`, type: 'bool' });
                });
            } else {
                const fieldType = getFieldType(element);

                if (element.elements) {
                    result = [...result, ...generateProtoSchemaArray(element)];
                } else if (
                    element.type !== FormElementsType.TITLE &&
                    element.type !== FormElementsType.ROOT &&
                    element.type !== FormElementsType.CLEAR_SUBMIT_BUTTONS
                ) {
                    result.push({ name: fieldName, type: fieldType });
                }
            }
        }
    }

    return result;
}

function getFieldType(element: JSONFormElement): string {
    switch (element.type) {
        case FormElementsType.NUMBER:
            return 'int32';
        case FormElementsType.SWITCH:
            return 'bool';
        case FormElementsType.SELECT:
            return 'string';
        case FormElementsType.COUNTER:
            return 'int32';
        default:
            return 'string';
    }
}

export function generateProtoRoot(jsonElement: JSONFormElement): protobuf.Root {
    const root = new protobuf.Root();
    const item = new protobuf.Type(ITEM_NAME);

    const fields = generateProtoSchemaArray(jsonElement);
    fields.push({ name: 'scoutName', type: 'string' });

    fields.forEach((field, index) => {
        item.add(new protobuf.Field(field.name, index + 1, field.type));
    });
    root.define(ROOT_NAME).add(item);

    const repeatedMessage = new protobuf.Type(REPEATED_ITEM_NAME);
    repeatedMessage.add(new protobuf.Field('items', 1, ITEM_NAME, 'repeated'));
    root.define(ROOT_NAME).add(repeatedMessage);

    return root;
}

export function protoSerialize(sampleData: { items: Record<string, any>[] }, root: protobuf.Root): string {
    const GeneratedForm = root.lookupType(`${ROOT_NAME}.${REPEATED_ITEM_NAME}`);

    // flatten checkbox options
    sampleData.items.forEach((row) => {
        Object.keys(row).forEach((key: string) => {
            if (Array.isArray(row[key])) {
                row[key].forEach((option: string) => {
                    row[`${key}${toPascalCase(option)}`] = true;
                });
                delete row[key];
            }
        });
    });

    // generate protobuf message
    const messageInstance = GeneratedForm.create(sampleData);
    const serializedMessage = GeneratedForm.encode(messageInstance).finish();
    // compress message
    const compressedMessage = fflate.deflateSync(serializedMessage, { level: 9, mem: 12 });
    return fflate.strFromU8(compressedMessage, true);
}

export function protoParse(message: string, root: protobuf.Root): Record<string, string> {
    const GeneratedForm = root.lookupType(`${ROOT_NAME}.${REPEATED_ITEM_NAME}`);

    const compressedBuffer = fflate.strToU8(message, true);
    const decompressedBuffer = fflate.inflateSync(compressedBuffer);
    const messageInstance = GeneratedForm.decode(decompressedBuffer);

    const verifyError = GeneratedForm.verify(messageInstance);
    if (verifyError) {
        console.error('Error verifying message:', verifyError);
        throw new Error(verifyError);
    }

    const jsonMessage = GeneratedForm.toObject(messageInstance, {
        enums: String,
        longs: String,
        defaults: true,
        arrays: true,
        objects: true,
        oneofs: true,
    });
    return jsonMessage;
}

self.onmessage = async (event: {
    data: { data: Record<string, any>[] | string; operation: ProtobufOperation; schemaJSON: JSONFormElement };
}) => {
    const root = generateProtoRoot(event.data.schemaJSON);
    if (event.data.operation === ProtobufOperation.PARSE) {
        let parsedData;
        if (typeof event.data.data === 'string') {
            parsedData = protoParse(event.data.data, root);
        } else {
            throw new Error('Invalid data format. Expected string.');
        }
        self.postMessage({ parsedData });
    }
    if (event.data.operation === ProtobufOperation.SERALIZE) {
        const unmarkedData = Array.isArray(event.data.data)
            ? event.data.data.filter((item: Record<string, any>) => !item.marked)
            : [];
        const seralizedData = protoSerialize({ items: unmarkedData }, root);
        self.postMessage({ seralizedData });
    }
};
