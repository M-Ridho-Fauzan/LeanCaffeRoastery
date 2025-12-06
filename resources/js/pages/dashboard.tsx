import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Clock, Eye, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

// Import komponen UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// --- DATA DUMMY AWAL ---

const salesData = [
    { day: 'Mon', sales: 5 },
    { day: 'Tue', sales: 10 },
    { day: 'Wed', sales: 8 },
    { day: 'Thu', sales: 25 },
    { day: 'Fri', sales: 15 },
    { day: 'Sat', sales: 18 },
    { day: 'Sun', sales: 8 },
];

const chartConfig = {
    sales: {
        label: 'Sales',
        color: '#2e236c',
    },
} satisfies ChartConfig;

const initialOrders = [
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

// Helper warna badge (Saya tambahkan 'Finished' agar ada warnanya)
const getStatusColor = (status: string) => {
    switch (status) {
        case 'Waiting':
            return 'bg-yellow-400 text-white';
        case 'Processing':
            return 'bg-sky-400 text-white';
        case 'Shipped':
            return 'bg-teal-400 text-white';
        case 'Delivered':
            return 'bg-green-500 text-white';
        case 'Finished':
            return 'bg-[#2e236c] text-white'; // Tambahan warna untuk Finished
        case 'Canceled':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-400 text-white';
    }
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    // 1. Mengubah Data Order menjadi State agar bisa diupdate
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<(typeof initialOrders)[0] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fungsi membuka Detail (Icon Mata)
    const handleOpenDetail = (order: (typeof initialOrders)[0]) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    // Fungsi mengubah Status (Dropdown)
    const handleStatusChange = (orderId: string, newStatus: string) => {
        setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                {/* --- CHART SECTION --- */}
                <Card className="w-full rounded-xl border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                    <CardHeader className="pb-2 text-center">
                        <CardTitle className="text-lg font-bold text-[#2e236c] dark:text-white">Sales in the last 7 days</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <BarChart accessibilityLayer data={salesData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={true} />
                                <YAxis tickLine={false} axisLine={true} tickMargin={10} />
                                <ChartTooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* --- TABLE SECTION --- */}
                <Card className="w-full rounded-xl border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-[#2e236c] dark:text-white">Recent Orders</CardTitle>
                        <CardDescription>Latest transaction details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-transparent text-xs font-bold text-[#2e236c] uppercase dark:text-gray-200">
                                    <tr>
                                        <th className="px-4 py-3">Order ID</th>
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Items</th>
                                        <th className="px-4 py-3">Total</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Time</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={index} className="bg-white hover:bg-gray-50 dark:bg-transparent dark:hover:bg-neutral-800/50">
                                            <td className="px-4 py-4 font-medium text-[#2e236c] dark:text-gray-300">{order.id}</td>
                                            <td className="px-4 py-4 text-[#2e236c] dark:text-gray-300">{order.customer}</td>
                                            <td className="max-w-[200px] truncate px-4 py-4 text-[#2e236c] dark:text-gray-300">{order.items}</td>
                                            <td className="px-4 py-4 text-[#2e236c] dark:text-gray-300">{order.total}</td>
                                            <td className="px-4 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{order.time}</td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* TOMBOL MATA (DETAIL) */}
                                                    <button
                                                        onClick={() => handleOpenDetail(order)}
                                                        className="text-[#2e236c] transition hover:text-blue-600 dark:text-white"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>

                                                    {/* TOMBOL TITIK 3 (DROPDOWN STATUS) */}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="text-[#2e236c] transition outline-none hover:text-blue-600 dark:text-white">
                                                                <MoreHorizontal className="h-5 w-5" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        {/* Styling Content agar mirip gambar: Background Putih, Text Biru Tua, Rounded */}
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-[200px] rounded-xl border border-gray-200 bg-white p-1 text-[#2e236c] shadow-lg"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(order.id, 'Processing')}
                                                                className="cursor-pointer rounded-lg px-3 py-2.5 font-medium hover:bg-gray-100 focus:bg-gray-100"
                                                            >
                                                                Change to Processing
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(order.id, 'Shipped')}
                                                                className="cursor-pointer rounded-lg px-3 py-2.5 font-medium hover:bg-gray-100 focus:bg-gray-100"
                                                            >
                                                                Change to Shipped
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(order.id, 'Delivered')}
                                                                className="cursor-pointer rounded-lg px-3 py-2.5 font-medium hover:bg-gray-100 focus:bg-gray-100"
                                                            >
                                                                Change to Delivered
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(order.id, 'Finished')}
                                                                className="cursor-pointer rounded-lg px-3 py-2.5 font-medium hover:bg-gray-100 focus:bg-gray-100"
                                                            >
                                                                Change to Finished
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(order.id, 'Canceled')}
                                                                className="cursor-pointer rounded-lg px-3 py-2.5 font-medium hover:bg-red-50 focus:bg-red-50"
                                                            >
                                                                Cancel Order
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* --- MODAL / DIALOG POP-UP DETAIL --- */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-none bg-white p-8 text-[#2e236c] shadow-2xl sm:max-w-4xl">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold text-[#2e236c]">Order Details {selectedOrder?.id}</DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="flex flex-col gap-2">
                            {/* Status di dalam Modal akan ikut berubah jika data state berubah */}
                            <div className="mb-4 flex items-center gap-4">
                                <span className="text-base font-medium text-gray-400">Status :</span>
                                <span className={`rounded-full px-6 py-1 text-sm font-bold shadow-sm ${getStatusColor(selectedOrder.status)}`}>
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
