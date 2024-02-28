'use client';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ProtobufOperation } from '@/lib/types';
import Scanner from '@/components/qr-scanner';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import pitJSON from '@/jsons/2024/pitscoutingjson';
import matchJSON from '@/jsons/2024/matchscoutingjson';
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
} from '@/components/ui/drawer';
import useSwipe from '@/components/useSwipe';
import MenuBar from '@/components/menu-bar';
import TeamsList from '@/components/teams-list';

function jsonToCSV(row: Record<string, any>): string {
    const rowResult: string[] = [];
    Object.keys(row).map((key) => {
        const value = row[key];
        if (Array.isArray(value) && value.length > 0) {
            rowResult.push(`"${value.join(',')}"`);
        } else {
            rowResult.push(value !== undefined ? String(value) : '');
        }
    });
    return rowResult.join(',');
}

function jsonArrToCSV(jsonArray: Record<string, string>[]): string {
    const result: string[] = [];

    const header = Object.keys(jsonArray[0]);

    jsonArray.map((row) => {
        result.push(jsonToCSV(row));
    });
    return [header.join(','), ...result].join('\n');
}

export default function Scanning() {
    let rawData = useRef<string[]>([]);
    let lastData = useRef<string>('');
    let cacheName = useRef<string>('');

    const [pitScoutingScanned, setPitScoutingScanned] = useState<Record<string, any>[]>([]);
    const [matchScoutingScanned, setMatchScoutingScanned] = useState<Record<string, any>[]>([]);

    // drawer open
    const [open, setOpen] = useState(false);

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
        if (lastData.current === data) {
            return;
        }
        lastData.current = data;
        if (!rawData.current.includes(data)) {
            rawData.current.push(data);
            toast.success('Scanned', {
                description: `Rart ${rawData.current.length} has been scanned!`,
            });
            if (data.slice(-1) === '!') {
                bundleQRData();
            }
        } else {
            toast.success('Duplicate!', {
                description: `This barcode was scanned as part ${rawData.current.indexOf(data) + 1}!`,
            });
        }
    }

    function bundleQRData() {
        let signature = rawData.current[0].slice(0, 1);
        rawData.current[0] = rawData.current[0].slice(1);
        rawData.current[rawData.current.length - 1] = rawData.current[rawData.current.length - 1].slice(0, -1);

        if (signature === pitJSON.signature) {
            cacheName.current = pitJSON.name + 'Scanned';
        } else if (signature === matchJSON.signature) {
            cacheName.current = matchJSON.name + 'Scanned';
        }

        if (!localStorage.getItem(cacheName.current)) {
            localStorage.setItem(cacheName.current, JSON.stringify([]));
        }

        const scannedData: string[] = JSON.parse(localStorage.getItem(cacheName.current)!);

        const protoWorker = new Worker(new URL('@/workers/protoworker.ts', import.meta.url));
        protoWorker.postMessage({
            data: rawData.current.join(''),
            schemaJSON: signature === pitJSON.signature ? pitJSON : matchJSON,
            operation: ProtobufOperation.PARSE,
        });

        protoWorker.onmessage = (e) => {
            const parsedData: Record<string, any>[] = e.data.parsedData.items;
            localStorage.setItem(cacheName.current, JSON.stringify([...scannedData, ...parsedData]));
            toast.success('Success', {
                description: `Data successfully imported!`,
            });
            protoWorker.terminate();
            rawData.current = [];
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

    const swipeHandlers = useSwipe({
        onSwipedUp: () => {
            setOpen(true);
        },
    });

    return (
        <>
            <main className='flex flex-col h-screen mx-auto justify-between'>
                <Scanner handleData={handleData}></Scanner>

                <MenuBar
                    className='fixed top-[calc(env(safe-area-inset-top))] inset-x-0 p-7'
                    backButtonPage='/'
                    resetData={() => {
                        localStorage.removeItem(`${pitJSON.name}Scanned`);
                        localStorage.removeItem(`${matchJSON.name}Scanned`);
                        updateScannedData();
                    }}
                />

                <Drawer open={open} onClose={() => setOpen(false)}>
                    <DrawerTrigger asChild>
                        <div
                            className={`w-full fixed bottom-[calc(env(safe-area-inset-bottom))] right-0 left-0 pointer-events-auto h-[20rem] p-7 flex flex-col justify-end ${
                                open && 'pointer-events-none'
                            }`}
                            {...swipeHandlers}
                        >
                            <Button className='w-full' onClick={() => setOpen(true)}>
                                Open Console
                            </Button>
                        </div>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className='mx-auto w-full'>
                            <DrawerHeader>
                                <DrawerTitle>Scanning Console</DrawerTitle>
                                <DrawerDescription>View and export scanned teams</DrawerDescription>
                            </DrawerHeader>
                            <div className='p-4 pb-0'>
                                <div>
                                    <div className='space-y-2'>
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
                                                (i: Record<string, any>) =>
                                                    `#${i.matchNumber.toString()}: ${i.teamNumber.toString()}`
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DrawerFooter>
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
                                <Button
                                    variant='secondary'
                                    onClick={() => {
                                        rawData.current = [];
                                        lastData.current = '';
                                        console.log(lastData.current);
                                        toast.warning('Cancelled', {
                                            description:
                                                'Scanned parts have been cleared, start scanning from the beginning.',
                                        });
                                    }}
                                >
                                    Cancel Parts
                                </Button>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            </main>
        </>
    );
}
