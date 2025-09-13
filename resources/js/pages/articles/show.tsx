/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 13/09/2025 - 16:50:36
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 13/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: '{judul}',
        href: '/blog/{slug}',
    },
];

export default function Index() {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="{judul}" />
            Eye
        </AppHeaderLayout>
    );
}
