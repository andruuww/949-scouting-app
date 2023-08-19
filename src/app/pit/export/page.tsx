'use client';

import MenuBar from '@/components/menu-bar';
import TeamsList from '@/components/teams-list';
import { FormData } from '@/lib/types';
import { ReloadIcon } from '@radix-ui/react-icons';
// @ts-ignore
import { toSVG } from 'bwip-js';
import { useEffect, useState } from 'react';

export default function PitScoutingExport() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [scoutedTeams, setScoutedTeams] = useState<FormData[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHasLoaded(true);
            setScoutedTeams(
                localStorage.getItem('scoutedTeams')
                    ? JSON.parse(localStorage.getItem('scoutedTeams')!)
                    : []
            );
        }
    }, [typeof window]);

    const [barcodeSVGs, setBarcodeSVGs] = useState<string[]>([]);

    useEffect(() => {
        const content = JSON.stringify(scoutedTeams);
        const chunks = content.match(/.{1,500}/g);
        const barcodes = chunks?.map((i) => toSVG({ bcid: 'qrcode', text: i }));
        setBarcodeSVGs(barcodes!);
    }, [scoutedTeams]);

    return (
        <main className="flex flex-col p-7 min-h-screen max-w-md mx-auto">
            <MenuBar backButtonPage="/pit" />
            {hasLoaded ? (
                <>
                    <div className="py-3">
                        <TeamsList
                            teams={scoutedTeams.map((i) =>
                                i.teamNumber!.toString()
                            )}
                        />
                    </div>
                    <div className="bg-white flex flex-col justify-center rounded-lg">
                        {scoutedTeams.length > 0 &&
                            barcodeSVGs.map((i, key) => (
                                <div
                                    key={key}
                                    className="flex flex-col justify-center"
                                >
                                    <img
                                        src={`data:image/svg+xml;base64,${btoa(
                                            i
                                        )}`}
                                        className="pt-2 px-2"
                                    />
                                    <div className="pb-2 font-bold text-xl text-black text-center">
                                        Barcode {key + 1}
                                    </div>
                                </div>
                            ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col justify-center items-center">
                    <ReloadIcon className="p-8 h-32 w-32 animate-spin" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        Loading...
                    </div>
                </div>
            )}
        </main>
    );
}
