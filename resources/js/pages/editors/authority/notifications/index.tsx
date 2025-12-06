import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronDown, Clock, Filter, Trash2 } from 'lucide-react';
import { useState } from 'react';

// --- IMPORT COMPONENT UI ---
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// --- DATA DUMMY (DIPERLUAS DENGAN DETAIL ORDER) ---
const initialNotifications = [
    {
        id: 1,
        title: 'New Order',
        message: 'Order ORD-1755264937855 Has Been Received',
        time: '2 minutes ago',
        isNew: true, // Background ungu
        // Data Detail Order untuk Pop-up
        orderDetail: {
            id: 'ORD-1755264937855',
            status: 'Waiting',
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
            timestamp: '9/2/2025, 04:03',
        },
    },
    {
        id: 2,
        title: 'Status Updated',
        message: 'Order ORD-1755264937855 To Be processing',
        time: '10 minutes ago',
        isNew: false, // Background putih
        // Data Detail Order untuk Pop-up
        orderDetail: {
            id: 'ORD-1755264937855',
            status: 'Processing',
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
            timestamp: '9/2/2025, 04:10',
        },
    },
];

// Helper warna status
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
        case 'Canceled':
            return 'bg-[#ff2e4d] text-white';
        default:
            return 'bg-gray-400 text-white';
    }
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notification', href: '/notifications' },
];

