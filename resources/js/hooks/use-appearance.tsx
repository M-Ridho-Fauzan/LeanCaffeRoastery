/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 20/08/2025 - 17:19:34
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 20/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
// import { useCallback, useEffect, useState } from 'react';

// export type Appearance = 'light' | 'dark' | 'system';

// const prefersDark = () => {
//     if (typeof window === 'undefined') {
//         return false;
//     }

//     return window.matchMedia('(prefers-color-scheme: dark)').matches;
// };

// const setCookie = (name: string, value: string, days = 365) => {
//     if (typeof document === 'undefined') {
//         return;
//     }

//     const maxAge = days * 24 * 60 * 60;
//     document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
// };

// const applyTheme = (appearance: Appearance) => {
//     const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

//     document.documentElement.classList.toggle('dark', isDark);
// };

// const mediaQuery = () => {
//     if (typeof window === 'undefined') {
//         return null;
//     }

//     return window.matchMedia('(prefers-color-scheme: dark)');
// };

// const handleSystemThemeChange = () => {
//     const currentAppearance = localStorage.getItem('appearance') as Appearance;
//     applyTheme(currentAppearance || 'system');
// };

// export function initializeTheme() {
//     const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';

//     applyTheme(savedAppearance);

//     // Add the event listener for system theme changes...
//     mediaQuery()?.addEventListener('change', handleSystemThemeChange);
// }

// export function useAppearance() {
//     const [appearance, setAppearance] = useState<Appearance>('system');

//     const updateAppearance = useCallback((mode: Appearance) => {
//         setAppearance(mode);

//         // Store in localStorage for client-side persistence...
//         localStorage.setItem('appearance', mode);

//         // Store in cookie for SSR...
//         setCookie('appearance', mode);

//         applyTheme(mode);
//     }, []);

//     useEffect(() => {
//         const savedAppearance = localStorage.getItem('appearance') as Appearance | null;
//         updateAppearance(savedAppearance || 'system');

//         return () => mediaQuery()?.removeEventListener('change', handleSystemThemeChange);
//     }, [updateAppearance]);

//     return { appearance, updateAppearance } as const;
// }

// ======
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect } from 'react';

// Tipe ini disederhanakan karena kita hanya akan memiliki 'light'
export type Appearance = 'light';

/**
 * Fungsi ini dipanggil di awal (kemungkinan di app.tsx) untuk mengatur tema
 * bahkan sebelum React di-mount. Ini adalah tempat terbaik untuk memaksa light mode.
 */
export function initializeTheme() {
    // 1. Hapus kelas 'dark' dari elemen <html> secara paksa.
    document.documentElement.classList.remove('dark');

    // 2. Bersihkan penyimpanan lokal dari pengaturan tema lama.
    localStorage.removeItem('appearance');

    // 3. (Opsional) Hapus cookie tema lama jika ada.
    // Kode ini akan mengatur cookie 'appearance' agar kedaluwarsa.
    if (typeof document !== 'undefined') {
        document.cookie = 'appearance=;path=/;max-age=-1;';
    }
}

/**
 * Hook ini sekarang menjadi "dummy" atau "placeholder".
 * Tujuannya adalah agar komponen lain yang mungkin masih menggunakan hook ini
 * tidak rusak (error). Hook ini tidak lagi melakukan apa-apa selain
 * mengkonfirmasi bahwa temanya adalah 'light'.
 */
export function useAppearance() {
    // Jalankan inisialisasi lagi sebagai jaring pengaman,
    // meskipun initializeTheme() seharusnya sudah cukup.
    useEffect(() => {
        initializeTheme();
    }, []); // Hanya berjalan sekali saat komponen dipasang.

    // Kembalikan objek statis yang sesuai dengan struktur lama.
    // Ini mencegah error di komponen lain.
    return {
        appearance: 'light' as const, // Selalu kembalikan 'light'
        updateAppearance: (mode: Appearance) => {
            // Fungsi ini tidak melakukan apa-apa.
        },
    } as const;
}
