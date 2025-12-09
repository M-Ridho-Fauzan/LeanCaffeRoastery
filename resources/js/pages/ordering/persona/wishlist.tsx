import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { FileMinus, FilePlus, Trash } from 'lucide-react';
import React, { useState } from 'react';

// --- Interfaces untuk Data ---

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    // imageUrl?: string; // Opsional jika Anda ingin menggunakan gambar asli
}

// --- Interfaces untuk Props Komponen ---

interface HeadProps {
    title?: string;
}

interface ProductImageGraphicProps {
    productName: string;
}

interface CartItemProps {
    item: CartItem;
    onQuantityChange: (itemId: string, newQuantity: number) => void;
    onRemove: (itemId: string) => void;
}

// --- Placeholder Components (Sesuaikan dengan proyek Anda) ---
// Jika AppHeaderLayout dan Head sudah ada, Anda bisa menghapus ini.
// const AppHeaderLayout: React.FC<AppHeaderLayoutProps> = ({ children }) => <div className="min-h-screen bg-gray-100">{children}</div>;

const Head: React.FC<HeadProps> = ({ title }) => <title>{title || 'Default Title'}</title>;
// --- Akhir Placeholder Components ---

// Komponen untuk menampilkan grafik produk di dalam keranjang
const ProductImageGraphic: React.FC<ProductImageGraphicProps> = ({ productName }) => {
    // Memisahkan nama produk untuk layout dua baris seperti di gambar
    const nameParts = productName.split(' ');
    const firstLine = nameParts[0];
    const secondLine = nameParts.slice(1).join(' ');

    return (
        <div className="flex h-28 w-28 flex-col justify-between overflow-hidden rounded-md bg-indigo-800 p-2">
            <p className="font-mono text-[8px] tracking-wide text-white/80 uppercase">Espresso Roast 100% Arabica</p>
            <h3 className="text-lg leading-tight font-bold text-white uppercase">
                {firstLine} <br /> {secondLine}
            </h3>
            <p className="text-right font-mono text-[6px] tracking-wide text-white/70 uppercase">
                Espresso Roasted By: <span className="font-semibold text-white">lean</span>
            </p>
        </div>
    );
};

// Komponen individual untuk setiap item di keranjang
const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
    const formatPrice = (price: number): string => {
        return `Rp. ${price.toLocaleString('id-ID')}`; // Format harga ke IDR
    };

    return (
        <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
            {/* Gambar/Grafik Produk */}
            <ProductImageGraphic productName={item.name} />
            {/* Jika Anda ingin menggunakan gambar URL asli:
            <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
            */}

            <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-md mb-2 text-gray-600">{formatPrice(item.price)}</p>

                <div className="mt-3 flex items-center justify-between">
                    {/* Kontrol Kuantitas */}
                    <div className="flex items-center rounded-md bg-gray-100 p-1">
                        <button
                            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="rounded-md p-1 text-gray-600 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Decrease quantity of ${item.name}`}
                        >
                            <FileMinus className="h-4 w-4" />
                        </button>
                        <span className="px-3 text-lg font-medium text-gray-800">{item.quantity}</span>
                        <button
                            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                            className="rounded-md p-1 text-gray-600 hover:bg-gray-200"
                            aria-label={`Increase quantity of ${item.name}`}
                        >
                            <FilePlus className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Tombol Hapus */}
                    <button
                        onClick={() => onRemove(item.id)}
                        className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-100"
                        aria-label={`Remove ${item.name} from cart`}
                    >
                        <Trash className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Wishlist: React.FC = () => {
    // Data dummy untuk item keranjang
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 'prod_1',
            name: 'THE SAGARA 1999',
            price: 120000,
            quantity: 1,
            // imageUrl: '/images/sagara-coffee.png'
        },
        {
            id: 'prod_2',
            name: 'SUMATRA MANDHELING',
            price: 95000,
            quantity: 2,
            // imageUrl: '/images/mandheling-coffee.png'
        },
        {
            id: 'prod_3',
            name: 'JAVA ARABICA KINTAMANI',
            price: 110000,
            quantity: 1,
            // imageUrl: '/images/kintamani-coffee.png'
        },
        {
            id: 'prod_4',
            name: 'ETHIOPIA SIDAMO',
            price: 135000,
            quantity: 1,
            // imageUrl: '/images/sidamo-coffee.png'
        },
        {
            id: 'prod_5',
            name: 'COLOMBIA SUPREMO',
            price: 105000,
            quantity: 1,
            // imageUrl: '/images/supremo-coffee.png'
        },
    ]);

    // Fungsi untuk memformat harga ke IDR
    const formatPrice = (price: number): string => {
        return `Rp. ${price.toLocaleString('id-ID')}`;
    };

    // Menghitung total harga keranjang
    const calculateTotal = (): number => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    // Mengubah kuantitas item
    const handleQuantityChange = (itemId: string, newQuantity: number): void => {
        if (newQuantity < 1) return;
        setCartItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)));
    };

    // Menghapus item dari keranjang
    const handleRemoveItem = (itemId: string): void => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };

    // Fungsi untuk menutup keranjang (misalnya, jika ini modal)
    const handleCloseCart = (): void => {
        console.log('Cart closed!');
        // Di aplikasi nyata, Anda mungkin akan memanggil fungsi dari parent component
        // untuk menyembunyikan atau menonaktifkan modal ini.
    };

    return (
        <AppHeaderLayout>
            <Head title="Charts" />
            {/* Overlay untuk modal cart */}
            <div className="flex items-center justify-center p-4">
                {/* Container utama cart */}
                <div className="relative flex h-[90vh] w-full flex-col rounded-lg bg-white p-5 shadow-xl">
                    {/* Tombol Tutup */}
                    <button
                        onClick={handleCloseCart}
                        className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700"
                        aria-label="Close cart"
                    >
                        <Trash className="h-6 w-6" />
                    </button>

                    {/* Header Cart */}
                    <div className="border-b border-gray-100 p-6 pb-4">
                        <h2 className="mb-2 text-3xl font-bold text-gray-800">Your cart is brewing with goodness</h2>
                        <p className="text-gray-600">ready to check out?</p>
                    </div>

                    {/* Daftar Item Keranjang (Scrollable) */}
                    <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-6">
                        {cartItems.length === 0 ? (
                            <p className="py-8 text-center text-lg text-gray-500">Your cart is empty! Add some coffee.</p>
                        ) : (
                            cartItems.map((item) => (
                                <CartItem key={item.id} item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} />
                            ))
                        )}
                    </div>

                    {/* Footer Cart - Total dan Tombol Checkout */}
                    <div className="border-t border-gray-100 bg-white p-6 pt-4">
                        <div className="mb-4 flex items-center justify-between text-xl">
                            <span className="font-semibold text-gray-800">Total :</span>
                            <span className="font-bold text-gray-900">{formatPrice(calculateTotal())}</span>
                        </div>
                        <button
                            onClick={() => console.log('Proceed to Checkout with items:', cartItems)}
                            className="w-full rounded-md bg-indigo-800 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-indigo-900"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </AppHeaderLayout>
    );
};

export default Wishlist;
