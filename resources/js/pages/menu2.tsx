/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 23/08/2025 - 21:04:50
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 23/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

// Komponen UI dari shadcn/ui
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Ikon dari lucide-react
import { MapPin, Recycle, Wheat } from 'lucide-react';

// Komponen Filter Kustom
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
interface Product {
    id: number;
    slug: string; // Menambahkan slug untuk link
    product_name: string;
    price: number;
    flavor_notes: string;
    type: string;
    is_specialty: boolean;
    origins: Origin[];
    processes: Process[];
    brew_methods: BrewMethod[];
    image_url: string; // Menambahkan image_url untuk tampilan
}

interface FilterOptions {
    brewMethods: BrewMethod[];
    origins: Origin[];
    processes: Process[];
    types: string[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Menu', href: route('products.index') }];

// --- Komponen Halaman Utama ---
export default function ProductIndex() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        brewMethods: [],
        origins: [],
        processes: [],
        types: [],
    });
    const [activeTab, setActiveTab] = useState<number | 'all'>('all');
    const [filters, setFilters] = useState({ origin: 'all', process: 'all', type: 'all' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsRes, filtersRes] = await Promise.all([
                    axios.get(route('products.index.api')),
                    axios.get(route('filters.options.api')),
                ]);
                setAllProducts(productsRes.data.data);
                setFilterOptions(filtersRes.data);
            } catch (error) {
                console.error('Gagal mengambil data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = useMemo(() => {
        return allProducts.filter((product) => {
            const brewMethodMatch = activeTab === 'all' || product.brew_methods.some((bm) => bm.id === activeTab);
            const originMatch = filters.origin === 'all' || product.origins.some((o) => String(o.id) === filters.origin);
            const processMatch = filters.process === 'all' || product.processes.some((p) => String(p.id) === filters.process);
            const typeMatch = filters.type === 'all' || product.type === filters.type;

            return brewMethodMatch && originMatch && processMatch && typeMatch;
        });
    }, [allProducts, activeTab, filters]);

    const resetAdvancedFilters = () => {
        setFilters({ origin: 'all', process: 'all', type: 'all' });
    };

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Welcome" />

            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* --- HEADER & FILTER --- */}
                <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Jelajahi Kopi Kami</h1>
                    <ProductFilters
                        filterOptions={filterOptions}
                        filters={filters}
                        setFilters={setFilters}
                        onReset={resetAdvancedFilters}
                        resultCount={filteredProducts.length}
                    />
                </div>

                {/* --- TABS METODE PENYAJIAN --- */}
                <div className="relative mb-8 border-b border-gray-200">
                    <div className="scrollbar-hide -mb-px flex space-x-4 overflow-x-auto sm:space-x-8">
                        <TabButton label="Semua" isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} />
                        {filterOptions.brewMethods.map((bm) => (
                            <TabButton key={bm.id} label={bm.brew_name} isActive={activeTab === bm.id} onClick={() => setActiveTab(bm.id)} />
                        ))}
                    </div>
                </div>

                {/* --- DAFTAR PRODUK --- */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => <ProductCardSkeleton key={index} />)
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
                    ) : (
                        <div className="col-span-full mt-16 text-center">
                            <h3 className="text-lg font-semibold text-gray-800">Tidak Ada Kopi yang Ditemukan</h3>
                            <p className="mt-2 text-gray-500">Coba atur ulang atau ubah filter Anda untuk hasil yang lebih baik.</p>
                            <Button
                                onClick={() => {
                                    resetAdvancedFilters();
                                    setActiveTab('all');
                                }}
                                className="mt-4"
                            >
                                Atur Ulang Semua Filter
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppHeaderLayout>
    );
}

// --- Komponen Pembantu ---

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
    const withPlus = text.replace(/\s+/g, '+');

    const hasil = withPlus.length > maxLength ? withPlus.substring(0, maxLength) + '...' : withPlus;

    console.log(hasil);

    return hasil;
};

const ProductCard = ({ product }: { product: Product }) => (
    <Link href={route('products.show', { product: product.slug })} className="group">
        <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lg">
            <CardHeader className="p-0">
                <div className="aspect-h-1 aspect-w-1 relative w-full overflow-hidden bg-gray-200">
                    <img
                        src={
                            !product.image_url?.trim()
                                ? `https://placehold.co/600x400/EEE/31343C?text=${truncateText(product.product_name, 20)}`
                                : product.image_url
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
