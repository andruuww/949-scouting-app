import React, { useEffect } from 'react';

import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';
import { set } from 'zod';

export default function Scanner({ handleData }: { handleData: (data: string) => void }) {
    const [scanner, setScanner] = React.useState<Html5Qrcode>();

    // stop camera on page leave
    useEffect(() => {
        return () => {
            try {
                scanner?.stop();
            } catch {}
        };
    }, [scanner]);

    useEffect(() => {
        startCamera();
    }, []);

    function startCamera() {
        const container = document.getElementById('reader');
        Html5Qrcode.getCameras()
            .then(() => {
                const html5Qrcode = new Html5Qrcode('reader');
                setScanner(html5Qrcode);
                return html5Qrcode.start(
                    { facingMode: 'environment' },
                    {
                        fps: 30,
                        qrbox: { width: container!.offsetWidth - 25, height: container!.offsetHeight - 25 },
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
            })
            .catch((error) => {
                toast.error('Error', {
                    description: error.message,
                });
            });
    }

    return (
        <div className='absolute top-0 bottom-0 right-0 left-0 h-full border-gray-300 dark:border-gray-800 flex flex-col justify-center'>
            <div id='reader' className='w-full h-full bg-secondary'></div>
        </div>
    );
}
