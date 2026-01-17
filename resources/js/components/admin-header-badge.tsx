import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { OrderDetail } from '@/types';
import { Bell, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface AdminHeaderBadgeProps {
    notifClick: (order: OrderDetail) => void;
    selectOrder: OrderDetail | null;
}

// --- MOCK DATA ---
const mockNotifications: OrderDetail[] = [
    {
        id: 'ORD-1755264937855',
        status: 'Waiting',
        notificationTitle: 'New Order',
        notificationDesc: 'Order ORD-1755264937855 Has Been Received',
        notificationTime: '2 minutes ago',
        customer: {
            name: 'Theral',
            email: 'Thrl6@gmail.com',
            phone: '+6281234567890',
            city: 'Cianjur, Indonesia',
            address: 'Jawa Barat, Cianjur, Sukanagara, JL.Raya Sukanagara Rt,004/Rw005',
            postalCode: '43264',
        },
        items: [{ name: 'The Sagara 1999', qty: 1, price: 120000 }],
        shippingCost: 15000,
        madeAt: '9/2/2025, 04:03',
        updatedAt: '9/2/2025, 04:03',
    },
    {
        id: 'ORD-1755264937855',
        status: 'Processing',
        notificationTitle: 'Status Updated',
        notificationDesc: 'Order ORD-1755264937855 To Be processing',
        notificationTime: '10 minutes ago',
        customer: {
            name: 'Theral',
            email: 'Thrl6@gmail.com',
            phone: '+6281234567890',
            city: 'Cianjur, Indonesia',
            address: 'Jawa Barat, Cianjur, Sukanagara, JL.Raya Sukanagara Rt,004/Rw005',
            postalCode: '43264',
        },
        items: [{ name: 'The Sagara 1999', qty: 1, price: 120000 }],
        shippingCost: 15000,
        madeAt: '9/2/2025, 04:03',
        updatedAt: '9/2/2025, 04:13',
    },
];

const formatRupiah = (number: number) => `Rp . ${number.toLocaleString('id-ID')}`;

export default function AdminHeaderBadge({ notifClick, selectOrder }: AdminHeaderBadgeProps) {
    const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

    return (
        <>
            {/* === ADMIN NOTIFICATION === */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="group relative h-9 w-9 cursor-pointer" aria-label="Notifications">
                        <Bell className="!size-5 text-slate-700 opacity-80 transition-opacity group-hover:opacity-100" />
                        {mockNotifications.length > 0 && (
                            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-[380px] overflow-hidden rounded-2xl border border-slate-100 bg-white p-0 shadow-2xl"
                >
                    <div className="bg-white px-5 pt-5 pb-3">
                        <h3 className="text-xl font-extrabold text-[#2D2A6E]">Notifications</h3>
                    </div>
                    <div className="relative h-[2px] w-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-[#2D2A6E]/80 to-indigo-500/10 blur-[1px]"></div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto bg-white py-2">
                        {mockNotifications.map((notif, index) => (
                            <DropdownMenuItem
                                key={index}
                                className="cursor-pointer px-5 py-3 hover:bg-slate-50 focus:bg-slate-50"
                                onClick={() => notifClick}
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold text-[#2D2A6E]">{notif.notificationTitle}</span>
                                    <span className="text-sm leading-snug font-medium text-slate-700">{notif.notificationDesc}</span>
                                    <span className="mt-1 text-xs text-slate-400">{notif.notificationTime}</span>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* === POPUP ORDER DETAILS === */}
            <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
                {/*
                                        PERUBAHAN UKURAN:
                                        sm:max-w-4xl (diperlebar agar tidak sempit)
                                    */}
                <DialogContent className="gap-0 overflow-hidden rounded-xl bg-white p-0 sm:max-w-4xl sm:rounded-2xl">
                    {selectOrder && (
                        <>
                            {/* HEADER */}
                            <div className="flex items-start justify-between p-6 pb-2">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold text-[#2D2A6E]">Order Details {selectOrder.id}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-slate-400">Status :</span>
                                        <span className="rounded-full bg-yellow-400 px-4 py-0.5 text-xs font-bold text-white shadow-sm">
                                            {selectOrder.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6">
                                <div className="h-[1px] w-full bg-slate-200"></div>
                            </div>

                            <div className="space-y-6 p-6">
                                {/* INFORMATION CUSTOMER */}
                                <div>
                                    <h3 className="mb-4 text-base font-bold text-[#2D2A6E]">Information Customer</h3>
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-4">
                                        {/* Row 1 */}
                                        <div>
                                            <p className="mb-1 text-xs text-slate-400">Name</p>
                                            <p className="text-sm font-bold text-[#2D2A6E]">{selectOrder.customer.name}</p>
                                        </div>
                                        <div className="md:col-span-1">
                                            <p className="mb-1 text-xs text-slate-400">Email</p>
                                            {/* Email sekarang lebih lega, truncate hanya kalau sangat panjang */}
                                            <p className="truncate text-sm font-bold text-[#2D2A6E]" title={selectOrder.customer.email}>
                                                {selectOrder.customer.email}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs text-slate-400">Phone Number</p>
                                            <p className="text-sm font-bold text-[#2D2A6E]">{selectOrder.customer.phone}</p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs text-slate-400">City</p>
                                            <p className="text-sm font-bold text-[#2D2A6E]">{selectOrder.customer.city}</p>
                                        </div>

                                        {/* Row 2 */}
                                        <div className="md:col-span-3">
                                            <p className="mb-1 text-xs text-slate-400">Address</p>
                                            <p className="text-sm leading-tight font-bold text-[#2D2A6E]">{selectOrder.customer.address}</p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs text-slate-400">Postal Code</p>
                                            <p className="text-sm font-bold text-[#2D2A6E]">{selectOrder.customer.postalCode}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[1px] w-full bg-slate-200"></div>

                                {/* ORDER ITEMS */}
                                <div>
                                    <h3 className="mb-4 text-base font-bold text-[#2D2A6E]">Order Items</h3>
                                    <p className="mb-2 text-xs text-slate-400">Item Ordered</p>

                                    <div className="space-y-2">
                                        {selectOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-[#2D2A6E]">
                                                    {item.name} x {item.qty}
                                                </span>
                                                <span className="text-sm font-bold text-[#2D2A6E]">{formatRupiah(item.price * item.qty)}</span>
                                            </div>
                                        ))}

                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-sm font-bold text-[#2D2A6E]">Shipping</span>
                                            <span className="text-sm font-bold text-[#2D2A6E]">{formatRupiah(selectOrder.shippingCost)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[1px] w-full bg-slate-200"></div>

                                {/* TOTAL PAID */}
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-bold text-[#2D2A6E]">Total Paid</span>
                                    <span className="text-lg font-extrabold text-[#2D2A6E]">
                                        {formatRupiah(
                                            selectOrder.items.reduce((acc, curr) => acc + curr.price * curr.qty, 0) + selectOrder.shippingCost,
                                        )}
                                    </span>
                                </div>

                                <div className="h-[1px] w-full bg-slate-200"></div>

                                {/* FOOTER */}
                                <div className="space-y-2 pt-2 pb-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Clock className="h-4 w-4" />
                                        <span>Made : {selectOrder.madeAt}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Clock className="h-4 w-4" />
                                        <span>Updated : {selectOrder.updatedAt}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
