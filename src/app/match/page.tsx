'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { FormData } from '@/lib/types';
import Link from 'next/link';
import MenuBar from '@/components/menu-bar';
import { ReloadIcon } from '@radix-ui/react-icons';
import ScoutingForm from '@/components/match-scouting-form';
import TeamsList from '@/components/teams-list';
import { useToast } from '@/components/ui/use-toast';
//cant test until andrew pushes the change that actually fixes stuff

export default function MatchScouting() {
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
        <main className='flex flex-col p-7 min-h-screen max-w-md mx-auto'>
            <MenuBar resetData={resetData} backButtonPage={`/${pathName.split('/').splice(0, -1).join('/')}`} />
            {hasLoaded ? (
                <>
                    <div className='py-2'>
                        <TeamsList teams={scoutedTeams.map((i) => i.teamNumber!.toString())} />
                    </div>
                    <ScoutingForm onSubmit={submitForm} />
                    {scoutedTeams.length > 0 &&
                        (!isLoading ? (
                            <Button
                                className='bg-green-600 dark:bg-green-400 mt-2'
                                asChild
                                onClick={() => setIsLoading(true)}
                            >
                                <Link href='/pit/export'>Export all teams</Link>
                            </Button>
                        ) : (
                            <Button disabled className='mt-2'>
                                <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                        ))}
                </>
            ) : (
                <div className='flex flex-col justify-center items-center'>
                    <ReloadIcon className='p-8 h-32 w-32 animate-spin' />
                    <div className='text-2xl font-bold text-gray-900 dark:text-white'>Loading...</div>
                </div>
            )}
        </main>
    );
}
