import { toast } from '@/components/ui/use-toast';
import zlib from 'zlib';
import * as fflate from 'fflate';
// @ts-ignore
import { toSVG } from 'bwip-js';
import { JSONFormElement, ProtobufOperation } from '@/lib/types';
import { generateProtoRoot, protoParse } from './protoworker';

function chunkString(str: string, chunkSize: number) {
    const chunks = [];
    let index = 0;
    while (index < str.length) {
        chunks.push(str.slice(index, (index += chunkSize)));
    }
    return chunks;
}

function renderQRCodes(compressedData: string): string[] {
    console.log(compressedData.length);
    const chunks = chunkString(compressedData, 500);
    const barcodes: string[] = chunks!.map((i) => toSVG({ bcid: 'qrcode', text: i }));
    return barcodes;
}

self.onmessage = async (event: {
    data: { data: Record<string, any>[]; schemaJSON: JSONFormElement; scoutName: string };
}) => {
    const protoWorker = new Worker(new URL('./protoworker.ts', import.meta.url));
    event.data.data.map((i) => {
        i['scoutName'] = event.data.scoutName;
        return i;
    });
    protoWorker.postMessage({
        data: event.data.data,
        operation: ProtobufOperation.SERALIZE,
        schemaJSON: event.data.schemaJSON,
    });

    protoWorker.onmessage = (response) => {
        let { seralizedData } = response.data;
        seralizedData = `${event.data.schemaJSON.signature!}${seralizedData}!`;
        const barcodes = renderQRCodes(seralizedData);
        self.postMessage({ barcodes });
        protoWorker.terminate();
    };
};
