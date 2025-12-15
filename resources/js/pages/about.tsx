import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react'; // <--- Link ditambahkan di sini

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'About Us',
//         url: '/about',
//     },
// ];

export default function About({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[breadcrumbs.length - 1].title}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <main className="bg-white text-[#303182]">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="mb-12 text-4xl font-semibold">Curious about us?</h1>

                    {/* Mission & Vision */}
                    <div className="mb-24">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Mission Card */}
                            <div className="flex flex-col rounded-[2.5rem] border border-[#303182] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-lg sm:p-10">
                                <div className="mb-8 flex items-center gap-6">
                                    {/* Icon Box */}
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#1e1b4b] shadow-md">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="40"
                                            height="40"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-target"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <circle cx="12" cy="12" r="6" />
                                            <circle cx="12" cy="12" r="2" />
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl font-bold text-[#1e1b4b]">Our Mission</h2>
                                </div>
                                <p className="text-left text-lg leading-relaxed text-[#303182]">
                                    To source, roast, and serve exceptional coffee while building a warm and inviting space. Our mission is to
                                    creating meaningful connections within our community. We believe in the power of a good cup to bring people
                                    together and brighten their day.
                                </p>
                            </div>

                            {/* Vision Card */}
                            <div className="flex flex-col rounded-[2.5rem] border border-[#303182] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-lg sm:p-10">
                                <div className="mb-8 flex items-center gap-6">
                                    {/* Icon Box */}
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#1e1b4b] shadow-md">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="40"
                                            height="40"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-eye"
                                        >
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl font-bold text-[#1e1b4b]">Our Vision</h2>
                                </div>
                                <p className="text-left text-lg leading-relaxed text-[#303182]">
                                    To be the leading specialty coffee roaster that elevates the coffee experience through quality and community
                                    engagement. We envision a world where every cup tells a story of craftsmanship, care and positive impact.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What Drives Us */}
                    <div className="mb-16">
                        <h2 className="mb-4 text-3xl font-semibold text-[#303182]">What Drives Us</h2>
                        <p className="mb-12 text-[#303182]">Our core values guide everything we do, from sourcing beans to serving customers</p>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Card 1: Quality First */}
                            <div className="flex flex-col items-center rounded-[2rem] border border-[#303182] bg-white p-8 transition-shadow duration-300 hover:shadow-lg">
                                {/* Icon Container (Grey Circle) */}
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#9ca3af]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#303182" // Warna icon biru tua
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-coffee"
                                    >
                                        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                                        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                                        <line x1="6" x2="6" y1="2" y2="4" />
                                        <line x1="10" x2="10" y1="2" y2="4" />
                                        <line x1="14" x2="14" y1="2" y2="4" />
                                    </svg>
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-[#303182]">Quality First</h3>
                                <p className="text-sm leading-relaxed text-[#303182]">
                                    We never compromise on quality. Every bean is carefully selected and roasted to perfection.
                                </p>
                            </div>

                            {/* Card 2: Sustainability */}
                            <div className="flex flex-col items-center rounded-[2rem] border border-[#303182] bg-white p-8 transition-shadow duration-300 hover:shadow-lg">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#9ca3af]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#303182"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-leaf"
                                    >
                                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                                    </svg>
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-[#303182]">Sustainability</h3>
                                <p className="text-sm leading-relaxed text-[#303182]">
                                    We work directly with farmers to ensure sustainable practices and fair compensation.
                                </p>
                            </div>

                            {/* Card 3: Community */}
                            <div className="flex flex-col items-center rounded-[2rem] border border-[#303182] bg-white p-8 transition-shadow duration-300 hover:shadow-lg">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#9ca3af]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#303182"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-heart"
                                    >
                                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                    </svg>
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-[#303182]">Community</h3>
                                <p className="text-sm leading-relaxed text-[#303182]">
                                    Building a community of coffee lovers who appreciate craftsmanship and quality.
                                </p>
                            </div>

                            {/* Card 4: Global Impact */}
                            <div className="flex flex-col items-center rounded-[2rem] border border-[#303182] bg-white p-8 transition-shadow duration-300 hover:shadow-lg">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#9ca3af]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#303182"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-globe"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="2" x2="22" y1="12" y2="12" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-[#303182]">Global Impact</h3>
                                <p className="text-sm leading-relaxed text-[#303182]">
                                    Making a positive impact on coffee communities around the world.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 5 Years of Excellence */}
                    <div className="mb-20">
                        <h2 className="mb-4 text-3xl font-semibold text-[#303182]">5 Years of Excellence</h2>
                        <p className="mb-12 text-[#303182]">Key milestones in our journey to becoming Cianjur's premier coffee roaster</p>

                        <div className="mx-auto flex max-w-4xl flex-col gap-6">
                            {[
                                { year: '2019', title: 'Lean Coffee Roastery founded', desc: 'Started with a small roastery in Cianjur, Indonesia.' },
                                { year: '2020', title: 'First retail location opened', desc: 'Opened our flagship store to serve the community.' },
                                { year: '2020', title: 'Direct trade partnerships', desc: 'Established direct relationships with coffee farmers.' },
                                { year: '2021', title: 'Online expansion', desc: 'Launched e-commerce platform during pandemic.' },
                                { year: '2025', title: '5 years of excellence', desc: 'Celebrating 5 years of exceptional coffee.' },
                            ].map((item, index) => (
                                <div key={index} className="flex flex-col items-center gap-6 sm:flex-row">
                                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#1e1b4b] text-xl font-bold text-white shadow-md sm:h-28 sm:w-28 sm:text-2xl">
                                        {item.year}
                                    </div>
                                    <div className="flex w-full flex-col justify-center rounded-2xl border border-indigo-100 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:shadow-md sm:h-28">
                                        <h3 className="mb-1 text-lg font-bold text-[#1e1b4b] sm:text-xl">{item.title}</h3>
                                        <p className="text-sm text-[#303182] sm:text-base">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ready to Experience Lean Coffee? */}
                    <div className="py-12 text-center">
                        <h2 className="mb-4 text-4xl font-bold tracking-tight text-[#1e1b4b]">Ready to Experience Lean Coffee?</h2>
                        <p className="mb-10 text-lg text-[#303182]">
                            Visit our stores or order online to taste the difference that passion and quality make
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {/* LINK KE HALAMAN PRODUCTS */}
                            <Link href={route('products.index')} className="group">
                                <button className="flex items-center gap-3 rounded-xl bg-[#1e1b4b] px-8 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#303182] group-hover:shadow-xl">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="shrink-0"
                                    >
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.61 11.63c-1.07 1.89-3.22 2.77-5.61 2.15 3.48-.09 5.16-3.57 4.09-5.46-1.07-1.9-4.04-2.23-6.63-.74 2.59-1.49 7.08 2.15 8.15 4.05z" />
                                    </svg>
                                    <span>Shop Now</span>
                                </button>
                            </Link>

                            {/* LINK KE HALAMAN LOCATION */}
                            <Link href={route('location')} className="group">
                                <button className="rounded-xl border-2 border-[#1e1b4b] bg-white px-8 py-3.5 font-semibold text-[#1e1b4b] transition-all duration-300 group-hover:bg-gray-50 group-hover:shadow-md">
                                    Find Our Store
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <footer>{/* Footer content if needed */}</footer>
        </AppHeaderLayout>
    );
}
