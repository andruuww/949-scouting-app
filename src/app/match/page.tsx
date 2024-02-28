'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import MenuBar from '@/components/menu-bar';
import { ReloadIcon } from '@radix-ui/react-icons';
import TeamsList from '@/components/teams-list';
import Parser from '@/components/parser';
import matchJSON from '@/jsons/2024/matchscoutingjson';

export default function MatchScouting() {
    const [exportIsLoading, setExportIsLoading] = useState(false);
    const [scoutedTeams, setScoutedTeams] = useState<Record<string, string>[]>([]);

    const router = useRouter();

    const formRef = useRef<any>(null);

    const cacheName = matchJSON.name!;

    useEffect(() => {
        updateFormSubmit();
    }, []);

    function updateFormSubmit() {
        if (typeof window !== 'undefined') {
            setScoutedTeams(localStorage.getItem(cacheName) ? JSON.parse(localStorage.getItem(cacheName)!) : []);
        }
    }

    const resetData = () => {
        if (typeof window !== 'undefined') localStorage.removeItem(cacheName);
        setScoutedTeams([]);
    };

    return (
        <main className='flex flex-col safe min-h-screen mx-auto'>
            <MenuBar
                resetData={() => resetData()}
                backButtonPage={'/'}
                navigationCondition={() => formRef.current.isFormClear()}
            />

            <div className='py-2'>
                <TeamsList
                    teamsJSON={scoutedTeams}
                    label='Scouted Matches'
                    displayDataStringArray={scoutedTeams.map(
                        (i) => `#${i.matchNumber.toString()}: ${i.teamNumber.toString()}`
                    )}
                    mode='edit'
                    setFormValues={(index) => formRef.current?.setValues(index)}
                />
            </div>
            <div className='space-y-2'>
                <Parser formJSON={matchJSON} update={() => updateFormSubmit()} ref={formRef} />
                {scoutedTeams.length > 0 &&
                    (!exportIsLoading ? (
                        <Button
                            variant='secondary'
                            onClick={() => {
                                if (formRef.current?.isFormClear()) {
                                    setExportIsLoading(true);
                                    router.push('/export');
                                }
                            }}
                            className='w-full'
                        >
                            Export Data
                        </Button>
                    ) : (
                        <Button disabled className='mt-2 w-full'>
                            <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ))}
            </div>
        </main>
    );
}
