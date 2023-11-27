import React, { useEffect, useRef } from 'react';

import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScannerProps {
    handleData: (data: string) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

const Scanner: React.FC<ScannerProps> = ({ handleData, containerRef }) => {
    let scanner: Html5QrcodeScanner;

    function success(result: string) {
        handleData(result);
    }

    function error(error: string) {
        // console.warn(error);
    }

    useEffect(() => {
        // Access the containerRef's current property to get the DOM element
        const container = containerRef.current;

        if (container && !scanner) {
            scanner = new Html5QrcodeScanner(
                'reader',
                {
                    fps: 30,
                    qrbox: { width: container.offsetWidth - 50, height: container.offsetHeight - 50 },
                    aspectRatio: container.offsetWidth / container.offsetHeight,
                    disableFlip: true,
                },
                false
            );

            scanner.render(success, error);
        }
    }, [containerRef]);

    return <div id='reader' className='w-full h-full'></div>;
};

Scanner.displayName = 'Scanner';

export default Scanner;
