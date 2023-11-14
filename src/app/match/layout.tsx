'use client';

import MenuBar from '@/components/menu-bar';
import TeamsList from '@/components/teams-list';
import { FormData } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function FormLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const [scoutedTeams, setScoutedTeams] = useState<FormData[]>([]);

    useEffect(() => {
        setScoutedTeams(
            localStorage.getItem('scoutedTeams')
                ? JSON.parse(localStorage.getItem('scoutedTeams')!)
                : []
        );
    }, [typeof window]);

    return (
        <>
            <div className="flex flex-col p-7 min-h-screen max-w-md mx-auto">
                <MenuBar backButtonPage="/pit" />
                <div className="py-3">
                    <TeamsList
                        teams={scoutedTeams.map((i) =>
                            i.teamNumber!.toString()
                        )}
                    />
                </div>
                {children}
            </div>
        </>
    );
}
