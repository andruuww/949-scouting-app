import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { ArrowLeft, XSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function ResetButton({ resetData }: { resetData?: () => void }) {
    if (!resetData) return null;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="mr-2"
                    aria-label="Remove Data"
                >
                    <XSquare className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Do you want to delete all data?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete all scouting data from the application state and
                        from backups. This will not delete data already scannned
                        into the server.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetData}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function MenuBar({
    resetData,
    backButtonPage
}: {
    resetData?: () => void;
    backButtonPage?: string;
}) {
    const router = useRouter();
    let [scoutName, setScoutName] = useState('');

    function BackButton({ backButtonPage }: { backButtonPage?: string }) {
        if (!backButtonPage) return null;

        return (
            <Button
                variant="outline"
                size="icon"
                className="mr-2"
                aria-label="Back Button"
                onClick={() => {
                    router.push(backButtonPage);
                }}
            >
                <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
            </Button>
        );
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setScoutName(localStorage.getItem('scoutName')!);
        }
    });

    return (
        <div className="flex flex-row justify-between items-center">
            <div className="text-2xl font-bold flex-grow">
                {scoutName === null ? (
                    '949 Scouting'
                ) : (
                    <span>
                        Welcome,
                        <br />
                        {scoutName.substring(0, 11)}
                    </span>
                )}
            </div>
            <BackButton backButtonPage={backButtonPage}></BackButton>
            <ResetButton resetData={resetData} />
            <ThemeSelector />
        </div>
    );
}
