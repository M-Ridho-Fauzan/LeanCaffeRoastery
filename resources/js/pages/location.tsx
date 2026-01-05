/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 10/09/2025 - 01:51:09
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 10/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    : Changed logo color to match brand identity
 **/
import AppLogoIcon from '@/components/app-logo-icon';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';
import { Clock, MapPin, PhoneCall } from 'lucide-react';

const breadcrumbs = [
    {
        title: 'Location',
        href: '#', // Menggunakan '#' untuk href karena rute eksternal tidak tersedia di lingkungan terisolasi ini
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
                    <section
                        className="relative flex h-[300px] w-full items-center justify-center bg-cover bg-center p-4 text-white sm:h-[400px]"
                        style={{
                            backgroundImage: `url(https://placehold.co/1200x400/343a40/ffffff?text=Coffee+Beans+Background)`,
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-40"></div>
                        <div className="relative z-10 px-4 text-center">
                            <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">Visit Our Locations</h1>
                            <p className="text-base sm:text-lg md:text-xl">Experience Lean Coffee at our carefully designed spaces across the city</p>
                        </div>
                    </section>

                    <div className="container mx-auto flex flex-col items-center px-4 py-12 sm:py-16">
                        {/* Perubahan ada di baris di bawah ini: menambahkan class text-[#1324a4] */}
                        <AppLogoIcon width="150" className="my-5 text-[#1324a4]" />

                        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
                            <div className="mb-6 h-full w-full overflow-hidden rounded-lg" style={{ aspectRatio: '16 / 9' }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.22290541031!2d107.12641637483716!3d-7.100144092903152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e685d18924e497f%3A0xc29e3d35903e0822!2sLean%20Coffee%20Roastery!5e0!3m2!1sid!2sid!4v1757356676265!5m2!1sid!2sid"
                                    className="h-full w-full"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>

                            <div className="flex flex-col items-start py-5 *:px-5 sm:flex-row lg:justify-center lg:space-x-10">
                                <div className="mb-4 flex items-start gap-3">
                                    <span className="flex-shrink-0 text-gray-600">
                                        <MapPin />
                                    </span>
                                    <ul className="flex flex-col text-left text-gray-700">
                                        <li className="font-medium">
                                            Jl. Raya Sukonagara, Sukonagara <br />
                                        </li>
                                        <li className="font-medium">Cianjur, Indonesia</li>
                                    </ul>
                                </div>

                                <div className="mb-6 flex items-start gap-3">
                                    <span className="flex-shrink-0 text-gray-600">
                                        <Clock />
                                    </span>
                                    <ul className="flex flex-col text-gray-700">
                                        <li className="font-medium">
                                            <b>Mon - Fri:</b>
                                            <small> 08:00 AM - 10:00 PM</small>
                                        </li>
                                        <li className="font-medium">
                                            <b>Sat - Sun:</b>
                                            <small> 09:00 AM - 12:00 PM</small>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mb-6 flex items-center gap-3">
                                    <span className="flex-shrink-0 text-gray-600">
                                        <PhoneCall />
                                    </span>
                                    <p className="text-gray-700">+62 21 1234 5678</p>
                                </div>
                            </div>

                            <button className="flex w-full items-center justify-center rounded-lg bg-[#1324a4] px-6 py-3 text-white shadow-md transition-all duration-300 hover:bg-[#3326c1]">
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
            </div>
        </AppHeaderLayout>
    );
}
