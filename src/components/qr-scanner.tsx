import Settings from '@/lib/settings';
import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';

type ScannerProps = {
    handleData: (data: string) => void;
};

const Scanner = ({ handleData }: ScannerProps) => {
    useEffect(() => {
        function startCamera() {}
        const videoElem = document.querySelector('video')!;

        if (
            navigator.userAgent.indexOf('Safari') != -1 &&
            navigator.userAgent.indexOf('Mac') != -1 &&
            navigator.userAgent.indexOf('Chrome') == -1
        ) {
            videoElem.setAttribute('crossorigin', 'true');
        }

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

        qrScanner.start().then(() => {
            // @ts-ignore
            qrScanner.$overlay!.childNodes[0].style.display = 'none';
        });

        return () => {
            if (document.querySelector('video') === null) {
                qrScanner.destroy();
            }
        };
    }, []);

    return <video className='fixed bottom-0 top-0 right-0 left-0' />;
};

export default Scanner;
