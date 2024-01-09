import { toast } from 'sonner';

export default function useIsConnected(): () => Promise<boolean> {
    const ping = async () => {
        try {
            const response = await fetch('/ping');
            return navigator.onLine && response.ok;
        } catch (error) {
            toast.error('No internet connection');
            return false;
        }
    };

    return ping;
}
