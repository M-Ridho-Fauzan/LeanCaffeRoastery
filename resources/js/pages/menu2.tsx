/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 05/09/2025 - 00:20:58
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 05/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 *
 * @Note
 *
### Daftar URL API yang Dapat Diakses

#### 1. `GET /api/products`

*   **Tujuan**: Mengambil daftar produk yang sudah dipaginasi dan difilter.
*   **Dipanggil oleh**: `ProductIndex.tsx` (saat halaman dimuat, filter berubah, atau halaman paginasi berubah).
*   **Controller yang menangani**: `App\Http\Controllers\Api\ProductController@index`
*   **Parameter Query yang Diterima**:
    *   `page`: (wajib) Nomor halaman yang ingin diambil (misalnya, `?page=2`).
    *   `type`: (opsional) Filter berdasarkan jenis produk (misalnya, `?type=Single+Origin`).
    *   `origin_id`: (opsional) Filter berdasarkan ID asal biji (misalnya, `?origin_id=5`).
    *   `process_id`: (opsional) Filter berdasarkan ID proses pasca panen (misalnya, `?process_id=3`).
    *   `brew_method_id`: (opsional) Filter berdasarkan ID metode seduh (misalnya, `?brew_method_id=2`).
*   **Contoh Panggilan**:
    *   `GET /api/products?page=1`
    *   `GET /api/products?page=2&type=House+Blend`
    *   `GET /api/products?page=1&origin_id=10&process_id=2&brew_method_id=4`

#### 2. `GET /api/filter-options`

*   **Tujuan**: Mengambil daftar opsi-opsi yang tersedia untuk filter produk (seperti daftar asal biji, proses, metode seduh, dan jenis produk).
*   **Dipanggil oleh**: `ProductIndex.tsx` (saat komponen `ProductIndex` pertama kali dimuat).
*   **Controller yang menangani**: `App\Http\Controllers\Api\FilterOptionsController@__invoke`
*   **Parameter Query yang Diterima**: Tidak ada parameter query spesifik yang digunakan oleh controller ini.
*   **Contoh Panggilan**: `GET /api/filter-options`

#### 3. `GET /products/{slug}`

*   **Tujuan**: Menampilkan halaman detail untuk produk tertentu. Ini adalah rute InertiaJS, bukan API murni yang mengembalikan JSON, melainkan HTML yang di-hydrate oleh React. Namun, InertiaJS secara internal akan membuat permintaan ke backend untuk mendapatkan data produk yang relevan untuk halaman tersebut.
*   **Dipanggil oleh**: Komponen `<Link>` di `ProductCard.tsx` (saat pengguna mengklik kartu produk).
*   **Controller yang menangani**: `App\Http\Controllers\Api\ProductController@show` (Asumsi ini adalah controller yang sama yang melayani rute web Inertia untuk detail produk).
*   **Parameter Path**: `{slug}` adalah slug unik dari produk (misalnya, `/products/kopi-arabika-gayo`).
*   **Contoh Panggilan**: `GET /products/kopi-arabika-gayo`
 **/
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react'; // Tambahkan 'router' untuk pushState URL
import axios from 'axios';
import { useEffect, useRef, useState } from 'react'; // useMemo tidak lagi diperlukan untuk filtering

// Komponen UI dari shadcn/ui
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Ikon dari lucide-react
import { MapPin, Recycle, Wheat } from 'lucide-react'; // Tambahkan ChevronLeft, ChevronRight

// Komponen Filter Kustom
import { PaginationControls } from '@/components/pagination-controls'; // Import komponen paginasi
import { ProductFilters } from '@/components/product-filters';

// --- Definisi Tipe Data ---
interface BrewMethod {
    id: number;
    brew_name: string;
}
interface Origin {
    id: number;
    origin_name: string;
}
interface Process {
    id: number;
    process_name: string;
}

