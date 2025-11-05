// cart-field.tsx
import { Button } from '@headlessui/react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useMemo } from 'react'; // Hapus useState karena state akan dari props

// --- Definisi Tipe Data untuk Produk dan Item Keranjang ---
// Ini harus konsisten dengan bagaimana Anda menyimpan item di parent component
export interface CartProduct {
    // Export interface agar bisa digunakan di parent
    id: string;
    name: string;
    imageUrl: string;
    price: number;
}

export interface CartItem {
    // Export interface agar bisa digunakan di parent
    product: CartProduct;
    quantity: number;
}

// Hapus DUMMY_PRODUCTS dan INITIAL_CART_ITEMS karena data akan datang dari props

// --- Properti untuk Komponen CartField ---
interface CartFieldProps {
    isOpen: boolean; // Mengontrol visibilitas sidebar
    onClose: () => void; // Fungsi untuk menutup sidebar
    cartItems: CartItem[]; // <<--- Menerima item keranjang dari parent
    onIncrementQuantity: (productId: string) => void; // Fungsi untuk menambah kuantitas
    onDecrementQuantity: (productId: string) => void; // Fungsi untuk mengurangi kuantitas
    onRemoveItem: (productId: string) => void; // Fungsi untuk menghapus item
}

function CartField({ isOpen, onClose, cartItems, onIncrementQuantity, onDecrementQuantity, onRemoveItem }: CartFieldProps) {
    // Hapus `useState` untuk `cartItems` karena sekarang dari props
    // Hapus juga `useCallback` untuk `incrementQuantity`, `decrementQuantity`, `removeItem`

    // --- Kalkulasi Total Harga ---
    const total = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }, [cartItems]);

    const formattedTotal = useMemo(() => total.toLocaleString('id-ID'), [total]);

    // Jika `isOpen` false, komponen tidak dirender
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="cart-title" role="dialog" aria-modal="true">
            {/* Overlay background */}
            <div className="bg-opacity-75 absolute inset-0 bg-gray-500 transition-opacity" onClick={onClose}></div>

            {/* Sidebar panel */}
            <div
                className={`fixed inset-y-0 right-0 flex max-w-full pl-10 transition duration-300 ease-in-out sm:pl-16 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full' // Animasi slide-in/slide-out
                }`}
            >
                <div className="w-screen max-w-md">
                    <div className="flex h-full flex-col bg-white shadow-xl">
                        {/* Header Area */}
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <h2 id="cart-title" className="text-3xl font-bold tracking-tight text-[#252831]">
                                    Your cart is brewing
                                    <br />
                                    with goodness
                                </h2>
                                <div className="ml-3 flex h-7 items-center">
                                    <Button
                                        type="button"
                                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                        onClick={onClose}
                                        aria-label="Close cart"
                                    >
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Close panel</span>
                                        <X className="h-6 w-6" aria-hidden="true" />
                                    </Button>
                                </div>
                            </div>
                            <p className="mt-2 text-gray-500">ready to check out?</p>
                        </div>

                        {/* Cart Items List Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {/* Jika keranjang kosong */}
                            {cartItems.length === 0 ? (
                                <p className="text-center text-gray-500">Your cart is empty.</p>
                            ) : (
                                <ul role="list" className="-my-6 divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <li key={item.product.id} className="flex py-6">
                                            {/* Gambar Produk */}
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={item.product.imageUrl}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            {/* Detail Item dan Kontrol */}
                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>
                                                            <a href="#" className="hover:underline">
                                                                {item.product.name}
                                                            </a>
                                                        </h3>
                                                        <p className="ml-4">Rp {item.product.price.toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        {/* Kontrol Kuantitas */}
                                                        <div className="inline-flex divide-x divide-gray-200 rounded-md bg-gray-100 shadow-sm">
                                                            <Button
                                                                type="button"
                                                                className="relative inline-flex items-center p-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:z-10 focus:outline-none"
                                                                onClick={() => onDecrementQuantity(item.product.id)} // Panggil prop
                                                                disabled={item.quantity <= 1} // Nonaktifkan tombol minus jika kuantitas 1
                                                                aria-label={`Decrease quantity of ${item.product.name}`}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                                                                {item.quantity}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                className="relative inline-flex items-center p-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:z-10 focus:outline-none"
                                                                onClick={() => onIncrementQuantity(item.product.id)} // Panggil prop
                                                                aria-label={`Increase quantity of ${item.product.name}`}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        {/* Tombol Hapus */}
                                                        <Button
                                                            type="button"
                                                            className="rounded-md p-2 font-medium text-red-600 hover:bg-red-50 hover:text-red-500"
                                                            onClick={() => onRemoveItem(item.product.id)} // Panggil prop
                                                            aria-label={`Remove ${item.product.name} from cart`}
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                            <span className="sr-only">Remove</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer Area (Total dan Checkout) */}
                        <div className="border-t border-gray-200 px-6 py-6 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Total :</p>
                                <p>Rp {formattedTotal}</p>
                            </div>
                            <div className="mt-6">
                                <Button
                                    type="button"
                                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#252831] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#343743]"
                                    onClick={() => alert('Proceeding to checkout!')} // Ganti dengan logika checkout Anda
                                >
                                    Checkout
                                </Button>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                <p>
                                    or{' '}
                                    <button type="button" className="font-medium text-[#252831] hover:text-[#343743]" onClick={onClose}>
                                        Continue Shopping
                                        <span aria-hidden="true"> &rarr;</span>
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartField;
