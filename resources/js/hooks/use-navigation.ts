/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 09/09/2025 - 22:33:59
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 09/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { platformItems } from '@/config/navigation';
import { filterNavItemsByRole } from '@/lib/navUtils';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export function useNavigation() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const userRoles = useMemo(() => {
        // Jika user.role adalah string tunggal (misal: 'admin', 'author', 'user')
        return user?.role ? [user.role as string] : [];
    }, [user]);

    const visibleNavItems = useMemo(() => {
        return filterNavItemsByRole(platformItems, userRoles);
    }, [userRoles]);

    return {
        user,
        visibleNavItems,
    };
}
