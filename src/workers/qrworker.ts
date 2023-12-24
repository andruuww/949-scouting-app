import { toast } from '@/components/ui/use-toast';
import zlib from 'zlib';
// @ts-ignore
import { toSVG } from 'bwip-js';
import pitJSON from '@/jsons/2023/pitscoutingjson';

import { FormElementsType, JSONFormElement } from '@/lib/types';

async function renderQRCodes(scoutedTeams: Record<string, string>[], scoutName: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        zlib.gzip(Buffer.from(jsonToCSV(scoutedTeams, scoutName)), (err, compressedBuffer) => {
            if (err) {
                toast({
                    title: 'Error!',
                    description: 'An error occurred while compressing the data! Contact Andrew...',
                });
            } else {
                const content = compressedBuffer.toString('base64') + '!';
                console.log(content);
                const chunks = content.match(/.{1,500}/g);
                const barcodes = chunks?.map((i) => toSVG({ bcid: 'qrcode', text: i }));
                // setBarcodeSVGs(barcodes!);
                resolve(barcodes!);
            }
        });
    });
}

function jsonToCSV(jsonArray: Record<string, string>[], scoutName: string): string {
    const result: string[] = [];
    console.log(jsonArray);
    jsonArray.map((row) => {
        const rowResult: string[] = [];
        Object.keys(row).map((key) => {
            const value = row[key];
            if (Array.isArray(value) && value.length > 0) {
                rowResult.push(`"${value.join(',')}"`);
            } else {
                rowResult.push(value !== undefined ? String(value) : '');
            }
        });

        result.push([scoutName, ...rowResult].join(','));
    });
    console.log(result);
    return result.join('\n');
}

self.onmessage = async (event) => {
    const barcodes = await renderQRCodes(event.data.data, event.data.scoutName);
    self.postMessage({ barcodes });
};
