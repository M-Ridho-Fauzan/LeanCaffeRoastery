import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Articles',
        href: '#', // Menggunakan '#' karena rute eksternal tidak tersedia di lingkungan terisolasi ini
    },
];

export default function Articles() {
    // Dummy data for articles to populate the cards
    const articles = [
        {
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Brewing+the+Perfect+Cup', // Placeholder image for empty background
            category: 'TUTORIAL', // Changed to category
            date: 'Sep 15, 2024',
            title: 'Brewing the Perfect Cup',
            description: 'Master the essential tips and techniques to brew your perfect cup of coffee every time.',
        },
        {
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Coffee+Origins+Around+the+World', // Placeholder image for empty background
            category: 'GUIDE', // Changed to category
            date: 'Sep 10, 2024',
            title: 'Coffee Origins Around the World',
            description: 'Explore the fascinating journey of coffee and how different regions create unique flavors.',
        },
        {
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=The+Art+of+Coffee+Roasting', // Placeholder image for empty background
            category: 'TECHNIQUE', // Changed to category
            date: 'Sep 05, 2024',
            title: 'The Art of Coffee Roasting',
            description: 'Learn about the intricate process of coffee roasting and how it transforms flavor profiles.',
        },
        // Adding more dummy data to match the image's layout
        {
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Brewing+the+Perfect+Cup',
            category: 'TUTORIAL',
            date: 'Sep 15, 2024',
            title: 'Brewing the Perfect Cup',
            description: 'Master the essential tips and techniques to brew your perfect cup of coffee every time.',
        },
        {
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Coffee+Origins+Around+the+World',
            category: 'GUIDE',
            date: 'Sep 10, 2024',
            title: 'Coffee Origins Around the World',
            description: 'Explore the fascinating journey of coffee and how different regions create unique flavors.',
        },
        {
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=The+Art+of+Coffee+Roasting',
            category: 'TECHNIQUE',
            date: 'Sep 05, 2024',
            title: 'The Art of Coffee Roasting',
            description: 'Learn about the intricate process of coffee roasting and how it transforms flavor profiles.',
        },
    ];

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-white font-sans">
                {/* Direct inclusion of font links for demonstration purposes */}
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

                <main className="bg-white text-[#303182]">
                    {' '}
                    {/* Changed main background to white */}
                    {/* Hero Section for Articles */}
                    <section
                        className="relative flex h-[300px] w-full flex-col items-center justify-center bg-cover bg-center p-4 text-white"
                        style={{
                            backgroundImage: `url(https://placehold.co/1200x300/343a40/ffffff?text=Coffee+Background)`,
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-40"></div>
                        <div className="relative z-10 text-center">
                            <h1 className="mb-2 text-4xl font-bold">Coffee Articles & Insights</h1>
                            <p className="mb-6 text-lg">
                                Discover the world of coffee through expert insights, brewing guides, and industry knowledge
                            </p>
                            <div className="relative mx-auto w-full max-w-lg">
                                <input
                                    type="text"
                                    placeholder="Search Articles..."
                                    className="bg-opacity-90 w-full rounded-full bg-white p-3 pl-10 text-gray-800 focus:ring-2 focus:ring-[#6B4F3A] focus:outline-none"
                                />
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
                                    className="lucide lucide-search absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </div>
                        </div>
                    </section>
                    {/* Articles Grid */}
                    <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-16 md:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article, index) => (
                            // Card
                            <div key={index} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                                {/* Image placeholder with rounded top corners */}
                                <div className="aspect-video overflow-hidden rounded-t-xl">
                                    <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                                </div>
                                {/* Card Content */}
                                <div className="p-6 text-gray-800">
                                    {/* Category and Date */}
                                    <div className="mb-2 text-sm text-gray-500">
                                        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium">{article.category}</span>
                                        <span className="ml-2">{article.date}</span>
                                    </div>
                                    {/* Title */}
                                    <h3 className="mb-3 text-xl font-semibold">{article.title}</h3>
                                    {/* Description */}
                                    <p className="mb-4 text-gray-600">{article.description}</p>
                                    {/* Read More button */}
                                    <button className="inline-flex items-center rounded-lg border border-[#303182] bg-white px-4 py-2 text-sm font-semibold text-[#303182] transition-colors hover:bg-[#303182] hover:text-white">
                                        Read More
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-arrow-right ml-1"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Pagination */}
                    <div className="flex items-center justify-center py-8">
                        <button className="mx-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white transition-colors hover:bg-gray-600">
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
                                className="lucide lucide-chevron-left"
                            >
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <button className="mx-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#303182] text-white transition-colors hover:bg-[#202160]">
                            {' '}
                            {/* Changed color to match new card button */}1
                        </button>
                        <button className="mx-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white transition-colors hover:bg-gray-600">
                            2
                        </button>
                        <button className="mx-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white transition-colors hover:bg-gray-600">
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
                                className="lucide lucide-chevron-right"
                            >
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </main>

                {/* Footer Section - Mimicking the design from the image */}
                <footer className="bg-[#1C213D] py-12 text-white">
                    <div className="container mx-auto grid grid-cols-1 gap-8 px-4 text-center md:grid-cols-3 md:text-left">
                        {/* Left Section: Logo and Copyright */}
                        <div className="flex flex-col items-center md:items-start">
                            <img
                                src="https://placehold.co/120x40/343a40/ffffff?text=Lean+Logo" // Placeholder for Lean Coffee Roastery logo
                                alt="Lean Coffee Roastery Logo"
                                className="mb-4"
                            />
                            <p className="text-sm text-gray-400">© 2024 Powered by Lean Coffee Company</p>
                        </div>

                        {/* Middle Section: Quick Links */}
                        <div>
                            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
                            <ul>
                                <li className="mb-2">
                                    <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                        About Us
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                        Articles
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                        Location
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                        Contact Us
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Right Section: Product & Follow Us */}
                        <div>
                            <h4 className="mb-4 text-lg font-semibold">Product</h4>
                            <ul>
                                <li className="mb-2">
                                    <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                        Beans
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                        Brewing Gear
                                    </a>
                                </li>
                            </ul>
                            <h4 className="mt-6 mb-4 text-lg font-semibold">Follow Us</h4>
                            <div className="flex justify-center space-x-4 md:justify-start">
                                {/* Social Media Icons - using simple text placeholders */}
                                <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                    FB
                                </a>
                                <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                    IG
                                </a>
                                <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                    TW
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </AppHeaderLayout>
    );
}
