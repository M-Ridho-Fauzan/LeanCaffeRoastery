/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 20/08/2025 - 19:36:19
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 20/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

// Definisikan breadcrumbs untuk halaman ini
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Posts',
        href: '/author/posts',
    },
];

export default function Index() {
    // <-- Halaman ini tidak perlu menerima props auth, karena layout yang mengurusnya
    return (
        // INI PERUBAHAN UTAMANYA
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Posts" />

            {/*
              Semua yang ada di dalam <AppLayout> ini adalah 'children'
              yang akan dimasukkan ke dalam layout utama.
            */}
            <div className="flex flex-col gap-y-4">
                <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm sm:p-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Posts Management</h1>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">This is the page to manage application Posts.</p>
                </div>

                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                    {/* Di sini Anda bisa menambahkan tabel untuk menampilkan daftar Post */}
                    <p>Post list will be displayed here.</p>
                </div>
            </div>
        </AppLayout>
    );
}