interface ProductImage {
    id: number;
    url: string; // Properti ini dari ProductImageResource, sesuaikan jika Anda menggunakan 'image_url'
    alt_text: string | null;
    is_primary: boolean;
}

// PERUBAHAN 1: Sesuaikan interface Product dengan respons API yang baru
interface Product {
    id: number;
    slug: string;
    product_name: string;
    price: number;
    flavor_notes: string;
    type: string;
    is_specialty: boolean;
    primary_image_url: string | null; // Ganti dari thumbnail_url
    origins: Origin[];
    processes: Process[];
    brew_methods: BrewMethod[];
    images: ProductImage[]; // Relasi images penuh
}

// PERUBAHAN 2: Tambahkan tipe untuk objek paginasi dari Laravel
// interface PaginatedResponse<T> {
//     data: T[];
//     current_page: number;
//     first_page_url: string | null;
//     from: number | null;
//     last_page: number;
//     last_page_url: string | null;
//     links: { url: string | null; label: string; active: boolean }[];
//     next_page_url: string | null;
//     path: string;
//     per_page: number;
//     prev_page_url: string | null;
//     to: number | null;
//     total: number;
// }
interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}
interface PaginatedResponse<T> {
    data: T[];
    meta?: PaginationMeta; // untuk Resource Collection
    current_page?: number; // untuk Paginator default
    last_page?: number; // untuk Paginator default
}

interface FilterOptions {
    brewMethods: BrewMethod[];
    origins: Origin[];
    processes: Process[];
    types: string[];
}

// PERUBAHAN 3: Sesuaikan tipe ActiveFilters agar match dengan query parameter backend
interface ActiveFilters {
    type: string;
    origin_id: string;
    process_id: string; // Tambahkan ini jika Anda akan mengimplementasikan filter proses di backend
    brew_method_id: string; // Tambahkan ini jika Anda ingin filter brew method juga server-side
}

