'use client';
import MenuBar from '@/components/menu-bar';
import QRCodeSkeleton from '@/components/qrcodeskeleton';
import TeamsList from '@/components/teams-list';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import matchJSON from '@/jsons/2023/matchscoutingjson';
import pitJSON from '@/jsons/2023/pitscoutingjson';
import { useEffect, useRef, useState } from 'react';

function fetchScoutedTeams(cacheName: string): Record<string, string>[] {
    if (typeof window !== 'undefined') {
        const scoutedTeams = localStorage.getItem(cacheName) ? JSON.parse(localStorage.getItem(cacheName)!) : [];
        return scoutedTeams;
    }
    return [];
}

export default function Export() {
    const pitCacheName = pitJSON.name!;
    const matchCacheName = matchJSON.name!;

    const [scoutedTeams, setScoutedTeams] = useState<Record<string, any>[]>([]);
    const [barcodeSVGs, setBarcodeSVGs] = useState<string[]>([]);

    const [cacheName, setCacheName] = useState<string>();
    const [exportType, setExportType] = useState<'Pit Data' | 'Match Data'>();

    const [exportBackPath, setExportBackPath] = useState<string>('/');

    const workerRef = useRef<Worker>();

    function updateQRCode() {
        if (cacheName === undefined) return;
        const data = fetchScoutedTeams(cacheName!);
        setScoutedTeams(data);
        workerRef.current = new Worker(new URL('@/workers/qrworker.ts', import.meta.url));

        workerRef.current.postMessage({
            data: data,
            schemaJSON: exportType === 'Pit Data' ? pitJSON : matchJSON,
            scoutName: localStorage.getItem('scoutName'),
        });

        workerRef.current.onmessage = (e) => {
            setBarcodeSVGs(e.data.barcodes);
        };
        return () => workerRef.current!.terminate();
    }

    useEffect(() => {
        updateQRCode();
    }, [cacheName]);

    useEffect(() => {
        // set export type by previous path
        if (typeof window !== 'undefined') {
            const prevPath = globalThis.sessionStorage.getItem('exportBackPath');
            setExportBackPath(prevPath || '/');
            if (prevPath === '/pit') {
                setCacheName(pitCacheName);
                setExportType('Pit Data');
            } else if (prevPath === '/match') {
                setCacheName(matchCacheName);
                setExportType('Match Data');
            } else {
                setCacheName(pitCacheName);
                setExportType('Pit Data');
            }
        }
    }, []);

    return (
        <main className='flex flex-col safe min-h-screen mx-auto'>
            <MenuBar backButtonPage={exportBackPath} />

            <div className='py-2 mb-4'>
                {cacheName && (
                    <div className='mb-2'>
                        {exportType === 'Pit Data' ? (
                            <TeamsList
                                teamsJSON={scoutedTeams}
                                label='Scouted Teams'
                                jsonKeyDisplayName='teamNumber'
                                update={() => updateQRCode()}
                                mode='mark'
                                cacheName={cacheName}
                            />
                        ) : (
                            <TeamsList
                                teamsJSON={scoutedTeams}
                                label='Scouted Matches'
                                displayDataStringArray={
                                    scoutedTeams.length > 0
                                        ? scoutedTeams.map(
                                              (i) => `#${i.matchNumber.toString()}: ${i.teamNumber.toString()}`
                                          )
                                        : []
                                }
                                update={() => updateQRCode()}
                                mode='mark'
                                cacheName={cacheName}
                            />
                        )}
                    </div>
                )}
                <Select
                    onValueChange={(value: 'Pit Data' | 'Match Data') => {
                        if (value === exportType) return;
                        setScoutedTeams([]);
                        setExportType(value);
                        setBarcodeSVGs([]);
                        setCacheName(value === 'Pit Data' ? pitCacheName : matchCacheName);
                    }}
                    value={exportType}
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Export Type'>{exportType}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={'Pit Data'}>Pit Data</SelectItem>
                        <SelectItem value={'Match Data'}>Match Data</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {barcodeSVGs.length > 0 ? (
                <div className='flex flex-col justify-center  space-y-[100%] md:space-y-0 md:flex-row md:grid md:grid-cols-2 md:gap-20'>
                    {scoutedTeams!.length > 0 &&
                        barcodeSVGs.map((i, key) => (
                            <div key={key} className='bg-white rounded-lg flex flex-col justify-center'>
                                <img
                                    alt='qrcode'
                                    src={`data:image/svg+xml;base64,${btoa(i)}`}
                                    className='p-4 visible'
                                />
                                <div className='pb-2 font-bold text-xl text-black text-center'>Barcode {key + 1}</div>
                            </div>
                        ))}
                </div>
            ) : (
                <QRCodeSkeleton />
            )}
        </main>
    );
}
