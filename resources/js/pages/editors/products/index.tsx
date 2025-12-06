import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Check, ChevronDown, CloudUpload, Filter, Plus, Search, SquarePen, Trash2, X } from 'lucide-react';
import { useState } from 'react';

// --- IMPORT KOMPONEN UI ---
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- DATA DUMMY ---
const productData = [
    {
        id: 1,
        name: 'The Sagara 1999',
        description: 'Our flagship blend with rich chocolate and caramel notes',
        category: 'Espresso Based',
        price: 'Rp . 120.000',
        status: 'Available',
        stock: 90,
        sale: 90,
        color: 'bg-[#2e236c]',
    },
    {
        id: 2,
        name: 'Ringguy',
        description: 'Our flagship blend with rich chocolate and caramel notes',
        category: 'Filter Series',
        price: 'Rp . 110.000',
        status: 'Available',
        stock: 35,
        sale: 35,
        color: 'bg-[#6b21a8]',
    },
    {
        id: 3,
        name: 'Angin - Angin',
        description: 'Our flagship blend with rich chocolate and caramel notes',
        category: 'Filter Series',
        price: 'Rp . 135.000',
        status: 'Sold',
        stock: 0,
        sale: 0,
        color: 'bg-[#fca5a5]',
    },
];

// Opsi Filter
const filterOptions = ['All Status', 'Available', 'Sold'];

