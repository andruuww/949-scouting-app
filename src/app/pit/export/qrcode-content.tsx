import zlib from 'zlib';
import { toast } from '@/components/ui/use-toast';
// @ts-ignore
import { toSVG } from 'bwip-js';

import TeamsList from '@/components/teams-list';
import { FormDataClass, FormData } from '@/lib/types';
import { useState, useEffect } from 'react';

function fetchScoutedTeams(): FormData[] {
    if (typeof window !== 'undefined') {
        const scoutedTeams = localStorage.getItem('scoutedTeams')
            ? JSON.parse(localStorage.getItem('scoutedTeams')!)
            : [];
        return scoutedTeams;
    }
    return [];
}

function renderQRCodes(scoutedTeams: FormData[], setBarcodeSVGs: (barcodes: string[]) => void): void {
    zlib.gzip(Buffer.from(jsonToCSV(scoutedTeams)), (err, compressedBuffer) => {
        if (err) {
            toast({
                title: 'Error!',
                description: 'An error occurred while compressing the data! Contact Andrew...',
            });
        } else {
            const content = compressedBuffer.toString('base64');
            const chunks = content.match(/.{1,500}/g);
            const barcodes = chunks?.map((i) => toSVG({ bcid: 'qrcode', text: i }));
            setBarcodeSVGs(barcodes!);
        }
    });
}

function jsonToCSV(jsonArray: FormData[]) {
    if (jsonArray && jsonArray.length > 0) {
        const header = Object.keys(new FormDataClass());
        const csvData = jsonArray.map((row) =>
            header.map((key) => {
                const value = row[key as keyof FormData];
                if (typeof value === 'number') {
                    return value.toFixed(0);
                } else if (typeof value === 'boolean') {
                    return value ? '1' : '0';
                }
                return value !== undefined ? value : '';
            })
        );
        return csvData.join('\n');
    }
    return '';
}

export default function QRContent() {
    const [scoutedTeams, setScoutedTeams] = useState<FormData[]>([]);
    const [barcodeSVGs, setBarcodeSVGs] = useState<string[]>([]);

    useEffect(() => {
        const data = fetchScoutedTeams();
        setScoutedTeams(data);
        renderQRCodes(data, setBarcodeSVGs);
    }, []);

    if (scoutedTeams.length === 0) {
        return null;
    }

    return (
        <>
            <div className='py-3'>
                <TeamsList teams={scoutedTeams!.map((i: FormData) => i.teamNumber!.toString())} />
            </div>
            <div className='bg-white flex flex-col justify-center rounded-lg space-y-[100%] md:space-y-0 md:flex-row md:grid md:grid-cols-2 md:gap-20'>
                {scoutedTeams!.length > 0 &&
                    barcodeSVGs.map((i, key) => (
                        <div key={key} className='flex flex-col justify-center'>
                            <img alt='qrcode' src={`data:image/svg+xml;base64,${btoa(i)}`} className='pt-2 px-2' />
                            <div className='pb-2 font-bold text-xl text-black text-center'>Barcode {key + 1}</div>
                        </div>
                    ))}
            </div>
        </>
    );
}
