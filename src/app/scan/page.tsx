'use client';
import { use, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ProtobufOperation } from '@/lib/types';
import MenuBar from '@/components/menu-bar';
import Scanner from '@/components/qr-scanner';
import { saveAs } from 'file-saver';
import { toast } from '@/components/ui/use-toast';
import pitJSON from '@/jsons/2023/pitscoutingjson';
import matchJSON from '@/jsons/2023/matchscoutingjson';
import TeamsList from '@/components/teams-list';

function jsonArrToCSV(jsonArray: Record<string, string>[]): string {
    const result: string[] = [];

    const header = Object.keys(jsonArray[0]);

    jsonArray.map((row) => {
        if (!row.marked) {
            const rowResult: string[] = [];
            Object.keys(row).map((key) => {
                const value = row[key];
                if (key !== 'marked') {
                    if (Array.isArray(value) && value.length > 0) {
                        rowResult.push(`"${value.join(',')}"`);
                    } else {
                        rowResult.push(value !== undefined ? String(value) : '');
                    }
                }
            });

            result.push(rowResult.join(','));
        }
    });
    return [header.join(','), ...result].join('\n');
}

export default function Scanning() {
    const containerRef = useRef(null);
    let rawData: string[] = [];
    let lastData: string = '';
    let cacheName = '';

    const [pitScoutingScanned, setPitScoutingScanned] = useState<Record<string, any>[]>([]);
    const [matchScoutingScanned, setMatchScoutingScanned] = useState<Record<string, any>[]>([]);

    function updateScannedData() {
        const pitScoutingScanned = localStorage.getItem('pitScoutingScanned')
            ? JSON.parse(localStorage.getItem('pitScoutingScanned')!)
            : [];
        const matchScoutingScanned = localStorage.getItem('matchScoutingScanned')
            ? JSON.parse(localStorage.getItem('matchScoutingScanned')!)
            : [];
        setPitScoutingScanned(pitScoutingScanned);
        setMatchScoutingScanned(matchScoutingScanned);
    }

    useEffect(() => {
        updateScannedData();
    }, []);

    function handleData(data: string) {
        if (lastData === data) return;
        lastData = data;
        if (!rawData.includes(data)) {
            rawData.push(data);
            toast({
                description: `Barcode part ${rawData.length} scanned!`,
            });
            if (data.slice(-1) === '!') {
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
        let signature = rawData[0].slice(0, 1);
        rawData[0] = rawData[0].slice(1).slice(0, -1);

        if (signature === pitJSON.signature) {
            cacheName = pitJSON.name + 'Scanned';
        } else if (signature === matchJSON.signature) {
            cacheName = matchJSON.name + 'Scanned';
        }

        if (!localStorage.getItem(cacheName)) {
            localStorage.setItem(cacheName, JSON.stringify([]));
        }

        const scannedData: string[] = JSON.parse(localStorage.getItem(cacheName)!);

        const protoWorker = new Worker(new URL('@/workers/protoworker.ts', import.meta.url));
        protoWorker.postMessage({
            data: rawData.join(''),
            schemaJSON: signature === pitJSON.signature ? pitJSON : matchJSON,
            operation: ProtobufOperation.PARSE,
        });

        protoWorker.onmessage = (e) => {
            const parsedData: Record<string, any>[] = e.data.parsedData.items;
            localStorage.setItem(cacheName, JSON.stringify([...scannedData, ...parsedData]));
            toast({
                description: `Data successfully imported!`,
            });
            protoWorker.terminate();
            rawData = [];
            updateScannedData();
        };
    }

    function exportData(cacheName: string) {
        const storedData = localStorage.getItem(cacheName);

        if (!storedData) {
            console.error('No data found in localStorage.');
            return;
        }

        try {
            const scannedDataArray: Record<string, string>[] = JSON.parse(storedData);
            const csvContent = jsonArrToCSV(scannedDataArray);

            const blob = new Blob([csvContent], {
                type: 'text/csv;charset=utf-8',
            });
            saveAs(blob, `${cacheName}.csv`);
        } catch (error) {
            console.error('Error parsing stored data:', error);
        }
    }

    return (
        <>
            <main className='flex flex-col p-7 min-h-screen max-w-md mx-auto justify-between'>
                <MenuBar
                    backButtonPage='/'
                    resetData={() => {
                        localStorage.removeItem(`${pitJSON.name}Scanned`);
                        localStorage.removeItem(`${matchJSON.name}Scanned`);
                        updateScannedData();
                    }}
                />
                <div className='space-y-4'>
                    <TeamsList
                        teamsJSON={pitScoutingScanned}
                        label='Scanned Teams'
                        mode='delete'
                        cacheName={`${pitJSON.name}Scanned`}
                        jsonKeyDisplayName='teamNumber'
                    />
                    <TeamsList
                        teamsJSON={matchScoutingScanned}
                        label='Scanned Matches'
                        mode='delete'
                        cacheName={`${matchJSON.name}Scanned`}
                        displayDataStringArray={matchScoutingScanned.map(
                            (i: Record<string, any>) => `#${i.matchNumber.toString()}: ${i.teamNumber.toString()}`
                        )}
                    />
                </div>
                <div className='w-full aspect-square mb-10 mt-10' ref={containerRef}>
                    <Scanner handleData={handleData} containerRef={containerRef} />
                </div>
                <div className='flex flex-col space-y-4'>
                    <Button
                        variant='secondary'
                        onClick={() => {
                            rawData = [];
                            toast({
                                description: 'Scanned parts have been cleared, start scanning from the beginning.',
                                repeatable: true,
                            });
                        }}
                    >
                        Cancel parts
                    </Button>
                    <div className='w-full space-y-2'>
                        <Button
                            onClick={() => exportData(pitJSON.name + 'Scanned')}
                            variant='default'
                            className='w-full'
                        >
                            Export {pitJSON.label} Data
                        </Button>
                        <Button
                            onClick={() => exportData(matchJSON.name + 'Scanned')}
                            variant='default'
                            className='w-full'
                        >
                            Export {matchJSON.label} Data
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
}
