import { Skeleton } from './ui/skeleton';

export default function QRCodeSkeleton() {
    return (
        <div className='flex flex-col justify-center rounded-lg space-y-[100%] md:space-y-0 md:flex-row md:grid md:grid-cols-2 md:gap-20'>
            {new Array(2).fill(0).map((_, key) => (
                <div className='flex flex-col items-center justify-center' key={key}>
                    <Skeleton className='p-12 w-full aspect-square' />
                    <Skeleton className='pb-2 mt-1 h-6 w-32' />
                </div>
            ))}
        </div>
    );
}
