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
import { XSquare } from 'lucide-react';

function ResetButton({ resetData }: { resetData?: () => void }) {
    if (!resetData) return null;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="mr-2">
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

export default function MenuBar({ resetData }: { resetData?: () => void }) {
    return (
        <div className="flex flex-row justify-between items-center">
            <div className="text-2xl font-bold flex-grow">949 Scouting</div>
            <ResetButton resetData={resetData} />
            <ThemeSelector />
        </div>
    );
}
