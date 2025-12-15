import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// --- DEFINISI TIPE ---
interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image_url: string | null;
    published_at: string | null;
    status: 'draft' | 'published' | 'archived';
    views_count: number;
    created_at: string;
    updated_at: string;
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
    author: {
        id: number;
        name: string;
        email: string;
    };
    tags: {
        id: number;
        name: string;
        slug: string;
    }[];
}

interface PageProps {
    articles: {
        data: Article[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        current_page: number;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}

export default function Index({ articles }: PageProps) {
    const primaryColorClass = 'bg-[#2E236C]';
    const textPrimaryColorClass = 'text-[#2E236C]';
    const modalScrollRef = useRef<HTMLDivElement>(null);

    // 1. State Pencarian (Client Side Only)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // 2. LOGIKA FILTER CLIENT-SIDE
    const filteredArticles = articles.data.filter((article) => {
        if (!searchTerm) return true;
        const lowerSearch = searchTerm.toLowerCase();
        return (
            article.title.toLowerCase().includes(lowerSearch) ||
            (article.excerpt && article.excerpt.toLowerCase().includes(lowerSearch)) ||
            article.author.name.toLowerCase().includes(lowerSearch)
        );
    });

    // --- DATA DUMMY GAMBAR ---
    const dummyImages = [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1442512595331-e89e7385a861?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
    ];

    const getImageUrl = (article: Article, index: number) => {
        if (article.featured_image_url) return article.featured_image_url;
        return dummyImages[index % dummyImages.length];
    };

    const getDummyContent = () => {
        return `
            <div class="space-y-6 text-[#2E236C]">
                <div>
                    <h4 class="font-bold text-lg mb-2">The Art of Perfect Coffee Brewing</h4>
                    <p class="text-gray-600 text-sm leading-relaxed">
                        Brewing the perfect cup of coffee is both an art and a science. It requires understanding the fundamental principles that govern extraction, timing, and technique.
                    </p>
                </div>
                
                <div>
                    <h4 class="font-bold text-sm mb-2">Essential Equipment</h4>
                    <p class="text-gray-600 text-sm mb-2">Before diving into brewing techniques, let's discuss the essential equipment you'll need:</p>
                    <ul class="list-disc pl-5 space-y-1 text-sm text-gray-600">
                        <li><strong>Coffee Grinder:</strong> A burr grinder is preferred.</li>
                        <li><strong>Scale:</strong> Precision is key - measure both coffee and water.</li>
                        <li><strong>Timer:</strong> Timing your extraction is crucial.</li>
                        <li><strong>Quality Water:</strong> Use filtered water for best taste.</li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold text-sm mb-2">The Golden Ratio</h4>
                    <p class="text-gray-600 text-sm leading-relaxed">
                        The standard coffee-to-water ratio is 1:15 to 1:17. This means for every gram of coffee, use 15-17 grams of water. Start with 1:16 and adjust to your taste preference.
                    </p>
                </div>

                 <div>
                    <h4 class="font-bold text-sm mb-2">Water Temperature</h4>
                    <p class="text-gray-600 text-sm leading-relaxed">
                       The ideal water temperature for brewing coffee is between 195°F and 205°F (90°C to 96°C). Water that's too hot will over-extract and create bitter flavors.
                    </p>
                </div>
            </div>
        `;
    };

    useEffect(() => {
        if (selectedArticle) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedArticle]);

    const decodeHtml = (html: string) => {
        if (typeof window === 'undefined') return html;
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    const handleSwitchArticle = (article: Article) => {
        setSelectedArticle(article);
        if (modalScrollRef.current) {
            modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <AppHeaderLayout breadcrumbs={[{ title: 'Articles', href: '/blog' }]}>
            <Head title="Coffee Articles" />

            <div className="min-h-screen bg-white font-sans text-gray-800">
                <main>
                    {/* --- HERO SECTION --- */}
                    <section className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden bg-[#0f172a]">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-1000 hover:scale-105"
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop')`,
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>

                        <div className="relative z-10 container px-4 text-center">
                            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-6xl">
                                Insights & Brewing Guides
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200">
                                Discover the world of coffee through expert insights, brewing guides, and industry knowledge
                            </p>

                            <div className="relative mx-auto w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search in this page..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-full border-0 bg-white/95 px-6 py-4 pl-12 text-sm text-gray-800 shadow-xl backdrop-blur transition-all placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#2E236C] focus:outline-none"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </section>

                    {/* --- ARTICLES GRID --- */}
                    <div className="container mx-auto px-4 py-20">
                        {filteredArticles.length > 0 ? (
                            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredArticles.map((article, index) => (
                                    <div
                                        key={article.id}
                                        className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-2xl"
                                    >
                                        <div className="relative h-[360px] w-full shrink-0 overflow-hidden bg-gray-100">
                                            <img
                                                src={getImageUrl(article, index)}
                                                alt={article.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {article.category && (
                                                <span className="absolute top-6 left-6 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#2E236C] uppercase shadow-sm backdrop-blur-sm">
                                                    {article.category.name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col p-8">
                                            <div className="mb-5 flex flex-col gap-1">
                                                <span className="text-sm leading-none font-bold text-gray-900">{article.author.name}</span>
                                                <span className="text-xs font-medium text-gray-500">
                                                    {article.published_at ? format(new Date(article.published_at), 'MMM dd, yyyy') : 'Recent'}
                                                </span>
                                            </div>
                                            <h3 className="mb-3 text-xl leading-tight font-extrabold text-gray-900 transition-colors group-hover:text-[#2E236C]">
                                                {article.title}
                                            </h3>
                                            <p className="mb-8 line-clamp-2 text-sm leading-relaxed font-medium text-gray-500">{article.excerpt}</p>
                                            <div className="mt-auto">
                                                <button
                                                    onClick={() => setSelectedArticle(article)}
                                                    className={`inline-flex items-center justify-center rounded-full ${primaryColorClass} px-6 py-4 text-[11px] font-bold tracking-wide text-white uppercase shadow-md transition-all hover:gap-3 hover:bg-[#1e1555] hover:shadow-lg`}
                                                >
                                                    Read More
                                                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="mb-6 rounded-full bg-gray-50 p-6">
                                    <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-gray-900">No articles found on this page</h3>
                                <p className="max-w-md text-sm text-gray-500">
                                    We couldn't find "<strong>{searchTerm}</strong>" on the current page. <br />
                                    (Note: Searching only works for visible items).
                                </p>
                                <button onClick={() => setSearchTerm('')} className="mt-6 font-bold text-[#2E236C] hover:underline">
                                    Clear Search
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --- PAGINATION --- */}
                    {articles.links && articles.links.length > 3 && (
                        <div className="flex items-center justify-center space-x-3 py-8 pb-24">
                            {articles.links.map((link, index) => {
                                const label = decodeHtml(link.label);
                                const isPrev = label.includes('Previous');
                                const isNext = label.includes('Next');
                                if (isPrev || isNext) {
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            as="button"
                                            disabled={!link.url}
                                            className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white transition-all hover:bg-[#2E236C] hover:text-white disabled:opacity-40`}
                                        >
                                            {isPrev ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </Link>
                                    );
                                }
                                return link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${link.active ? 'bg-[#2E236C] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {label}
                                    </Link>
                                ) : (
                                    <span key={index} className="px-2 text-gray-400">
                                        ...
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </main>

                {/* --- MODAL POPUP --- */}
                {selectedArticle && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-white/60 backdrop-blur-md transition-opacity"
                            onClick={() => setSelectedArticle(null)}
                        ></div>

                        {/* Modal Container */}
                        <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl ring-1 ring-gray-100">
                            {/* Scrollable Area */}
                            <div ref={modalScrollRef} className="scrollbar-hide flex-1 overflow-y-auto px-4 py-10 sm:px-12">
                                {/* 1. HEADER: Title & Close Button */}
                                <div className="relative mb-8 text-center">
                                    <h2 className={`text-2xl font-bold ${textPrimaryColorClass} px-8 md:text-3xl`}>{selectedArticle.title}</h2>
                                    <button
                                        onClick={() => setSelectedArticle(null)}
                                        className="absolute -top-2 right-0 p-2 text-gray-400 transition-colors hover:text-[#2E236C]"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* 2. META INFO: Author & Date */}
                                <div className="mb-10 flex w-full items-center justify-between border-t border-transparent pt-2">
                                    <span className="text-[10px] font-bold tracking-wider text-[#2E236C] uppercase sm:text-xs">
                                        {selectedArticle.author.name}
                                    </span>
                                    <span className="text-[10px] font-bold tracking-wider text-[#2E236C] uppercase sm:text-xs">
                                        {selectedArticle.published_at ? format(new Date(selectedArticle.published_at), 'MMMM dd, yyyy') : 'Recent'}
                                    </span>
                                </div>

                                {/* 3. FEATURED IMAGE */}
                                <div className="mb-12 flex justify-center">
                                    <div className="w-full max-w-sm rounded-xl bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-gray-50">
                                        <img
                                            src={getImageUrl(
                                                selectedArticle,
                                                articles.data.findIndex((a) => a.id === selectedArticle.id),
                                            )}
                                            alt={selectedArticle.title}
                                            className="aspect-[4/5] w-full rounded-lg object-cover sm:aspect-square"
                                        />
                                    </div>
                                </div>

                                {/* 4. CONTENT AREA */}
                                <div className="mx-auto mb-16 max-w-2xl" dangerouslySetInnerHTML={{ __html: getDummyContent() }} />

                                {/* 5. RELATED ARTICLES (Footer) */}
                                <div className="mt-12 pt-8">
                                    <h3 className={`text-center text-2xl font-bold ${textPrimaryColorClass} mb-12`}>Another Articles</h3>

                                    <div className="grid gap-8 sm:grid-cols-2">
                                        {articles.data
                                            .filter((a) => a.id !== selectedArticle?.id)
                                            .slice(0, 2)
                                            .map((related, idx) => (
                                                <div
                                                    key={related.id}
                                                    className="group flex flex-col overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-md transition-all hover:shadow-xl"
                                                >
                                                    {/* Image Full Width Top */}
                                                    <div className="h-56 w-full overflow-hidden">
                                                        <img
                                                            src={getImageUrl(related, idx + 3)}
                                                            alt={related.title}
                                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    </div>

                                                    {/* Content Bottom */}
                                                    <div className="flex flex-1 flex-col p-6">
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <span className="text-[10px] font-bold text-gray-500">{related.author.name}</span>
                                                            <span className="text-[10px] text-gray-400">
                                                                {related.published_at ? format(new Date(related.published_at), 'MMM dd, yyyy') : ''}
                                                            </span>
                                                        </div>
                                                        <h4 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-[#2E236C]">
                                                            {related.title}
                                                        </h4>
                                                        <p className="mb-6 line-clamp-2 text-xs font-medium text-gray-500">
                                                            {related.excerpt || 'Learn about the intricate process of coffee brewing and roasting...'}
                                                        </p>

                                                        {/* --- UPDATED BUTTON STYLE HERE --- */}
                                                        <button
                                                            onClick={() => handleSwitchArticle(related)}
                                                            className={`mt-auto w-fit rounded-full ${primaryColorClass} flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#1e1555]`}
                                                        >
                                                            Read More <ArrowRight className="h-3 w-3" />
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