interface ZiggyProps {
    query?: { [key: string]: string | string[] }; // 'query' bisa saja undefined
    // Anda bisa tambahkan properti Ziggy lainnya di sini jika diperlukan, seperti 'url', 'routes'
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Menu', href: route('products.index') }];

// --- Komponen Halaman Utama ---
export default function ProductIndex() {
    // const { ziggy } = usePage().props as { ziggy: { query: { [key: string]: string | string[] } } };
    // const ziggy = (usePage().props as any).ziggy as { query: { [key: string]: string | string[] } };
    const { ziggy } = usePage().props as { ziggy?: ZiggyProps };
    const currentQuery = ziggy?.query || {};

    // PERUBAHAN 4: State management dirombak total
    // `products` sekarang menampung seluruh objek paginasi dari Laravel.
    const [products, setProducts] = useState<PaginatedResponse<Product> | null>(null);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        brewMethods: [],
        origins: [],
        processes: [],
        types: [],
    });

    // const [page, setPage] = useState(1);
    // PERBAIKAN 1: Inisialisasi state `page` dari URL query
    const [page, setPage] = useState<number>(Number(currentQuery.page || 1));

    // PERBAIKAN 2: Inisialisasi state `filters` dari URL query
    const [filters, setFilters] = useState<ActiveFilters>(() => {
        const initialFilters: ActiveFilters = {
            type: 'all',
            origin_id: 'all',
            process_id: 'all',
            brew_method_id: 'all',
        };
        if (currentQuery.type) initialFilters.type = String(currentQuery.type);
        if (currentQuery.origin_id) initialFilters.origin_id = String(currentQuery.origin_id);
        if (currentQuery.process_id) initialFilters.process_id = String(currentQuery.process_id);
        if (currentQuery.brew_method_id) initialFilters.brew_method_id = String(currentQuery.brew_method_id);
        return initialFilters;
    });

    const [loading, setLoading] = useState(true);

    // Gunakan useRef untuk melacak apakah ini render pertama atau tidak
    // Ini membantu mencegah router.visit pada mount awal jika URL sudah cocok
    const isInitialMount = useRef(true);

    // PERUBAHAN 6: `useEffect` utama untuk fetching produk
    // Efek ini akan berjalan ulang setiap kali `filters` atau `page` berubah
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);

            // Bangun query object sekali saja
            const query: Record<string, string | number> = { page };
            if (filters.type !== 'all') query.type = filters.type;
            if (filters.origin_id !== 'all') query.origin_id = filters.origin_id;
            if (filters.process_id !== 'all') query.process_id = filters.process_id;
            if (filters.brew_method_id !== 'all') query.brew_method_id = filters.brew_method_id;

            try {
                // 1. Fetch API dengan query lengkap
                const res = await axios.get<PaginatedResponse<Product>>(route('products.index.api'), {
                    params: query,
                });
                setProducts(res.data);

                // 2. Update URL browser tanpa reload
                router.visit(route('products.index', query), {
                    preserveScroll: true,
                    replace: true,
                    preserveState: true,
                });
            } catch (error) {
                console.error('Gagal mengambil data produk:', error);
            } finally {
                setLoading(false);
                isInitialMount.current = false;
            }
        };

        fetchProducts();
    }, [filters, page]);

    // PERUBAHAN 7: `useEffect` terpisah untuk mengambil opsi filter (hanya sekali)
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const res = await axios.get(route('filters.options.api'));
                setFilterOptions(res.data);
            } catch (error) {
                console.error('Gagal mengambil opsi filter:', error);
            }
        };
        fetchFilterOptions();
    }, []); // Dependencies kosong, dijalankan sekali saat mount

    // Data yang akan ditampilkan adalah dari objek paginasi
    const displayedProducts = products?.data || [];

    // PERUBAHAN 8: Handler untuk perubahan filter dari ProductFilters
    const handleFilterChange = (newFilters: ActiveFilters) => {
        setPage(1); // Setiap kali filter diubah, kembali ke halaman 1
        setFilters(newFilters);
    };

    // PERUBAHAN 9: Handler untuk perubahan tab (brew method)
    const handleTabChange = (brewMethodId: string | 'all') => {
        setPage(1); // Reset halaman saat tab berubah
        setFilters((prev) => ({ ...prev, brew_method_id: String(brewMethodId) }));
        // setFilters((prev) => ({ ...prev, brew_method_id: brewMethodId === 'all' ? 'all' : String(brewMethodId) }));
    };

    const resetAdvancedFilters = () => {
        setPage(1); // Reset halaman juga
        setFilters({ type: 'all', origin_id: 'all', process_id: 'all', brew_method_id: 'all' }); // Reset semua filter
    };

    const lastPage = products?.meta?.last_page ?? products?.last_page ?? 1;
    const currentPage = products?.meta?.current_page ?? products?.current_page ?? page;

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Jelajahi Kopi" />

            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* --- HEADER & FILTER --- */}
                <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Jelajahi Kopi Kami</h1>
                    <ProductFilters
                        filterOptions={filterOptions}
                        filters={filters}
                        setFilters={handleFilterChange} // Kirim handler yang baru
                        onReset={resetAdvancedFilters}
                        resultCount={products?.meta?.total || 0} // Tampilkan total hasil dari server
                    />
                </div>

                {/* --- TABS METODE PENYAJIAN --- */}
                <div className="relative mb-8 border-b border-gray-200">
                    <div className="scrollbar-hide -mb-px flex space-x-4 overflow-x-auto sm:space-x-8">
                        <TabButton
                            label="Semua"
                            isActive={filters.brew_method_id === 'all'} // Cek dari filters.brew_method_id
                            onClick={() => handleTabChange('all')}
                        />
                        {filterOptions.brewMethods.map((bm) => (
                            <TabButton
                                key={bm.id}
                                label={bm.brew_name}
                                isActive={String(bm.id) === filters.brew_method_id} // Cek dari filters.brew_method_id
                                onClick={() => handleTabChange(bm.id as unknown as string)} // Cast ke string
                            />
                        ))}
                    </div>
                </div>

                {/* --- DAFTAR PRODUK --- */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => <ProductCardSkeleton key={index} />)
                    ) : displayedProducts.length > 0 ? (
                        displayedProducts.map((product) => <ProductCard key={product.id} product={product} />)
                    ) : (
                        <div className="col-span-full mt-16 text-center">
                            <h3 className="text-lg font-semibold text-gray-800">Tidak Ada Kopi yang Ditemukan</h3>
                            <p className="mt-2 text-gray-500">Coba atur ulang atau ubah filter Anda untuk hasil yang lebih baik.</p>
                            <Button
                                onClick={() => {
                                    resetAdvancedFilters();
                                }}
                                className="mt-4"
                            >
                                Atur Ulang Semua Filter
                            </Button>
                        </div>
                    )}
                </div>

                {/* PERUBAHAN 10: Tambahkan komponen UI untuk Paginasi */}
                {!loading && products && lastPage > 1 && (
                    <div className="mt-12 flex items-center justify-center">
                        <PaginationControls currentPage={currentPage} lastPage={lastPage} onPageChange={setPage} />
                    </div>
                )}
            </div>
        </AppHeaderLayout>
    );
}

