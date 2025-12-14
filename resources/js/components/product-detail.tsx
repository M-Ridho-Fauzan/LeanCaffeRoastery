import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Checkout from '@/pages/ordering/payments/checkout';
import type { Product } from '@/types';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// 1. IMPORT DARI INERTIA
import { router, usePage } from '@inertiajs/react';

interface ProductDetailsProps {
    product: Product;
    closeModal?: () => void;
    inModal?: boolean;
}

// Interface untuk menangani tipe data auth dari Inertia Shared Props
interface PageProps {
    auth: {
        user: any | null; // Ganti 'any' dengan tipe User Anda jika ada
    };
    [key: string]: any;
}

const truncateText = (text: string | null | undefined, maxLength: number): string => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ProductDetail({ product, closeModal, inModal }: ProductDetailsProps) {
    // 2. AMBIL DATA AUTH USER
    const { auth } = usePage<PageProps>().props;

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const thumbnailsContainerRef = useRef<HTMLDivElement>(null);

    // --- State & Memo Data ---
    const allImages = useMemo(() => product.images || [], [product.images]);
    const currentImage = useMemo(() => allImages[selectedImageIndex], [allImages, selectedImageIndex]);
    const currentImageUrl = useMemo(() => currentImage?.url || product.primary_image_url, [currentImage, product.primary_image_url]);

    const formattedPrice = useMemo(
        () => (typeof product.price === 'number' ? product.price.toLocaleString('id-ID') : product.price),
        [product.price],
    );

    const flavorTags = useMemo(() => {
        if (!product.flavor_notes) return [];
        return product.flavor_notes.split(',').map((note) => note.trim());
    }, [product.flavor_notes]);

    const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

    // --- Effects ---
    useEffect(() => {
        setSelectedImageIndex(0);
        setQuantity(1);
        thumbnailsContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    }, [product.id]);

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

    // 3. LOGIKA UTAMA DISINI (UPDATE)
    const handleAddToCart = () => {
        // A. Cek apakah user SUDAH login
        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        // B. Logika Simpan ke Local Storage (Agar Header Update)
        const saved = localStorage.getItem('cart-storage');
        let items = saved ? JSON.parse(saved) : [];

        // Cek apakah produk sudah ada di cart
        const existingIndex = items.findIndex((item: any) => item.id === product.id);

        if (existingIndex >= 0) {
            // Jika ada, tambahkan qty sesuai yang dipilih user
            items[existingIndex].qty += quantity;
        } else {
            // Jika baru, push data baru
            items.push({
                id: product.id,
                name: product.product_name,
                price: product.price,
                qty: quantity, // Gunakan quantity dari state
                image_url: product.primary_image_url,
            });
        }

        // Simpan Balik
        localStorage.setItem('cart-storage', JSON.stringify(items));

        // C. Trigger Event agar Header Action bereaksi
        window.dispatchEvent(new Event('cart-updated'));

        // D. Tutup Modal Detail setelah berhasil add to cart (Optional)
        // Agar user bisa melihat perubahan di header
        if (closeModal) {
            closeModal();
        }

        // Note: Saya menghapus setIsCheckoutOpen(true) karena ini tombol "Add to Cart",
        // bukan "Buy Now". Data masuk keranjang, user lanjut belanja.
    };

    return (
        <div className={`flex flex-col overflow-hidden bg-white ${inModal ? '' : 'rounded-[30px] shadow-xl'} lg:flex-row`}>
            {/* --- KOLOM KIRI: GAMBAR --- */}
            <div className="relative p-6 lg:w-1/2 lg:p-8">
                {/* Main Image */}
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

                {/* Thumbnails Gallery */}
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
                                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                        index === selectedImageIndex ? 'border-[#2A2F5B]' : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
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

                {/* Price */}
                <div className="mb-6">
                    <span className="text-2xl font-bold text-[#2A2F5B]">Rp . {formattedPrice}</span>
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
