'use client';

import MenuBar from '@/components/menu-bar';
// @ts-ignore
import { toSVG } from 'bwip-js';
import { useEffect, useState } from 'react';
import { FormData } from '@/lib/types';
import TeamsList from '@/components/teams-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PitScoutingExport() {
    const lsTeams = localStorage.getItem('scoutedTeams');
    const [scoutedTeams, setScoutedTeams] = useState<FormData[]>(
        lsTeams ? JSON.parse(lsTeams) : []
    );
    const [barcodeSVGs, setBarcodeSVGs] = useState<string[]>([]);

    useEffect(() => {
        const content = JSON.stringify(scoutedTeams);
        const chunks = content.match(/.{1,500}/g);
        const barcodes = chunks?.map((i) => toSVG({ bcid: 'qrcode', text: i }));
        setBarcodeSVGs(barcodes!);
    }, [scoutedTeams]);

    return (
        <main className="flex flex-col p-7 min-h-screen max-w-md mx-auto">
            <MenuBar />
            <div className="py-3">
            <TeamsList
                    teams={scoutedTeams.map((i) => i.teamNumber!.toString())}
                />
                </div>
            <div className="bg-white flex flex-col justify-center rounded-lg">
                {scoutedTeams.length > 0 && barcodeSVGs.map((i, key) => (
                    <div key={key} className="flex flex-col justify-center">
                    <img
                        src={`data:image/svg+xml;base64,${btoa(i)}`}
                        className="pt-2 px-2"
                    />
                    <div className="pb-2 font-bold text-xl text-black text-center">Barcode {key+1}</div>
                    </div>
                ))}
            </div>
            <Button className='mt-4' asChild>
                <Link href="/pit">Back</Link>
            </Button>
        </main>
    );
}
