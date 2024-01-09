import React, { useEffect } from 'react';

import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';
import useSwipe from './useSwipe';

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
                        qrbox: { width: container!.offsetWidth - 25, height: container!.offsetHeight - 25 },
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
                toast.error('Error', {
                    description: error,
                });
            });
    }

    useEffect(() => {
        startCamera();
    }, []);

    const swipeHandlers = useSwipe({
        onSwipedUp: () => console.log('up'),
        onSwipedDown: () => console.log('down'),
    });

    return (
        // <div className='border h-full border-gray-300 dark:border-gray-800 flex flex-col justify-center'>
        //     <div id='reader' className=' w-full h-full bg-secondary overflow-hidden' />

        //     <div className='absolute bottom-10 inset-x-0 flex justify-center items-center'>
        /* {isCameraOn ? (
                    <Button
                        variant='default'
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
                        variant='default'
                        onClick={() => {
                            startCamera();
                        }}
                        className='mt-2'
                    >
                        Start Camera
                    </Button>
                )}
            </div>
        </div> */
        <div {...swipeHandlers} className='w-full h-screen'></div>
    );
}
