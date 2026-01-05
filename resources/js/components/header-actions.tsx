import { Link, usePage } from '@inertiajs/react';
import { Bell, ChevronDown, Clock, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { UserMenuContent } from '@/components/user-menu-content';
import { Icon } from './icon';

import { footerNavItems as rightNavItems } from '@/config/navigation';
import { useInitials } from '@/hooks/use-initials';
import Checkout from '@/pages/ordering/payments/checkout';
import { Product, SharedData } from '@/types';

// --- TIPE DATA ---
interface CartItem {
    id: number;
    name: string;
    price: number;
    qty: number;
    image_url: string | null;
}

// Interface untuk Detail Order
interface OrderDetail {
    id: string;
    status: 'Waiting' | 'Processing' | 'Completed';
    notificationTitle: string;
    notificationDesc: string;
    notificationTime: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        city: string;
        address: string;
        postalCode: string;
    };
    items: {
        name: string;
        qty: number;
        price: number;
    }[];
    shippingCost: number;
    madeAt: string;
    updatedAt: string;
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

export function HeaderActions() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const user = auth.user as any;
    const getInitials = useInitials();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // --- STATE POPUP ORDER DETAIL ---
    const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

    const isAdmin = user?.role === 'admin';

    const formatRupiah = (number: number) => `Rp . ${number.toLocaleString('id-ID')}`;

    // --- LOGIKA KERANJANG ---
    const loadCartFromStorage = () => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cart-storage');
            if (saved) {
                try {
                    setCartItems(JSON.parse(saved));
                } catch (e) {
                    console.error('Error parsing cart', e);
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
            }
        }
    };

    const updateStorage = (newItems: CartItem[]) => {
        localStorage.setItem('cart-storage', JSON.stringify(newItems));
        setCartItems(newItems);
        window.dispatchEvent(new Event('cart-updated'));
    };

    useEffect(() => {
        loadCartFromStorage();
        const handleCartUpdate = () => loadCartFromStorage();
        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, []);

    const updateQty = (id: number, type: 'plus' | 'minus') => {
        const updated = cartItems.map((item) => {
            if (item.id === id) {
                const newQty = type === 'plus' ? item.qty + 1 : item.qty - 1;
                return { ...item, qty: Math.max(1, newQty) };
            }
            return item;
        });
        updateStorage(updated);
    };

    const removeItem = (id: number) => {
        const updated = cartItems.filter((item) => item.id !== id);
        updateStorage(updated);
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    const mockProductForCheckout: Product = {
        id: 999,
        slug: 'cart-summary',
        product_name: `Your Cart (${cartItems.length} items)`,
        price: totalAmount,
        flavor_notes: `Total Items: ${cartItems.length}`,
        type: 'CART',
        is_specialty: false,
        primary_image_url: null,
        origins: [],
        processes: [],
        brew_methods: [],
    };

    const handleNotificationClick = (order: OrderDetail) => {
        setSelectedOrder(order);
        setIsOrderDetailOpen(true);
    };

    const dialogContentClasses =
        'm-0 flex h-[95vh] w-full max-w-full flex-col rounded-none border p-0 ' +
        'sm:mx-auto sm:my-auto sm:h-auto sm:max-h-[95vh] sm:max-w-2xl sm:rounded-lg md:max-w-3xl lg:max-w-4xl';

    return (
        <div className="ml-auto flex items-center space-x-2">
            <div className="relative flex items-center space-x-1">
                {isAdmin ? (
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
                                            onClick={() => handleNotificationClick(notif)}
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
                                {selectedOrder && (
                                    <>
                                        {/* HEADER */}
                                        <div className="flex items-start justify-between p-6 pb-2">
                                            <div className="space-y-1">
                                                <h2 className="text-lg font-bold text-[#2D2A6E]">Order Details {selectedOrder.id}</h2>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-slate-400">Status :</span>
                                                    <span className="rounded-full bg-yellow-400 px-4 py-0.5 text-xs font-bold text-white shadow-sm">
                                                        {selectedOrder.status}
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
                                                        <p className="text-sm font-bold text-[#2D2A6E]">{selectedOrder.customer.name}</p>
                                                    </div>
                                                    <div className="md:col-span-1">
                                                        <p className="mb-1 text-xs text-slate-400">Email</p>
                                                        {/* Email sekarang lebih lega, truncate hanya kalau sangat panjang */}
                                                        <p className="truncate text-sm font-bold text-[#2D2A6E]" title={selectedOrder.customer.email}>
                                                            {selectedOrder.customer.email}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-xs text-slate-400">Phone Number</p>
                                                        <p className="text-sm font-bold text-[#2D2A6E]">{selectedOrder.customer.phone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-xs text-slate-400">City</p>
                                                        <p className="text-sm font-bold text-[#2D2A6E]">{selectedOrder.customer.city}</p>
                                                    </div>

                                                    {/* Row 2 */}
                                                    <div className="md:col-span-3">
                                                        <p className="mb-1 text-xs text-slate-400">Address</p>
                                                        <p className="text-sm leading-tight font-bold text-[#2D2A6E]">
                                                            {selectedOrder.customer.address}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-xs text-slate-400">Postal Code</p>
                                                        <p className="text-sm font-bold text-[#2D2A6E]">{selectedOrder.customer.postalCode}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="h-[1px] w-full bg-slate-200"></div>

                                            {/* ORDER ITEMS */}
                                            <div>
                                                <h3 className="mb-4 text-base font-bold text-[#2D2A6E]">Order Items</h3>
                                                <p className="mb-2 text-xs text-slate-400">Item Ordered</p>

                                                <div className="space-y-2">
                                                    {selectedOrder.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between">
                                                            <span className="text-sm font-bold text-[#2D2A6E]">
                                                                {item.name} x {item.qty}
                                                            </span>
                                                            <span className="text-sm font-bold text-[#2D2A6E]">
                                                                {formatRupiah(item.price * item.qty)}
                                                            </span>
                                                        </div>
                                                    ))}

                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-sm font-bold text-[#2D2A6E]">Shipping</span>
                                                        <span className="text-sm font-bold text-[#2D2A6E]">
                                                            {formatRupiah(selectedOrder.shippingCost)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="h-[1px] w-full bg-slate-200"></div>

                                            {/* TOTAL PAID */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-bold text-[#2D2A6E]">Total Paid</span>
                                                <span className="text-lg font-extrabold text-[#2D2A6E]">
                                                    {formatRupiah(
                                                        selectedOrder.items.reduce((acc, curr) => acc + curr.price * curr.qty, 0) +
                                                            selectedOrder.shippingCost,
                                                    )}
                                                </span>
                                            </div>

                                            <div className="h-[1px] w-full bg-slate-200"></div>

                                            {/* FOOTER */}
                                            <div className="space-y-2 pt-2 pb-4">
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Made : {selectedOrder.madeAt}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Updated : {selectedOrder.updatedAt}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>
                    </>
                ) : (
                    // === USER CART (UNCHANGED) ===
                    <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer" aria-label="Shopping Cart">
                                <div className="relative">
                                    <ShoppingCart className="!size-5 opacity-80 group-hover:opacity-100" />
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </div>
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="flex h-[80vh] max-h-[800px] flex-col p-0 sm:max-w-[580px]">
                            {!user ? (
                                <div className="flex h-full w-full flex-col">
                                    <div className="p-6">
                                        <DialogClose className="rounded-full p-2 hover:bg-gray-100"></DialogClose>
                                    </div>
                                    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                                        <h2 className="mb-2 text-3xl font-extrabold text-[#2A2F5B]">No orders yet</h2>
                                        <Link href={route('login')} onClick={() => setIsCartOpen(false)}>
                                            <Button className="h-12 min-w-[200px] rounded-full bg-[#2A2F5B] text-white hover:bg-[#1e2345]">
                                                Find Product
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {cartItems.length === 0 ? (
                                        <div className="flex h-full w-full flex-col">
                                            <div className="flex justify-end p-6">
                                                <DialogClose className="rounded-full p-1 hover:bg-gray-100"></DialogClose>
                                            </div>
                                            <div className="-mt-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
                                                <h2 className="mb-2 text-3xl font-extrabold text-[#2A2F5B]">Your cart is empty</h2>
                                                <p className="mb-8 text-sm font-medium text-indigo-900/60">but the aroma of great coffee awaits.</p>
                                                <Link href={route('products.index')}>
                                                    <Button
                                                        onClick={() => setIsCartOpen(false)}
                                                        className="h-12 min-w-[200px] rounded-full bg-[#2A2F5B] text-lg font-bold text-white hover:bg-[#1e2345]"
                                                    >
                                                        Find Product
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <DialogHeader className="p-6 pb-0">
                                                <DialogTitle className="text-2xl font-extrabold tracking-tight text-primary">
                                                    Your cart is brewing <br /> with goodness
                                                </DialogTitle>
                                                <p className="mt-1 text-sm font-medium text-foreground/80">ready to check out?</p>
                                            </DialogHeader>

                                            <div className="flex-1 overflow-y-auto border-b px-6 py-4">
                                                <div className="space-y-2">
                                                    {cartItems.map((item) => (
                                                        <div key={item.id} className="flex items-start justify-between py-4">
                                                            <div className="flex items-start space-x-4">
                                                                <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-indigo-800 p-0 text-white shadow-lg sm:h-20 sm:w-32">
                                                                    {item.image_url ? (
                                                                        <img
                                                                            src={item.image_url}
                                                                            alt={item.name}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-full items-center justify-center bg-gray-200 text-gray-500">
                                                                            <span className="text-xs">No Image</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-col space-y-1">
                                                                    <p className="text-base font-semibold text-foreground">{item.name}</p>
                                                                    <p className="text-sm font-medium text-muted-foreground">
                                                                        {formatRupiah(item.price)}
                                                                    </p>

                                                                    <div className="mt-2 flex items-center space-x-2">
                                                                        <div className="flex items-center rounded-md border text-sm">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="icon"
                                                                                className="h-7 w-7 rounded-r-none border-y-0 border-l-0"
                                                                                onClick={() => updateQty(item.id, 'minus')}
                                                                            >
                                                                                <Minus className="h-3 w-3" />
                                                                            </Button>
                                                                            <span className="px-3 font-medium">{item.qty}</span>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="icon"
                                                                                className="h-7 w-7 rounded-l-none border-y-0 border-r-0"
                                                                                onClick={() => updateQty(item.id, 'plus')}
                                                                            >
                                                                                <Plus className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-7 w-7 text-muted-foreground hover:text-red-500"
                                                                            onClick={() => removeItem(item.id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col space-y-4 px-6 py-4">
                                                <div className="flex items-center justify-between text-base font-bold">
                                                    <span>Total :</span>
                                                    <span className="text-foreground">{formatRupiah(totalAmount)}</span>
                                                </div>

                                                <Button
                                                    className="h-12 w-full bg-indigo-900 text-lg font-bold text-white shadow-lg hover:bg-indigo-800"
                                                    onClick={() => {
                                                        setIsCartOpen(false);
                                                        setIsCheckoutOpen(true);
                                                    }}
                                                >
                                                    Checkout
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                )}

                {/* Navigation Icons */}
                <div className="hidden lg:flex">
                    {rightNavItems.map((item) => (
                        <TooltipProvider key={item.title} delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium opacity-80 hover:bg-accent hover:opacity-100"
                                    >
                                        <span className="sr-only">{item.title}</span>
                                        {item.icon && <Icon iconNode={item.icon} className="size-5" />}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </div>

            {/* Auth Buttons */}
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-auto items-center gap-x-2 rounded-full p-1 pr-2">
                            <Avatar className="size-8 overflow-hidden rounded-full">
                                <AvatarImage src={user.avatar_url} alt={user.name} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <UserMenuContent user={user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex items-center space-x-1">
                    <Link href={route('login')}>
                        <Button variant="ghost text-[#303182]">Log In</Button>
                    </Link>
                    <Link href={route('register')}>
                        <Button className="bg-[#303182]">Sing Up</Button>
                    </Link>
                </div>
            )}

            {/* Checkout Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className={dialogContentClasses}>
                    <Checkout product={mockProductForCheckout} cartItems={cartItems} onClose={() => setIsCheckoutOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
