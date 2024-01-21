import { TouchEvent, useState } from 'react';

interface SwipeInput {
    onSwipedLeft?: () => void;
    onSwipedRight?: () => void;
    onSwipedUp?: () => void;
    onSwipedDown?: () => void;
}

interface SwipeOutput {
    onTouchStart?: (e: TouchEvent) => void;
    onTouchMove?: (e: TouchEvent) => void;
}

export default (input: SwipeInput): SwipeOutput => {
    const minSwipeDistance = 50;

    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);
    const [touchStartY, setTouchStartY] = useState(0);
    const [touchEndY, setTouchEndY] = useState(0);
    const [swipeDetected, setSwipeDetected] = useState(false);

    // ...

    const onTouchStart = (e: TouchEvent) => {
        setTouchEndX(0);
        setTouchStartX(e.targetTouches[0].clientX);

        setTouchEndY(0);
        setTouchStartY(e.targetTouches[0].clientY);

        setSwipeDetected(false);
    };

    const onTouchMove = (e: TouchEvent) => {
        setTouchEndX(e.targetTouches[0].clientX);
        setTouchEndY(e.targetTouches[0].clientY);
        if (touchStartX && touchEndX && touchStartY && touchEndY && !swipeDetected) {
            const distanceX = touchStartX - touchEndX;
            const distanceY = touchStartY - touchEndY;
            const isLeftSwipe = distanceX > minSwipeDistance;
            const isRightSwipe = distanceX < -minSwipeDistance;
            const isUpSwipe = distanceY > minSwipeDistance;
            const isDownSwipe = distanceY < -minSwipeDistance;
            if (isLeftSwipe) {
                input.onSwipedLeft?.();
                setSwipeDetected(true);
            }
            if (isRightSwipe) {
                input.onSwipedRight?.();
                setSwipeDetected(true);
            }
            if (isUpSwipe) {
                input.onSwipedUp?.();
                setSwipeDetected(true);
            }
            if (isDownSwipe) {
                input.onSwipedDown?.();
                setSwipeDetected(true);
            }
        }
    };

    return {
        onTouchStart,
        onTouchMove,
    };
};
