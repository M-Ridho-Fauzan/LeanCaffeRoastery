import { Article } from '@/types';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface ArticleDetailModalProps {
    article: Article | null;
    allArticles: Article[];
    onClose: () => void;
    onViewRelated: (article: Article) => void;
}

export default function ArticleDetailModal({ article, allArticles, onClose, onViewRelated }: ArticleDetailModalProps) {
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
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Header */}
                    <div className="mb-6 flex items-start justify-between">
                        <h2 className="w-full text-center text-3xl font-bold text-[#303182]">{article.title}</h2>
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Author & Date */}
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

                    {/* Image */}
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

                    {/* Content Body */}
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
