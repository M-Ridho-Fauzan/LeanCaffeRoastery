import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Article, ArticleIndexPageProps, PaginationLinks, PaginationMeta } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowRight, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

// IMPORT MODAL YANG BARU DIBUAT
import ArticleDetailModal from './show';

interface PaginationProps {
    links: PaginationLinks;
    meta: {
        current_page: PaginationMeta['current_page'];
        last_page: PaginationMeta['last_page'];
    };
}

// --- COMPONENT: Pagination (Bisa dipisah juga ke file lain jika mau lebih bersih lagi) ---
function PaginationComponent({ links, meta }: PaginationProps) {
    const { current_page, last_page } = meta;
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, current_page - 2);
        const end = Math.min(last_page, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < last_page) {
            if (end < last_page - 1) pages.push('...');
            pages.push(last_page);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-3 py-10 pb-20">
            <Link
                href={links.prev || '#'}
                as="button"
                preserveScroll
                disabled={!links.prev}
                className={`flex items-center justify-center transition-opacity ${!links.prev ? 'cursor-not-allowed opacity-30' : 'hover:opacity-75'}`}
            >
                <Play className="h-5 w-5 rotate-180 fill-[#303182] text-[#303182]" />
            </Link>
            <div className="flex items-center gap-2">
                {generatePageNumbers().map((page, index) => {
                    if (page === '...')
                        return (
                            <span key={`ellipsis-${index}`} className="flex h-9 w-9 items-center justify-center text-gray-400">
                                ...
                            </span>
                        );
                    const isActive = page === current_page;
                    return (
                        <Link
                            key={`page-${page}`}
                            href={`/blog?page=${page}`}
                            preserveScroll
                            className={`flex h-9 w-9 items-center justify-center rounded border text-sm font-semibold transition-colors ${isActive ? 'border-[#303182] bg-[#303182] text-white shadow-sm' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>
            <Link
                href={links.next || '#'}
                as="button"
                preserveScroll
                disabled={!links.next}
                className={`flex items-center justify-center transition-opacity ${!links.next ? 'cursor-not-allowed opacity-30' : 'hover:opacity-75'}`}
            >
                <Play className="h-5 w-5 fill-[#303182] text-[#303182]" />
            </Link>
        </div>
    );
}

// --- MAIN PAGE COMPONENT ---
export default function Index({ articles }: ArticleIndexPageProps) {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // Effect untuk mematikan scroll saat modal terbuka
    useEffect(() => {
        if (selectedArticle) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedArticle]);

    return (
        <AppHeaderLayout breadcrumbs={[{ title: 'Articles', href: '/blog' }]}>
            <Head title="Articles">
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

                    {/* Articles Grid */}
                    <div className="container mx-auto px-4 py-16">
                        {articles.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {articles.data.map((article) => (
                                    <div
                                        key={article.id}
                                        className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition-all hover:shadow-xl"
                                    >
                                        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                            {article.featured_image_url ? (
                                                <img
                                                    src={article.featured_image_url}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-[#2e236c]/10 text-sm text-[#2e236c]/40">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col p-6">
                                            <div className="mb-1 text-xs font-semibold text-gray-900">{article.author.name}</div>
                                            <div className="mb-3 text-[10px] font-medium text-gray-500">
                                                {article.published_at
                                                    ? format(new Date(article.published_at), 'MMM dd, yyyy')
                                                    : format(new Date(article.created_at), 'MMM dd, yyyy')}
                                            </div>
                                            <h3 className="mb-2 line-clamp-2 text-lg font-extrabold text-[#1a1a1a]" title={article.title}>
                                                {article.title}
                                            </h3>
                                            <p className="mb-5 line-clamp-3 text-xs leading-relaxed text-gray-600">
                                                {article.excerpt || 'No description available.'}
                                            </p>

                                            {/* Button Membuka Modal */}
                                            <button
                                                onClick={() => setSelectedArticle(article)}
                                                className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#303182] px-6 py-2.5 text-[10px] font-bold text-white transition-colors hover:bg-[#232360]"
                                            >
                                                Read More
                                                <ArrowRight className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <h3 className="text-xl font-medium text-gray-500">No articles found.</h3>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {articles.meta.last_page > 1 && (
                        <PaginationComponent
                            links={articles.links}
                            meta={{ current_page: articles.meta.current_page, last_page: articles.meta.last_page }}
                        />
                    )}
                </main>

                {/* PEMANGGILAN KOMPONEN MODAL YANG BARU */}
                <ArticleDetailModal
                    article={selectedArticle}
                    allArticles={articles.data}
                    onClose={() => setSelectedArticle(null)}
                    onViewRelated={setSelectedArticle}
                />
            </div>
        </AppHeaderLayout>
    );
}
