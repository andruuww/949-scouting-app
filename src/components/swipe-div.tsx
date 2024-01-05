'use client';

import { useState } from 'react';

export default function SwipeDiv() {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e: any) => {
        setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientY);
    };

    const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientY);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isUpSwipe = distance > minSwipeDistance;
        const isDownSwipe = distance < -minSwipeDistance;
        if (isUpSwipe || isDownSwipe) console.log('swipe', isUpSwipe ? 'up' : 'down');
    };

    return (
        <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <h1>ALSKDFJ;LWJEORIUQOWIJEL;KJ</h1>
        </div>
    );
}
