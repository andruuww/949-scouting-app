'use client';

import MenuBar from '@/components/menu-bar';
import TeamsList from '@/components/teams-list';
import { toast } from '@/components/ui/use-toast';
import { FormData, FormDataClass } from '@/lib/types';
import { ReloadIcon } from '@radix-ui/react-icons';
// @ts-ignore
import { toSVG } from 'bwip-js';
import { useEffect, useState } from 'react';
import zlib from 'zlib';

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
        return [header.join(','), ...csvData].join('\n');
    }
    return '';
}

export default function PitScoutingExport() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [scoutedTeams, setScoutedTeams] = useState<FormData[]>([]);
    const [barcodeSVGs, setBarcodeSVGs] = useState<string[]>([]);

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

    useEffect(() => {
        if (scoutedTeams) {
            zlib.gzip(
                Buffer.from(jsonToCSV(scoutedTeams)),
                (err, compressedBuffer) => {
                    if (err) {
                        toast({
                            title: 'Error!',
                            description:
                                'An error occurred while compressing the data! Contact Andrew...'
                        });
                    } else {
                        const content = compressedBuffer.toString('base64');
                        console.log(content.length);
                        const chunks = content.match(/.{1,2000}/g);
                        const barcodes = chunks?.map((i) =>
                            toSVG({ bcid: 'qrcode', text: i })
                        );
                        setBarcodeSVGs(barcodes!);
                    }
                }
            );
        }
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
