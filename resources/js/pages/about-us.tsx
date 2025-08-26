import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';

export default function AboutUs() {
    return (
        <AppHeaderLayout>
            <Head title="Abou Us">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="w-100">
                <h1>Halaman About</h1>
            </div>
        </AppHeaderLayout>
    );
}
