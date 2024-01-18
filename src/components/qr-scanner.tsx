import React, { useEffect } from 'react';

import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';

export default function Scanner({ handleData }: { handleData: (data: string) => void }) {
    const [scanner, setScanner] = React.useState<Html5Qrcode>();

    const QR_PADDING = 50;

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
                        fps: 60,
                        qrbox: {
                            width: 400,
                            height: 400,
                        },
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
        <div className='fixed bottom-0 top-0 h-screen right-0 left-0 bg-secondary'>
            <div id='reader' className='w-full h-full'></div>
        </div>
    );
}
