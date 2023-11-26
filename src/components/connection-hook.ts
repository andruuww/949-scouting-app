export default function useIsConnected(): () => Promise<boolean> {
  const ping = async () => {
    try {
      const response = await fetch('/ping');
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  return ping;
}