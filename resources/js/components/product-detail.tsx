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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const formattedPrice = useMemo(
        () => (typeof product.price === 'number' ? product.price.toLocaleString('id-ID') : product.price),
        [product.price],
    );

    // --- LOGIKA UTAMA: Menghitung Total Harga (Harga x Quantity) ---
    const totalPrice = useMemo(() => {
        const priceNum = typeof product.price === 'number' ? product.price : Number(product.price);
        return (priceNum * quantity).toLocaleString('id-ID');
    }, [product.price, quantity]);
    // -------------------------------------------------------------

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
        let items = saved ? JSON.parse(saved) : [];

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

    // =====================================================================
    // TAMPILAN 1: MODE "QUICK ADD"
    // =====================================================================
    if (variant === 'quick-add') {
        return (
            <div className="flex flex-col bg-white p-6 pb-8 font-sans sm:p-8">
                {/* 1. GAMBAR */}
                <div className="mb-8 flex justify-center">
                    <div className="relative w-full rounded-[20px] border border-gray-100 bg-white p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:w-[350px]">
                        <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#2A2F5B]">
                            {currentImageUrl ? (
                                <img src={currentImageUrl} alt={product.product_name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm text-white/50">No Image</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. BADGE */}
                <div className="mb-3 text-left">
                    <span className="inline-block rounded-full border border-[#2A2F5B] bg-white px-3 py-1 text-xs font-semibold text-[#2A2F5B]">
                        {product.type || 'House Blend'}
                    </span>
                </div>

                {/* 3. JUDUL */}
                <h2 className="mb-2 text-left text-2xl font-extrabold text-[#2A2F5B]">{product.product_name}</h2>

                {/* 4. DESKRIPSI */}
                <p className="mb-6 text-left text-sm leading-relaxed text-gray-500">
                    {product.flavor_notes || 'Our flagship blend with rich chocolate and caramel notes...'}
                </p>

                {/* 5. DETAIL INFO */}
                <div className="mb-6 space-y-3 pt-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-400">Origin:</span>
                        <span className="font-semibold text-[#2A2F5B]">
                            {product.origins && product.origins.length > 0
                                ? product.origins.map((o) => o.origin_name).join(' & ')
                                : 'Brazil & Colombia'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-400">Roast:</span>
                        <span className="font-semibold text-[#2A2F5B]">Medium</span>
                    </div>
                </div>

                {/* 6. HARGA TOTAL (DINAMIS & DI KANAN) */}
                {/* Ubah text-left menjadi text-right dan gunakan totalPrice */}
                <div className="mb-8 text-right">
                    <span className="text-3xl font-extrabold text-[#2A2F5B]">Rp . {totalPrice}</span>
                </div>

                {/* 7. ACTIONS */}
                <div className="flex items-center justify-between gap-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleQuantityChange('decrement')}
                            disabled={quantity <= 1}
                            className="flex h-12 w-12 items-center justify-center rounded-md bg-[#E4E4E4] text-[#2A2F5B] shadow-sm transition hover:bg-gray-300 disabled:opacity-50"
                        >
                            <Minus size={24} strokeWidth={2} />
                        </button>
                        <span className="w-6 text-center text-xl font-bold text-[#2A2F5B]">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange('increment')}
                            className="flex h-12 w-12 items-center justify-center rounded-md bg-[#E4E4E4] text-[#2A2F5B] shadow-sm transition hover:bg-gray-300"
                        >
                            <Plus size={24} strokeWidth={2} />
                        </button>
                    </div>

                    {/* Tombol Add To Cart (Bersih tanpa harga) */}
                    <Button
                        onClick={handleAddToCart}
                        className="h-12 flex-1 rounded-full bg-[#2A2F5B] text-base font-bold text-white shadow-lg hover:bg-[#1e2345]"
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add To Cart
                    </Button>
                </div>
            </div>
        );
    }

    // =====================================================================
    // TAMPILAN 2: MODE "DETAIL"
    // =====================================================================
    return (
        <div className={`flex flex-col overflow-hidden bg-white ${inModal ? '' : 'rounded-[30px] shadow-xl'} lg:flex-row`}>
            {/* --- KOLOM KIRI: GAMBAR --- */}
            <div className="relative p-6 lg:w-1/2 lg:p-8">
                {/* Main Image & Thumbnails (Code sama seperti sebelumnya) */}
                <div className="group relative overflow-hidden rounded-3xl bg-gray-100">
                    <div className="aspect-square w-full">
                        {currentImageUrl ? (
                            <img
                                src={currentImageUrl}
                                alt={product.product_name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                                {truncateText(product.product_name, 20)}
                            </div>
                        )}
                    </div>
                </div>

                {allImages.length > 1 && (
                    <div className="relative mt-4">
                        <button
                            onClick={() => scrollThumbnails('left')}
                            className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow hover:bg-white"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div ref={thumbnailsContainerRef} className="scrollbar-hide flex space-x-3 overflow-x-auto px-6 py-1">
                            {allImages.map((image, index) => (
                                <button
                                    key={image.id || index}
                                    onClick={() => handleThumbnailClick(index)}
                                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${index === selectedImageIndex ? 'border-[#2A2F5B]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={image.url} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => scrollThumbnails('right')}
                            className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow hover:bg-white"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* --- KOLOM KANAN: INFORMASI --- */}
            <div className="flex flex-col p-6 pt-0 lg:w-1/2 lg:p-10 lg:pl-0">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#2A2F5B] lg:text-4xl">{product.product_name}</h1>
                    </div>
                </div>

                {/* Type */}
                <div className="mb-4">
                    <span className="inline-block rounded-full border border-[#2A2F5B] px-4 py-1 text-sm font-semibold text-[#2A2F5B]">
                        {product.type || 'Espresso Based'}
                    </span>
                </div>

                {/* Price (DINAMIS & DI KANAN) */}
                {/* Menggunakan text-right dan totalPrice */}
                <div className="mb-6 text-right">
                    <span className="text-2xl font-bold text-[#2A2F5B]">Rp . {totalPrice}</span>
                </div>

                {/* Content */}
                <div className="scrollbar-thin scrollbar-thumb-gray-200 flex-grow space-y-6 overflow-y-auto pr-2">
                    <p className="text-base leading-relaxed text-gray-600">
                        Our flagship blend with rich chocolate and caramel notes. Perfect for daily espresso.
                    </p>

                    {product.origins && product.origins.length > 0 && (
                        <div>
                            <h3 className="mb-2 text-lg font-bold text-[#2A2F5B]">Origin</h3>
                            <p className="text-gray-600">{product.origins.map((o) => o.origin_name).join(' & ')}</p>
                        </div>
                    )}
                    {product.processes && product.processes.length > 0 && (
                        <div>
                            <h3 className="mb-2 text-lg font-bold text-[#2A2F5B]">Process</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.processes.map((p) => (
                                    <span key={p.id} className="rounded-full bg-gray-200 px-4 py-1 text-sm font-medium text-gray-600">
                                        {p.process_name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {flavorTags.length > 0 && (
                        <div>
                            <h3 className="mb-2 text-lg font-bold text-[#2A2F5B]">Flavor Notes</h3>
                            <div className="flex flex-wrap gap-2">
                                {flavorTags.map((note, idx) => (
                                    <span key={idx} className="rounded-full bg-gray-200 px-4 py-1 text-sm font-medium text-gray-600">
                                        {note}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.brew_methods && product.brew_methods.length > 0 && (
                        <div>
                            <h3 className="mb-2 text-lg font-bold text-[#2A2F5B]">Recommended Brewing</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.brew_methods.map((bm) => (
                                    <span key={bm.id} className="rounded-full bg-gray-200 px-4 py-1 text-sm font-medium text-gray-600">
                                        {bm.brew_name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex items-center gap-4 border-t pt-6">
                    <div className="flex items-center rounded-lg bg-gray-100 p-1">
                        <button
                            onClick={() => handleQuantityChange('decrement')}
                            className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
                            disabled={quantity <= 1}
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-12 text-center text-lg font-bold text-[#2A2F5B]">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange('increment')}
                            className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* Tombol Add To Cart (Bersih tanpa harga) */}
                    <Button
                        onClick={handleAddToCart}
                        className="h-12 flex-1 rounded-full bg-[#2A2F5B] text-base font-bold text-white hover:bg-[#1e2345]"
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add To Cart
                    </Button>
                </div>
            </div>

            {/* Modal Checkout */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="m-0 flex h-[95vh] w-full max-w-full flex-col overflow-y-auto rounded-none border p-0 sm:mx-auto sm:my-auto sm:h-auto sm:max-h-[95vh] sm:max-w-2xl sm:rounded-lg md:max-w-3xl lg:max-w-4xl">
                    <Checkout product={product} onClose={() => setIsCheckoutOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ProductDetail;
