/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 17/08/2025 - 19:15:10
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 17/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppHeaderUnlogin } from '@/components/app-header-unlogin';
import { AppShell } from '@/components/app-shell';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppShell>
            {auth.user ? <AppHeader breadcrumbs={breadcrumbs} /> : <AppHeaderUnlogin breadcrumbs={breadcrumbs} />}
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
