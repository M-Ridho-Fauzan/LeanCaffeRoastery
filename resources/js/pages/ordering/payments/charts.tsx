import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

// --- Interfaces ---

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

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

// --- Placeholder Components ---
// Jika project Anda menggunakan Inertia, bisa ganti dengan: import { Head } from '@inertiajs/react';
const Head: React.FC<HeadProps> = ({ title }) => <title>{title || 'Default Title'}</title>;

// --- Sub-Components ---

// 1. Gambar Produk (Grafik Kotak Biru)
const ProductImageGraphic: React.FC<ProductImageGraphicProps> = ({ productName }) => {
    // Memecah nama produk agar tampilan teks estetik (baris 1 & baris 2)
    const nameParts = productName.split(' ');
    const firstLine = nameParts[0];
    const secondLine = nameParts.slice(1).join(' ');

    return (
        <div className="flex h-20 w-24 flex-shrink-0 flex-col justify-between overflow-hidden rounded-md bg-[#30307e] p-2 shadow-sm">
            <p className="font-mono text-[6px] tracking-wide text-white/80 uppercase">Espresso Roast 100% Arabica</p>
            <h3 className="text-sm leading-tight font-bold text-white uppercase">
                {firstLine} <br /> {secondLine}
            </h3>
            <p className="text-right font-mono text-[5px] tracking-wide text-white/70 uppercase">
                Roasted By: <span className="font-semibold text-white">lean</span>
            </p>
        </div>
    );
};

// 2. Baris Item (Row) di dalam List Keranjang
const CartItemRow: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
    const formatPrice = (price: number) => `Rp. ${price.toLocaleString('id-ID')}`;

    return (
        <div className="flex items-start gap-4 border-b border-gray-100 py-4 last:border-0">
            {/* Component Gambar */}
            <ProductImageGraphic productName={item.name} />

            {/* Detail Produk & Kontrol */}
            <div className="flex h-20 flex-1 flex-col justify-between">
                <div>
                    <h3 className="text-sm font-bold text-[#30307e] uppercase">{item.name}</h3>
                    <p className="mt-1 text-xs text-gray-400">{formatPrice(item.price)}</p>
                </div>

                <div className="flex items-center justify-between">
                    {/* Tombol Plus/Minus */}
                    <div className="flex items-center rounded border border-gray-200 bg-gray-50 px-1 py-0.5">
                        <button
                            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="cursor-pointer p-1 text-gray-500 transition-colors hover:text-[#30307e] disabled:opacity-30"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="min-w-[2rem] px-3 text-center text-sm font-semibold text-[#30307e]">{item.quantity}</span>
                        <button
                            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                            className="cursor-pointer p-1 text-gray-500 transition-colors hover:text-[#30307e]"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Tombol Hapus */}
                    <button onClick={() => onRemove(item.id)} className="cursor-pointer p-1 text-gray-400 transition-colors hover:text-red-500">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

const Charts: React.FC = () => {
    // Data Dummy Awal
    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: 'prod_1', name: 'THE SAGARA 1999', price: 120000, quantity: 1 },
        { id: 'prod_2', name: 'SUMATRA MANDHELING', price: 95000, quantity: 2 },
        { id: 'prod_3', name: 'JAVA ARABICA', price: 110000, quantity: 1 },
    ]);

    // Format Rupiah
    const formatPrice = (price: number) => `Rp. ${price.toLocaleString('id-ID')}`;

    // Hitung Total
    const calculateTotal = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Handler Ubah Jumlah
    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)));
    };

    // Handler Hapus Item
    const handleRemoveItem = (itemId: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    return (
        <AppHeaderLayout>
            <Head title="Cart Simulation" />

            {/* Container Utama: Mengatur posisi Card agar di tengah layar */}
            <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center bg-gray-100/50 p-4">
                {/* --- KARTU POPUP / DIALOG --- */}
                <div className="relative flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 animate-in zoom-in-95">
                    {/* HEADER: Judul & Tombol Close */}
                    <div className="flex items-start justify-between p-6 pb-2">
                        <div>
                            <h2 className="text-2xl leading-tight font-bold text-[#30307e]">
                                Your cart is brewing
                                <br />
                                with goodness
                            </h2>
                            <p className="mt-2 text-sm text-[#30307e]/80">ready to check out?</p>
                        </div>
                        {/* Tombol Close (Hanya visual karena ini halaman demo) */}
                        <button className="cursor-pointer rounded-full p-1 text-[#30307e] transition-colors hover:bg-indigo-50">
                            <X size={24} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* BODY: Daftar Item (Bisa di-scroll) */}
                    <div className="custom-scrollbar max-h-[50vh] flex-1 space-y-2 overflow-y-auto px-6 py-2">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center space-y-4 py-10 text-gray-400">
                                <ShoppingBag size={48} className="opacity-20" />
                                <p>Keranjang Anda kosong.</p>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <CartItemRow key={item.id} item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} />
                            ))
                        )}
                    </div>

                    {/* FOOTER: Total & Tombol Checkout */}
                    <div className="border-t border-gray-100 bg-white p-6 pt-4">
                        <div className="mb-6 flex items-center justify-between">
                            <span className="text-lg font-bold text-[#30307e]">Total :</span>
                            <span className="text-lg font-bold text-[#30307e]">{formatPrice(calculateTotal())}</span>
                        </div>

                        <button
                            disabled={cartItems.length === 0}
                            className="w-full rounded-full bg-[#30307e] py-4 font-bold text-white shadow-lg transition-transform hover:bg-[#252563] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => alert('Proceeding to checkout with amount: ' + formatPrice(calculateTotal()))}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
                {/* --- END KARTU POPUP --- */}
            </div>
        </AppHeaderLayout>
    );
};

export default Charts;
