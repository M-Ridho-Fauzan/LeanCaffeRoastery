import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { pickBy, throttle } from 'lodash';
import { CloudUpload, Filter, Plus, Search, SquarePen, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// --- Definisi Tipe ---
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

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ArticlesIndexSpecificProps {
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
    filters: {
        search?: string;
        category?: string;
        status?: 'draft' | 'published' | 'archived';
    };
    categories: {
        data: Category[];
    };
    statuses: ('draft' | 'published' | 'archived')[];
    breadcrumbs: BreadcrumbItem[];
}

type ArticlesIndexPageProps = PageProps & ArticlesIndexSpecificProps;

export default function ArticleIndex({ articles, filters, categories, statuses, breadcrumbs, flash }: ArticlesIndexPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

    // State untuk Dialog Delete
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

    // State untuk Dialog Add Article
    const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);

    // --- STATE BARU UNTUK EDIT ---
    const [isEditArticleOpen, setIsEditArticleOpen] = useState(false);
    const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);

    const { delete: inertiaDelete, processing, errors } = useForm();

    const throttledApplyFilters = useRef(
        throttle((s: string, c: string, st: string) => {
            router.get(
                route('editor.articles.index'),
                pickBy(
                    {
                        search: s,
                        category: c !== 'all' ? c : undefined,
                        status: st !== 'all' ? st : undefined,
                    },
                    (value) => value !== undefined && value !== '',
                ),
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                },
            );
        }, 300),
    ).current;

    useEffect(() => {
        throttledApplyFilters(search, selectedCategory, selectedStatus);
        return () => {
            throttledApplyFilters.cancel();
        };
    }, [search, selectedCategory, selectedStatus, throttledApplyFilters]);

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
        if (flash.message) toast.info(flash.message);
    }, [flash]);

    const handleDeleteClick = (article: Article) => {
        setArticleToDelete(article);
        setIsDeleteDialogOpen(true);
    };

    // --- HANDLER BARU UNTUK EDIT ---
    const handleEditClick = (article: Article) => {
        setArticleToEdit(article);
        setIsEditArticleOpen(true);
    };

    const confirmDelete = () => {
        if (articleToDelete) {
            inertiaDelete(route('editor.articles.destroy', articleToDelete.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setArticleToDelete(null);
                    toast.success(`Article "${articleToDelete.title}" deleted successfully.`);
                    router.reload();
                },
                onError: (errorResponse) => {
                    setIsDeleteDialogOpen(false);
                    const errorMessage = Object.values(errorResponse).flat().join('\n') || 'Failed to delete article.';
                    toast.error(errorMessage);
                },
            });
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Article List" />

            <div className="flex h-full flex-col p-4">
                <div className="min-h-[85vh] w-full rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-[#2e236c] dark:text-white">Article List</h1>
                    </div>

                    <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="relative w-full md:w-1/2">
                            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#2e236c]" />
                            <input
                                type="text"
                                placeholder="Search Articles"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-full border border-[#2e236c]/40 bg-transparent py-2.5 pr-4 pl-12 text-sm text-[#2e236c] placeholder:text-[#2e236c]/60 focus:ring-2 focus:ring-[#2e236c]/20 focus:outline-none"
                            />
                        </div>

                        <div className="w-full md:w-auto">
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="h-11 w-full rounded-full border border-[#2e236c]/40 px-6 text-[#2e236c]/70 md:min-w-[200px]">
                                    <div className="flex items-center gap-3">
                                        <Filter className="h-4 w-4" />
                                        <SelectValue placeholder="All Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    {statuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mb-8">
                        <button
                            onClick={() => setIsAddArticleOpen(true)}
                            className="flex items-center gap-2 rounded-full bg-[#2e236c] px-6 py-2.5 text-sm text-white shadow-sm transition-colors hover:bg-[#2e236c]/90"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Add Article</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="text-sm font-bold text-[#2e236c]">
                                    <th className="w-[40%] py-4 pr-4">Article</th>
                                    <th className="px-4 py-4">Author</th>
                                    <th className="px-4 py-4">Date</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="py-4 pl-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {articles.data.length > 0 ? (
                                    articles.data.map((article) => (
                                        <tr key={article.id} className="group hover:bg-gray-50/50">
                                            <td className="py-6 pr-4 align-top">
                                                <div className="flex gap-4">
                                                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
                                                        {article.featured_image_url ? (
                                                            <img
                                                                src={article.featured_image_url}
                                                                alt={article.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-[#2e236c]/10 text-xs text-[#2e236c]/40">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col justify-start">
                                                        <span className="mb-1 text-[15px] font-bold text-[#2e236c]">{article.title}</span>
                                                        <p className="line-clamp-2 text-xs leading-relaxed font-light text-gray-400">
                                                            {article.excerpt || 'No description available for this article.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6 align-middle font-medium text-[#2e236c]">{article.author.name}</td>
                                            <td className="px-4 py-6 align-middle font-medium whitespace-nowrap text-[#2e236c]">
                                                {article.published_at
                                                    ? format(new Date(article.published_at), 'MMM, dd yyyy')
                                                    : format(new Date(article.created_at), 'MMM, dd yyyy')}
                                            </td>
                                            <td className="px-4 py-6 align-middle">
                                                <span
                                                    className={`rounded-full px-5 py-1.5 text-xs font-medium text-white capitalize shadow-sm ${
                                                        article.status === 'published'
                                                            ? 'bg-[#32c945]'
                                                            : article.status === 'draft'
                                                              ? 'bg-[#ff5b5b]'
                                                              : 'bg-gray-400'
                                                    }`}
                                                >
                                                    {article.status}
                                                </span>
                                            </td>
                                            <td className="py-6 pl-4 text-right align-middle">
                                                <div className="flex items-center justify-end gap-3">
                                                    {/* TOMBOL PENSIL YANG DIMODIFIKASI UNTUK MEMICU EDIT POPUP */}
                                                    <button
                                                        onClick={() => handleEditClick(article)}
                                                        className="rounded-md border border-[#2e236c] p-1.5 text-[#2e236c] transition-colors hover:bg-[#2e236c] hover:text-white"
                                                    >
                                                        <SquarePen className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(article)}
                                                        className="p-1.5 text-[#2e236c] transition-colors hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-6 w-6" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400">
                                            No articles found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {articles.last_page > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination>
                                <div className="flex space-x-2">
                                    {articles.links.map((link, index) => {
                                        const params = new URLSearchParams(link.url ? new URL(link.url).search : '');
                                        if (search) params.set('search', search);
                                        else params.delete('search');
                                        if (selectedCategory !== 'all') params.set('category', selectedCategory);
                                        else params.delete('category');
                                        if (selectedStatus !== 'all') params.set('status', selectedStatus);
                                        else params.delete('status');
                                        const fullHref = `${route('editor.articles.index')}?${params.toString()}`;

                                        return link.url ? (
                                            <Link
                                                key={index}
                                                href={fullHref}
                                                className={`rounded-md border px-3 py-1 text-sm ${link.active ? 'border-[#2e236c] bg-[#2e236c] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="cursor-not-allowed rounded-md border px-3 py-1 text-sm text-gray-300"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>

            {/* --- DIALOG: ADD NEW ARTICLE (Tetap Ada) --- */}
            <Dialog open={isAddArticleOpen} onOpenChange={setIsAddArticleOpen}>
                <DialogContent className="max-h-[95vh] overflow-y-auto rounded-xl border-none bg-white p-0 shadow-2xl sm:max-w-xl">
                    <div className="flex items-center justify-between px-6 py-4">
                        <DialogTitle className="text-lg font-bold text-[#2e236c]">Add New Article</DialogTitle>
                    </div>
                    <div className="space-y-5 px-6 pb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#2e236c]">Article Title</label>
                            <input
                                type="text"
                                placeholder="Enter Title"
                                className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2.5 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#2e236c]">Description</label>
                            <textarea
                                rows={4}
                                placeholder="Article Description"
                                className="w-full resize-none rounded-2xl border border-[#2e236c]/60 px-4 py-3 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2e236c]">Author</label>
                                <input
                                    type="text"
                                    placeholder="Author Name"
                                    className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2.5 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2e236c]">Status</label>
                                <Select>
                                    <SelectTrigger className="h-[42px] w-full rounded-full border border-[#2e236c]/60 px-4 py-2 text-sm text-[#2e236c]/60 focus:ring-1 focus:ring-[#2e236c]">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-2 flex flex-col items-center rounded-lg border border-[#2e236c]/40 p-6 text-center">
                            <h4 className="mb-4 text-sm font-bold text-[#2e236c]">Upload</h4>
                            <div className="mb-6 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#2e236c]/20 bg-[#f8f9fc] px-4 py-8">
                                <div className="mb-3">
                                    <CloudUpload className="h-10 w-10 text-[#2e236c]/60" />
                                </div>
                                <p className="mb-1 text-xs font-bold text-black">
                                    Drag & drop files or <span className="cursor-pointer text-[#2e236c] underline">Browse</span>
                                </p>
                                <p className="text-[10px] text-gray-400">Supported formates: JPEG, PNG, JPG</p>
                            </div>
                            <button className="w-full rounded-lg bg-[#2e236c] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#2e236c]/90">
                                Upload File
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center pt-2 pb-8">
                        <button className="rounded-full bg-[#2e236c] px-12 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#2e236c]/90">
                            Save
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* --- DIALOG: EDIT ARTICLE (BARU) --- */}
            <Dialog open={isEditArticleOpen} onOpenChange={setIsEditArticleOpen}>
                <DialogContent className="max-h-[95vh] overflow-y-auto rounded-xl border-none bg-white p-0 shadow-2xl sm:max-w-xl">
                    <div className="flex items-center justify-between px-6 py-4">
                        <DialogTitle className="text-lg font-bold text-[#2e236c]">Edit Article</DialogTitle>
                    </div>

                    {articleToEdit && (
                        <div className="space-y-5 px-6 pb-6">
                            {/* Article Title (Pre-filled) */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2e236c]">Article Title</label>
                                <input
                                    type="text"
                                    defaultValue={articleToEdit.title}
                                    className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2.5 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                />
                            </div>

                            {/* Description (Pre-filled) */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2e236c]">Description</label>
                                <textarea
                                    rows={4}
                                    defaultValue={articleToEdit.excerpt}
                                    className="w-full resize-none rounded-2xl border border-[#2e236c]/60 px-4 py-3 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                />
                            </div>

                            {/* Row: Author & Status (Pre-filled) */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#2e236c]">Author</label>
                                    <input
                                        type="text"
                                        defaultValue={articleToEdit.author.name}
                                        className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2.5 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#2e236c]">Status</label>
                                    {/* Default Value untuk Select */}
                                    <Select defaultValue={articleToEdit.status}>
                                        <SelectTrigger className="h-[42px] w-full rounded-full border border-[#2e236c]/60 px-4 py-2 text-sm text-[#2e236c]/60 focus:ring-1 focus:ring-[#2e236c]">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Upload Section (Sama persis dengan Add) */}
                            <div className="mt-2 flex flex-col items-center rounded-lg border border-[#2e236c]/40 p-6 text-center">
                                <h4 className="mb-4 text-sm font-bold text-[#2e236c]">Upload</h4>
                                <div className="mb-6 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#2e236c]/20 bg-[#f8f9fc] px-4 py-8">
                                    <div className="mb-3">
                                        <CloudUpload className="h-10 w-10 text-[#2e236c]/60" />
                                    </div>
                                    <p className="mb-1 text-xs font-bold text-black">
                                        Drag & drop files or <span className="cursor-pointer text-[#2e236c] underline">Browse</span>
                                    </p>
                                    <p className="text-[10px] text-gray-400">Supported formates: JPEG, PNG, JPG</p>
                                </div>

                                {/* Contoh tampilan jika ada file (Dummy) sesuai permintaan gambar */}
                                <div className="mb-6 w-full space-y-4 text-left">
                                    <div>
                                        <p className="mb-1 text-xs text-gray-500">Uploading files</p>
                                        <div className="flex items-center justify-between border-b border-[#2e236c] pb-1">
                                            <span className="text-xs text-gray-700">your-file-here.png</span>
                                            <Trash2 className="h-4 w-4 cursor-pointer text-red-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-gray-500">Uploaded</p>
                                        <div className="flex items-center justify-between rounded border border-green-400 bg-white px-2 py-1.5">
                                            <span className="text-xs text-gray-700">image-name-goes-here.png</span>
                                            <div className="rounded-full bg-gray-300 p-0.5">
                                                <X className="h-3 w-3 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full rounded-lg bg-[#2e236c] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#2e236c]/90">
                                    Upload File
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center pt-2 pb-8">
                        <button className="rounded-full bg-[#2e236c] px-12 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#2e236c]/90">
                            Save
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="rounded-xl bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-[#2e236c]">Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="text-gray-500">
                            This action cannot be undone. This will permanently delete the article{' '}
                            <span className="font-semibold text-[#2e236c]">"{articleToDelete?.title}"</span>.
                        </DialogDescription>
                        {Object.keys(errors).length > 0 && (
                            <div className="mt-2 text-sm text-red-500">
                                {(Object.values(errors) as string[]).map((message, i) => (
                                    <p key={i}>{message}</p>
                                ))}
                            </div>
                        )}
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={processing} className="rounded-full">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={processing}
                            className="rounded-full bg-red-500 hover:bg-red-600"
                        >
                            {processing ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