export default function NotificationPage() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filterStatus, setFilterStatus] = useState('All Status');

    // State untuk Pop-up Detail
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedNotif, setSelectedNotif] = useState<(typeof initialNotifications)[0] | null>(null);

    // Fungsi Hapus Notifikasi
    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Mencegah trigger klik pada parent (agar pop-up tidak muncul saat klik hapus)
        setNotifications((prev) => prev.filter((item) => item.id !== id));
    };

    // Fungsi Buka Detail
    const handleOpenDetail = (notif: (typeof initialNotifications)[0]) => {
        setSelectedNotif(notif);
        setIsDialogOpen(true);
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Notification" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="relative min-h-[85vh] w-full rounded-xl border border-sidebar-border/70 bg-white p-8 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    {/* --- HEADER --- */}
                    <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
                        <h1 className="text-xl font-bold text-[#2e236c] dark:text-white">Notification</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex w-full items-center justify-between gap-8 rounded-full border border-[#2e236c] bg-white px-6 py-2.5 text-sm text-[#2e236c] transition-colors outline-none hover:bg-gray-50 md:w-auto">
                                    <div className="flex items-center gap-3">
                                        <Filter className="h-5 w-5" />
                                        <span>{filterStatus}</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px] rounded-xl border border-[#2e236c]/20 bg-white text-[#2e236c]">
                                <DropdownMenuItem
                                    onClick={() => setFilterStatus('All Status')}
                                    className="cursor-pointer rounded-lg font-medium hover:bg-gray-100"
                                >
                                    All Status
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setFilterStatus('Read')}
                                    className="cursor-pointer rounded-lg font-medium hover:bg-gray-100"
                                >
                                    Read
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setFilterStatus('Unread')}
                                    className="cursor-pointer rounded-lg font-medium hover:bg-gray-100"
                                >
                                    Unread
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* --- NOTIFICATION LIST --- */}
                    <div className="space-y-4">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleOpenDetail(notif)} // Klik container membuka pop-up
                                    className={`relative flex cursor-pointer items-center justify-between rounded-[30px] border border-[#2e236c] px-8 py-6 transition-all hover:shadow-md ${
                                        notif.isNew ? 'bg-[#2e236c]/20' : 'bg-white'
                                    }`}
                                >
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-sm font-bold text-[#2e236c] dark:text-white">{notif.title}</h3>
                                        <p className="text-sm font-medium text-[#2e236c] dark:text-gray-200">{notif.message}</p>
                                        <span className="mt-1 text-xs text-[#2e236c]/60 dark:text-gray-400">{notif.time}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(notif.id, e)} // Pass event 'e'
                                        className="z-10 p-2 text-[#2e236c] transition-colors hover:text-red-600"
                                        title="Delete Notification"
                                    >
                                        <Trash2 className="h-6 w-6" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center text-gray-400">No notifications found.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODAL ORDER DETAIL (POP UP) --- */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-none bg-white p-8 text-[#2e236c] shadow-2xl sm:max-w-4xl">
                    {selectedNotif && (
                        <>
                            <DialogHeader className="mb-4">
                                <DialogTitle className="text-xl font-bold text-[#2e236c]">Order Details {selectedNotif.orderDetail.id}</DialogTitle>
                            </DialogHeader>

                            <div className="flex flex-col gap-2">
                                {/* Status */}
                                <div className="mb-4 flex items-center gap-4">
                                    <span className="text-base font-medium text-gray-400">Status :</span>
                                    <span
                                        className={`rounded-full px-6 py-1 text-sm font-bold shadow-sm ${getStatusBadgeStyles(selectedNotif.orderDetail.status)}`}
                                    >
                                        {selectedNotif.orderDetail.status}
                                    </span>
                                </div>

                                <hr className="mb-6 border-gray-300/70" />

                                {/* Customer Info */}
                                <div className="mb-6">
                                    <h3 className="mb-6 text-lg font-bold text-[#2e236c]">Information Customer</h3>
                                    <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
                                        <div>
                                            <p className="mb-2 text-sm text-gray-400">Name</p>
                                            <p className="text-base font-bold text-[#2e236c]">{selectedNotif.orderDetail.customer}</p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-sm text-gray-400">Email</p>
                                            <p className="truncate text-base font-bold text-[#2e236c]" title={selectedNotif.orderDetail.email}>
                                                {selectedNotif.orderDetail.email}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-sm text-gray-400">Phone Number</p>
                                            <p className="text-base font-bold text-[#2e236c]">{selectedNotif.orderDetail.phone}</p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-sm text-gray-400">City</p>
                                            <p className="text-base font-bold text-[#2e236c]">{selectedNotif.orderDetail.city}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                                        <div className="md:col-span-2">
                                            <p className="mb-2 text-sm text-gray-400">Address</p>
                                            <p className="text-base leading-snug font-bold text-[#2e236c]">{selectedNotif.orderDetail.address}</p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-sm text-gray-400">Postal Code</p>
                                            <p className="text-base font-bold text-[#2e236c]">{selectedNotif.orderDetail.postalCode}</p>
                                        </div>
                                    </div>
                                </div>

                                <hr className="mb-6 border-gray-300/70" />

                                {/* Order Items */}
                                <div className="mb-4">
                                    <h3 className="mb-6 text-lg font-bold text-[#2e236c]">Order Items</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm font-medium">
                                            <span className="text-base text-gray-400">Item Ordered</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-bold text-[#2e236c]">
                                                {selectedNotif.orderDetail.items.replace('(1)', 'x 1').replace('(2)', 'x 2')}
                                            </span>
                                            <span className="text-base font-bold text-[#2e236c]">{selectedNotif.orderDetail.itemPrice}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-bold text-[#2e236c]">Shipping</span>
                                            <span className="text--[#2e236c] text-base font-bold">{selectedNotif.orderDetail.shipping}</span>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-6 border-gray-300/70" />

                                {/* Total Paid */}
                                <div className="mb-12 flex items-center justify-between">
                                    <span className="text-xl font-bold text-[#2e236c]">Total Paid</span>
                                    <span className="text-xl font-bold text-[#2e236c]">{selectedNotif.orderDetail.total}</span>
                                </div>

                                <hr className="mb-6 border-gray-300/70" />

                                {/* Timestamps */}
                                <div className="flex flex-col gap-3 text-sm text-gray-400">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5" />
                                        <span>Made : {selectedNotif.orderDetail.timestamp}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5" />
                                        <span>Updated : {selectedNotif.orderDetail.timestamp}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
