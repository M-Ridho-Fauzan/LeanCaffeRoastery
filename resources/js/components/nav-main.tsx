/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 18/08/2025 - 15:54:23
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 18/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { PageProps, type NavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import NavMainGroup from './nav-main-group';

export function NavMain({ platformItems = [], adminItems = [] }: { platformItems: NavItem[]; adminItems: NavItem[] }) {
    const { auth } = usePage<PageProps>().props;

    const visibleUserRule = useMemo(() => {
        if (!auth.user) return [];

        return platformItems.filter((item) => {
            if (!item.roles) return true;

            return item.roles.includes(auth.user.role as string);
        });
    }, [auth.user, platformItems]);

    return (
        <>
            <NavMainGroup title="Platform" items={visibleUserRule} />

            {auth.user && auth.user.can_be_admin && <NavMainGroup title="Admin Tools" items={adminItems} className="pt-4" />}
            {auth.user && auth.user.can_be_admin && auth.user.can_be_author && (
                <NavMainGroup title="Author Tools" items={adminItems} className="pt-4" />
            )}
        </>
    );
}
