'use client';

import MenuBar from '@/components/menu-bar';
import ScoutingForm from '@/components/scouting-form';
import TeamsList from '@/components/teams-list';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { FormData } from '@/lib/types';
import { ReloadIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useState } from 'react';

export default function PitScouting() {
    const { toast } = useToast();
    const lsTeams = localStorage.getItem('scoutedTeams');
    const [scoutedTeams, setScoutedTeams] = useState<FormData[]>(
        lsTeams ? JSON.parse(lsTeams) : []
    );
    const [isLoading, setIsLoading] = useState(false);

    const submitForm = (data: FormData) => {
        const teams = [...scoutedTeams, data];
        localStorage.setItem('scoutedTeams', JSON.stringify(teams));
        setScoutedTeams(teams);
        toast({
            title: `Submitted!`,
            description: `Team ${data.teamNumber} has been scouted!`
        });
    };

    const resetData = () => {
        localStorage.removeItem('scoutedTeams');
        setScoutedTeams([]);
        toast({ title: `Reset!`, description: `All data has been reset!` });
    };

    return (
        <main className="flex flex-col p-7 min-h-screen max-w-md mx-auto">
            <MenuBar resetData={resetData} />
            <div className="py-2">
                <TeamsList
                    teams={scoutedTeams.map((i) => i.teamNumber!.toString())}
                />
            </div>
            <ScoutingForm onSubmit={submitForm} />
            {scoutedTeams.length > 0 && (!isLoading ? (
                <Button
                    className="bg-green-600 dark:bg-green-400 mt-2"
                    asChild
                    onClick={() => setIsLoading(true)}
                >
                    <Link href="/pit/export">Export all teams</Link>
                </Button>
            ) : (
                <Button disabled className="mt-2">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </Button>
            ))}
        </main>
    );
}
