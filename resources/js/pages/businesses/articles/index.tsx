import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// --- 1. Perbaiki Tipe Data untuk Pagination ---
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

// Struktur Pagination yang sesuai dengan data dari backend
interface PageProps {
    articles: {
        data: Article[];
        links: {
            first: string | null;
            last: string | null;
            prev: string | null;
            next: string | null;
        };
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
            from?: number;
            to?: number;
            path?: string;
            first_page_url?: string;
            last_page_url?: string;
            next_page_url?: string | null;
            prev_page_url?: string | null;
        };
    };
}

interface ArticleDetailModalProps {
    article: Article | null;
    allArticles: Article[]; // Digunakan untuk menampilkan "Another Articles"
    onClose: () => void;
    onViewRelated: (article: Article) => void;
}

// --- COMPONENT: Pagination dengan shadcn/ui style ---
interface PaginationProps {
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        last_page: number;
    };
}

function PaginationComponent({ links, meta }: PaginationProps) {
    const { current_page, last_page } = meta;

    // Generate array of page numbers
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // Jumlah halaman yang ditampilkan
        let start = Math.max(1, current_page - 2);
        const end = Math.min(last_page, start + maxVisible - 1);

        // Adjust start if we're near the end
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        // Add first page with ellipsis if needed
        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push('...');
            }
        }

        // Add middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add last page with ellipsis if needed
        if (end < last_page) {
            if (end < last_page - 1) {
                pages.push('...');
            }
            pages.push(last_page);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center py-8 pb-16">
            <div className="flex items-center space-x-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                {/* Previous Button */}
                <Link
                    href={links.prev || '#'}
                    as="button"
                    preserveScroll
                    disabled={!links.prev}
                    className={`flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-sm font-medium transition-colors ${
                        !links.prev ? 'cursor-not-allowed text-gray-400 opacity-50' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    } `}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Link>

                {/* Page Numbers */}
                {generatePageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="flex h-9 w-9 items-center justify-center text-gray-400">
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
                            className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                                isActive
                                    ? 'border border-[#303182] bg-[#303182] text-white shadow-sm'
                                    : 'border border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            } `}
                        >
                            {page}
                        </Link>
                    );
                })}

                {/* Next Button */}
                <Link
                    href={links.next || '#'}
                    as="button"
                    preserveScroll
                    disabled={!links.next}
                    className={`flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-sm font-medium transition-colors ${
                        !links.next ? 'cursor-not-allowed text-gray-400 opacity-50' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    } `}
                >
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            {/* Optional: Show page info */}
            {last_page > 1 && (
                <div className="ml-4 text-sm text-gray-500">
                    Page <span className="font-medium">{current_page}</span> of <span className="font-medium">{last_page}</span>
                </div>
            )}
        </div>
    );
}

