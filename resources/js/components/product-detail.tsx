import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Checkout from '@/pages/ordering/payments/checkout';
import type { Product } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ProductDetailsProps {
    product: Product;
    closeModal?: () => void;
    inModal?: boolean;
    variant?: 'detail' | 'quick-add';
}

interface PageProps {
    auth: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: any | null;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const truncateText = (text: string | null | undefined, maxLength: number): string => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

function ProductDetail({ product, closeModal, inModal, variant = 'detail' }: ProductDetailsProps) {
    const { auth } = usePage<PageProps>().props;

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const thumbnailsContainerRef = useRef<HTMLDivElement>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

    // --- State & Memo Data ---
    const allImages = useMemo(() => product.images || [], [product.images]);
    const currentImage = useMemo(() => allImages[selectedImageIndex], [allImages, selectedImageIndex]);
    const currentImageUrl = useMemo(() => currentImage?.url || product.primary_image_url, [currentImage, product.primary_image_url]);

    // --- LOGIKA UTAMA: Menghitung Total Harga ---
    const totalPrice = useMemo(() => {
        const priceNum = typeof product.price === 'number' ? product.price : Number(product.price);
        return (priceNum * quantity).toLocaleString('id-ID');
    }, [product.price, quantity]);

    const flavorTags = useMemo(() => {
        if (!product.flavor_notes) return [];
        return product.flavor_notes.split(',').map((note) => note.trim());
    }, [product.flavor_notes]);

    // --- Effects ---
    useEffect(() => {
        setSelectedImageIndex(0);
        setQuantity(1);
        if (thumbnailsContainerRef.current) {
            thumbnailsContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [product.id, variant]);

    // --- Handlers ---
    const handleThumbnailClick = useCallback((index: number) => setSelectedImageIndex(index), []);

    const scrollThumbnails = useCallback((direction: 'left' | 'right') => {
        const container = thumbnailsContainerRef.current;
        if (!container) return;
        const scrollAmount = container.clientWidth / 2;
        container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }, []);

    const handleQuantityChange = (type: 'increment' | 'decrement') => {
        setQuantity((prev) => (type === 'decrement' && prev > 1 ? prev - 1 : type === 'increment' ? prev + 1 : prev));
    };

    const handleAddToCart = () => {
        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        const saved = localStorage.getItem('cart-storage');
        // eslint-disable-next-line prefer-const
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
        let items: any[] = saved ? JSON.parse(saved) : [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existingIndex = items.findIndex((item: any) => item.id === product.id);

        if (existingIndex >= 0) {
            items[existingIndex].qty += quantity;
        } else {
            items.push({
                id: product.id,
                name: product.product_name,
                price: product.price,
                qty: quantity,
                image_url: product.primary_image_url,
            });
        }

        localStorage.setItem('cart-storage', JSON.stringify(items));
        window.dispatchEvent(new Event('cart-updated'));

        if (closeModal) {
            closeModal();
        }
    };

    // Class untuk Modal Checkout agar konsisten responsive
    const nestedModalClasses =
        'm-0 flex h-[100dvh] w-full max-w-full flex-col overflow-y-auto rounded-none border-0 p-0 sm:mx-auto sm:my-auto sm:h-auto sm:max-h-[95vh] sm:max-w-2xl sm:rounded-lg sm:border md:max-w-3xl lg:max-w-4xl';

    // =====================================================================
    // TAMPILAN 1: MODE "QUICK ADD"
    // =====================================================================
    if (variant === 'quick-add') {
        return (
            // Menggunakan h-[100dvh] untuk memastikan tinggi pas di mobile
            <div className="flex h-dvh w-full flex-col bg-white font-sans sm:h-auto sm:max-h-[90vh]">
                {/* Scrollable Content Area (flex-1) */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                    {/* Gambar */}
                    <div className="mb-4 flex justify-center sm:mb-6">
                        <div className="relative w-32 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm sm:w-48 md:w-64">
                            <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#2A2F5B]">
                                {currentImageUrl ? (
                                    <img src={currentImageUrl} alt={product.product_name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-sm text-white/50">No Image</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Konten Teks */}
                    <div className="flex flex-col">
                        <div className="mb-2 text-left">
                            <span className="inline-block rounded-full border border-[#2A2F5B] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#2A2F5B]">
                                {product.type || 'House Blend'}
                            </span>
                        </div>
                        <h2 className="mb-2 text-left text-lg font-extrabold text-[#2A2F5B] sm:text-2xl">{product.product_name}</h2>
                        <p className="mb-4 text-left text-xs leading-relaxed text-gray-500 sm:text-sm">
                            {product.flavor_notes || 'Our flagship blend with rich chocolate and caramel notes...'}
                        </p>

                        {/* Detail Info Ringkas */}
                        <div className="space-y-1.5 rounded-lg bg-gray-50 p-3 text-xs sm:space-y-2 sm:text-sm">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-400">Origin:</span>
                                <span className="max-w-[150px] truncate text-right font-semibold text-[#2A2F5B]">
                                    {product.origins?.map((o) => o.origin_name).join(', ') || '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Fixed (flex-none) - SELALU TERLIHAT */}
                <div className="pb-safe z-20 flex-none border-t bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:p-6">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Total</span>
                        <span className="text-xl font-extrabold text-[#2A2F5B] sm:text-2xl">Rp {totalPrice}</span>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center rounded-lg bg-gray-100 p-1">
                            <button
                                onClick={() => handleQuantityChange('decrement')}
                                disabled={quantity <= 1}
                                className="flex h-9 w-9 items-center justify-center rounded-md bg-white shadow-sm disabled:opacity-50"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-8 text-center text-base font-bold text-[#2A2F5B]">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange('increment')}
                                className="flex h-9 w-9 items-center justify-center rounded-md bg-white shadow-sm"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <Button
                            onClick={handleAddToCart}
                            className="h-11 flex-1 rounded-xl bg-[#2A2F5B] text-sm font-bold text-white hover:bg-[#1e2345]"
                        >
                            Add To Cart
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================================
    // TAMPILAN 2: MODE "DETAIL"
    // =====================================================================
    return (
        // Container Utama: h-[100dvh] untuk mobile agar pas layar tanpa address bar mengganggu
        <div
            className={`flex h-[100dvh] w-full flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[90vh] lg:flex-row ${
                inModal ? '' : 'rounded-[30px] shadow-xl'
            }`}
        >
            {/* --- KOLOM KIRI: GAMBAR --- */}
            {/* max-h-[40vh] di mobile: Membatasi tinggi area gambar agar sisa ruang untuk teks cukup */}
            <div className="relative flex max-h-[40vh] flex-shrink-0 flex-col items-center justify-center bg-gray-50 p-4 sm:p-6 lg:h-full lg:max-h-none lg:w-1/2 lg:overflow-y-auto lg:p-10">
                {/* Image Wrapper */}
                <div className="group relative flex h-full w-full max-w-55 items-center justify-center lg:max-w-none">
                    <div className="aspect-square h-full max-h-full w-auto overflow-hidden rounded-2xl border-4 border-white shadow-md lg:rounded-[2rem] lg:shadow-xl">
                        {currentImageUrl ? (
                            <img src={currentImageUrl} alt={product.product_name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                                {truncateText(product.product_name, 20)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Thumbnails - DILETAKKAN DI BAWAH GAMBAR */}
                {allImages.length > 1 && (
                    <div className="relative mt-4 w-full px-2 lg:mt-8">
                        <div className="flex items-center justify-center gap-2">
                            {/* Tombol Scroll Kiri (Hanya muncul jika perlu/desktop) */}
                            <button
                                onClick={() => scrollThumbnails('left')}
                                className="hidden items-center justify-center rounded-full bg-white p-1 shadow-sm hover:bg-gray-100 sm:flex"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {/* Container Thumbnails */}
                            <div ref={thumbnailsContainerRef} className="scrollbar-hide flex max-w-full space-x-2 overflow-x-auto py-1">
                                {allImages.map((image, index) => (
                                    <button
                                        key={image.id || index}
                                        onClick={() => handleThumbnailClick(index)}
                                        className={`h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all lg:h-16 lg:w-16 ${
                                            index === selectedImageIndex ? 'border-[#2A2F5B]' : 'border-transparent opacity-60'
                                        }`}
                                    >
                                        <img src={image.url} alt="" className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Tombol Scroll Kanan */}
                            <button
                                onClick={() => scrollThumbnails('right')}
                                className="hidden items-center justify-center rounded-full bg-white p-1 shadow-sm hover:bg-gray-100 sm:flex"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- KOLOM KANAN: INFORMASI --- */}
            {/* flex-1 dan min-h-0 sangat penting agar scroll container berfungsi di dalam flex parent */}
            <div className="flex min-h-0 flex-1 flex-col bg-white lg:w-1/2">
                {/* SCROLLABLE AREA: Header & Details */}
                {/* flex-1 overflow-y-auto: Bagian ini akan scroll jika konten panjang */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
                    {/* Header Group */}
                    <div className="mb-4 border-b border-gray-100 pb-3 sm:mb-6 sm:pb-6">
                        <div className="mb-2 flex items-start justify-between">
                            <h1 className="text-lg font-black text-[#2A2F5B] sm:text-3xl lg:text-4xl">{product.product_name}</h1>
                        </div>

                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-[#2A2F5B]/10 px-2 py-0.5 text-[10px] font-bold text-[#2A2F5B] sm:px-3 sm:py-1 sm:text-sm">
                                {product.type || 'Blend'}
                            </span>
                            {product.is_specialty && (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 sm:px-3 sm:py-1 sm:text-sm">
                                    Specialty
                                </span>
                            )}
                        </div>

                        <div className="text-right">
                            <span className="text-xl font-black text-[#2A2F5B] sm:text-3xl">Rp {totalPrice}</span>
                        </div>
                    </div>

                    {/* Description & Details */}
                    <div className="space-y-4 pb-4 sm:space-y-8">
                        <p className="text-justify text-xs leading-5 text-gray-600 sm:text-left sm:text-base sm:leading-7">
                            {product.description ||
                                'Experience the rich, bold flavors of our premium selection. Carefully sourced and roasted to perfection, this coffee offers a unique tasting journey suited for your daily ritual.'}
                        </p>

                        {/* Grid Info Mobile Friendly */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-6">
                            {product.origins && product.origins.length > 0 && (
                                <div className="rounded-xl bg-gray-50 p-2 sm:bg-transparent sm:p-0">
                                    <h3 className="mb-1 text-[9px] font-bold tracking-wider text-gray-400 uppercase sm:mb-2 sm:text-xs sm:text-[#2A2F5B]">
                                        Origin
                                    </h3>
                                    <p className="line-clamp-2 text-[11px] font-bold text-[#2A2F5B] sm:text-sm sm:font-medium sm:text-gray-700">
                                        {product.origins.map((o) => o.origin_name).join(', ')}
                                    </p>
                                </div>
                            )}
                            {product.processes && product.processes.length > 0 && (
                                <div className="rounded-xl bg-gray-50 p-2 sm:bg-transparent sm:p-0">
                                    <h3 className="mb-1 text-[9px] font-bold tracking-wider text-gray-400 uppercase sm:mb-2 sm:text-xs sm:text-[#2A2F5B]">
                                        Process
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                        {product.processes.map((p) => (
                                            <span
                                                key={p.id}
                                                className="text-[11px] font-bold text-[#2A2F5B] sm:text-sm sm:font-medium sm:text-gray-700"
                                            >
                                                {p.process_name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        {flavorTags.length > 0 && (
                            <div>
                                <h3 className="mb-2 text-[10px] font-bold tracking-wide text-[#2A2F5B] uppercase sm:mb-3 sm:text-xs">Flavor Notes</h3>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {flavorTags.map((note, idx) => (
                                        <span
                                            key={idx}
                                            className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-600 sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-sm"
                                        >
                                            {note}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Brew Methods */}
                        {product.brew_methods && product.brew_methods.length > 0 && (
                            <div>
                                <h3 className="mb-2 text-[10px] font-bold tracking-wide text-[#2A2F5B] uppercase sm:mb-3 sm:text-xs">Best For</h3>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {product.brew_methods.map((bm) => (
                                        <span
                                            key={bm.id}
                                            className="rounded-md bg-[#2A2F5B]/5 px-2 py-0.5 text-[10px] font-bold text-[#2A2F5B] sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-sm"
                                        >
                                            {bm.brew_name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER: Fixed / Sticky Bottom */}
                {/* flex-none menjamin footer tidak akan mengecil atau hilang */}
                {/* z-20 memastikan tombol di atas konten scroll jika overlap */}
                <div className="pb-safe z-20 flex-none border-t border-gray-100 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] sm:p-8">
                    <div className="flex gap-3 sm:gap-4">
                        {/* Quantity */}
                        <div className="flex items-center justify-between rounded-xl bg-gray-100 p-1">
                            <button
                                onClick={() => handleQuantityChange('decrement')}
                                disabled={quantity <= 1}
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm disabled:opacity-50 sm:h-12 sm:w-12"
                            >
                                <Minus size={16} strokeWidth={2.5} />
                            </button>
                            <span className="w-8 text-center text-base font-bold text-[#2A2F5B] sm:w-14 sm:text-xl">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange('increment')}
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm sm:h-12 sm:w-12"
                            >
                                <Plus size={16} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Add to Cart */}
                        <Button
                            onClick={handleAddToCart}
                            className="h-12 flex-1 rounded-xl bg-[#2A2F5B] text-sm font-bold text-white shadow-lg hover:bg-[#1e2345] sm:h-14 sm:text-lg"
                        >
                            <ShoppingCart className="mr-2 h-4 w-4 sm:mr-3 sm:h-5 sm:w-5" />
                            Add To Cart
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal Checkout */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className={nestedModalClasses}>
                    <Checkout product={product} onClose={() => setIsCheckoutOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ProductDetail;
