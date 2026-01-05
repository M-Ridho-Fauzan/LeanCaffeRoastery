import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowRight, Play, X } from 'lucide-react'; // Tambah Play & ArrowRight
import { useEffect, useState } from 'react';

// --- 1. Tipe Data (TIDAK BERUBAH) ---
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
    allArticles: Article[];
    onClose: () => void;
    onViewRelated: (article: Article) => void;
}

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

// --- COMPONENT: Pagination (Logic SAMA, Tampilan disesuaikan Gambar) ---
function PaginationComponent({ links, meta }: PaginationProps) {
    const { current_page, last_page } = meta;

    // Logic generate halaman (TIDAK BERUBAH)
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
        // Mengubah container agar tombol terpisah (gap-2) sesuai gambar, bukan menyatu
        <div className="flex items-center justify-center gap-3 py-10 pb-20">
            {/* Previous Button (Triangle Left) */}
            <Link
                href={links.prev || '#'}
                as="button"
                preserveScroll
                disabled={!links.prev}
                className={`flex items-center justify-center transition-opacity ${
                    !links.prev ? 'cursor-not-allowed opacity-30' : 'hover:opacity-75'
                }`}
            >
                {/* Icon Play diputar 180 derajat agar jadi segitiga kiri */}
                <Play className="h-5 w-5 rotate-180 fill-[#303182] text-[#303182]" />
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
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
                            // Style kotak: Border solid jika aktif, rounded kecil
                            className={`flex h-9 w-9 items-center justify-center rounded border text-sm font-semibold transition-colors ${
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

            {/* Next Button (Triangle Right) */}
            <Link
                href={links.next || '#'}
                as="button"
                preserveScroll
                disabled={!links.next}
                className={`flex items-center justify-center transition-opacity ${
                    !links.next ? 'cursor-not-allowed opacity-30' : 'hover:opacity-75'
                }`}
            >
                <Play className="h-5 w-5 fill-[#303182] text-[#303182]" />
            </Link>
        </div>
    );
}

// --- ARTICLE DETAIL MODAL (TIDAK BERUBAH) ---
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="mb-6 flex items-start justify-between">
                        <h2 className="w-full text-center text-3xl font-bold text-[#303182]">{article.title}</h2>
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

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

                    {article.featured_image_url && (
                        <div className="mb-8 flex justify-center">
                            <div className="w-full max-w-lg overflow-hidden rounded-lg shadow-md">
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

                    <div className="prose max-w-none leading-relaxed text-gray-700">
                        <p className="text-lg">{article.excerpt}</p>

                        <div className="mt-8 rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
                            <p>
                                To view the full content, please ensure the backend API includes a 'content' field, or fetch the single article
                                details.
                            </p>
                        </div>
                    </div>

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

// --- MAIN PAGE COMPONENT ---
export default function Index({ articles }: PageProps) {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    useEffect(() => {
        console.log('Articles Links Data from Inertia:', articles.links);
    }, [articles.links]);

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
                    {/* Hero Section (Tetap ada sesuai permintaan "tidak merubah yang sebelumnya") */}
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

                    {/* Articles Grid (BAGIAN INI YANG DIUBAH MENJADI CARD STYLE BARU) */}
                    <div className="container mx-auto px-4 py-16">
                        {articles.data.length > 0 ? (
                            // Ubah gap agar lebih lega seperti gambar
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {articles.data.map((article) => (
                                    <div
                                        key={article.id}
                                        // Ubah style card wrapper: Rounded lebih besar (rounded-[2rem]), shadow lebih soft
                                        className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition-all hover:shadow-xl"
                                    >
                                        {/* Logic Gambar: Aspect ratio Portrait (3/4 atau 4/5) untuk vertikal */}
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

                                        {/* Content: Layout diubah total agar sesuai gambar */}
                                        <div className="flex flex-1 flex-col p-6">
                                            {/* 1. Author Name (Kecil, Paling Atas) */}
                                            <div className="mb-1 text-xs font-semibold text-gray-900">{article.author.name}</div>

                                            {/* 2. Date (Kecil, di bawah Author) */}
                                            <div className="mb-3 text-[10px] font-medium text-gray-500">
                                                {article.published_at
                                                    ? format(new Date(article.published_at), 'MMM dd, yyyy')
                                                    : format(new Date(article.created_at), 'MMM dd, yyyy')}
                                            </div>

                                            {/* 3. Title (Bold) */}
                                            <h3 className="mb-2 line-clamp-2 text-lg font-extrabold text-[#1a1a1a]" title={article.title}>
                                                {article.title}
                                            </h3>

                                            {/* 4. Excerpt (Abu-abu, kecil) */}
                                            <p className="mb-5 line-clamp-3 text-xs leading-relaxed text-gray-600">
                                                {article.excerpt || 'No description available.'}
                                            </p>

                                            {/* 5. Action Button (Pill Shape / Bulat Lonjong, Solid Color) */}
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
