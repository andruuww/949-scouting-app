'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { FormData } from '@/lib/types';
import MenuBar from '@/components/menu-bar';
import { ReloadIcon } from '@radix-ui/react-icons';
import ScoutingForm from '@/components/pit-scouting-form';
import TeamsList from '@/components/teams-list';
import { useToast } from '@/components/ui/use-toast';

export default function PitScouting() {
    const { toast } = useToast();

    const [hasLoaded, setHasLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [scoutedTeams, setScoutedTeams] = useState<FormData[]>([]);

    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHasLoaded(true);
            setScoutedTeams(
                localStorage.getItem('scoutedTeams') ? JSON.parse(localStorage.getItem('scoutedTeams')!) : []
            );
        }
    }, [typeof window]);

    const submitForm = (data: FormData) => {
        const teams = [...scoutedTeams, data];
        if (typeof window !== 'undefined') localStorage.setItem('scoutedTeams', JSON.stringify(teams));
        setScoutedTeams(teams);
        toast({
            title: `Submitted!`,
            description: `Team ${data.teamNumber} has been scouted!`,
        });
    };

    const resetData = () => {
        if (typeof window !== 'undefined') localStorage.removeItem('scoutedTeams');
        setScoutedTeams([]);
        toast({ title: `Reset!`, description: `All data has been reset!` });
    };

    return (
        <main className='flex flex-col p-7 min-h-screen mx-auto'>
            <MenuBar resetData={resetData} backButtonPage={`/${pathName.split('/').splice(0, -1).join('/')}`} />
            <div className='py-2'>
                <TeamsList teams={scoutedTeams.map((i) => i.teamNumber!.toString())} />
            </div>
            <div className='space-y-3'>
                <ScoutingForm onSubmit={submitForm} />
                {scoutedTeams.length > 0 &&
                    (!isLoading ? (
                        <Button
                            variant='secondary'
                            onClick={() => {
                                setIsLoading(true);
                                router.push('/pit/export');
                            }}
                            className='w-full'
                        >
                            Export all teams
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
