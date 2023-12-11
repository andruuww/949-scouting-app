'use client';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { FormDataClass } from '@/lib/types';
import MenuBar from '@/components/menu-bar';
import Scanner from '@/components/qr-scanner';
import { saveAs } from 'file-saver';
import { toast } from '@/components/ui/use-toast';
import zlib from 'zlib';

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
                processData();
            }
        } else {
            toast({
                title: 'Duplicate!',
                description: `This barcode was scanned as part ${rawData.indexOf(data) + 1}!`,
            });
        }
    }

    function processData() {
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
                if (!localStorage.getItem('scoutData')) {
                    localStorage.setItem('scoutData', JSON.stringify({ data: [] }));
                }
                const scoutData: { data: string[] } = JSON.parse(localStorage.getItem('scoutData')!);
                console.log(scoutData);
                scoutData.data.push(decompressed);
                localStorage.setItem('scoutData', JSON.stringify(scoutData));

                toast({
                    description: `Scout number ${scoutData.data.length} has been saved!`,
                });
            }

            rawData = [];
        });
    }

    function exportData() {
        const storedData = localStorage.getItem('scoutData');

        if (!storedData) {
            console.error('No data found in localStorage.');
            return;
        }

        try {
            const scoutData = JSON.parse(storedData);
            const dataArray = scoutData.data;

            if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
                console.error('No data array found in scoutData.');
                return;
            }

            const csvContent = dataArray.join('\n');

            // Create a Blob and append header row to it
            const header = Object.keys(new FormDataClass());
            const blob = new Blob([`${header.join(',')}\n`, csvContent], { type: 'text/csv;charset=utf-8' });

            // Use file-saver to trigger the download
            saveAs(blob, 'scoutData.csv');
        } catch (error) {
            console.error('Error parsing stored data:', error);
        }
    }

    return (
        <>
            <main className='flex flex-col p-7 h-screen max-w-md mx-auto justify-between'>
                <MenuBar backButtonPage='/' resetData={() => localStorage.removeItem('scoutData')} />
                <div className='w-full h-[70%]' ref={containerRef}>
                    <Scanner handleData={handleData} containerRef={containerRef} />
                </div>
                <div className='flex flex-col space-y-3'>
                    <Button onClick={processData}>Finish Scout</Button>
                    <Button onClick={exportData} variant='secondary'>
                        Export
                    </Button>
                </div>
            </main>
        </>
    );
}