// --- ARTICLE DETAIL MODAL / POPUP COMPONENT (Dipisahkan) ---
function ArticleDetailModal({ article, allArticles, onClose, onViewRelated }: ArticleDetailModalProps) {
    if (!article) return null;

    const relatedArticles = allArticles
        .filter((a) => a.id !== article.id) // Jangan tampilkan artikel yang sedang dibuka
        .slice(0, 2); // Ambil 2 saja

    const resolveImageUrl = (url: string) => {
        if (!url) return '';

        // Jika salah: /storage/https://...
        if (url.includes('/storage/https://') || url.includes('/storage/http://')) {
            return url.replace('/storage/', '');
        }

        return url;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Header Modal */}
                    <div className="mb-6 flex items-start justify-between">
                        <h2 className="w-full text-center text-3xl font-bold text-[#303182]">{article.title}</h2>
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Meta Info (Author & Date) */}
                    <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#303182] font-bold text-white">
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

                    {/* Main Image Modal */}
                    {article.featured_image_url && (
                        // (console.log(resolveImageUrl(article.featured_image_url)))
                        <div className="mb-8 flex justify-center">
                            <div className="w-full max-w-lg overflow-hidden rounded-lg shadow-md">
                                {article.featured_image_url ? (
                                    <img
                                        // src={
                                        //     article.featured_image_url?.startsWith('/storage/http')
                                        //         ? article.featured_image_url.replace('/storage/', '')
                                        //         : article.featured_image_url
                                        // }
                                        src={resolveImageUrl(article.featured_image_url)}
                                        alt={article.title}
                                        className="h-auto w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/640x480/5c5e5e/transparent?text=image+error';
                                        }}
                                    />
                                ) : (
                                    <img
                                        src="https://placehold.co/640x480/5c5e5e/transparent?text=No+Image"
                                        alt="No Image"
                                        className="h-auto w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/640x480/5c5e5e/transparent?text=image+error';
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Article Body Text */}
                    <div className="prose max-w-none leading-relaxed text-gray-700">
                        <p className="text-lg">{article.excerpt}</p>

                        <div className="mt-8 rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
                            <p>
                                To view the full content, please ensure the backend API includes a 'content' field, or fetch the single article
                                details.
                            </p>
                        </div>
                    </div>

                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                        <div className="mt-12 border-t border-gray-200 pt-8">
                            <h3 className="mb-6 text-center text-2xl font-bold text-[#303182]">Another Articles</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {relatedArticles.map((related, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="h-48 overflow-hidden bg-gray-100">
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
                                        <div className="flex flex-1 flex-col p-4">
                                            <div className="mb-2 text-xs text-gray-500">
                                                <span className="font-bold">{related.author.name}</span> •{' '}
                                                {related.published_at ? format(new Date(related.published_at), 'MMM dd, yyyy') : 'Recent'}
                                            </div>
                                            <h4 className="mb-2 line-clamp-1 text-sm font-bold text-[#303182]">{related.title}</h4>
                                            <p className="mb-4 line-clamp-2 text-xs text-gray-600">{related.excerpt}</p>
                                            <button
                                                onClick={() => onViewRelated(related)}
                                                className="mt-auto self-start rounded-full bg-[#303182] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#202160]"
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
// --- AKHIR ARTICLE DETAIL MODAL COMPONENT ---
export default function Index({ articles }: PageProps) {
    // State untuk menyimpan artikel yang sedang dipilih (Modal)
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // DEBUG: Log links ke console untuk verifikasi data paginasi
    useEffect(() => {
        console.log('Articles Links Data from Inertia:', articles.links);
    }, [articles.links]);

    // Disable scroll background saat modal terbuka
    useEffect(() => {
        if (selectedArticle) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function
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
                    {/* Hero Section (omitted for brevity, no changes) */}
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

                            {/* Search Input Visual Only */}
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
                    <div className="z-40 container mb-60 px-4 py-16">
                        {articles.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {articles.data.map((article) => (
                                    <div
                                        key={article.id}
                                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all hover:shadow-xl"
                                    >
                                        <div className="group aspect-video overflow-hidden rounded-t-xl bg-gray-100">
                                            {/* Logic Gambar: Menggunakan featured_image_url */}
                                            {article.featured_image_url ? (
                                                <img
                                                    src={article.featured_image_url}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-[#2e236c]/10 text-sm text-[#2e236c]/40">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 text-gray-800">
                                            {/* Metadata: Category & Date */}
                                            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                                                {article.category ? (
                                                    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-bold text-[#303182] uppercase">
                                                        {article.category.name}
                                                    </span>
                                                ) : (
                                                    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium">Uncategorized</span>
                                                )}
                                                <span>•</span>
                                                <span>
                                                    {article.published_at
                                                        ? format(new Date(article.published_at), 'MMM dd, yyyy')
                                                        : format(new Date(article.created_at), 'MMM dd, yyyy')}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="mb-3 line-clamp-2 text-xl font-bold text-[#303182]" title={article.title}>
                                                {article.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="mb-4 line-clamp-3 text-gray-600">{article.excerpt || 'No description available.'}</p>

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
                        ) : (
                            <div className="py-20 text-center">
                                <h3 className="text-xl font-medium text-gray-500">No articles found.</h3>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls (Menggunakan Link dari Laravel) */}
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

                {/* --- ARTICLE DETAIL MODAL / POPUP --- */}
                <ArticleDetailModal
                    article={selectedArticle}
                    allArticles={articles.data}
                    onClose={() => setSelectedArticle(null)}
                    onViewRelated={setSelectedArticle} // Ganti artikel yang sedang dilihat
                />
            </div>
        </AppHeaderLayout>
    );
}
