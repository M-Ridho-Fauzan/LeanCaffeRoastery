import { ProductCreateDialog } from '@/components/products/product-create-dialog';
import { ProductShowDialog } from '@/components/products/product-show-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem, FilterOptions, PaginatedResponse, Product } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios'; // Pastikan axios sudah terinstal dan tersedia
import { ChevronDown, Edit, Plus, Search } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

// Tipe untuk data yang dikirim dari controller
interface Props {
    products: PaginatedResponse<Product>;
    filterOptions: FilterOptions;
    // Tipe diperbaiki agar tidak ada 'any' di sini
    activeFilters: { search: string | undefined; status: string | undefined };
    breadcrumbs: BreadcrumbItem[];
}

// --- Komponen Item List ---
const ProductListItem: React.FC<{ product: Product; onShowDetail: (product: Product) => void }> = ({ product, onShowDetail }) => {
    // Helper untuk generate initial (sesuai design)
    const initials = product.product_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    const isAvailable = product.status;
    const description = product.flavor_notes.length > 50 ? product.flavor_notes.substring(0, 50) + '...' : product.flavor_notes;

    // Ambil Category (Type) dan Origin pertama untuk display ringkas
    // const categoryName = product.type;
    const editRoute = route('admin.products.edit', product.slug);

    return (
        <div className="grid cursor-pointer grid-cols-[1fr_2fr_1.5fr_1fr_1fr_1fr_0.5fr] items-center border-b py-4 transition-colors last:border-b-0 hover:bg-gray-50">
            {/* Product (Image + Name) */}
            <div className="flex items-center space-x-3" onClick={() => onShowDetail(product)}>
                {product.primary_image_url ? (
                    <img src={product.primary_image_url} alt={product.product_name} className="h-10 w-10 rounded-md object-cover" />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-700 text-sm font-semibold text-white">
                        {initials}
                    </div>
                )}
                <div>
                    <div className="text-sm font-semibold text-indigo-800">{product.product_name}</div>
                    <div className="text-xs text-gray-500">{description}</div>
                </div>
            </div>

            {/* Category */}
            {/* <div className="text-sm">{categoryName}</div> */}
            <div className="text-sm">{product.type}</div>

            {/* Price */}
            <div className="font-medium">Rp. {product.price.toLocaleString('id-ID')}</div>

            {/* Status */}
            <div>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                    {isAvailable ? 'Available' : 'Sold'}
                </span>
            </div>

            {/* Stock (sesuai design, namun perlu disesuaikan jika ingin menampilkan Stock saat ini) */}
            <div className="text-sm">{product.stock}</div>

            {/* Action */}
            <div className="text-right">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={editRoute}>
                        <Edit className="h-4 w-4 text-gray-500 hover:text-indigo-700" />
                    </Link>
                </Button>
            </div>
        </div>
    );
};
// --- End Component Item List ---

export default function ProductIndex({ products, filterOptions, activeFilters, breadcrumbs }: Props) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // State untuk filtering (sinkronisasi dengan activeFilters dari server)
    const [search, setSearch] = useState(activeFilters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(activeFilters.status ?? 'All Status'); // 'true', 'false', atau 'All Status'

    const handleFilterChange = useCallback(
        (key: 'search' | 'status', value: string | null) => {
            const newQuery: { [key: string]: string | null } = { ...activeFilters, [key]: value };

            if (value === '' || value === 'All Status' || value === null) {
                delete newQuery[key];
            }

            router.get(route('admin.products.index'), newQuery, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        },
        [activeFilters],
    ); // Dependency: activeFilters (props dari server)

    // Debounce search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            handleFilterChange('search', search);
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, handleFilterChange]);

    // Handler untuk detail produk (akan melakukan AJAX request ke route show)
    const handleShowDetail = (product: Product) => {
        // Melakukan AJAX request ke endpoint show dengan slug (menggunakan axios yang diasumsikan global)
        axios
            .get(route('admin.products.show', product.slug))
            .then((response) => {
                // Perbaikan: memastikan tipe data yang diterima sesuai Product
                setSelectedProduct(response.data.product as Product);
                setIsShowDialogOpen(true);
            })
            .catch((error) => {
                console.error('Error fetching product detail:', error);
            });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Product List" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Product List</h1>

                {/* Filter & Action Area */}
                <div className="mb-6 flex items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Search Products" className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    {/* Filter Dropdown & Add Product Button */}
                    <div className="flex space-x-4">
                        {/* Status Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center">
                                    <span className="mr-2 text-sm">
                                        {statusFilter === 'true' ? 'Available' : statusFilter === 'false' ? 'Sold' : 'All Status'}
                                    </span>
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuCheckboxItem
                                    checked={statusFilter === 'All Status'}
                                    onCheckedChange={() => {
                                        setStatusFilter('All Status');
                                        handleFilterChange('status', null);
                                    }}
                                >
                                    All Status
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={statusFilter === 'true'}
                                    onCheckedChange={() => {
                                        setStatusFilter('true');
                                        handleFilterChange('status', 'true');
                                    }}
                                >
                                    Available
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={statusFilter === 'false'}
                                    onCheckedChange={() => {
                                        setStatusFilter('false');
                                        handleFilterChange('status', 'false');
                                    }}
                                >
                                    Sold
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Add Product Button (Trigger Dialog) */}
                        <Button className="bg-indigo-700 hover:bg-indigo-800" onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </div>
                </div>

                {/* Product List Content */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    {/* Header List */}
                    <div className="grid grid-cols-[1fr_2fr_1.5fr_1fr_1fr_1fr_0.5fr] border-b bg-gray-50 p-4 text-sm font-semibold text-gray-500">
                        <div>Product</div>
                        <div>Category</div>
                        <div>Price</div>
                        <div>Status</div>
                        <div>Stock</div>
                        <div className="text-right">Actions</div>
                    </div>

                    {/* Body List - Perbaikan: memastikan data dilooping dengan benar */}
                    <div className="px-4">
                        {products.data && products.data.length > 0 ? (
                            products.data.map((product) => <ProductListItem key={product.id} product={product} onShowDetail={handleShowDetail} />)
                        ) : (
                            <div className="py-10 text-center text-gray-500">No products found.</div>
                        )}
                    </div>
                    {/* Anda perlu menambahkan komponen Pagination di sini, menggunakan products.meta & products.links */}
                </div>

                {/* Tambahkan Pagination di sini */}
            </div>

            {/* Dialog Create/Edit */}
            <ProductCreateDialog isOpen={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} {...filterOptions} />

            {/* Dialog Show Detail */}
            <ProductShowDialog isOpen={isShowDialogOpen} onOpenChange={setIsShowDialogOpen} product={selectedProduct} />
        </AppSidebarLayout>
    );
}
