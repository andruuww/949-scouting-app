import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Settings, XSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-dropdown-menu';
import SettingsForm from './settings-form';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { useRouter } from 'next/navigation';

function ResetButton({ resetData }: { resetData?: () => void }) {
    if (!resetData) return null;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='outline' size='icon' aria-label='Remove Data'>
                    <XSquare className='h-[1.2rem] w-[1.2rem]' />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Do you want to delete all data?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all collected data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetData}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function BackButton({ onClick }: { onClick?: () => void }) {
    return (
        <Button variant='outline' size='icon' aria-label='Back Button' onClick={onClick}>
            <ArrowLeft className='h-[1.2rem] w-[1.2rem]' />
        </Button>
    );
}

function SettingsButton({ onClick }: { onClick?: () => void }) {
    return <SettingsForm />;
}

export default function MenuBar({ resetData, backButtonPage }: { resetData?: () => void; backButtonPage?: string }) {
    const router = useRouter();
    let [scoutName, setScoutName] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedScoutName = localStorage.getItem('scoutName');
            if (storedScoutName !== null) {
                setScoutName(storedScoutName);
            }
        }
    }, []);

    return (
        <div className='flex flex-row justify-between items-center space-x-2 mb-4'>
            <div className='text-2xl font-bold align-middle min-w-min'>
                {scoutName === null || scoutName === '' ? '949 Scouting' : <span>Welcome, {scoutName}</span>}
            </div>
            <div className='space-x-2 flex'>
                {backButtonPage && <BackButton onClick={() => router.replace(backButtonPage!)}></BackButton>}
                <ResetButton resetData={resetData} />
                <SettingsButton />
            </div>
        </div>
    );
}
