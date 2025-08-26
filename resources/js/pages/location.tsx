import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';
import React from 'react';
// Define a simple Breadcrumb component for demonstration
// This mimics the functionality of the BreadcrumbItem from your original setup
const Breadcrumb = ({ items }) => (
    <nav className="mb-4 text-sm text-gray-600">
        {items.map((item, index) => (
            <React.Fragment key={item.title}>
                <a href={item.href} className="hover:underline">
                    {item.title}
                </a>
                {index < items.length - 1 && <span className="mx-2">/</span>}
            </React.Fragment>
        ))}
    </nav>
);

// Define a simple Header component to mimic AppHeaderLayout
// This component replaces the external AppHeaderLayout import
const AppHeader = ({ breadcrumbs, title }) => (
    <header className="bg-gray-50 py-4 shadow-sm">
        <div className="container mx-auto px-4">
            {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
            {/* The title prop here can be used to display a page-specific title in the header */}
            {title && <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>}
        </div>
    </header>
);

// Define a simple Head component to mimic @inertiajs/react Head
// This replaces the external Head import for setting document title and linking fonts
const CustomHead = ({ title, children }) => {
    React.useEffect(() => {
        if (title) {
            document.title = title;
        }
        // In a real browser environment, you might append child <link> elements here,
        // but for a self-contained React component, external CSS is usually handled by a build tool.
        // We will include the link tags directly in the JSX for demonstration.
    }, [title]);

    return null; // This component does not render anything itself
};

const breadcrumbs = [
    {
        title: 'Location',
        href: '#', // Menggunakan '#' untuk href karena rute eksternal tidak tersedia di lingkungan terisolasi ini
    },
];

export default function Locatiom() {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-white font-sans">
                {/* Tautan font disertakan langsung di sini untuk tujuan demonstrasi,
                karena komponen Head eksternal dan mock-nya dihapus dari alur rendering langsung */}
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

                <main className="bg-white text-gray-800">
                    {/* Bagian Hero - Dikembalikan sesuai permintaan */}
                    <section
                        className="relative flex h-[400px] w-full items-center justify-center bg-cover bg-center p-4 text-white"
                        style={{
                            // Gambar placeholder untuk latar belakang, ganti dengan jalur gambar Anda yang sebenarnya
                            backgroundImage: `url(https://placehold.co/1200x400/343a40/ffffff?text=Coffee+Beans+Background)`,
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-40"></div> {/* Overlay untuk keterbacaan teks yang lebih baik */}
                        <div className="relative z-10 text-center">
                            <h1 className="mb-4 text-5xl font-bold">Visit Our Locations</h1>
                            <p className="text-xl">Experience Lean Coffee at our carefully designed spaces across the city</p>
                        </div>
                    </section>

                    <div className="container mx-auto flex flex-col items-center px-4 py-16">
                        {/* Logo Roastery Kopi Lean - Dikembalikan sesuai permintaan */}
                        <img
                            src="https://placehold.co/150x50/343a40/ffffff?text=Lean+Logo" // Placeholder untuk logo Roastery Kopi Lean
                            alt="Lean Coffee Roastery Logo"
                            className="mb-12"
                        />

                        {/* Kartu Lokasi - ini adalah konten utama sekarang */}
                        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
                            {/* Gambar Lokasi */}
                            <div className="mb-6 overflow-hidden rounded-lg">
                                <img
                                    src="https://placehold.co/400x250/EFEFEF/AAAAAA?text=Location+Image" // Placeholder untuk gambar lokasi
                                    alt="Location Front"
                                    className="h-auto w-full object-cover"
                                />
                            </div>

                            {/* Alamat */}
                            <div className="mb-4 flex items-start">
                                <span className="mr-3 flex-shrink-0 text-gray-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-map-pin"
                                    >
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                        <circle cx="12" cy="9" r="3" />
                                    </svg>
                                </span>
                                <p className="text-left text-gray-700">
                                    Jl. Raya Sukonagara, Sukonagara <br />
                                    Cianjur, Indonesia
                                </p>
                            </div>

                            {/* Jam Buka */}
                            <div className="mb-4 flex items-center">
                                <span className="mr-3 flex-shrink-0 text-gray-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-clock"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </span>
                                <p className="text-gray-700">
                                    Mon - Fri: 08:00 AM - 10:00 PM <br />
                                    Sat - Sun: 09:00 AM - 12:00 PM
                                </p>
                            </div>

                            {/* Telepon */}
                            <div className="mb-6 flex items-center">
                                <span className="mr-3 flex-shrink-0 text-gray-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-phone"
                                    >
                                        <path d="M22 16.92V21a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4.08A2 2 0 0 1 4 13h16a2 2 0 0 1 2 2.92z" />
                                        <path d="M10 2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6z" />
                                    </svg>
                                </span>
                                <p className="text-gray-700">+62 21 1234 5678</p>
                            </div>

                            {/* Tombol Dapatkan Arah */}
                            <button className="flex w-full items-center justify-center rounded-lg bg-[#6B4F3A] px-6 py-3 text-white shadow-md transition-all duration-300 hover:bg-[#8D6B58]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-navigation"
                                >
                                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                                </svg>
                                <span className="ml-2">Get Directions</span>
                            </button>
                        </div>
                    </div>
                </main>

                <footer>{/* Konten footer bisa ditambahkan di sini jika diperlukan */}</footer>
            </div>
        </AppHeaderLayout>
    );
}
