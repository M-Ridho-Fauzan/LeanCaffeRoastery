import AppLogoIcon from '@/components/app-logo-icon';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';
import { Clock, MapPin, Navigation, PhoneCall } from 'lucide-react';

const breadcrumbs = [
    {
        title: 'Location',
        href: '#',
    },
];

export default function Location() {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-white font-sans">
                <main className="bg-white text-gray-800">
                    {/* Hero Section */}
                    <section
                        className="relative flex h-[300px] w-full items-center justify-center bg-cover bg-center p-4 text-white sm:h-[400px] lg:h-[450px]"
                        style={{
                            backgroundImage: `url(https://placehold.co/1200x400/343a40/ffffff?text=Coffee+Beans+Background)`,
                        }}
                    >
                        <div className="absolute inset-0 bg-black/50"></div> {/* Menggunakan opacity Tailwind */}
                        <div className="relative z-10 max-w-3xl px-4 text-center">
                            <h1 className="mb-3 text-3xl leading-tight font-bold sm:text-4xl md:text-5xl lg:text-6xl">Visit Our Locations</h1>
                            <p className="mx-auto max-w-xl text-base font-light text-gray-100 sm:text-lg md:text-xl">
                                Experience Lean Coffee at our carefully designed spaces across the city
                            </p>
                        </div>
                    </section>

                    <div className="container mx-auto flex flex-col items-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                        <AppLogoIcon width="150" className="mt-2 mb-8 text-[#1324a4] sm:mb-10" />

                        <div className="w-full max-w-5xl rounded-2xl border border-gray-100 bg-white shadow-xl">
                            {/* Map Container - Responsive Aspect Ratio */}
                            <div className="overflow-hidden rounded-t-2xl bg-gray-100 p-2 sm:p-3">
                                <div className="relative aspect-video w-full sm:aspect-[21/9] md:aspect-[16/7]">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.22290541031!2d107.12641637483716!3d-7.100144092903152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e685d18924e497f%3A0xc29e3d35903e0822!2sLean%20Coffee%20Roastery!5e0!3m2!1sid!2sid!4v1757356676265!5m2!1sid!2sid"
                                        className="absolute inset-0 h-full w-full rounded-xl"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Lean Coffee Location"
                                    ></iframe>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 md:p-10">
                                {/* Grid Layout untuk Informasi Kontak */}
                                {/* Mobile: 1 kolom, Tablet/Desktop: 3 kolom */}
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
                                    {/* Address */}
                                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                                        <div className="mb-3 inline-flex items-center justify-center rounded-full bg-blue-50 p-3 text-[#1324a4]">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-bold text-gray-900">Address</h3>
                                        <div className="text-gray-600">
                                            <p>Jl. Raya Sukonagara</p>
                                            <p>Cianjur, Indonesia</p>
                                        </div>
                                    </div>

                                    {/* Opening Hours */}
                                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                                        <div className="mb-3 inline-flex items-center justify-center rounded-full bg-blue-50 p-3 text-[#1324a4]">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-bold text-gray-900">Opening Hours</h3>
                                        <ul className="space-y-1 text-gray-600">
                                            <li>
                                                <span className="font-medium text-gray-800">Mon - Fri:</span> 08:00 - 22:00
                                            </li>
                                            <li>
                                                <span className="font-medium text-gray-800">Sat - Sun:</span> 09:00 - 00:00
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Contact */}
                                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                                        <div className="mb-3 inline-flex items-center justify-center rounded-full bg-blue-50 p-3 text-[#1324a4]">
                                            <PhoneCall className="h-6 w-6" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-bold text-gray-900">Contact</h3>
                                        <div className="text-gray-600">
                                            <p className="mb-1">Call us for reservation</p>
                                            <a href="tel:+622112345678" className="font-medium text-[#1324a4] hover:underline">
                                                +62 21 1234 5678
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <hr className="my-8 border-gray-100" />

                                {/* Action Button */}
                                <div className="flex justify-center">
                                    <button className="group flex w-full items-center justify-center rounded-lg bg-[#1324a4] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#0f1c85] hover:shadow-xl hover:shadow-blue-900/20 sm:w-auto">
                                        <Navigation className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        Get Directions
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AppHeaderLayout>
    );
}
