import React, { useEffect } from 'react';

import { Html5Qrcode } from 'html5-qrcode';
import { toast } from './ui/use-toast';
import { Button } from './ui/button';

export default function Scanner({ handleData }: { handleData: (data: string) => void }) {
    const [scanner, setScanner] = React.useState<Html5Qrcode>();
    const [isCameraOn, setisCameraOn] = React.useState(false);

    // stop camera on page leave
    useEffect(() => {
        return () => {
            try {
                scanner?.stop();
            } catch {}
        };
    }, [scanner]);

    function startCamera(): void {
        const container = document.getElementById('reader');

        Html5Qrcode.getCameras()
            .then(() => {
                const html5Qrcode = new Html5Qrcode('reader');
                setScanner(html5Qrcode);
                return html5Qrcode.start(
                    { facingMode: 'environment' },
                    {
                        fps: 30,
                        qrbox: { width: container!.offsetWidth - 50, height: container!.offsetHeight - 50 },
                        aspectRatio: 1,
                        disableFlip: true,
                    },
                    (result: string) => {
                        handleData(result);
                    },
                    (error: string) => {}
                );
            })
            .then(() => {
                const videoElement = container?.querySelector('video');
                if (videoElement) {
                    videoElement.style.objectFit = 'cover';
                    videoElement.style.width = '100%';
                    videoElement.style.height = '100%';
                }

                setisCameraOn(true);
            })
            .catch((error) => {
                toast({
                    title: error,
                    description: 'Failed to access the camera. Please double check camera permissions.',

                    repeatable: true,
                });
            });
    }

    return (
        <div className='border rounded-xl border-gray-300 dark:border-gray-800 flex flex-col justify-center p-4'>
            <div id='reader' className=' w-full aspect-square bg-secondary rounded-md overflow-hidden' />

            {isCameraOn ? (
                <Button
                    variant='secondary'
                    onClick={() => {
                        scanner!.stop();
                        setisCameraOn(false);
                    }}
                    className='mt-2'
                    disabled={!isCameraOn}
                >
                    Stop Camera
                </Button>
            ) : (
                <Button
                    variant='secondary'
                    onClick={() => {
                        startCamera();
                    }}
                    className='mt-2'
                >
                    Start Camera
                </Button>
            )}
        </div>
    );
}