// --- Komponen Pembantu (Tidak berubah signifikan kecuali image src) ---

const TabButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus:outline-none ${
            isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        }`}
    >
        {label}
    </button>
);

const truncateText = (text: string, maxLength: number) => {
    // Pastikan kita memotong teks terlebih dahulu
    const display_text = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

    // Ini langkah KRUSIAL: Encode teks untuk URL
    return encodeURIComponent(display_text);
};

// PERUBAHAN 11: Sesuaikan ProductCard untuk menggunakan primary_image_url
const ProductCard = ({ product }: { product: Product }) => (
    <Link href={route('products.show', { product: product.slug })} className="group">
        <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lg">
            <CardHeader className="p-0">
                <div className="aspect-h-1 aspect-w-1 relative w-full overflow-hidden bg-gray-200">
                    <img
                        src={
                            product.primary_image_url
                                ? // ? product.primary_image_url
                                  `https://placehold.co/600x400/EEE/31343C?text=${truncateText(product.product_name, 20)}`
                                : // Ini adalah baris di mana URL placeholder dibuat
                                  `https://placehold.co/600x400/EEE/31343C?text=${truncateText(product.product_name, 20)}`
                        }
                        alt={product.product_name}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.is_specialty && (
                        <Badge variant="destructive" className="absolute top-3 right-3">
                            Specialty
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col p-4">
                <CardTitle className="text-lg font-semibold text-gray-800">{product.product_name}</CardTitle>
                <CardDescription className="mt-1 text-base font-bold text-primary">Rp {product.price.toLocaleString('id-ID')}</CardDescription>
                <p className="mt-3 mb-4 flex-grow text-sm text-gray-500">{product.flavor_notes}</p>
                <div className="space-y-2">
                    <InfoLine icon={<MapPin size={14} />} text={product.origins.map((o) => o.origin_name).join(', ')} />
                    <InfoLine icon={<Recycle size={14} />} text={product.processes.map((p) => p.process_name).join(', ')} />
                    <InfoLine icon={<Wheat size={14} />} text={product.type} />
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <div className="flex flex-wrap gap-2">
                    {product.brew_methods.map((bm) => (
                        <Badge key={bm.id} variant="secondary">
                            {bm.brew_name}
                        </Badge>
                    ))}
                </div>
            </CardFooter>
        </Card>
    </Link>
);

const ProductCardSkeleton = () => (
    <div className="space-y-3">
        <Skeleton className="aspect-h-1 aspect-w-1 w-full rounded-lg" />
        <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    </div>
);

const InfoLine = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="flex items-center text-sm text-gray-600">
        <span className="mr-2 text-gray-400">{icon}</span>
        <span className="truncate">{text}</span>
    </div>
);
