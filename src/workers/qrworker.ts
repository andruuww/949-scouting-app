import { JSONFormElement, ProtobufOperation } from '@/lib/types';
import QRCode from 'qrcode';

function chunkString(str: string, chunkSize: number) {
    const chunks = [];
    let index = 0;
    while (index < str.length) {
        chunks.push(str.slice(index, (index += chunkSize)));
    }
    return chunks;
}

async function renderQRCodes(compressedData: string): Promise<string[]> {
    console.log(compressedData.length);
    const chunks = chunkString(compressedData, 300);

    const barcodes: string[] = await Promise.all(
        chunks.map(async (i) => {
            return await QRCode.toString(i, { margin: 0 });
        })
    );

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

    protoWorker.onmessage = async (response) => {
        let { seralizedData } = response.data;
        seralizedData = `${event.data.schemaJSON.signature!}${seralizedData}!`;
        const barcodes = await renderQRCodes(seralizedData);
        self.postMessage({ barcodes });
        protoWorker.terminate();
    };
};
