import MenuBar from '@/components/menu-bar';
import React from 'react';
import QRContent from './qrcode-content';

export default function PitScoutingExport() {
    return (
        <main className='flex flex-col p-7 min-h-screen mx-auto'>
            <MenuBar backButtonPage='/pit' />
            <QRContent />
        </main>
    );
}
