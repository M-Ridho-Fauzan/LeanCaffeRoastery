// resources/js/Pages/editors/blogs/publics/index.jsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
// Jika Anda punya komponen Pagination kustom, ini akan menjadi wrapper untuk Link Inertia
// Jika tidak, anggap ini hanya div. Ini sudah diimplementasikan dengan baik di bagian bawah.
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type PageProps } from '@/types'; // Import User dan FlashMessages
import { Head, Link, router, useForm } from '@inertiajs/react'; // Tambahkan usePage jika perlu di sub-komponen
import { format } from 'date-fns';
import { pickBy, throttle } from 'lodash';
import { DotSquareIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner'; // Asumsi Anda punya toast (shadcn/ui atau lainnya)

// --- Definisi Tipe ---
// (Tidak ada perubahan pada definisi tipe ini, tetap pertahankan)
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
        // Asumsi ini adalah 'user' di backend Anda
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

// Extends PageProps untuk mendapatkan properti global (auth, flash, ziggy, dll.)
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

// Gabungkan ArticlesIndexSpecificProps dengan PageProps global
type ArticlesIndexPageProps = PageProps & ArticlesIndexSpecificProps;

export default function ArticleIndex({ articles, filters, categories, statuses, breadcrumbs, flash }: ArticlesIndexPageProps) {
    // Inisialisasi state filter langsung dari props filters
    // `filters` dijamin selalu ada sebagai objek karena `request->only()` di controller
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

    // useForm digunakan untuk DELETE request karena memberikan fitur loading, errors, dll.
    const { delete: inertiaDelete, processing, errors } = useForm();

    // Fungsi untuk menerapkan filter
    const throttledApplyFilters = useRef(
        throttle((s: string, c: string, st: string) => {
            // console.log("Applying filters:", { search: s, category: c, status: st });
            router.get(
                route('editor.articles.index'),
                // pickBy akan menghapus properti dengan nilai falsy (null, undefined, '')
                // Jadi, jika search kosong, dia tidak akan dikirim.
                // Namun, 'all' untuk category/status adalah nilai yang disengaja, jadi perlu logic pickBy yang lebih hati-hati
                // Atau cukup kirim semua, dan backend yang handle.
                // Jika ingin hanya mengirim yang bukan 'all' atau bukan string kosong:
                pickBy(
                    {
                        search: s,
                        category: c !== 'all' ? c : undefined,
                        status: st !== 'all' ? st : undefined,
                    },
                    (value) => value !== undefined && value !== '',
                ), // pickBy juga akan menghapus undefined
                {
                    preserveState: true, // Pertahankan state lokal komponen (misal: scroll position)
                    replace: true, // Ganti entry di history browser, bukan menambah
                    preserveScroll: true, // Pertahankan posisi scroll
                },
            );
        }, 300), // Throttling untuk menghindari terlalu banyak request saat mengetik/memilih
    ).current;

    useEffect(() => {
        // Panggil fungsi throttled yang sudah di-memoize
        throttledApplyFilters(search, selectedCategory, selectedStatus);

        // Cleanup function untuk membatalkan panggilan throttled yang tertunda jika komponen unmount
        // atau jika dependensi berubah sebelum waktu throttling habis
        return () => {
            throttledApplyFilters.cancel();
        };
    }, [search, selectedCategory, selectedStatus, throttledApplyFilters]); // Dependensi yang benar

    // Efek untuk menampilkan pesan flash (misalnya dari CRUD lainnya)
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        // Jika ada pesan umum
        if (flash.message) {
            toast.info(flash.message); // Atau sesuaikan dengan jenis toast yang Anda inginkan
        }
    }, [flash]);

    const handleDeleteClick = (article: Article) => {
        setArticleToDelete(article);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (articleToDelete) {
            inertiaDelete(route('editor.articles.destroy', articleToDelete.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setArticleToDelete(null);
                    toast.success(`Article "${articleToDelete.title}" deleted successfully.`);
                    // router.reload() akan memuat ulang halaman dengan URL dan query params saat ini,
                    // sehingga filter yang ada tetap akan diterapkan.
                    router.reload();
                },
                onError: (errorResponse) => {
                    setIsDeleteDialogOpen(false);
                    // Menampilkan error dari backend (jika ada)
                    const errorMessage = Object.values(errorResponse).flat().join('\n') || 'Failed to delete article.';
                    toast.error(errorMessage);
                },
            });
        }
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedCategory('all');
        setSelectedStatus('all');
        // Karena state berubah, useEffect akan terpanggil kembali untuk menerapkan filter kosong
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            {/* Menggunakan `auth.user.name` misalnya di judul halaman atau user profile */}
            {/* <Head title={`Articles for ${auth.user.name}`} /> */}
            <Head title={breadcrumbs[breadcrumbs.length - 1].title} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Articles</h1>
                    <Link href={route('editor.articles.create')}>
                        <Button>Add New Article</Button>
                    </Link>
                </div>

                {/* Filter Section */}
                <div className="flex flex-wrap items-center gap-4">
                    <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.data &&
                                categories.data.map((category) => (
                                    <SelectItem key={category.id} value={category.slug}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {/* Uppercase hanya huruf pertama */}
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {(search || selectedCategory !== 'all' || selectedStatus !== 'all') && (
                        <Button variant="outline" onClick={handleClearFilters}>
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* Articles Table */}
                <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Published At</TableHead>
                                <TableHead>Views</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {articles.data.length > 0 ? (
                                articles.data.map((article) => (
                                    <TableRow key={article.id}>
                                        <TableCell className="font-medium">{article.id}</TableCell>
                                        <TableCell>
                                            <Link href={route('editor.articles.edit', article.id)} className="font-semibold hover:underline">
                                                {article.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{article.category?.name || 'N/A'}</TableCell>
                                        <TableCell>{article.author.name}</TableCell>
                                        <TableCell>
                                            {/* Badge styling bisa lebih spesifik */}
                                            <Badge
                                                variant={
                                                    article.status === 'published' ? 'default' : article.status === 'draft' ? 'secondary' : 'outline' // Untuk 'archived' atau status lain
                                                }
                                            >
                                                {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{article.published_at ? format(new Date(article.published_at), 'PPP') : 'N/A'}</TableCell>
                                        <TableCell>{article.views_count}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <DotSquareIcon className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('editor.articles.edit', article.id)}>Edit</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteClick(article)}
                                                        className="text-destructive focus:text-destructive"
                                                        // Tampilkan loading state jika sedang memproses
                                                        disabled={processing}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                        No articles found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Paginasi */}
                {/* Periksa juga apakah ada lebih dari 1 halaman, bukan hanya jumlah link */}
                {articles.last_page > 1 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination>
                            <div className="flex space-x-2">
                                {articles.links.map((link, index) => {
                                    // Membangun URL dengan mempertahankan filter yang ada
                                    // URLSearchParams akan secara otomatis menangani encoding
                                    const params = new URLSearchParams(link.url ? new URL(link.url).search : '');

                                    // Set ulang filter dari state lokal agar konsisten
                                    if (search) params.set('search', search);
                                    else params.delete('search');
                                    if (selectedCategory !== 'all') params.set('category', selectedCategory);
                                    else params.delete('category');
                                    if (selectedStatus !== 'all') params.set('status', selectedStatus);
                                    else params.delete('status');

                                    // Membuat href lengkap
                                    const fullHref = `${route('editor.articles.index')}?${params.toString()}`;

                                    return link.url ? (
                                        <Link
                                            key={index}
                                            href={fullHref} // Gunakan href yang sudah dimodifikasi
                                            className={`rounded-md border px-4 py-2 ${link.active ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
                                            // Inertia Link akan secara otomatis menghandle navigasi, jadi dangerouslySetInnerHTML tidak selalu dibutuhkan
                                            // kecuali label benar-benar mengandung HTML (misal: "&laquo; Previous")
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="cursor-not-allowed rounded-md border px-4 py-2 text-muted-foreground"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </Pagination>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the article{' '}
                            <span className="font-semibold text-foreground">"{articleToDelete?.title}"</span> and remove its data from our servers.
                        </DialogDescription>
                        {/* Menampilkan semua pesan error yang ada dari useForm */}
                        {Object.keys(errors).length > 0 && (
                            <div className="mt-2 text-sm text-destructive">
                                {(Object.values(errors) as string[]).map(
                                    (
                                        message,
                                        i, // Perubahan ada di sini!
                                    ) => (
                                        <p key={i}>{message}</p>
                                    ),
                                )}
                            </div>
                        )}
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={processing}>
                            {processing ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
