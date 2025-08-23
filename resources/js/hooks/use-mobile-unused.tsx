/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 23/08/2025 - 21:14:05
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 23/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
// import { useEffect, useState } from 'react';

// const MOBILE_BREAKPOINT = 768;

// export function useIsMobile() {
//     const [isMobile, setIsMobile] = useState<boolean>();

//     useEffect(() => {
//         const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

//         const onChange = () => {
//             setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
//         };

//         mql.addEventListener('change', onChange);
//         setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

//         return () => mql.removeEventListener('change', onChange);
//     }, []);

//     return !!isMobile;
// }