export default function ProductManagement({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
    // --- STATE MANAGEMENT ---
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [isEditProductOpen, setIsEditProductOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<(typeof productData)[0] | null>(null);
    const [filterStatus, setFilterStatus] = useState('All Status');

    // --- LOGIC ---
    const filteredProducts = productData.filter((product) => {
        if (filterStatus === 'All Status') return true;
        return product.status === filterStatus;
    });

    const handleEditClick = (product: (typeof productData)[0]) => {
        setSelectedProduct(product);
        setIsEditProductOpen(true);
    };

    const formatPriceForInput = (price: string) => {
        return price.replace('Rp . ', '');
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Product List" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="relative min-h-[85vh] w-full rounded-xl border border-sidebar-border/70 bg-white p-8 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="inline-block text-xl font-bold text-[#2e236c] dark:text-white">Product List</h1>
                    </div>

                    {/* Search & Filter */}
                    <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="relative w-full md:w-[45%]">
                            <Search className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-[#2e236c]" />
                            <input
                                type="text"
                                placeholder="Search Products"
                                className="w-full rounded-full border border-[#2e236c]/40 bg-transparent py-3 pr-6 pl-14 text-sm text-[#2e236c] placeholder:text-[#2e236c]/60 focus:ring-2 focus:ring-[#2e236c]/20 focus:outline-none"
                            />
                        </div>
                        <div className="w-full md:w-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex w-full items-center justify-between gap-4 rounded-full border border-[#2e236c]/40 bg-transparent px-6 py-3 text-sm text-[#2e236c]/80 outline-none hover:bg-gray-50 md:min-w-[200px]">
                                        <div className="flex items-center gap-3">
                                            <Filter className="h-5 w-5" />
                                            <span>{filterStatus}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-[200px] rounded-xl border border-gray-200 bg-white p-2 text-[#2e236c] shadow-lg"
                                >
                                    {filterOptions.map((option) => (
                                        <DropdownMenuItem
                                            key={option}
                                            onClick={() => setFilterStatus(option)}
                                            className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 font-medium hover:bg-gray-100 focus:bg-gray-100"
                                        >
                                            {option}
                                            {filterStatus === option && <Check className="h-4 w-4 text-[#2e236c]" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Button Add Product */}
                    <div className="mb-8">
                        <button
                            onClick={() => setIsAddProductOpen(true)}
                            className="flex items-center gap-2 rounded-full bg-[#2e236c] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2e236c]/90"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Add Product</span>
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="text-sm font-bold text-[#2e236c]">
                                    <th className="w-[30%] pr-4 pb-4">Product</th>
                                    <th className="px-4 pb-4">Category</th>
                                    <th className="px-4 pb-4">Price</th>
                                    <th className="px-4 pb-4">Status</th>
                                    <th className="px-4 pb-4">Stock</th>
                                    <th className="px-4 pb-4">Sale</th>
                                    <th className="pb-4 pl-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((item) => (
                                        <tr key={item.id} className="group hover:bg-gray-50/50">
                                            <td className="py-6 pr-4 align-top">
                                                <div className="flex gap-4">
                                                    <div
                                                        className={`h-14 w-14 shrink-0 rounded-md ${item.color} flex items-center justify-center p-1 text-center text-[9px] leading-tight font-bold text-white shadow-sm`}
                                                    >
                                                        {item.name.split(' ').slice(0, 2).join('\n').toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col pt-1">
                                                        <span className="mb-1 text-[15px] font-bold text-[#2e236c]">{item.name}</span>
                                                        <span className="max-w-[220px] text-xs leading-relaxed font-light text-gray-400">
                                                            {item.description}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6 pt-8 align-top font-medium text-[#2e236c]">{item.category}</td>
                                            <td className="px-4 py-6 pt-8 align-top font-medium text-[#2e236c]">{item.price}</td>
                                            <td className="px-4 py-6 pt-7 align-top">
                                                <span
                                                    className={`rounded-full px-5 py-1.5 text-xs font-medium text-white shadow-sm ${item.status === 'Available' ? 'bg-[#32c945]' : 'bg-[#ff5b5b]'}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-6 pt-8 align-top font-medium text-[#2e236c]">{item.stock}</td>
                                            <td className="px-4 py-6 pt-8 align-top font-medium text-[#2e236c]">{item.sale}</td>
                                            <td className="py-6 pt-7 pl-4 text-right align-top">
                                                <button
                                                    onClick={() => handleEditClick(item)}
                                                    className="text-[#2e236c] transition-colors hover:text-blue-600"
                                                >
                                                    <SquarePen className="h-6 w-6 stroke-[1.5]" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-gray-500">
                                            No products found for status "{filterStatus}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- 1. DIALOG: ADD NEW PRODUCT (UPDATED) --- */}
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogContent className="max-h-[95vh] overflow-y-auto rounded-xl border-none bg-white p-0 shadow-2xl sm:max-w-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4">
                        <DialogTitle className="text-lg font-bold text-[#2e236c]">Add New Product</DialogTitle>
                    </div>

                    {/* Body Form */}
                    <div className="space-y-5 px-6 pb-6">
                        {/* Product Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#2e236c]">Product Name</label>
                            <input
                                type="text"
                                placeholder="Enter Product Name"
                                className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2.5 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#2e236c]">Description</label>
                            <textarea
                                rows={4}
                                placeholder="Product Description"
                                className="w-full resize-none rounded-2xl border border-[#2e236c]/60 px-4 py-3 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                            />
                        </div>

                        {/* Row: Price, Category, Stock */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2e236c]">Price (IDR)</label>
                                <input
                                    type="text"
                                    placeholder="0"
                                    className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2e236c]">Category</label>
                                <Select>
                                    <SelectTrigger className="h-[42px] w-full rounded-full border border-[#2e236c]/60 px-4 py-2 text-sm text-[#2e236c]/60 focus:ring-1 focus:ring-[#2e236c]">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="espresso">Espresso Based</SelectItem>
                                        <SelectItem value="filter">Filter Series</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2e236c]">Stock</label>
                                <input
                                    type="text"
                                    placeholder="0"
                                    className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Upload Section (Sesuai Gambar) */}
                        <div className="mt-2 flex flex-col items-center rounded-lg border border-[#2e236c]/40 p-6 text-center">
                            <h4 className="mb-4 text-sm font-bold text-[#2e236c]">Upload</h4>

                            {/* Drag & Drop Area */}
                            <div className="mb-6 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#2e236c]/20 bg-[#f8f9fc] px-4 py-8">
                                <div className="mb-3">
                                    <CloudUpload className="h-10 w-10 text-[#2e236c]/60" />
                                </div>
                                <p className="mb-1 text-xs font-bold text-black">
                                    Drag & drop files or <span className="cursor-pointer text-[#2e236c] underline">Browse</span>
                                </p>
                                <p className="text-[10px] text-gray-400">Supported formates: JPEG, PNG, JPG</p>
                            </div>

                            {/* File List */}
                            <div className="mb-6 w-full space-y-4 text-left">
                                {/* File 1: Uploading */}
                                <div>
                                    <p className="mb-1 text-xs text-gray-500">Uploading files</p>
                                    <div className="flex items-center justify-between border-b border-[#2e236c] pb-1">
                                        <span className="text-xs text-gray-700">your-file-here.png</span>
                                        <Trash2 className="h-4 w-4 cursor-pointer text-red-500" />
                                    </div>
                                </div>
                                {/* File 2: Uploaded */}
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

                            {/* Upload Button */}
                            <button className="w-full rounded-lg bg-[#2e236c] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#2e236c]/90">
                                Upload File
                            </button>
                        </div>
                    </div>

                    {/* Footer Save Button */}
                    <div className="flex justify-center pt-2 pb-8">
                        <button className="rounded-full bg-[#2e236c] px-12 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#2e236c]/90">
                            Save
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* --- 2. DIALOG: EDIT PRODUCT --- */}
            <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                <DialogContent className="max-h-[95vh] overflow-y-auto rounded-xl border-none bg-white p-0 shadow-2xl sm:max-w-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4">
                        <DialogTitle className="text-lg font-bold text-[#2e236c]">Edit Product</DialogTitle>
                    </div>

                    {/* Body Form (Terisi Data selectedProduct) */}
                    {selectedProduct && (
                        <div className="space-y-5 px-6 pb-6">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2e236c]">Product Name</label>
                                <input
                                    type="text"
                                    defaultValue={selectedProduct.name}
                                    className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2.5 text-sm text-[#2e236c] focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2e236c]">Description</label>
                                <textarea
                                    rows={4}
                                    defaultValue={selectedProduct.description}
                                    className="w-full resize-none rounded-2xl border border-[#2e236c]/60 px-4 py-3 text-sm text-[#2e236c] focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                />
                            </div>

                            {/* Row: Price, Category, Stock */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#2e236c]">Price (IDR)</label>
                                    <input
                                        type="text"
                                        defaultValue={formatPriceForInput(selectedProduct.price)}
                                        className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2 text-sm text-[#2e236c] focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#2e236c]">Category</label>
                                    <Select defaultValue={selectedProduct.category === 'Espresso Based' ? 'espresso' : 'filter'}>
                                        <SelectTrigger className="h-[42px] w-full rounded-full border border-[#2e236c]/60 px-4 py-2 text-sm text-[#2e236c] focus:ring-1 focus:ring-[#2e236c]">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="espresso">Espresso Based</SelectItem>
                                            <SelectItem value="filter">Filter Series</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#2e236c]">Stock</label>
                                    <input
                                        type="text"
                                        defaultValue={selectedProduct.stock}
                                        className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2 text-sm text-[#2e236c] focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Upload Section (Sama seperti Add Product) */}
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

                    {/* Footer Save Button */}
                    <div className="flex justify-center pt-2 pb-8">
                        <button className="rounded-full bg-[#2e236c] px-12 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#2e236c]/90">
                            Save
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
