/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 20/08/2025 - 19:33:21
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 20/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Location',
        href: '/location',
    },
];

export default function Locatiom() {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <main>
                <p>Link berguna yang sudah include ke template</p>
                <ul>
                    <li>
                        <a href="https://ui.shadcn.com/docs" target="_blank" rel="noopener noreferrer">
                            Shadcn Ui
                        </a>
                    </li>
                    <li>
                        <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer">
                            Lucide
                        </a>
                    </li>
                    <li>
                        <a href="https://headlessui.com/" target="_blank" rel="noopener noreferrer">
                            Headless UI
                        </a>
                    </li>
                </ul>
            </main>

            <footer></footer>
        </AppHeaderLayout>
    );
}
