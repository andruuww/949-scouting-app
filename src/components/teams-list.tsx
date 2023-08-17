import { Badge } from '@/components/ui/badge';

export default function TeamsList({ teams }: { teams: string[] }) {
    return (
        <div className="border rounded-xl border-gray-300 dark:border-gray-800 p-2">
            {teams.length ? (
                <>
                    <div className="text-center flex justify-center gap-x-4 items-center">
                        <div className="font-bold text-sm">Scouted teams</div>
                    </div>
                    <div className="py-2 flex flex-row flex-wrap gap-y-1 gap-x-1 justify-center font-mono">
                        {/*  map the numbers 900-930 and display a badge for each */}
                        {teams.map((i, key) => (
                            <Badge variant="secondary" key={key}>
                                {i}
                            </Badge>
                        ))}
                    </div>
                </>
            ) : (
                <div className="font-bold text-sm text-center py-2">
                    No teams scouted (yet)
                </div>
            )}
        </div>
    );
}
