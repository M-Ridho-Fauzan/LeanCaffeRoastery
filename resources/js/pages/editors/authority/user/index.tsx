import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Check, ChevronDown, Clock, Eye, Filter, MoreHorizontal, Search } from 'lucide-react'; // Tambah import Check
import { useState } from 'react';

// --- IMPORT KOMPONEN UI ---
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// --- DATA DUMMY ---
const initialOrderData = [
    {
        id: 'ORD-1755264937855',
        customer: 'Theral',
        email: 'Thrl6@gmail.com',
        phone: '+6281234567890',
        city: 'Cianjur, Indonesia',
        address: 'Jawa Barat, Cianjur, Sukanagara, JL.Raya Sukanagara Rt,004/Rw005',
        postalCode: '43264',
        items: 'The Sagara 1999 (1)',
        itemPrice: 'Rp . 120.000',
        shipping: 'Rp . 15.000',
        total: 'Rp . 135.000',
        status: 'Waiting',
        time: '9/2/2025, 04:03',
    },
    {
        id: 'ORD-1755264937856',
        customer: 'Dios',
        email: 'dios@example.com',
        phone: '+6281234567891',
        city: 'Bandung, Indonesia',
        address: 'Jawa Barat, Bandung, Sukajadi',
        postalCode: '40162',
        items: 'Ringguy (2)',
        itemPrice: 'Rp . 200.000',
        shipping: 'Rp . 20.000',
        total: 'Rp . 220.000',
        status: 'Processing',
        time: '29/1/2025, 02:00',
    },
    {
        id: 'ORD-1755264937857',
        customer: 'Deni',
        email: 'deni@example.com',
        phone: '+6281234567892',
        city: 'Jakarta, Indonesia',
        address: 'DKI Jakarta, Tebet',
        postalCode: '12810',
        items: 'Angin-Angin (1)',
        itemPrice: 'Rp . 120.000',
        shipping: 'Rp . 15.000',
        total: 'Rp . 135.000',
        status: 'Shipped',
        time: '19/1/2025, 10:40',
    },
    {
        id: 'ORD-1755264937858',
        customer: 'Adam',
        email: 'adam@example.com',
        phone: '+6281234567893',
        city: 'Surabaya, Indonesia',
        address: 'Jawa Timur, Surabaya',
        postalCode: '60251',
        items: 'Angin-Angin (1), Ringguy (1)',
        itemPrice: 'Rp . 230.000',
        shipping: 'Rp . 15.000',
        total: 'Rp . 245.000',
        status: 'Delivered',
        time: '9/1/2025, 14:20',
    },
    {
        id: 'ORD-1755264937859',
        customer: 'Ridho',
        email: 'ridho@example.com',
        phone: '+6281234567894',
        city: 'Medan, Indonesia',
        address: 'Sumatera Utara, Medan',
        postalCode: '20111',
        items: 'Angin-Angin (1)',
        itemPrice: 'Rp . 120.000',
        shipping: 'Rp . 15.000',
        total: 'Rp . 135.000',
        status: 'Canceled',
        time: '5/1/2025, 16:24',
    },
];

// Helper Function untuk Warna Status
const getStatusBadgeStyles = (status: string) => {
    switch (status) {
        case 'Waiting':
            return 'bg-yellow-400 text-white';
        case 'Processing':
            return 'bg-[#00b4d8] text-white';
        case 'Shipped':
            return 'bg-[#00c49a] text-white';
        case 'Delivered':
            return 'bg-[#4cc958] text-white';
        case 'Finished':
            return 'bg-[#2e236c] text-white';
        case 'Canceled':
            return 'bg-[#ff2e4d] text-white';
        default:
            return 'bg-gray-400 text-white';
    }
};

// Daftar Opsi Filter
const filterOptions = ['All Status', 'Processing', 'Shipped', 'Delivered', 'Finished', 'Canceled'];

