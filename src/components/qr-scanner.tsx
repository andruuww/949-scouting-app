import Settings from '@/lib/settings';
import QrScanner from 'qr-scanner';
import { useEffect } from 'react';

type ScannerProps = {
    handleData: (data: string) => void;
};

const Scanner = ({ handleData }: ScannerProps) => {
    useEffect(() => {
        const videoElem = document.querySelector('video')!;
        videoElem.style.objectFit = 'cover';
        videoElem.style.width = '100%';
        videoElem.style.height = '100%';
        const qrScanner = new QrScanner(videoElem, (result) => handleData(result.data), {
            preferredCamera: Settings.getCameraID(),
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

        return () => {};
    }, []);

    return <video></video>;
};

export default Scanner;
