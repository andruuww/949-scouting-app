'use client';
import QRCodeSkeleton from '@/components/qrcodeskeleton';
import TeamsList from '@/components/teams-list';
import { FormData } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';

function fetchScoutedTeams(): FormData[] {
    if (typeof window !== 'undefined') {
        const scoutedTeams = localStorage.getItem('scoutedTeams')
            ? JSON.parse(localStorage.getItem('scoutedTeams')!)
            : [];
        return scoutedTeams;
    }
    return [];
}

export default function QRContent() {
    const [scoutedTeams, setScoutedTeams] = useState<FormData[]>([]);
    const [barcodeSVGs, setBarcodeSVGs] = useState<string[]>([]);

    const workerRef = useRef<Worker>();

    useEffect(() => {
        const data = fetchScoutedTeams();
        setScoutedTeams(data);
        workerRef.current = new Worker(new URL('@/workers/qrworker.ts', import.meta.url));

        workerRef.current.postMessage(data);
        workerRef.current.onmessage = (e) => {
            setBarcodeSVGs(e.data.barcodes);
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    return (
        <>
            <div className='py-3'>
                <TeamsList teams={scoutedTeams!.map((i: FormData) => i.teamNumber!.toString())} />
            </div>
            {barcodeSVGs.length > 0 ? (
                <div className='flex flex-col justify-center  space-y-[100%] md:space-y-0 md:flex-row md:grid md:grid-cols-2 md:gap-20'>
                    {scoutedTeams!.length > 0 &&
                        barcodeSVGs.map((i, key) => (
                            <div key={key} className='bg-white rounded-lg flex flex-col justify-center'>
                                <img alt='qrcode' src={`data:image/svg+xml;base64,${btoa(i)}`} className='pt-2 px-2' />
                                <div className='pb-2 font-bold text-xl text-black text-center'>Barcode {key + 1}</div>
                            </div>
                        ))}
                </div>
            ) : (
                <QRCodeSkeleton />
            )}
        </>
    );
}
