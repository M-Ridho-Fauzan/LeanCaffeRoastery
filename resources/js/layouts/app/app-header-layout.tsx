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
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
