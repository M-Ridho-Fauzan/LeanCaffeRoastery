import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'About Us',
        href: '/about',
    },
];

export default function About() {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <main className="bg-white text-[#303182]">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="mb-12 text-4xl font-semibold">Curious about us?</h1>

                    {/* Mission & Vision */}
                    <div className="mb-16 flex flex-col justify-center gap-8 lg:flex-row">
                        {/* Mission */}
                        <div className="mx-auto max-w-lg rounded-xl border-5 bg-white p-8 lg:mx-0">
                            <div className="mb-4 flex items-center justify-center lg:justify-start">
                                <span className="mr-4 rounded-full bg-white p-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-target"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <circle cx="12" cy="12" r="6" />
                                        <circle cx="12" cy="12" r="2" />
                                    </svg>
                                </span>
                                <h2 className="text-2xl font-semibold">Our Mission</h2>
                            </div>
                            <p className="text-left text-[#303182]">
                                To source, roast, and serve exceptional coffee while building a warm and inviting space. Our mission is to creating
                                meaningful connections within our community. We believe in the power of a good cup to bring people together and
                                brighten their day.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="mx-auto max-w-lg rounded-xl border-4 bg-white p-8 lg:mx-0">
                            <div className="mb-4 flex items-center justify-center lg:justify-start">
                                <span className="mr-4 rounded-full bg-white p-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-eye"
                                    >
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </span>
                                <h2 className="text-2xl font-semibold">Our Vision</h2>
                            </div>
                            <p className="text-left text-[#303182]">
                                To be the leading specialty coffee roaster that elevates the coffee experience through quality and community
                                engagement. We envision a world where every cup tells a story of craftsmanship, care and positive impact.
                            </p>
                        </div>
                    </div>

                    {/* What Drives Us */}
                    <div className="mb-16">
                        <h2 className="mb-4 text-3xl font-semibold">What Drives Us</h2>
                        <p className="mb-8 text-[#303182]">Our core values guide everything we do, from sourcing beans to serving customers</p>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Quality First */}
                            <div className="rounded-xl border-4 bg-white p-6">
                                <span className="mb-4 inline-block rounded-full border-4 bg-white p-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-coffee"
                                    >
                                        <path d="M10 2c1.33-1 2.67-1 4 0v2H10V2z" />
                                        <path d="M14 2c1.33-1 2.67-1 4 0v2h-4V2z" />
                                        <path d="M10 20h4V14H10v6z" />
                                        <path d="M14 20h4V14h-4v6z" />
                                        <path d="M10 22h4V20h-4V22z" />
                                        <path d="M14 22h4V20h-4V22z" />
                                        <path d="M6 14v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6H6z" />
                                        <path d="M6 14h12V4H6v10z" />
                                    </svg>
                                </span>
                                <h3 className="mb-2 text-xl font-semibold">Quality First</h3>
                                <p className="text-sm text-[#303182]">We are committed to delivering the highest quality coffee, from bean to cup.</p>
                            </div>
                            {/* Sustainability */}
                            <div className="rounded-xl border-4 bg-white p-6">
                                <span className="mb-4 inline-block rounded-full bg-white p-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-leaf"
                                    >
                                        <path d="M22 10.03c-2.48-2.61-6.1-4.14-10-4.03-3.9.11-7.52 1.64-10 4.03-2.48 2.61-4.14 6.1-4.03 10 .11 3.9 1.64 7.52 4.03 10 .05.05.1.1.15.15l-1.41-1.41a10 10 0 0 0-1.41 1.41-10 10 0 0 0 1.41-1.41l1.41 1.41a10 10 0 0 0-1.41-1.41-10 10 0 0 0 1.41-1.41l-1.41 1.41a10 10 0 0 0-1.41-1.41-10 10 0 0 0 1.41-1.41l1.41 1.41a10 10 0 0 0-1.41-1.41-10 10 0 0 0 1.41-1.41l-1.41 1.41a10 10 0 0 0-1.41-1.41-10 10 0 0 0 1.41-1.41l-1.41 1.41a10 10 0 0 0-1.41-1.41-10 10 0 0 0 1.41-1.41l1.41 1.41a10 10 0 0 0-1.41-1.41-10 10 0 0 0 1.41-1.41z" />
                                    </svg>
                                </span>
                                <h3 className="mb-2 text-xl font-semibold">Sustainability</h3>
                                <p className="text-sm text-[#303182]">
                                    We partner with farms that practice sustainable and ethical sourcing methods.
                                </p>
                            </div>
                            {/* Community */}
                            <div className="rounded-xl border-4 bg-white p-6">
                                <span className="mb-4 inline-block rounded-full border-4 bg-white p-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-users"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M4 13V2a4 4 0 0 1 4 4v7" />
                                    </svg>
                                </span>
                                <h3 className="mb-2 text-xl font-semibold">Community</h3>
                                <p className="text-sm text-gray-400">
                                    We foster a sense of belonging and support local initiatives in our community.
                                </p>
                            </div>
                            {/* Global Impact */}
                            <div className="rounded-xl border-4 bg-white p-6">
                                <span className="mb-4 inline-block rounded-full bg-white p-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-globe"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10c-2.43 2.5-5.27 3.97-8 4" />
                                        <path d="M12 2a15.3 15.3 0 0 0-4 10c2.43 2.5 5.27 3.97 8 4" />
                                    </svg>
                                </span>
                                <h3 className="mb-2 text-xl font-semibold">Global Impact</h3>
                                <p className="text-sm text-[#303182]">
                                    We strive to make a positive impact on the global coffee industry, one cup at a time.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 5 Years of Excellence */}
                    <div className="mb-16">
                        <h2 className="mb-4 text-3xl font-semibold">5 Years of Excellence</h2>
                        <p className="mb-8 text-[#303182]">Key milestones in our journey to becoming Cianjur's premier coffee roaster</p>
                        <div className="relative flex flex-col items-center">
                            {/* Timeline items */}
                            {[
                                { year: 2019, text: 'Lean Coffee Roastery founded', subtext: 'started with a small roastery in Cianjur, Indonesia.' },
                                { year: 2020, text: 'First retail location opened', subtext: 'opened our flagship store to serve the community.' },
                                { year: 2020, text: 'Direct trade partnerships', subtext: 'established direct relationships with coffee farmers.' },
                                { year: 2021, text: 'Online expansion', subtext: 'Launched a e-commerce platform during pandemic.' },
                                { year: 2025, text: '5 years of excellence', subtext: 'Celebrating 5 years of exceptional coffee.' },
                            ].map((item, index) => (
                                <div key={index} className="mb-4 flex w-full items-center bg-white lg:w-3/4">
                                    <div className="relative flex-shrink-0">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#424A69] bg-[#303182] text-sm font-semibold text-white">
                                            {item.year}
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-grow rounded-xl bg-[#2A3152] p-4 text-left">
                                        <h3 className="text-xl font-semibold">{item.text}</h3>
                                        <p className="text-sm text-[#303182]">{item.subtext}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ready to Experience Lean Coffee? */}
                    <div>
                        <h2 className="mb-4 text-3xl font-semibold">Ready to Experience Lean Coffee?</h2>
                        <p className="mb-8 text-[#303182]">Visit our stores or order online to taste the difference that passion and quality make</p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <button className="flex items-center justify-center rounded-full bg-[#303182] px-6 py-3 text-white transition-all duration-300 hover:bg-[#8D6B58]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-store"
                                >
                                    <path d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z" />
                                    <path d="M12 16.99c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                                    <path d="M12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                                    <path d="M22 12c0 5.52-4.48 10-10 10-5.52 0-10-4.48-10-10C2 6.48 6.48 2 12 2c5.52 0 10 4.48 10 10z" />
                                </svg>
                                <span className="ml-2">Shop Now</span>
                            </button>
                            <button className="rounded-full border border-gray-500 px-6 py-3 text-gray-300 transition-all duration-300 hover:border-gray-300 hover:bg-[#2A3152]">
                                Find Out More
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer>{/* Footer content if needed, as per original design */}</footer>
        </AppHeaderLayout>
    );
}
