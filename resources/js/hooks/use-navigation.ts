/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 20/08/2025 - 18:15:17
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 20/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { adminNavItems, authorNavItems, platformItems } from '@/config/navigation';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export function useNavigation() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    // 1. Logika filter untuk 'platformItems' yang disentralisasi di sini.
    const visiblePlatformItems = useMemo(() => {
        return platformItems.filter((item) => {
            // Aturan 1: Jika item ditandai 'public', selalu tampilkan.
            if (item.roles === 'public') {
                return true;
            }

            // Aturan 2: Jika bukan 'public', maka itu adalah array role.
            // Pengguna harus login DAN rolenya harus ada di dalam array tersebut.
            // `Array.isArray` adalah pengecekan yang aman.
            if (user && Array.isArray(item.roles)) {
                return item.roles.includes(user.role as string);
            }

            // Jika tidak memenuhi kedua kondisi di atas, sembunyikan.
            return false;
        });
    }, [user]); // Dijalankan ulang hanya jika objek 'user' berubah.

    // 2. Logika untuk 'adminItems'. Mengembalikan data atau array kosong.
    const visibleAdminItems = useMemo(() => {
        return user?.can_be_admin ? adminNavItems : [];
    }, [user]);

    // 3. Logika untuk 'authorItems'. Mengembalikan data atau array kosong.
    const visibleAuthorItems = useMemo(() => {
        return user?.can_be_super ? authorNavItems : [];
    }, [user]);

    // 4. Kembalikan semua data yang sudah siap pakai.
    return {
        user,
        visiblePlatformItems,
        visibleAdminItems,
        visibleAuthorItems,
    };
}

/**
 * @penjelasan_kode
 *
 * Hook ini mengimpor usePage dan useMemo serta semua data navigasi mentah.
 * Logika filter untuk platformItems sekarang ada di satu tempat dan dibungkus useMemo untuk efisiensi.
 * Logika untuk adminItems dan authorItems juga ada di sini. Daripada mengembalikan null, kita mengembalikan array kosong [] jika pengguna tidak memiliki akses. Ini sangat aman karena saat Anda melakukan .map() pada array kosong, tidak akan terjadi error, hanya saja tidak ada yang dirender.
 * Hook ini mengembalikan sebuah objek berisi semua daftar navigasi yang sudah difilter dan siap digunakan.
 */
