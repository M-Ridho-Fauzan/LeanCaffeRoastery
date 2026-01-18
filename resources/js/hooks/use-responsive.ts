import { useEffect, useState } from 'react';

// Helper hook generik untuk media query
const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Cek di client-side saja untuk menghindari error SSR
        if (typeof window === 'undefined') {
            return;
        }

        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);

    return matches;
};

// Hook utama yang akan Anda gunakan di komponen
export const useResponsive = () => {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    return { isMobile, isTablet, isDesktop };
};
