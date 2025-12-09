// components/HeaderActions.tsx

import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

import { UserMenuContent } from '@/components/user-menu-content';
import { Icon } from './icon';

import { footerNavItems as rightNavItems } from '@/config/navigation';
import { useInitials } from '@/hooks/use-initials';
import Checkout from '@/pages/ordering/payments/checkout';
import { Product, SharedData } from '@/types';

// --- NEW: Interface untuk item cart (disamakan dengan mockCartData) ---
interface CartItem {
    name: string;
    price: number;
    qty: number;
}
// --------------------------------------------------------------------

// Komponen Placeholder CartItem yang sesuai dengan gambar (TIDAK ADA PERUBAHAN)
const CartItemPlaceholder = ({ name, price, qty }: CartItem) => {
    // ... (kode CartItemPlaceholder yang sudah ada) ...
    // Fungsi untuk memformat harga ke format Rupiah (Rp.)
    const formatRupiah = (number: number) => {
        return `Rp. ${number.toLocaleString('id-ID')}`;
    };

    return (
        <div className="flex items-start justify-between py-4">
            <div className="flex items-start space-x-4">
                {/* Gambar/Kartu Produk (Meniru desain kartu biru) */}
                <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-indigo-800 p-2 text-white shadow-lg sm:h-20 sm:w-32">
                    <p className="text-[8px] font-light uppercase opacity-70">Espresso Roast 100% Arabica</p>
                    <p className="text-lg leading-none font-bold sm:text-xl">THE SAGARA</p>
                    <p className="text-lg leading-none font-bold sm:text-xl">1999</p>
                </div>

                <div className="flex flex-col space-y-1">
                    <p className="text-base font-semibold text-foreground">{name}</p>
                    <p className="text-sm font-medium text-muted-foreground">{formatRupiah(price)}</p>

                    {/* Quantity Control dan Tombol Hapus */}
                    <div className="mt-2 flex items-center space-x-2">
                        <div className="flex items-center rounded-md border text-sm">
                            <Button variant="outline" size="icon" className="h-7 w-7 rounded-r-none border-y-0 border-l-0">
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 font-medium">{qty}</span>
                            <Button variant="outline" size="icon" className="h-7 w-7 rounded-l-none border-y-0 border-r-0">
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                        {/* Tombol Hapus */}
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function HeaderActions() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const user = auth.user;
    const getInitials = useInitials();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Data simulasi (Group semua item untuk perhitungan total yang benar)
    // --- GANTI: Tambahkan tipe CartItem ke mockCartData ---
    const mockCartData: CartItem[] = [
        { name: 'THE SAGARA 1999', price: 120000, qty: 1 },
        { name: 'Another Great Coffee', price: 85000, qty: 2 },
        { name: 'Coffee Grinder Portable', price: 350000, qty: 1 },
        { name: 'Luxury Gadget Pro X', price: 1999999, qty: 1 },
        { name: 'Ergonomic Keyboard Mechanical', price: 599999, qty: 2 },
    ];
    // -------------------------------------------------------

    // Hitung total dari semua mock item
    const totalAmount = mockCartData.reduce((sum, item) => sum + item.price * item.qty, 0);
    const formatRupiah = (number: number) => `Rp. ${number.toLocaleString('id-ID')}`;

    // NEW: Mock Product object untuk dikirim ke komponen Checkout (untuk memenuhi tipe Product)
    const mockProductForCheckout: Product = {
        id: 999,
        slug: 'cart-summary',
        product_name: `Your Cart (${mockCartData.length} items)`, // Judul untuk layar Checkout
        price: totalAmount, // Total Harga
        flavor_notes: `Total Items: ${mockCartData.length}. Total Price: ${formatRupiah(totalAmount)}`,
        type: 'CART',
        is_specialty: false,
        primary_image_url: null,
        origins: [],
        processes: [],
        brew_methods: [],
    };

    // Kelas DialogContent yang kompleks (disalin dari ProductDetail/ProductCard)
    const dialogContentClasses =
        'm-0 flex h-[95vh] w-full max-w-full flex-col rounded-none border p-0 ' +
        'sm:mx-auto sm:my-auto sm:h-auto sm:max-h-[95vh] sm:max-w-2xl sm:rounded-lg md:max-w-3xl lg:max-w-4xl';

    return (
        <div className="ml-auto flex items-center space-x-2">
            <div className="relative flex items-center space-x-1">
                <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer" aria-label="Shopping Cart">
                            <ShoppingCart className="!size-5 opacity-80 group-hover:opacity-100" />
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="flex h-[80vh] max-h-[800px] flex-col p-0 sm:max-w-[580px]">
                        <DialogHeader className="p-6 pb-0">
                            <DialogTitle className="text-2xl font-extrabold tracking-tight text-primary">
                                Your cart is brewing <br /> with goodness
                            </DialogTitle>
                            <p className="mt-1 text-sm font-medium text-foreground/80">ready to check out?</p>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto border-b px-6 py-4">
                            <div className="space-y-2">
                                {/* Map semua item mockCartData */}
                                {mockCartData.map((item, index) => (
                                    <CartItemPlaceholder key={index} {...item} />
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
                                    setIsCartOpen(false); // 1. Tutup Cart Dialog
                                    setIsCheckoutOpen(true); // 2. Buka Checkout Dialog
                                }}
                            >
                                Checkout
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* ... (kode Tooltip & Navigasi lainnya) ... */}

                <div className="hidden lg:flex">
                    {rightNavItems.map((item) => (
                        <TooltipProvider key={item.title} delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <span className="sr-only">{item.title}</span>
                                        {item.icon && <Icon iconNode={item.icon} className="size-5 opacity-80 group-hover:opacity-100" />}
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

            {/* Tampilkan menu user atau tombol login/register */}
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-auto items-center gap-x-2 rounded-full p-1 pr-2">
                            <Avatar className="size-8 overflow-hidden rounded-full">
                                <AvatarImage src={user.avatar_url} alt={user.name} />
                                <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(user.name)}
                                </AvatarFallback>
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
                        <Button variant="ghost">Log in</Button>
                    </Link>
                    <Link href={route('register')}>
                        <Button>Register</Button>
                    </Link>
                </div>
            )}

            {/* --- Implementasi Checkout Dialog dari Cart --- */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className={dialogContentClasses}>
                    {/* GANTI: Tambahkan prop cartItems */}
                    <Checkout product={mockProductForCheckout} cartItems={mockCartData} onClose={() => setIsCheckoutOpen(false)} />
                </DialogContent>
            </Dialog>
            {/* ------------------------------------------------ */}
        </div>
    );
}
