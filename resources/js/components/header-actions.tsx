import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { UserMenuContent } from '@/components/user-menu-content';
import { Icon } from './icon';

import { footerNavItems as rightNavItems } from '@/config/navigation';
import { useInitials } from '@/hooks/use-initials';
import Checkout from '@/pages/ordering/payments/checkout';
import { OrderDetail, Product, SharedData } from '@/types';
import AdminHeaderBadge from './admin-header-badge';

// --- TIPE DATA ---
interface CartItem {
    id: number;
    name: string;
    price: number;
    qty: number;
    image_url: string | null;
}

// Interface untuk Detail Order

export function HeaderActions() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const user = auth.user;
    const getInitials = useInitials();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    /* eslint-disable @typescript-eslint/no-unused-vars */
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
        stock: 0,
        status: false,
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
                        <AdminHeaderBadge notifClick={handleNotificationClick} selectOrder={selectedOrder} />
                    </>
                ) : (
                    // === USER CART (UNCHANGED) ===
                    <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer" aria-label="Shopping Cart">
                                <div className="relative">
                                    <ShoppingCart className="size-5! opacity-80 group-hover:opacity-100" />
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
                                                                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-indigo-800 p-0 text-white shadow-lg sm:h-20 sm:w-32">
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
                        <Button variant="ghost" className="text-[#303182]">
                            Log In
                        </Button>
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
