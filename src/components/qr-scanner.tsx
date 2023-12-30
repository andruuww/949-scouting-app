import React, { useEffect } from 'react';

import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScannerProps {
    handleData: (data: string) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

function applyTailwindClassesByID(id: string, classes: string[]) {
    const element = document.getElementById(id);
    classes.forEach((className) => {
        element?.classList.add(className);
    });
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
        if (typeof window !== 'undefined') localStorage.removeItem('HTML5_QRCODE_DATA');

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

        // css garbage because library awful styling
        const secondaryButton = ['rounded-xl', 'p-4', 'h-full', 'bg-secondary', 'w-full', 'item-center'];

        applyTailwindClassesByID('reader__dashboard_section', [...secondaryButton, 'm-0']);

        applyTailwindClassesByID('reader__dashboard', ['mt-4']);

        applyTailwindClassesByID('reader', ['h-full', 'flex', 'flex-col', 'justify-between', 'items-center']);

        // applyTailwindClassesByID('html5-qrcode-anchor-scan-type-change', [...secondaryButton]);
        // applyTailwindClassesByID('html5-qrcode-button-file-selection', [...secondaryButton]);

        if (document.getElementById('reader')) {
            document.getElementById('reader')!.style.padding = '1rem';
        }

        // hide the scan by file button, because the ui is so bad
        const scanTypeChangeAnchor = document.getElementById('html5-qrcode-anchor-scan-type-change');
        if (scanTypeChangeAnchor) {
            scanTypeChangeAnchor.style.textDecoration = 'none';
            scanTypeChangeAnchor.style.display = 'none';

            // Monitor for changes and reset styles if necessary
            const observer = new MutationObserver(() => {
                scanTypeChangeAnchor.style.textDecoration = 'none';
                scanTypeChangeAnchor.style.display = 'none';
            });

            observer.observe(scanTypeChangeAnchor, { attributes: true, childList: true, subtree: true });

            // Cleanup observer on component unmount
            return () => {
                observer.disconnect();
            };
        }
    }, [containerRef, typeof window]);

    return (
        <div
            id='reader'
            className='border rounded-xl border-gray-300 dark:border-gray-800 flex flex-col justify-center'
        ></div>
    );
};

Scanner.displayName = 'Scanner';

export default Scanner;
