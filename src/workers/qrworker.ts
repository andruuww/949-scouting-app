import { toast } from '@/components/ui/use-toast';
import zlib from 'zlib';
// @ts-ignore
import { toSVG } from 'bwip-js';

import { FormData, FormDataClass } from '@/lib/types';

async function renderQRCodes(
    scoutedTeams: FormData[]
    // setBarcodeSVGs: (barcodes: string[]) => void
): Promise<string[]> {
    return new Promise((resolve, reject) => {
        zlib.gzip(Buffer.from(jsonToCSV(scoutedTeams)), (err, compressedBuffer) => {
            if (err) {
                toast({
                    title: 'Error!',
                    description: 'An error occurred while compressing the data! Contact Andrew...',
                });
            } else {
                const content = compressedBuffer.toString('base64');
                console.log(content);
                const chunks = content.match(/.{1,500}/g);
                const barcodes = chunks?.map((i) => toSVG({ bcid: 'qrcode', text: i }));
                // setBarcodeSVGs(barcodes!);
                resolve(barcodes!);
            }
        });
    });
}

function jsonToCSV(jsonArray: FormData[]) {
    if (jsonArray && jsonArray.length > 0) {
        const header = Object.keys(new FormDataClass());
        const csvData = jsonArray.map((row) =>
            header.map((key) => {
                const value = row[key as keyof FormData];
                return value !== undefined ? value : '';
            })
        );
        console.log(csvData.map(row => {
            return row.map((select) => {
                let result = '';
                result = select.constructor === Array ? select.join(' ') : select.toString();
                if (result.includes(',')) {
                    result = `"${result}"`;
                }
                return result;
            }).join(',')
        }).join('\n'));
        return csvData.join('\n');
    }
    return '';
}

self.onmessage = async (e) => {
    console.log(e);
    const barcodes = await renderQRCodes(e.data);
    self.postMessage({ barcodes });
}