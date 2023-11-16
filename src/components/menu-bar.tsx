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
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { ArrowLeft, XSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function ResetButton({ resetData }: { resetData?: () => void }) {
    if (!resetData) return null;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='outline' size='icon' className='mr-2' aria-label='Remove Data'>
                    <XSquare className='h-[1.2rem] w-[1.2rem]' />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Do you want to delete all data?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all scouting data from the
                        application state and from backups. This will not delete data already scannned into the server.
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
        <Button variant='outline' size='icon' className='mr-2' aria-label='Back Button' onClick={onClick}>
            <ArrowLeft className='h-[1.2rem] w-[1.2rem]' />
        </Button>
    );
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
        <div className='flex flex-row justify-between items-center'>
            <div className='text-2xl font-bold flex-grow'>
                {scoutName === null ? '' : <span>Welcome, {scoutName.substring(0, 11)}</span>}
            </div>
            {backButtonPage && <BackButton onClick={() => router.replace(backButtonPage!)}></BackButton>}
            <ResetButton resetData={resetData} />
            <ThemeSelector />
        </div>
    );
}
