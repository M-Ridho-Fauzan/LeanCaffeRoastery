import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Product } from '@/types';
import { Image as ImageIcon, Minus, Plus, ShoppingCart } from 'lucide-react';

interface Props {
    product: Product | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProductShowDialog({ product, isOpen, onOpenChange }: Props) {
    if (!product) return null;

    const flavorTags = product.flavor_notes ? product.flavor_notes.split(',').map((tag) => tag.trim()) : [];
    const [quantity, setQuantity] = useState(1);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="overflow-hidden rounded-xl p-0 sm:max-w-[700px]">
                <div className="grid md:grid-cols-2">
                    {/* Bagian Kiri: Gambar */}
                    <div className="relative flex flex-col items-center justify-center bg-gray-100 p-4">
                        {product.primary_image_url ? (
                            <img src={product.primary_image_url} alt={product.product_name} className="h-auto max-h-96 w-full object-contain" />
                        ) : (
                            <div className="flex h-96 w-full items-center justify-center bg-gray-200 text-gray-500">
                                <ImageIcon size={48} /> No Image
                            </div>
                        )}
                        {/* Thumbnail Galeri (diabaikan untuk simplifikasi, tetapi mengikuti design) */}
                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-primary bg-white"></div>
                        </div>
                    </div>

                    {/* Bagian Kanan: Deskripsi Produk */}
                    <div className="space-y-4 p-6">
                        <h2 className="text-3xl font-bold">{product.product_name}</h2>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {product.type}
                        </Badge>

                        <div className="text-3xl font-bold text-indigo-700">Rp. {product.price.toLocaleString('id-ID')}</div>

                        <p className="text-gray-600">{product.flavor_notes}</p>

                        <div className="space-y-3 pt-3">
                            <div className="text-sm font-semibold">Origin</div>
                            <div className="flex flex-wrap gap-2">
                                {product.origins.map((o) => (
                                    <Badge key={o.id} variant="outline" className="font-normal">
                                        {o.origin_name}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="text-sm font-semibold">Process</div>
                            <div className="flex flex-wrap gap-2">
                                {product.processes.map((p) => (
                                    <Badge key={p.id} variant="outline" className="font-normal">
                                        {p.process_name}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="text-sm font-semibold">Flavor Notes</div>
                            <div className="flex flex-wrap gap-2">
                                {flavorTags.map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="bg-gray-100 font-normal text-gray-700">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="text-sm font-semibold">Recommended Brewing</div>
                            <div className="flex flex-wrap gap-2">
                                {product.brew_methods.map((b) => (
                                    <Badge key={b.id} variant="secondary" className="bg-gray-100 font-normal text-gray-700">
                                        {b.brew_name}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart (sesuai design) */}
                        <div className="flex space-x-4 pt-4">
                            <div className="flex items-center rounded-lg border">
                                <Button variant="ghost" size="icon" onClick={() => setQuantity((q: number) => Math.max(1, q - 1))}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-3 font-semibold">{quantity}</span>
                                <Button variant="ghost" size="icon" onClick={() => setQuantity((q: number) => q + 1)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button className="flex-1 bg-indigo-700 hover:bg-indigo-800">
                                <ShoppingCart className="mr-2 h-4 w-4" /> Add To Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
