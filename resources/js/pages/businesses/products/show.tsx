import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { ActiveFilters, BreadcrumbItem, FilterOptions, PaginatedResponse, Product, ZiggyProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';
import { ShoppingCart } from 'lucide-react';

// Komponen UI dari shadcn/ui
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// IMPORT PENTING UNTUK MODAL
import ProductDetail from '@/components/product-detail';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import { ProductFilters } from '@/components/product-filters';

// --- DEFINISI ProductCard (Diubah dari Link ke Div onClick) ---
const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => (
    <div onClick={onClick} className="group h-full cursor-pointer">
        {/* Card Container: Rounded lebih besar, shadow halus */}
        <Card className="flex h-full flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* --- Bagian Gambar --- */}
            <CardHeader className="p-0">
                <div className="aspect-h-1 aspect-w-1 relative overflow-hidden bg-[#2A2F5B]">
                    <img
                        src={
                            product.primary_image_url
                                ? product.primary_image_url
                                : `https://placehold.co/600x600/2A2F5B/FFFFFF?text=${encodeURIComponent(truncateText(product.product_name, 20))}`
                        }
                        alt={product.product_name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badge: Dipindah ke Kiri Atas & Warna Hijau sesuai desain */}
                    {product.is_specialty && (
                        <Badge className="absolute top-4 left-4 border-none bg-[#22C55E] px-3 py-1 text-xs font-bold text-white hover:bg-[#16a34a]">
                            Best Seller
                        </Badge>
                    )}
                </div>
            </CardHeader>

            {/* --- Bagian Konten --- */}
            <CardContent className="flex flex-grow flex-col px-5 pt-5 pb-4">
                {/* Tag Tipe (House Blend) */}
                <div className="mb-2">
                    <span className="inline-block rounded-full border border-gray-300 px-3 py-0.5 text-[10px] font-semibold tracking-wide text-gray-500 uppercase">
                        {product.type}
                    </span>
                </div>

                {/* Judul Produk */}
                <CardTitle className="mb-1 line-clamp-1 text-lg font-bold text-gray-900">{product.product_name}</CardTitle>

                {/* Deskripsi Singkat */}
                <p className="mb-4 line-clamp-2 min-h-[2.5em] text-xs leading-relaxed text-gray-500">{product.flavor_notes}</p>

                {/* Informasi Detail (Origin & Process) */}
                <div className="mt-auto space-y-2 border-t border-dashed border-gray-100 pt-3 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-400">Origin:</span>
                        <span className="max-w-[60%] truncate text-right font-semibold text-gray-700">
                            {product.origins.map((o) => o.origin_name).join(', ')}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-400">Process:</span>
                        <span className="max-w-[60%] truncate text-right font-semibold text-gray-700">
                            {product.processes.map((p) => p.process_name).join(', ')}
                        </span>
                    </div>
                </div>

                {/* Harga */}
                <div className="mt-4">
                    <span className="text-lg font-bold text-gray-900">Rp . {product.price.toLocaleString('id-ID')}</span>
                </div>
            </CardContent>

            {/* --- Footer / Tombol --- */}
            <CardFooter className="flex gap-3 px-5 pt-0 pb-5">
                <div className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#2A2F5B] py-2 text-xs font-bold text-white transition-colors group-hover:bg-[#1e2345]">
                    <ShoppingCart size={14} />
                    <span>Add To Cart</span>
                </div>
                <div className="flex flex-1 items-center justify-center rounded-full border border-[#2A2F5B] py-2 text-xs font-bold text-[#2A2F5B] transition-colors hover:bg-gray-50">
                    View Details
                </div>
            </CardFooter>
        </Card>
    </div>
);

// --- UTILS ---
const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
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

// --- MAIN COMPONENT ---
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

    // --- STATE UNTUK MODAL POPUP ---
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // --- HANDLER KLIK PRODUK ---
    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsDetailOpen(true);
    };

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

    const itemsPerRow = 3;
    const rowCount = Math.ceil(allProducts.length / itemsPerRow);

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => document.documentElement,
        estimateSize: useCallback(() => 600, []), // Estimasi tinggi per row
        overscan: 3,
    });

    // --- Efek Fetch Products (Sama seperti logika Anda) ---
    const fetchProducts = useCallback(async () => {
        if (isLoadingInitial || isLoadingMore) return;
        if (!hasMore && pageToFetch > 1 && !isFiltersChanged.current) return;

        const isFilterOrInitialLoad = pageToFetch === 1 || isFiltersChanged.current;

        if (isFilterOrInitialLoad) {
            setIsLoadingInitial(true);
            setAllProducts([]);
            setHasMore(true);
        } else {
            setIsLoadingMore(true);
        }

        const apiQueryParams: Record<string, string | number> = { page: pageToFetch };
        if (filters.type !== 'all') apiQueryParams.type = filters.type;
        if (filters.origin_id !== 'all') apiQueryParams.origin_id = filters.origin_id;
        if (filters.process_id !== 'all') apiQueryParams.process_id = filters.process_id;
        if (filters.brew_method_id !== 'all') apiQueryParams.brew_method_id = filters.brew_method_id;

        const browserUrlParams: Record<string, string | number> = {};
        if (filters.type !== 'all') browserUrlParams.type = filters.type;
        if (filters.origin_id !== 'all') browserUrlParams.origin_id = filters.origin_id;
        if (filters.process_id !== 'all') browserUrlParams.process_id = filters.process_id;
        if (filters.brew_method_id !== 'all') browserUrlParams.brew_method_id = filters.brew_method_id;
        if (pageToFetch > 1) browserUrlParams.page = pageToFetch;

        try {
            const res = await axios.get<PaginatedResponse<Product>>(route('products.index.api'), {
                params: apiQueryParams,
            });

            setAllProducts((prevProducts) => {
                let updatedProducts: Product[];
                if (isFilterOrInitialLoad) {
                    updatedProducts = res.data.data;
                } else {
                    const existingProductIds = new Set(prevProducts.map((p) => p.id));
                    const newUniqueProducts = res.data.data.filter((p) => !existingProductIds.has(p.id));
                    updatedProducts = [...prevProducts, ...newUniqueProducts];
                }
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

            if (isFilterOrInitialLoad) {
                const currentBrowserParams = new URLSearchParams(window.location.search);
                const newBrowserUrlParams = new URLSearchParams(browserUrlParams as Record<string, string>);
                let paramsChanged = false;
                for (const [key, value] of currentBrowserParams.entries()) {
                    if (newBrowserUrlParams.get(key) !== value) {
                        paramsChanged = true;
                        break;
                    }
                }
                if (!paramsChanged) {
                    for (const [key, value] of newBrowserUrlParams.entries()) {
                        if (currentBrowserParams.get(key) !== value) {
                            paramsChanged = true;
                            break;
                        }
                    }
                }
                if (!paramsChanged && currentBrowserParams.has('page') && currentBrowserParams.get('page') === '1' && pageToFetch === 1) {
                    paramsChanged = true;
                }
                if (paramsChanged) {
                    router.visit(route('products.index', browserUrlParams), {
                        preserveScroll: true,
                        replace: true,
                        preserveState: true,
                    });
                }
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

    useEffect(() => {
        if (isFiltersChanged.current) {
            fetchProducts();
        } else if (pageToFetch === 1 && !hasFetchedInitialData.current && !isLoadingInitial && !isLoadingMore) {
            fetchProducts();
        }
    }, [filters, pageToFetch, fetchProducts, hasFetchedInitialData, isLoadingInitial, isLoadingMore]);

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

    useEffect(() => {
        if (!loadMoreRef.current) return;
        const node = loadMoreRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !isLoadingInitial &&
                    !isLoadingMore &&
                    hasFetchedInitialData.current &&
                    !isFiltersChanged.current
                ) {
                    fetchProducts();
                }
            },
            {
                root: null,
                rootMargin: '0px 0px 200px 0px',
            },
        );
        observer.observe(node);
        return () => {
            if (node) observer.unobserve(node);
        };
    }, [hasMore, isLoadingInitial, isLoadingMore, fetchProducts, hasFetchedInitialData]);

    const handleFilterChange = (newFilters: ActiveFilters) => {
        setFilters(newFilters);
        setPageToFetch(1);
        isFiltersChanged.current = true;
        hasFetchedInitialData.current = false;
        rowVirtualizer.scrollToOffset(0, { align: 'start' });
    };

    const handleTabChange = (brewMethodId: string | 'all') => {
        setFilters((prev) => ({ ...prev, brew_method_id: String(brewMethodId) }));
        setPageToFetch(1);
        isFiltersChanged.current = true;
        hasFetchedInitialData.current = false;
        rowVirtualizer.scrollToOffset(0, { align: 'start' });
    };

    const resetAdvancedFilters = () => {
        setFilters({ type: 'all', origin_id: 'all', process_id: 'all', brew_method_id: 'all' });
        setPageToFetch(1);
        isFiltersChanged.current = true;
        hasFetchedInitialData.current = false;
        rowVirtualizer.scrollToOffset(0, { align: 'start' });
    };

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Jelajahi Kopi" />

            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="relative mb-10 h-[450px] w-full overflow-hidden rounded-3xl bg-gray-900 shadow-xl">
                    <img
                        src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1920&auto=format&fit=crop"
                        alt="Coffee Background"
                        className="absolute inset-0 h-full w-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-md md:text-6xl">Our Coffee Menu</h1>
                        <p className="mb-8 max-w-2xl text-lg font-light text-gray-200 drop-shadow-sm md:text-xl">
                            Discover our carefully curated selection of premium coffees from around the world
                        </p>
                        <div className="group relative w-full max-w-lg">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                                <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search Coffee.."
                                className="block w-full rounded-full border-none bg-white py-4 pr-6 pl-14 text-lg text-gray-900 shadow-lg focus:ring-4 focus:ring-orange-500/50 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="mb-6 flex justify-end">
                    <ProductFilters
                        filterOptions={filterOptions}
                        filters={filters}
                        setFilters={handleFilterChange}
                        onReset={resetAdvancedFilters}
                        resultCount={totalResults}
                    />
                </div>

                {/* Tabs */}
                <div className="relative mb-8 border-b border-gray-200">
                    <div className="scrollbar-hide -mb-px flex justify-center space-x-4 overflow-x-auto sm:space-x-8">
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

                {/* --- PRODUCT LIST (VIRTUALIZED) --- */}
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        position: 'relative',
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
                                        // PENTING: Passing onClick yang memicu modal
                                        <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product)} />
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

                {/* Loading / End Indicators */}
                {hasMore && (
                    <div ref={loadMoreRef} className="mt-12 flex justify-center py-4">
                        {(isLoadingMore || (isLoadingInitial && allProducts.length > 0)) && <p className="text-gray-600">Loading more products...</p>}
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

            {/* --- MODAL POPUP PRODUCT DETAIL --- */}
            {/* 
               DialogContent dibuat lebar (max-w-5xl) dan transparan backgroundnya
               agar ProductDetail bisa mengisi ruang dengan desainnya sendiri.
               overflow-y-auto memungkinkan scroll di dalam modal jika konten panjang.
            */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="block max-h-[90vh] max-w-5xl overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-2xl">
                    {selectedProduct && (
                        // Passing isModal=true untuk menyembunyikan tombol back & styling container
                        <ProductDetail product={selectedProduct} inModal={true} />
                    )}
                </DialogContent>
            </Dialog>
        </AppHeaderLayout>
    );
}
