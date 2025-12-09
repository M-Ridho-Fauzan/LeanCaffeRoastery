import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react'; // Import icon panah dan X
import { useEffect, useState } from 'react';

// --- Dummy Data Content (Teks Panjang untuk simulasi) ---
const longContent = `
    <h3 class="text-lg font-bold mb-2">The Art of Perfect Coffee Brewing</h3>
    <p class="mb-4 text-gray-600">Brewing the perfect cup of coffee is both an art and a science. It requires understanding the fundamental principles that govern extraction, timing, and technique.</p>
    
    <h4 class="font-bold mb-1">Essential Equipment</h4>
    <p class="mb-2 text-gray-600">Before diving into brewing techniques, let's discuss the essential equipment you'll need:</p>
    <ul class="list-disc pl-5 mb-4 text-gray-600 space-y-1">
        <li><strong>Coffee Grinder:</strong> A burr grinder is preferred for consistent particle size.</li>
        <li><strong>Scale:</strong> Precision is key – measure both coffee and water.</li>
        <li><strong>Timer:</strong> Timing your extraction is crucial.</li>
        <li><strong>Quality Water:</strong> Use filtered water for the best taste.</li>
    </ul>

    <h4 class="font-bold mb-1">The Golden Ratio</h4>
    <p class="mb-4 text-gray-600">The standard coffee-to-water ratio is 1:15 to 1:17. This means for every gram of coffee, use 15-17 grams of water. Start with 1:16 and adjust to your taste preference.</p>
`;

