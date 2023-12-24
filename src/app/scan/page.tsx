'use client';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { FormDataClass, FormElementsType, JSONFormElement } from '@/lib/types';
import MenuBar from '@/components/menu-bar';
import Scanner from '@/components/qr-scanner';
import { saveAs } from 'file-saver';
import { toast } from '@/components/ui/use-toast';
import zlib from 'zlib';
import pitJSON from '@/jsons/2023/pitscoutingjson';

export default function Scanning() {
    const containerRef = useRef(null);
    let rawData: string[] = [];
    let lastData: string = '';

    enum ScanState {
        SCANNING = 'SCANNING',
        PROCESSING = 'PROCESSING',
        FINISHED = 'FINISHED',
        ERROR = 'ERROR',
    }

    function decompress(data: String, callback: (result: string) => void): void {
        zlib.gunzip(Buffer.from(data, 'base64'), (err, decompressedBuffer) => {
            if (!err) {
                const result = decompressedBuffer.toString('utf-8');
                console.log(result);
                callback(result);
            } else {
                callback(ScanState.ERROR);
            }
        });
    }

    function handleData(data: string) {
        if (lastData === data) return;
        lastData = data;
        if (!rawData.includes(data)) {
            rawData.push(data);
            toast({
                title: 'Scanned!',
                description: `Barcode part ${rawData.length} scanned!`,
            });
            console.log(data);
            if (data.slice(-1) === '!') {
                data = data.slice(0, -1);
                bundleQRData();
            }
        } else {
            toast({
                title: 'Duplicate!',
                description: `This barcode was scanned as part ${rawData.indexOf(data) + 1}!`,
            });
        }
    }

    function bundleQRData() {
        decompress(rawData.join(''), (decompressed) => {
            console.log(decompressed);
            if (decompressed === ScanState.ERROR) {
                toast({
                    repeatable: true,
                    variant: 'destructive',
                    description: `There was an error processing the data! Please rescan all QR code parts!`,
                });
                lastData = '';
            } else {
                if (!localStorage.getItem('scannedData')) {
                    localStorage.setItem('scannedData', JSON.stringify({ data: [] }));
                }
                const scannedData: { data: string[] } = JSON.parse(localStorage.getItem('scannedData')!);
                console.log(scannedData);
                scannedData.data.push(decompressed);
                localStorage.setItem('scannedData', JSON.stringify(scannedData));

                toast({
                    description: `Scout number ${scannedData.data.length} has been saved!`,
                });
            }

            rawData = [];
        });
    }

    function generateHeader(json: JSONFormElement): string[] {
        let header: string[] = [];

        function traverse(element: JSONFormElement) {
            if (element.elements) {
                element.elements.forEach(traverse);
            } else if (element.type !== FormElementsType.SUBMIT) {
                header.push(element.name || '');
            }
        }

        traverse(json);

        return header;
    }

    function exportData() {
        const storedData = localStorage.getItem('scannedData');

        if (!storedData) {
            console.error('No data found in localStorage.');
            return;
        }

        try {
            const scannedDataArray: Record<string, string>[] = JSON.parse(storedData).data;

            if (!scannedDataArray || !Array.isArray(scannedDataArray) || scannedDataArray.length === 0) {
                console.error('No data array found in scannedData.');
                return;
            }

            const csvContent = scannedDataArray.join('\n');

            const blob = new Blob([`${['scoutName', ...generateHeader(pitJSON)].join(',')}\n`, csvContent], {
                type: 'text/csv;charset=utf-8',
            });

            saveAs(blob, 'scannedData.csv');
        } catch (error) {
            console.error('Error parsing stored data:', error);
        }
    }

    return (
        <>
            <main className='flex flex-col p-7 h-screen max-w-md mx-auto justify-between'>
                <MenuBar backButtonPage='/' resetData={() => localStorage.removeItem('scannedData')} />
                <div className='w-full h-[70%]' ref={containerRef}>
                    <Scanner handleData={handleData} containerRef={containerRef} />
                </div>
                <div className='flex flex-col space-y-3'>
                    <Button onClick={bundleQRData}>Finish Scout</Button>
                    <Button onClick={exportData} variant='secondary'>
                        Export
                    </Button>
                </div>
            </main>
        </>
    );
}
