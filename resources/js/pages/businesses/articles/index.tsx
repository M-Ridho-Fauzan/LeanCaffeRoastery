import { Article, ArticleIndexPageProps, PaginationLinks, PaginationMeta } from '@/types';

import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowRight, Play, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ArticleDetailModalProps {
    article: Article | null;
    allArticles: Article[];
    onClose: () => void;
    onViewRelated: (article: Article) => void;
}

interface PaginationProps {
    links: PaginationLinks;
    meta: {
        current_page: PaginationMeta['current_page'];
        last_page: PaginationMeta['last_page'];
    };
}

// --- COMPONENT: Pagination (Responsive) ---
function PaginationComponent({ links, meta }: PaginationProps) {
    const { current_page, last_page } = meta;

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, current_page - 2);
        const end = Math.min(last_page, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push('...');
            }
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < last_page) {
            if (end < last_page - 1) {
                pages.push('...');
            }
            pages.push(last_page);
        }

        return pages;
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 py-8 pb-16 sm:gap-3 sm:py-10 sm:pb-20">
            {/* Previous Button */}
            <Link
                href={links.prev || '#'}
                as="button"
                preserveScroll
                disabled={!links.prev}
                className={`flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all sm:h-10 sm:w-10 ${
                    !links.prev ? 'cursor-not-allowed opacity-30' : 'hover:border-[#303182] hover:bg-gray-50'
                }`}
            >
                <Play className="h-3 w-3 rotate-180 fill-[#303182] text-[#303182] sm:h-4 sm:w-4" />
            </Link>

            {/* Page Numbers */}
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                {generatePageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="flex h-8 w-8 items-center justify-center text-xs text-gray-400 sm:h-9 sm:w-9 sm:text-sm"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = page === current_page;

                    return (
                        <Link
                            key={`page-${page}`}
                            href={`/blog?page=${page}`}
                            preserveScroll
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors sm:h-9 sm:w-9 sm:text-sm ${
                                isActive
                                    ? 'border-[#303182] bg-[#303182] text-white shadow-sm'
                                    : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            <Link
                href={links.next || '#'}
                as="button"
                preserveScroll
                disabled={!links.next}
                className={`flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all sm:h-10 sm:w-10 ${
                    !links.next ? 'cursor-not-allowed opacity-30' : 'hover:border-[#303182] hover:bg-gray-50'
                }`}
            >
                <Play className="h-3 w-3 fill-[#303182] text-[#303182] sm:h-4 sm:w-4" />
            </Link>
        </div>
    );
}

// --- ARTICLE DETAIL MODAL (Fully Responsive) ---
function ArticleDetailModal({ article, allArticles, onClose, onViewRelated }: ArticleDetailModalProps) {
    if (!article) return null;

    const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 2);

    const resolveImageUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('/storage/https://') || url.includes('/storage/http://')) {
            return url.replace('/storage/', '');
        }
        return url;
    };

    return (
        // Wrapper: Padding 0 di mobile (full screen), Padding 4 di sm ke atas (modal look)
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal Container: h-[100dvh] di mobile, rounded-none di mobile */}
            <div className="relative z-10 flex h-[100dvh] w-full max-w-4xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-2xl">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-8">
                    {/* Header: Flex Row untuk Title & Close Button */}
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <h2 className="flex-1 text-center text-xl leading-tight font-bold text-[#303182] sm:text-2xl md:text-3xl">{article.title}</h2>
                        {/* Tombol Close Statis di pojok kanan layout flex */}
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
                        >
                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                    </div>

                    {/* Metadata */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-y-2 border-b border-gray-100 pb-4 text-[10px] font-medium tracking-wider text-gray-500 uppercase sm:text-xs">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#303182] text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm">
                                {article.author.name.charAt(0)}
                            </div>
                            <span>{article.author.name}</span>
                        </div>
                        <span>
                            {article.published_at
                                ? format(new Date(article.published_at), 'MMM dd, yyyy')
                                : format(new Date(article.created_at), 'MMM dd, yyyy')}
                        </span>
                    </div>

                    {/* Featured Image */}
                    {article.featured_image_url && (
                        <div className="mb-6 flex justify-center sm:mb-8">
                            <div className="w-full max-w-2xl overflow-hidden rounded-xl shadow-sm">
                                <img
                                    src={resolveImageUrl(article.featured_image_url)}
                                    alt={article.title}
                                    className="h-auto w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://placehold.co/640x480/5c5e5e/transparent?text=image+error';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="prose prose-sm sm:prose-base max-w-none leading-relaxed text-gray-700">
                        <p className="text-base sm:text-lg">{article.excerpt}</p>

                        <div className="mt-8 rounded-lg bg-gray-50 p-4 text-center text-xs text-gray-500 sm:p-6 sm:text-sm">
                            <p>
                                To view the full content, please ensure the backend API includes a 'content' field, or fetch the single article
                                details.
                            </p>
                        </div>
                    </div>

                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                        <div className="mt-8 border-t border-gray-200 pt-8 sm:mt-12">
                            <h3 className="mb-4 text-center text-lg font-bold text-[#303182] sm:mb-6 sm:text-2xl">Another Articles</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                {relatedArticles.map((related, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="h-40 overflow-hidden bg-gray-100 sm:h-48">
                                            {related.featured_image_url ? (
                                                <img
                                                    src={related.featured_image_url}
                                                    alt={related.title}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Image</div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col p-3 sm:p-4">
                                            <div className="mb-2 text-[10px] text-gray-500 sm:text-xs">
                                                <span className="font-bold">{related.author.name}</span> •{' '}
                                                {related.published_at ? format(new Date(related.published_at), 'MMM dd, yyyy') : 'Recent'}
                                            </div>
                                            <h4 className="mb-2 line-clamp-1 text-sm font-bold text-[#303182] sm:text-base">{related.title}</h4>
                                            <p className="mb-3 line-clamp-2 text-xs text-gray-600">{related.excerpt}</p>
                                            <button
                                                onClick={() => onViewRelated(related)}
                                                className="mt-auto self-start rounded-full bg-[#303182] px-3 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-[#202160] sm:px-4 sm:text-xs"
                                            >
                                                Read More →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- MAIN PAGE COMPONENT ---
export default function Index({ articles }: ArticleIndexPageProps) {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

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
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-white font-sans">
                <main className="bg-white text-[#303182]">
                    {/* Hero Section Responsive */}
                    <section
                        className="relative flex h-[250px] w-full flex-col items-center justify-center bg-cover bg-center p-4 text-white sm:h-[300px] md:h-[350px]"
                        style={{
                            backgroundImage: `url(https://placehold.co/1200x350/343a40/ffffff?text=Coffee+Background)`,
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="relative z-10 w-full max-w-3xl text-center">
                            <h1 className="mb-2 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">Coffee Articles & Insights</h1>
                            <p className="mb-6 text-sm text-gray-100 sm:text-base md:text-lg">
                                Discover the world of coffee through expert insights and brewing guides
                            </p>

                            <div className="relative mx-auto w-full max-w-xs sm:max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search Articles..."
                                    className="w-full rounded-full bg-white/95 p-2.5 pl-9 text-sm text-gray-800 shadow-lg backdrop-blur-sm focus:ring-2 focus:ring-[#6B4F3A] focus:outline-none sm:p-3 sm:pl-10 sm:text-base"
                                />
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
                                    className="lucide lucide-search absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 sm:h-5 sm:w-5"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </div>
                        </div>
                    </section>

                    {/* Articles Grid Responsive */}
                    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 md:py-16">
                        {articles.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                                {articles.data.map((article) => (
                                    <div
                                        key={article.id}
                                        className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl"
                                    >
                                        {/* Image Aspect Ratio: 16:9 on Mobile (Less height), 4:3 or 3:4 on Desktop */}
                                        <div className="aspect-video w-full overflow-hidden bg-gray-100 sm:aspect-[4/3]">
                                            {article.featured_image_url ? (
                                                <img
                                                    src={article.featured_image_url}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-[#2e236c]/10 text-xs text-[#2e236c]/40 sm:text-sm">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                                            {/* Author & Date */}
                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="text-xs font-bold text-gray-900 sm:text-sm">{article.author.name}</div>
                                                <div className="text-[10px] font-medium text-gray-400 sm:text-xs">
                                                    {article.published_at
                                                        ? format(new Date(article.published_at), 'MMM dd, yyyy')
                                                        : format(new Date(article.created_at), 'MMM dd, yyyy')}
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3
                                                className="mb-2 line-clamp-2 text-base font-extrabold text-[#1a1a1a] sm:text-lg"
                                                title={article.title}
                                            >
                                                {article.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-gray-600 sm:mb-5 sm:text-sm">
                                                {article.excerpt || 'No description available for this article.'}
                                            </p>

                                            {/* Action Button */}
                                            <button
                                                onClick={() => setSelectedArticle(article)}
                                                className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#303182] px-4 py-2 text-[10px] font-bold text-white transition-colors hover:bg-[#232360] sm:px-6 sm:py-2.5 sm:text-xs"
                                            >
                                                Read More
                                                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
                                <p className="mt-1 text-sm text-gray-500">Check back later for new content.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {articles.meta.last_page > 1 && (
                        <PaginationComponent
                            links={articles.links}
                            meta={{
                                current_page: articles.meta.current_page,
                                last_page: articles.meta.last_page,
                            }}
                        />
                    )}
                </main>

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