export default function Index() {
    // State untuk menyimpan artikel yang sedang dipilih (Modal)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedArticle, setSelectedArticle] = useState<any>(null);

    // --- State Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Menampilkan 6 artikel per halaman

    // --- 12 Dummy Data ---
    const articles = [
        {
            id: 1,
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Brewing+101',
            category: 'TUTORIAL',
            date: 'Sep 15, 2024',
            author: 'Eko Ahmad',
            title: '1. Brewing the Perfect Cup',
            description: 'Master the essential tips and techniques to brew your perfect cup of coffee every time.',
            content: longContent,
        },
        {
            id: 2,
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Coffee+Origins',
            category: 'GUIDE',
            date: 'Sep 10, 2024',
            author: 'Sarah Jenkins',
            title: '2. Coffee Origins Around the World',
            description: 'Explore the fascinating journey of coffee and how different regions create unique flavors.',
            content: longContent,
        },
        {
            id: 3,
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Roasting+Art',
            category: 'TECHNIQUE',
            date: 'Sep 05, 2024',
            author: 'Michael Chen',
            title: '3. The Art of Coffee Roasting',
            description: 'Learn about the intricate process of coffee roasting and how it transforms flavor profiles.',
            content: longContent,
        },
        {
            id: 4,
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Advanced+Brew',
            category: 'TUTORIAL',
            date: 'Aug 20, 2024',
            author: 'Eko Ahmad',
            title: '4. Advanced Brewing Techniques',
            description: 'Take your brewing skills to the next level with these pro tips.',
            content: longContent,
        },
        {
            id: 5,
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=African+Coffee',
            category: 'GUIDE',
            date: 'Aug 18, 2024',
            author: 'Sarah Jenkins',
            title: '5. Exploring African Coffee',
            description: 'Deep dive into Ethiopian and Kenyan beans and their distinct profiles.',
            content: longContent,
        },
        {
            id: 6,
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Roast+Levels',
            category: 'TECHNIQUE',
            date: 'Aug 15, 2024',
            author: 'Michael Chen',
            title: '6. Understanding Roast Levels',
            description: 'From light to dark: what you need to know about roast differences.',
            content: longContent,
        },
        {
            id: 7,
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Espresso+Mastery',
            category: 'TUTORIAL',
            date: 'Aug 10, 2024',
            author: 'Davina Rose',
            title: '7. Espresso Mastery',
            description: 'How to pull the perfect shot of espresso at home.',
            content: longContent,
        },
        {
            id: 8,
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Latte+Art',
            category: 'ART',
            date: 'Aug 05, 2024',
            author: 'Davina Rose',
            title: '8. Latte Art for Beginners',
            description: 'Simple steps to create hearts and tulips in your milk coffee.',
            content: longContent,
        },
        {
            id: 9,
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Water+Science',
            category: 'SCIENCE',
            date: 'Jul 30, 2024',
            author: 'Dr. Bean',
            title: '9. The Science of Water',
            description: 'Why water chemistry matters more than you think.',
            content: longContent,
        },
        {
            id: 10,
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Grinder+Guide',
            category: 'GEAR',
            date: 'Jul 25, 2024',
            author: 'Gear Head',
            title: '10. Choosing the Right Grinder',
            description: 'Burr vs Blade? Conical vs Flat? We explain it all.',
            content: longContent,
        },
        {
            id: 11,
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Cold+Brew',
            category: 'RECIPE',
            date: 'Jul 20, 2024',
            author: 'Summer Vibes',
            title: '11. Ultimate Cold Brew Recipe',
            description: 'Refreshing, smooth, and easy to make overnight.',
            content: longContent,
        },
        {
            id: 12,
            image: 'https://placehold.co/400x250/E0E0E0/303182?text=Coffee+Sustainability',
            category: 'ETHICS',
            date: 'Jul 15, 2024',
            author: 'Green Earth',
            title: '12. Sustainability in Coffee',
            description: 'How to support ethical farming and eco-friendly practices.',
            content: longContent,
        },
    ];

    // --- Logika Pagination ---
    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentArticles = articles.slice(indexOfFirstItem, indexOfLastItem);

    // Fungsi pindah halaman
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    // Disable scroll background saat modal terbuka
    useEffect(() => {
        if (selectedArticle) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedArticle]);

    return (
        <AppHeaderLayout breadcrumbs={[{ title: 'Articles', href: '/blog' }]}>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-white font-sans">
                <main className="bg-white text-[#303182]">
                    {/* Hero Section */}
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

                    {/* Articles Grid (Menampilkan currentArticles berdasarkan halaman) */}
                    <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-16 md:grid-cols-2 lg:grid-cols-3">
                        {currentArticles.map((article) => (
                            <div key={article.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                                <div className="group aspect-video overflow-hidden rounded-t-xl">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 text-gray-800">
                                    <div className="mb-2 text-sm text-gray-500">
                                        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium">{article.category}</span>
                                        <span className="ml-2">{article.date}</span>
                                    </div>
                                    <h3 className="mb-3 text-xl font-semibold">{article.title}</h3>
                                    <p className="mb-4 text-gray-600">{article.description}</p>

                                    {/* Action Button: Opens Modal */}
                                    <button
                                        onClick={() => setSelectedArticle(article)}
                                        className="inline-flex items-center rounded-lg border border-[#303182] bg-white px-4 py-2 text-sm font-semibold text-[#303182] transition-colors hover:bg-[#303182] hover:text-white"
                                    >
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

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-center space-x-4 py-8">
                        {/* Tombol Previous */}
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`flex items-center justify-center p-2 text-[#303182] transition-transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100`}
                        >
                            <ChevronLeft className="h-10 w-10 fill-[#303182]" />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex space-x-3">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-lg font-bold transition-colors ${
                                        currentPage === i + 1
                                            ? 'border-[#303182] bg-[#303182] text-white' // Style Aktif (Biru Solid)
                                            : 'border-gray-300 bg-white text-[#303182] hover:border-[#303182]' // Style Inaktif (Putih)
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        {/* Tombol Next */}
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className={`flex items-center justify-center p-2 text-[#303182] transition-transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100`}
                        >
                            <ChevronRight className="h-10 w-10 fill-[#303182]" />
                        </button>
                    </div>
                </main>

                {/* --- ARTICLE DETAIL MODAL / POPUP (Sama seperti sebelumnya) --- */}
                {selectedArticle && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setSelectedArticle(null)}
                        ></div>

                        <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="mb-6 flex items-start justify-between">
                                    <h2 className="w-full text-center text-3xl font-bold text-[#303182]">{selectedArticle.title}</h2>
                                    <button
                                        onClick={() => setSelectedArticle(null)}
                                        className="absolute top-6 right-6 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#303182] font-bold text-white">
                                            {selectedArticle.author ? selectedArticle.author.charAt(0) : 'A'}
                                        </div>
                                        <span>{selectedArticle.author || 'Lean Author'}</span>
                                    </div>
                                    <span>{selectedArticle.date}</span>
                                </div>

                                <div className="mb-8 flex justify-center">
                                    <div className="w-full max-w-lg overflow-hidden rounded-lg shadow-md">
                                        <img src={selectedArticle.image} alt={selectedArticle.title} className="h-auto w-full object-cover" />
                                    </div>
                                </div>

                                <div
                                    className="prose max-w-none leading-relaxed text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                                ></div>

                                <div className="mt-12 border-t border-gray-200 pt-8">
                                    <h3 className="mb-6 text-center text-2xl font-bold text-[#303182]">Another Articles</h3>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        {articles
                                            .filter((a) => a.id !== selectedArticle.id)
                                            .slice(0, 2)
                                            .map((related, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                                                >
                                                    <div className="h-48 overflow-hidden">
                                                        <img
                                                            src={related.image}
                                                            alt={related.title}
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div className="flex flex-1 flex-col p-4">
                                                        <div className="mb-2 text-xs text-gray-500">
                                                            <span className="font-bold">{related.author || 'Author'}</span> • {related.date}
                                                        </div>
                                                        <h4 className="mb-2 text-sm font-bold text-[#303182]">{related.title}</h4>
                                                        <p className="mb-4 line-clamp-2 text-xs text-gray-600">{related.description}</p>
                                                        <button
                                                            onClick={() => setSelectedArticle(related)}
                                                            className="mt-auto self-start rounded-full bg-[#303182] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#202160]"
                                                        >
                                                            Read More →
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppHeaderLayout>
    );
}
