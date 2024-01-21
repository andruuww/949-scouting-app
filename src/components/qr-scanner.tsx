import Settings from '@/lib/settings';
import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';

type ScannerProps = {
    handleData: (data: string) => void;
};

const Scanner = ({ handleData }: ScannerProps) => {
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const videoElem = document.querySelector('video')!;
        videoElem.style.objectFit = 'cover';
        videoElem.style.width = '100%';
        videoElem.style.height = '100%';
        const qrScanner = new QrScanner(videoElem, (result) => handleData(result.data), {
            preferredCamera: Settings.getCameraID() === '' ? 'environment' : Settings.getCameraID(),
            onDecodeError: (error) => {},
            highlightScanRegion: true,
            highlightCodeOutline: true,
            calculateScanRegion: () => {
                return {};
            },
        });

        qrScanner.start();
        // @ts-ignore
        qrScanner.$overlay!.childNodes[0].style.display = 'none';

        setIsStarted(true);

        return () => {
            if (document.querySelector('video') === null) {
                qrScanner.destroy();
            }
        };
    }, []);

    return <video className={`fixed bottom-0 top-0 right-0 left-0 ${!isStarted && 'hidden'}`} />;
};

export default Scanner;
