/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 06/09/2025 - 23:38:20
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 06/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { ActiveFilters, BreadcrumbItem, FilterOptions, PaginatedResponse, Product, ZiggyProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

// Komponen UI dari shadcn/ui
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Ikon dari lucide-react
import { MapPin, Recycle, Wheat } from 'lucide-react';

// Komponen Filter Kustom
import { ProductFilters } from '@/components/product-filters';

// --- Definisi Tipe Data (Pastikan ini sesuai dengan ProductResource Anda) ---

// const breadcrumbs: BreadcrumbItem[] = [{ title: 'Menu', href: route('products.index') }];

export default function ProductIndex({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
    const { ziggy } = usePage().props as { ziggy?: ZiggyProps };
    const currentQuery = ziggy?.query || {};

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [pageToFetch, setPageToFetch] = useState<number>(Number(currentQuery.page || 1));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingInitial, setIsLoadingInitial] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [totalResults, setTotalResults] = useState(0);

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        brewMethods: [],
        origins: [],
        processes: [],
        types: [],
    });
    const [filters, setFilters] = useState<ActiveFilters>(() => {
        const initialFilters: ActiveFilters = {
            type: 'all',
            origin_id: 'all',
            process_id: 'all',
            brew_method_id: 'all',
        };
        if (currentQuery.type && currentQuery.type !== 'all') initialFilters.type = String(currentQuery.type);
        if (currentQuery.origin_id && currentQuery.origin_id !== 'all') initialFilters.origin_id = String(currentQuery.origin_id);
        if (currentQuery.process_id && currentQuery.process_id !== 'all') initialFilters.process_id = String(currentQuery.process_id);
        if (currentQuery.brew_method_id && currentQuery.brew_method_id !== 'all') initialFilters.brew_method_id = String(currentQuery.brew_method_id);
        return initialFilters;
    });

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isFiltersChanged = useRef(false);
    const hasFetchedInitialData = useRef(false);

    // --- Virtualization Setup ---
    // const parentRef = useRef<HTMLDivElement>(null); // TIDAK LAGI DIGUNAKAN

    const itemsPerRow = 3;
    const rowCount = Math.ceil(allProducts.length / itemsPerRow);

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => document.documentElement, // <<< PENTING: Gunakan window sebagai scroll parent
        estimateSize: useCallback(() => 650, []), // Estimasi tinggi rata-rata satu BARIS dari 3 produk + gap
        overscan: 3,
    });
    // =======================================

    // --- Efek untuk Mengambil Produk ---
    const fetchProducts = useCallback(async () => {
        if (isLoadingInitial || isLoadingMore) {
            return;
        }
        if (!hasMore && pageToFetch > 1 && !isFiltersChanged.current) {
            return;
        }

        const isFilterOrInitialLoad = pageToFetch === 1 || isFiltersChanged.current;

        if (isFilterOrInitialLoad) {
            setIsLoadingInitial(true);
            setAllProducts([]);
            setHasMore(true);
        } else {
            setIsLoadingMore(true);
        }

        // --- Perbedaan utama di sini: Dua set queryParams ---
        // 1. queryParams untuk permintaan API (selalu sertakan `page`)
        const apiQueryParams: Record<string, string | number> = { page: pageToFetch };
        if (filters.type !== 'all') apiQueryParams.type = filters.type;
        if (filters.origin_id !== 'all') apiQueryParams.origin_id = filters.origin_id;
        if (filters.process_id !== 'all') apiQueryParams.process_id = filters.process_id;
        if (filters.brew_method_id !== 'all') apiQueryParams.brew_method_id = filters.brew_method_id;

        // 2. browserUrlParams untuk URL di browser (hilangkan `page=1` jika pageToFetch adalah 1)
        const browserUrlParams: Record<string, string | number> = {};
        if (filters.type !== 'all') browserUrlParams.type = filters.type;
        if (filters.origin_id !== 'all') browserUrlParams.origin_id = filters.origin_id;
        if (filters.process_id !== 'all') browserUrlParams.process_id = filters.process_id;
        if (filters.brew_method_id !== 'all') browserUrlParams.brew_method_id = filters.brew_method_id;
        // Hanya tambahkan `page` ke URL browser jika pageToFetch > 1
        if (pageToFetch > 1) {
            browserUrlParams.page = pageToFetch;
        }
        // --- Akhir perbedaan ---

        try {
            const res = await axios.get<PaginatedResponse<Product>>(route('products.index.api'), {
                params: apiQueryParams, // Gunakan apiQueryParams untuk permintaan API
            });

            // setAllProducts((prevProducts) => {
            //     const newProducts = isFilterOrInitialLoad ? res.data.data : [...prevProducts, ...res.data.data];
            //     console.log(`[API Response] Halaman ${res.data.meta.current_page} dimuat. Tambahan ${res.data.data.length} produk.`);
            //     console.log(`[Total Produk Dimuat] ${newProducts.length} produk.`);
            //     return newProducts;
            // });

            // --- setAllProducts dengan pengecekan duplikat ---
            setAllProducts((prevProducts) => {
                let updatedProducts: Product[];

                if (isFilterOrInitialLoad) {
                    updatedProducts = res.data.data; // Jika ini load awal/filter, mulai dari nol
                } else {
                    // Jika ini load more, gabungkan dan pastikan unik
                    const existingProductIds = new Set(prevProducts.map((p) => p.id));
                    const newUniqueProducts = res.data.data.filter((p) => !existingProductIds.has(p.id));
                    updatedProducts = [...prevProducts, ...newUniqueProducts];
                }

                console.log(`[API Response] Halaman ${res.data.meta.current_page} dimuat. Tambahan ${res.data.data.length} produk.`);
                console.log(`[Total Produk Dimuat] ${updatedProducts.length} produk.`);

                return updatedProducts;
            });

            setNextPageUrl(res.data.links.next);
            setHasMore(!!res.data.links.next);
            setTotalResults(res.data.meta.total);

            if (res.data.links.next) {
                const url = new URL(res.data.links.next);
                setPageToFetch(Number(url.searchParams.get('page')));
            } else {
                setPageToFetch(res.data.meta.last_page + 1);
            }

            // --- Inertia router.visit Logic (menggunakan browserUrlParams) ---
            if (isFilterOrInitialLoad) {
                const currentBrowserParams = new URLSearchParams(window.location.search);
                const newBrowserUrlParams = new URLSearchParams(browserUrlParams as Record<string, string>);

                let paramsChanged = false;
                // Cek apakah ada parameter di currentBrowserParams yang tidak ada di newBrowserUrlParams
                for (const [key, value] of currentBrowserParams.entries()) {
                    if (newBrowserUrlParams.get(key) !== value) {
                        paramsChanged = true;
                        break;
                    }
                }
                // Cek apakah ada parameter di newBrowserUrlParams yang tidak ada di currentBrowserParams
                if (!paramsChanged) {
                    for (const [key, value] of newBrowserUrlParams.entries()) {
                        if (currentBrowserParams.get(key) !== value) {
                            paramsChanged = true;
                            break;
                        }
                    }
                }
                // Kondisi tambahan: Jika URL saat ini punya `?page=1` tapi kita mau menghilangkannya
                if (!paramsChanged && currentBrowserParams.has('page') && currentBrowserParams.get('page') === '1' && pageToFetch === 1) {
                    paramsChanged = true;
                }

                if (paramsChanged) {
                    router.visit(route('products.index', browserUrlParams), {
                        // Gunakan browserUrlParams di sini
                        preserveScroll: true,
                        replace: true,
                        preserveState: true,
                    });
                }
            }

            if (isFilterOrInitialLoad) {
                hasFetchedInitialData.current = true;
            }
        } catch (error) {
            console.error('Gagal mengambil data produk:', error);
        } finally {
            setIsLoadingInitial(false);
            setIsLoadingMore(false);
            isFiltersChanged.current = false;
        }
    }, [filters, pageToFetch, hasMore, isLoadingInitial, isLoadingMore]);

    // --- Efek untuk memicu fetchProducts saat `filters` atau `pageToFetch` berubah (BUKAN DARI SCROLL) ---
    useEffect(() => {
        // PERBAIKAN 4: Guard yang lebih spesifik untuk pemicu awal/filter
        // Panggil fetchProducts hanya jika:
        // 1. Ini adalah perubahan filter/tab (isFiltersChanged.current true)
        // 2. Ini adalah load awal halaman 1 DAN belum pernah fetch data awal
        // (Scroll akan ditangani oleh IntersectionObserver secara terpisah)

        if (isFiltersChanged.current) {
            // console.log("useEffect: Filters changed, triggering fetch.");
            fetchProducts(); // Ini akan fetch page 1 dengan filter baru
        } else if (pageToFetch === 1 && !hasFetchedInitialData.current && !isLoadingInitial && !isLoadingMore) {
            // console.log("useEffect: Initial page 1 load, triggering fetch.");
            fetchProducts(); // Ini akan fetch page 1 pertama kali
        }
        // Jangan panggil fetchProducts di sini untuk pageToFetch > 1, itu urusan observer
    }, [filters, pageToFetch, fetchProducts, hasFetchedInitialData, isLoadingInitial, isLoadingMore]);

    // --- Efek untuk Mengambil Opsi Filter (hanya sekali saat mount) ---
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const res = await axios.get<FilterOptions>(route('filters.options.api'));
                setFilterOptions(res.data);
            } catch (error) {
                console.error('Gagal mengambil opsi filter:', error);
            }
        };
        fetchFilterOptions();
    }, []);

    // --- Efek untuk Deteksi Scroll (IntersectionObserver) ---
    useEffect(() => {
        if (!loadMoreRef.current) return;

        const node = loadMoreRef.current; // Copy ref value to a variable

        const observer = new IntersectionObserver(
            (entries) => {
                // PERBAIKAN 5: Logic IntersectionObserver yang lebih ketat
                // Panggil fetchProducts HANYA jika:
                // 1. Elemen terlihat (entries[0].isIntersecting)
                // 2. Masih ada halaman berikutnya (hasMore)
                // 3. Tidak sedang dalam proses loading (baik initial maupun more)
                // 4. Data awal sudah berhasil diambil (hasFetchedInitialData.current)
                // 5. Bukan karena filter/tab baru saja diubah (agar tidak konflik dengan pemicu fetchProducts lainnya)
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !isLoadingInitial &&
                    !isLoadingMore &&
                    hasFetchedInitialData.current &&
                    !isFiltersChanged.current // Tambahkan ini
                ) {
                    // console.log("Observer: Triggering fetch for next page.");
                    fetchProducts(); // Panggil tanpa argumen
                }
            },
            {
                root: null,
                // PERBAIKAN 6: Sesuaikan rootMargin. Misalnya, picu 200px sebelum mencapai bagian bawah.
                rootMargin: '0px 0px 200px 0px', // Top, Right, Bottom, Left. Bottom 200px berarti trigger lebih awal.
                // threshold: 0.1, // Mungkin perlu diatur lebih rendah jika observer tidak terpicu sama sekali
            },
        );

        observer.observe(node);

        return () => {
            if (node) {
                observer.unobserve(node);
            }
        };
    }, [hasMore, isLoadingInitial, isLoadingMore, fetchProducts, hasFetchedInitialData]); // Tambahkan fetchProducts & hasFetchedInitialData

    // --- Handler untuk Perubahan Filter ---
    const handleFilterChange = (newFilters: ActiveFilters) => {
        setFilters(newFilters);
        setPageToFetch(1);
        isFiltersChanged.current = true; // Set flag
        hasFetchedInitialData.current = false; // Reset flag agar data pertama di-fetch ulang
        // console.log("Filters changed, pageToFetch reset to 1.");
        rowVirtualizer.scrollToOffset(0, { align: 'start' }); // Scroll ke atas saat filter berubah
    };

    // --- Handler untuk Perubahan Tab (Brew Method) ---
    const handleTabChange = (brewMethodId: string | 'all') => {
        setFilters((prev) => ({ ...prev, brew_method_id: String(brewMethodId) }));
        setPageToFetch(1);
        isFiltersChanged.current = true; // Set flag
        hasFetchedInitialData.current = false; // Reset flag
        // console.log("Tab changed, pageToFetch reset to 1.");
        rowVirtualizer.scrollToOffset(0, { align: 'start' }); // Scroll ke atas saat tab berubah
    };

    // --- Handler untuk Reset Semua Filter ---
    const resetAdvancedFilters = () => {
        setFilters({ type: 'all', origin_id: 'all', process_id: 'all', brew_method_id: 'all' });
        setPageToFetch(1);
        isFiltersChanged.current = true; // Set flag
        hasFetchedInitialData.current = false; // Reset flag
        // console.log("Filters reset, pageToFetch reset to 1.");
        rowVirtualizer.scrollToOffset(0, { align: 'start' }); // Scroll ke atas saat reset filter
    };

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
                        setFilters={handleFilterChange}
                        onReset={resetAdvancedFilters}
                        resultCount={totalResults}
                    />
                </div>

                {/* --- TABS METODE PENYAJIAN --- */}
                <div className="relative mb-8 border-b border-gray-200">
                    <div className="scrollbar-hide -mb-px flex space-x-4 overflow-x-auto sm:space-x-8">
                        <TabButton label="Semua" isActive={filters.brew_method_id === 'all'} onClick={() => handleTabChange('all')} />
                        {filterOptions.brewMethods.map((bm) => (
                            <TabButton
                                key={bm.id}
                                label={bm.brew_name}
                                isActive={String(bm.id) === filters.brew_method_id}
                                onClick={() => handleTabChange(bm.id as unknown as string)}
                            />
                        ))}
                    </div>
                </div>

                {/* --- DAFTAR PRODUK --- */}
                {/* === BAGIAN INI UNTUK VIRTUALISASI === */}
                {/* Inner container yang akan menampung item virtual.
                    Ini adalah div yang akan membuat tinggi scrollbar halaman utama. */}
                <div
                    // Hapus `ref={parentRef}` dan styling `height`, `overflowY` dari sini
                    // karena window adalah scroll parent sekarang.
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`, // Tinggi total sesuai virtualizer
                        position: 'relative', // Penting untuk posisi absolut item
                        width: '100%',
                    }}
                >
                    {isLoadingInitial && allProducts.length === 0 ? (
                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                            {Array.from({ length: 9 }).map((_, index) => (
                                <ProductCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : allProducts.length > 0 ? (
                        rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const startIndex = virtualRow.index * itemsPerRow;
                            const endIndex = Math.min(startIndex + itemsPerRow, allProducts.length);
                            const productsInRow = allProducts.slice(startIndex, endIndex);

                            return (
                                <div
                                    key={virtualRow.key}
                                    data-index={virtualRow.index}
                                    ref={rowVirtualizer.measureElement}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                        display: 'grid',
                                        gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))`,
                                        gap: '24px',
                                    }}
                                    className="py-4"
                                >
                                    {productsInRow.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                    {productsInRow.length < itemsPerRow &&
                                        productsInRow.length == itemsPerRow &&
                                        Array.from({ length: itemsPerRow - productsInRow.length }).map((_, idx) => (
                                            <ProductCardSkeleton key={`skeleton-${virtualRow.index}-${idx}`} />
                                        ))}
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full mt-16 text-center">
                            <h3 className="text-lg font-semibold text-gray-800">Tidak Ada Kopi yang Ditemukan</h3>
                            <p className="mt-2 text-gray-500">Coba atur ulang atau ubah filter Anda untuk hasil yang lebih baik.</p>
                            <Button onClick={resetAdvancedFilters} className="mt-4">
                                Atur Ulang Semua Filter
                            </Button>
                        </div>
                    )}
                </div>
                {/* === AKHIR PERUBAHAN VIRTUALISASI === */}

                {/* --- LOADING INDICATOR / END OF LIST --- */}
                {/* Pastikan div `loadMoreRef` hanya dirender jika ada potensi data lain */}
                {hasMore && (
                    <div ref={loadMoreRef} className="mt-12 flex justify-center py-4">
                        {(isLoadingMore || (isLoadingInitial && allProducts.length > 0)) && <p className="text-gray-600">Loading more products...</p>}
                        {/* Jika observer tidak pernah memicu, tapi hasMore masih true, ini akan tampil */}
                        {!isLoadingMore && !isLoadingInitial && allProducts.length > 0 && (
                            <p className="text-gray-500">Scroll down to load more...</p>
                        )}
                    </div>
                )}
                {!hasMore && allProducts.length > 0 && !isLoadingInitial && !isLoadingMore && (
                    <div className="mt-12 flex justify-center py-4">
                        <p className="text-gray-500">Anda telah mencapai akhir daftar.</p>
                    </div>
                )}
            </div>
        </AppHeaderLayout>
    );
}

// ... (Komponen pembantu ProductCard, ProductCardSkeleton, InfoLine, TabButton)

// --- Komponen Pembantu (Tidak berubah signifikan) ---

const TabButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`cursor-pointer border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 hover:underline focus:outline-none ${
            isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        }`}
    >
        {label}
    </button>
);

const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const ProductCard = ({ product }: { product: Product }) => (
    <Link href={route('products.show', { product: product.slug })} className="group">
        <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lg">
            <CardHeader className="p-0">
                <div className="aspect-h-1 aspect-w-1 relative w-full overflow-hidden bg-gray-200">
                    <img
                        src={
                            product.primary_image_url
                                ? // ? product.primary_image_url
                                  `https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(truncateText(product.product_name, 20))}`
                                : `https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(truncateText(product.product_name, 20))}`
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
