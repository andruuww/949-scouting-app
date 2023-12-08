import { toast } from "./ui/use-toast";

export default function useIsConnected(): () => Promise<boolean> {
  const ping = async () => {
    try {
      const response = await fetch('/ping');
      return navigator.onLine && response.ok;
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'No internet connection.',
        repeatable: true,
      })
      return false;
    }
  };

  return ping;
}