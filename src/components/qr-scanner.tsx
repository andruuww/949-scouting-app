import React, { useEffect } from 'react';

import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';

export default function Scanner({ handleData }: { handleData: (data: string) => void }) {
    const [scanner, setScanner] = React.useState<Html5Qrcode>();

    useEffect(() => {
        if (navigator.mediaDevices) {
            const cameras: MediaDeviceInfo[] = [];
            navigator.mediaDevices
                .enumerateDevices()
                .then((devices) => {
                    devices.forEach((devices) => {
                        if (devices.kind == 'videoinput') {
                            cameras.push(devices);
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });

            const container = document.getElementById('reader');
            Html5Qrcode.getCameras()
                .then(() => {
                    const html5Qrcode = new Html5Qrcode('reader');
                    setScanner(html5Qrcode);
                    return html5Qrcode.start(
                        { deviceId: cameras.at(-1)!.deviceId },
                        {
                            fps: 30,
                            disableFlip: true,
                            aspectRatio: container!.offsetWidth / container!.offsetHeight,
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
    }, [typeof window]);

    // stop camera on page leave
    useEffect(() => {
        return () => {
            try {
                scanner?.stop();
            } catch {}
        };
    }, [scanner]);

    return (
        <div className='fixed top-0 bottom-0 right-0 left-0 bg-secondary'>
            <div id='reader' className='w-full h-full'></div>
        </div>
    );
}