export default function OrderList({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
    // --- STATE MANAGEMENT ---
    const [orders, setOrders] = useState(initialOrderData);
    const [selectedOrder, setSelectedOrder] = useState<(typeof initialOrderData)[0] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // State untuk Filter
    const [filterStatus, setFilterStatus] = useState('All Status');

    // --- LOGIC ---

    // 1. Filter Logic (Derived State)
    const filteredOrders = orders.filter((order) => {
        if (filterStatus === 'All Status') return true;
        return order.status === filterStatus;
    });

    // 2. Open Detail Modal
    const handleOpenDetail = (order: (typeof initialOrderData)[0]) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    // 3. Change Status
    const handleStatusChange = (orderId: string, newStatus: string) => {
        setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Order List" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="relative min-h-[85vh] w-full rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-[#2e236c] dark:text-white">Order List</h1>
                    </div>

                    {/* Controls (Search & Filter) */}
                    <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-[400px]">
                            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#2e236c]" />
                            <input
                                type="text"
                                placeholder="Search for Orders or Customers"
                                className="w-full rounded-full border border-[#2e236c]/40 bg-transparent py-2.5 pr-4 pl-12 text-sm text-[#2e236c] placeholder:text-[#2e236c]/60 focus:ring-2 focus:ring-[#2e236c]/20 focus:outline-none"
                            />
                        </div>

                        {/* Filter Button (Dropdown) */}
                        <div className="w-full md:w-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex w-full items-center justify-between gap-8 rounded-full border border-[#2e236c]/40 bg-transparent px-5 py-2.5 text-sm text-[#2e236c]/80 outline-none hover:bg-gray-50 md:w-auto">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-4 w-4" />
                                            {/* Menampilkan Status yang sedang dipilih */}
                                            <span>{filterStatus}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                </DropdownMenuTrigger>

                                {/* Isi Dropdown Filter */}
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
                                            {/* Tampilkan Checklist jika status aktif */}
                                            {filterStatus === option && <Check className="h-4 w-4 text-[#2e236c]" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="text-xs font-bold tracking-wide text-[#2e236c] uppercase">
                                    <th className="pr-4 pb-4 pl-2">Order ID</th>
                                    <th className="px-4 pb-4">Customer</th>
                                    <th className="px-4 pb-4">Items</th>
                                    <th className="px-4 pb-4">Total</th>
                                    <th className="px-4 pb-4">Status</th>
                                    <th className="px-4 pb-4">Time</th>
                                    <th className="pb-4 pl-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {/* MENGGUNAKAN FILTERED ORDERS (Bukan orders mentah) */}
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order, index) => (
                                        <tr key={index} className="group hover:bg-gray-50/50">
                                            <td className="py-5 pr-4 pl-2 font-medium text-[#2e236c] dark:text-gray-300">{order.id}</td>
                                            <td className="px-4 py-5 text-[#2e236c] dark:text-gray-300">{order.customer}</td>
                                            <td className="max-w-[200px] truncate px-4 py-5 text-[#2e236c] dark:text-gray-300">{order.items}</td>
                                            <td className="px-4 py-5 font-medium text-[#2e236c] dark:text-gray-300">{order.total}</td>
                                            <td className="px-4 py-5">
                                                <span
                                                    className={`inline-block min-w-[80px] rounded-full px-4 py-1.5 text-center text-xs font-medium ${getStatusBadgeStyles(order.status)}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-5 text-[#2e236c]/70 dark:text-gray-400">{order.time}</td>
                                            <td className="py-5 pl-4 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => handleOpenDetail(order)}
                                                        className="text-[#2e236c] transition-colors hover:text-blue-600"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button
                                                                className="text-[#2e236c] transition-colors outline-none hover:text-blue-600"
                                                                title="More Options"
                                                            >
                                                                <MoreHorizontal className="h-5 w-5" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-[200px] rounded-xl border border-gray-200 bg-white p-1 text-[#2e236c] shadow-lg"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(order.id, 'Processing')}
                                                                className="cursor-pointer rounded-lg px-3 py-2.5 font-medium hover:bg-gray-100"
                                                            >
                                                                Change to Processing
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(order.id, 'Shipped')}
                                                                className="cursor-pointer rounded-lg px-3 py-2.5 font-medium hover:bg-gray-100"
                                                            >
                                                                Change to Shipped
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(order.id, 'Delivered')}
                                                                className="cursor-pointer rounded-lg px-3 py-2.5 font-medium hover:bg-gray-100"
                                                            >
                                                                Change to Delivered
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(order.id, 'Finished')}
                                                                className="cursor-pointer rounded-lg px-3 py-2.5 font-medium hover:bg-gray-100"
                                                            >
                                                                Change to Finished
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(order.id, 'Canceled')}
                                                                className="cursor-pointer rounded-lg px-3 py-2.5 font-medium text-red-600 hover:bg-red-50"
                                                            >
                                                                Cancel Order
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-gray-500">
                                            No orders found for status "{filterStatus}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Detail Order (Tetap sama) */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-none bg-white p-8 text-[#2e236c] shadow-2xl sm:max-w-4xl">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold text-[#2e236c]">Order Details {selectedOrder?.id}</DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="flex flex-col gap-2">
                            <div className="mb-4 flex items-center gap-4">
                                <span className="text-base font-medium text-gray-400">Status :</span>
                                <span className={`rounded-full px-6 py-1 text-sm font-bold shadow-sm ${getStatusBadgeStyles(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                            <hr className="mb-6 border-gray-300/70" />
                            <div className="mb-6">
                                <h3 className="mb-6 text-lg font-bold text-[#2e236c]">Information Customer</h3>
                                <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
                                    <div>
                                        <p className="mb-2 text-sm text-gray-400">Name</p>
                                        <p className="text-base font-bold text-[#2e236c]">{selectedOrder.customer}</p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-sm text-gray-400">Email</p>
                                        <p className="truncate text-base font-bold text-[#2e236c]" title={selectedOrder.email}>
                                            {selectedOrder.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-sm text-gray-400">Phone Number</p>
                                        <p className="text-base font-bold text-[#2e236c]">{selectedOrder.phone}</p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-sm text-gray-400">City</p>
                                        <p className="text-base font-bold text-[#2e236c]">{selectedOrder.city}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                                    <div className="md:col-span-2">
                                        <p className="mb-2 text-sm text-gray-400">Address</p>
                                        <p className="text-base leading-snug font-bold text-[#2e236c]">{selectedOrder.address}</p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-sm text-gray-400">Postal Code</p>
                                        <p className="text-base font-bold text-[#2e236c]">{selectedOrder.postalCode}</p>
                                    </div>
                                </div>
                            </div>
                            <hr className="mb-6 border-gray-300/70" />
                            <div className="mb-4">
                                <h3 className="mb-6 text-lg font-bold text-[#2e236c]">Order Items</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span className="text-base text-gray-400">Item Ordered</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold text-[#2e236c]">
                                            {selectedOrder.items.replace('(1)', 'x 1').replace('(2)', 'x 2')}
                                        </span>
                                        <span className="text-base font-bold text-[#2e236c]">{selectedOrder.itemPrice}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold text-[#2e236c]">Shipping</span>
                                        <span className="text-base font-bold text-[#2e236c]">{selectedOrder.shipping}</span>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-6 border-gray-300/70" />
                            <div className="mb-12 flex items-center justify-between">
                                <span className="text-xl font-bold text-[#2e236c]">Total Paid</span>
                                <span className="text-xl font-bold text-[#2e236c]">{selectedOrder.total}</span>
                            </div>
                            <hr className="mb-6 border-gray-300/70" />
                            <div className="flex flex-col gap-3 text-sm text-gray-400">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5" />
                                    <span>Made : {selectedOrder.time}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5" />
                                    <span>Updated : {selectedOrder.time}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
