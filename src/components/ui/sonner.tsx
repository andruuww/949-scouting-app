'use client';

import { useTheme } from 'next-themes';
import React, { useEffect } from 'react';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme();
    const [isMobile, setIsMobile] = React.useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 640);
        }
    });

    return (
        <Sonner
            position={isMobile ? 'top-center' : 'bottom-right'}
            theme={theme as ToasterProps['theme']}
            className='toaster group'
            toastOptions={{
                duration: 2000,
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg mt-[env(safe-area-inset-top)]',
                    description: 'group-[.toast]:text-muted-foreground',
                    actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground p-4',
                    cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
