import Checkout from '@/pages/ordering/payments/checkout';
import type { Product } from '@/types';
import { Button } from '@headlessui/react';
import { ChevronLeft, ChevronRight, CornerUpLeft, Heart, ShoppingCart, Star } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';

interface ProductDetailsProps {
    product: Product;
}

const truncateText = (text: string | null | undefined, maxLength: number): string => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

function ProductDetail({ product }: ProductDetailsProps) {
    const [viewMode, setViewMode] = useState<'beginner' | 'expert'>('beginner');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const thumbnailsContainerRef = useRef<HTMLDivElement>(null);

    const allImages = useMemo(() => product.images || [], [product.images]);
    const currentImage = useMemo(() => allImages[selectedImageIndex], [allImages, selectedImageIndex]);
    const currentImageUrl = useMemo(() => currentImage?.url || product.primary_image_url, [currentImage, product.primary_image_url]);
    const currentImageAlt = useMemo(() => currentImage?.alt_text || product.product_name || 'Product Image', [currentImage, product.product_name]);
    const formattedPrice = useMemo(
        () => (typeof product.price === 'number' ? product.price.toLocaleString('id-ID') : product.price),
        [product.price],
    );

    const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false); // Menggunakan tipe boolean eksplisit

    useEffect(() => {
        setSelectedImageIndex(0);
        thumbnailsContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    }, [product.id]);

    const handleThumbnailClick = useCallback((index: number) => {
        setSelectedImageIndex(index);
    }, []);

    const scrollThumbnails = useCallback((direction: 'left' | 'right') => {
        const container = thumbnailsContainerRef.current;
        if (!container) return;

        const scrollAmount = container.clientWidth / 2;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    }, []);

    const toggleWishlist = useCallback(() => {
        setIsWishlisted((prev) => !prev);
    }, []);

    // Fungsi yang akan dipanggil saat tombol "Buy Now" diklik
    const handleBuyNowClick = useCallback(() => {
        setIsCheckoutOpen(true); // Membuka dialog
    }, []);

    const renderFlavorNotes = useMemo(
        () =>
            product.flavor_notes ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <h4 className="mb-2 flex items-center font-semibold text-amber-800">
                        <Star className="mr-2 h-4 w-4 text-amber-600" />
                        Flavor Notes
                    </h4>
                    <p className="text-amber-700">{product.flavor_notes}</p>
                </div>
            ) : null,
        [product.flavor_notes],
    );

    const renderBrewMethods = useCallback(
        (simple = false) =>
            product.brew_methods?.length ? (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h4 className="mb-3 font-semibold text-blue-800">Recommended Brew Methods</h4>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {product.brew_methods.map((method) => (
                            <div key={method.id} className="rounded border border-blue-100 bg-white p-2">
                                <span className="font-medium text-blue-700">{method.brew_name}</span>
                                {!simple && method.description && <p className="mt-1 text-sm text-blue-600">{method.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null,
        [product.brew_methods],
    );

    const renderOrigins = useCallback(
        (simple = false) =>
            product.origins?.length ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <h4 className="mb-3 font-semibold text-green-800">Origins</h4>
                    <div className="space-y-2">
                        {product.origins.map((origin) => (
                            <div key={origin.id} className="rounded border border-green-100 bg-white p-2">
                                <span className="font-medium text-green-700">{origin.origin_name}</span>
                                {!simple && origin.region && origin.country && (
                                    <p className="text-sm text-green-600">
                                        {origin.region}, {origin.country}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null,
        [product.origins],
    );

    const renderProcesses = useCallback(
        (simple = false) =>
            product.processes?.length ? (
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                    <h4 className="mb-3 font-semibold text-purple-800">Processing Methods</h4>
                    <div className="space-y-2">
                        {product.processes.map((process) => (
                            <div key={process.id} className="rounded border border-purple-100 bg-white p-2">
                                <span className="font-medium text-purple-700">{process.process_name}</span>
                                {!simple && process.description && <p className="mt-1 text-sm text-purple-600">{process.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null,
        [product.processes],
    );

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="lg:flex">
                <div className="p-6 lg:w-1/2">
                    {/* Main Image Display */}
                    <div className="group relative">
                        {currentImageUrl ? (
                            <img
                                src={currentImageUrl || '/placeholder.svg'}
                                alt={currentImageAlt}
                                className="h-96 w-full rounded-xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-[1.02] lg:h-[500px]"
                                loading="lazy"
                            />
                        ) : (
                            <div className="flex h-96 w-full items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 lg:h-[500px]">
                                <span className="text-lg font-medium text-gray-500">{truncateText(product.product_name, 20)}</span>
                            </div>
                        )}

                        {/* Image counter */}
                        {allImages.length > 1 && (
                            <div className="absolute top-4 right-4 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
                                {selectedImageIndex + 1} / {allImages.length}
                            </div>
                        )}
                    </div>

                    {allImages.length > 1 && (
                        <div className="relative mt-6">
                            {allImages.length > 4 && (
                                <button
                                    onClick={() => scrollThumbnails('left')}
                                    className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all duration-200 hover:bg-white"
                                    aria-label="Previous thumbnail"
                                >
                                    <ChevronLeft size={20} className="text-gray-700" />
                                </button>
                            )}

                            <div ref={thumbnailsContainerRef} className="scrollbar-hide flex space-x-3 overflow-x-auto px-8 py-2">
                                {allImages.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => handleThumbnailClick(index)}
                                        className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                                            index === selectedImageIndex
                                                ? 'scale-105 border-blue-500 ring-2 ring-blue-200'
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <img
                                            src={image.url || `https://placehold.co/80x80/EEE/31343C?text=${index + 1}`}
                                            alt={image.alt_text || `${product.product_name} ${index + 1}`}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>

                            {allImages.length > 4 && (
                                <button
                                    onClick={() => scrollThumbnails('right')}
                                    className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all duration-200 hover:bg-white"
                                    aria-label="Next thumbnail"
                                >
                                    <ChevronRight size={20} className="text-gray-700" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 lg:w-1/2 lg:p-8">
                    <div className="flex">
                        <Button
                            className={
                                'mb-4 flex cursor-pointer items-center rounded-lg bg-gray-800 px-3 py-2 text-gray-100 *:text-xs hover:text-gray-200'
                            }
                            onClick={() => window.history.back()}
                        >
                            <CornerUpLeft />
                            <span className="ml-2">Back to Products</span>
                        </Button>
                    </div>
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-balance text-gray-900 lg:text-4xl">{product.product_name}</h1>
                            <div className="mb-4 flex items-center space-x-3">
                                <span className="text-2xl font-bold text-green-600 lg:text-3xl">Rp {formattedPrice}</span>
                                {product.is_specialty && (
                                    <span className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 text-sm font-semibold text-white">
                                        Specialty
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={toggleWishlist}
                            className={`rounded-full p-3 transition-all duration-200 ${
                                isWishlisted ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    <div className="mb-6 rounded-lg bg-gray-50 p-4">
                        <span className="text-lg font-semibold text-gray-700">Type: </span>
                        <span className="text-lg text-gray-900">{product.type}</span>
                    </div>

                    <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
                        <button
                            onClick={() => setViewMode('beginner')}
                            className={`flex-1 rounded-md px-4 py-3 font-medium transition-all duration-200 ${
                                viewMode === 'beginner' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Barista Pemula
                        </button>
                        <button
                            onClick={() => setViewMode('expert')}
                            className={`flex-1 rounded-md px-4 py-3 font-medium transition-all duration-200 ${
                                viewMode === 'expert' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Barista Expert
                        </button>
                    </div>

                    <div className="mb-8 space-y-6">
                        {viewMode === 'beginner' ? (
                            <>
                                <h3 className="border-b-2 border-blue-500 pb-2 text-xl font-bold text-gray-900">Order</h3>
                                {renderFlavorNotes}
                                {renderBrewMethods(true)}
                                {renderOrigins(true)}
                            </>
                        ) : (
                            <>
                                <h3 className="border-b-2 border-purple-500 pb-2 text-xl font-bold text-gray-900">Detailed Specifications</h3>
                                {renderFlavorNotes}
                                {renderOrigins(false)}
                                {renderProcesses(false)}
                                {renderBrewMethods(false)}
                            </>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-green-700 hover:to-green-800 hover:shadow-xl">
                            <ShoppingCart className="h-5 w-5" />
                            <span>Add to Cart - Rp {formattedPrice}</span>
                        </button>
                        <button
                            onClick={handleBuyNowClick}
                            className="w-full rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-800 hover:bg-gray-200"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="/* Penting: Flex column dan tanpa padding internal / / Mobile: Lebar penuh, tinggi 95vh, tanpa radius, tanpa margin luar / / Tablet/Desktop: Max lebar 672px, tinggi auto (batas 95vh), radius, terpusat / / Medium Desktop: Max lebar 896px / / Large Desktop: Max lebar 1024px */ m-0 flex h-[95vh] w-full max-w-full flex-col rounded-none border p-0 sm:mx-auto sm:my-auto sm:h-auto sm:max-h-[95vh] sm:max-w-2xl sm:rounded-lg md:max-w-3xl lg:max-w-4xl">
                    <Checkout product={product} onClose={() => setIsCheckoutOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ProductDetail;
