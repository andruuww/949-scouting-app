import './globals.css';

import HistoryProvider from '@/components/history-provider';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

const APP_NAME = '949 Scout App';
const APP_DEFAULT_TITLE = 'Scout App';
const APP_TITLE_TEMPLATE = 'Scout App';
const APP_DESCRIPTION = "949's custom scouting app";

export const metadata: Metadata = {
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        title: 'Apple Web App',
        statusBarStyle: 'black-translucent',
        startupImage: [
            '/assets/startup/apple-touch-startup-image-768x1004.png',
            {
                url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
                media: '(device-width: 768px) and (device-height: 1024px)',
            },
        ],
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: 'website',
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    twitter: {
        card: 'summary',
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#020817',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <HistoryProvider />
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
                    {children}
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    );
}
