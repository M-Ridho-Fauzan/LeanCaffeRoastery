// src/hooks/use-scroll-direction.ts
import { useCallback, useEffect, useState } from 'react';

type ScrollDirection = 'up' | 'down' | null;

interface ScrollDirectionState {
    scrollDirection: ScrollDirection;
    isAtTop: boolean;
}

/**
 * Custom hook to detect scroll direction and if the user is at the top of the page.
 * @param threshold The minimum scroll distance to register a direction change (default: 50px).
 * @returns {ScrollDirectionState} An object containing `scrollDirection` ('up' | 'down' | null) and `isAtTop` (boolean).
 */
export function useScrollDirection(threshold = 50): ScrollDirectionState {
    const [scrollState, setScrollState] = useState<ScrollDirectionState>({
        scrollDirection: null,
        isAtTop: true, // Initially assume at the top
    });
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;

        // Determine if at the very top of the page
        const currentIsAtTop = currentScrollY === 0;

        // Only update direction if scroll has moved beyond the threshold
        // This prevents flickering on minor scroll movements
        if (Math.abs(currentScrollY - lastScrollY) < threshold) {
            // If scroll change is too small, don't update direction,
            // but still update isAtTop if it changed.
            if (scrollState.isAtTop !== currentIsAtTop) {
                setScrollState((prev) => ({ ...prev, isAtTop: currentIsAtTop }));
            }
            return;
        }

        let newDirection: ScrollDirection = scrollState.scrollDirection;

        if (currentScrollY > lastScrollY) {
            newDirection = 'down';
        } else if (currentScrollY < lastScrollY) {
            newDirection = 'up';
        }

        setScrollState({
            scrollDirection: newDirection,
            isAtTop: currentIsAtTop,
        });
        setLastScrollY(currentScrollY);
    }, [lastScrollY, threshold, scrollState.scrollDirection, scrollState.isAtTop]);

    useEffect(() => {
        // Initialize lastScrollY and isAtTop on mount based on current scroll position
        setLastScrollY(window.scrollY);
        setScrollState((prev) => ({ ...prev, isAtTop: window.scrollY === 0 }));

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]); // `handleScroll` is memoized by useCallback, so this is safe

    return scrollState;
}
