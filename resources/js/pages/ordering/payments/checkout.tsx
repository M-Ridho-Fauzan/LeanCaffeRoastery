// resources/js/pages/ordering/payments/checkout.tsx
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Product } from '@/types';
import { Banknote, CreditCard, Landmark, MapPin, QrCode, ShoppingCart, Wallet } from 'lucide-react'; // Import icons
import React, { useState } from 'react';

// Definisikan props untuk komponen Checkout
interface CheckoutProps {
    product: Product; // Produk yang akan di-checkout
    onClose: () => void; // Fungsi untuk menutup dialog
}

// Fixed shipping cost as per the design
const SHIPPING_COST = 15000; // Harga ongkir tetap sesuai desain

const Checkout: React.FC<CheckoutProps> = ({ product, onClose }) => {
    // State for shipping information
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [orderNotes, setOrderNotes] = useState<string>('');

    // State for selected payment method
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Bank Transfer'); // Default ke Bank Transfer

    // Calculate totals
    const subTotal = product.price;
    const totalAmount = subTotal + SHIPPING_COST;

    const handleContinueToPayment = () => {
        // Basic validation for shipping info
        if (!fullName || !email || !phoneNumber || !city || !postalCode || !address) {
            alert('Harap lengkapi semua informasi pengiriman.');
            return;
        }

        alert(`Melanjutkan ke pembayaran Rp ${totalAmount.toLocaleString('id-ID')} dengan metode ${selectedPaymentMethod}...`);
        // Dalam aplikasi nyata, Anda akan mengirim data ini ke backend Anda
        // untuk pembuatan pesanan dan pemrosesan pembayaran.
        setTimeout(() => {
            alert('Pesanan berhasil dibuat! Lanjutkan ke pembayaran.');
            onClose(); // Tutup dialog setelah inisiasi pesanan berhasil
        }, 1500);
    };

    return (
        <div className="flex h-full flex-col p-0">
            {' '}
            {/* Kontainer utama: flex column, tinggi penuh, tanpa padding di luar */}
            <DialogHeader className="relative border-b px-6 py-4">
                {' '}
                {/* Header dialog */}
                <DialogTitle className="text-xl font-bold text-gray-900">Checkout</DialogTitle>
                {/* Tombol X sudah ditangani oleh DialogContent dari shadcn/ui */}
            </DialogHeader>
            {/* Konten utama yang dapat di-scroll */}
            <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-6">
                {' '}
                {/* flex-1 agar mengisi ruang vertikal tersisa dan bisa di-scroll */}
                {/* Order Summary Section */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                        <ShoppingCart className="mr-2 h-5 w-5 text-gray-600" />
                        Order Summary
                    </h3>
                    <div className="flex items-center space-x-4 border-b border-gray-100 pb-4">
                        <img
                            src={product.primary_image_url || '/placeholder.svg'} // Gunakan placeholder jika tidak ada gambar
                            alt={product.product_name}
                            className="h-16 w-16 rounded-md object-cover shadow-sm"
                        />
                        <div className="flex-1">
                            <p className="text-base font-medium text-gray-800">{product.product_name}</p>
                            <p className="text-sm text-gray-500">Qty 1</p>
                        </div>
                        <span className="text-base font-semibold text-gray-800">Rp {subTotal.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Sub Total</span>
                            <span className="font-medium text-gray-800">Rp {subTotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium text-gray-800">Rp {SHIPPING_COST.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                </div>
                {/* Shipping Information Section */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                        <MapPin className="mr-2 h-5 w-5 text-gray-600" />
                        Shipping Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                placeholder="Enter Your Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="block w-full rounded-md border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                placeholder="Enter Your Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="block w-full rounded-md border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                placeholder="Enter Your City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="block w-full rounded-md border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="postalCode" className="mb-1 block text-sm font-medium text-gray-700">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                id="postalCode"
                                placeholder="Enter Postal Code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                className="block w-full rounded-md border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                placeholder="Enter Your Full Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="block w-full rounded-md border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="orderNotes" className="mb-1 block text-sm font-medium text-gray-700">
                                Order Notes (Opsiional)
                            </label>
                            <input
                                type="text"
                                id="orderNotes"
                                placeholder="Any Special Instructions"
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                className="block w-full rounded-md border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
                {/* Payment Method Section */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                        <CreditCard className="mr-2 h-5 w-5 text-gray-600" />
                        Payment Method
                    </h3>
                    <div className="space-y-3">
                        <PaymentOption
                            icon={<Banknote className="h-5 w-5" />}
                            title="Bank Transfer"
                            description="Transfer To Our bank Account"
                            isSelected={selectedPaymentMethod === 'Bank Transfer'}
                            onSelect={() => setSelectedPaymentMethod('Bank Transfer')}
                        />
                        <PaymentOption
                            icon={<Landmark className="h-5 w-5" />} // Menggunakan Landmark untuk Virtual Account
                            title="Virtual Account"
                            description="BCA,BRI,Mandiri Virtual Account"
                            isSelected={selectedPaymentMethod === 'Virtual Account'}
                            onSelect={() => setSelectedPaymentMethod('Virtual Account')}
                        />
                        <PaymentOption
                            icon={<Wallet className="h-5 w-5" />}
                            title="E-Wallet"
                            description="DANA,OVO,GoPay,ShopeePay"
                            isSelected={selectedPaymentMethod === 'E-Wallet'}
                            onSelect={() => setSelectedPaymentMethod('E-Wallet')}
                        />
                        <PaymentOption
                            icon={<QrCode className="h-5 w-5" />}
                            title="QRIS"
                            description="Scan QR Code To Pay"
                            isSelected={selectedPaymentMethod === 'QRIS'}
                            onSelect={() => setSelectedPaymentMethod('QRIS')}
                        />
                    </div>
                </div>
            </div>
            {/* Footer untuk tombol "Continue To Payment" */}
            <div className="w-full border-t border-gray-200 bg-white p-6 shadow-md">
                {' '}
                {/* Footer akan tetap di bawah */}
                <button
                    type="button"
                    className="w-full rounded-md bg-indigo-700 px-6 py-3 text-lg font-medium text-white shadow-sm transition-colors duration-200 hover:bg-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                    onClick={handleContinueToPayment}
                >
                    Continue To Payment - Rp {totalAmount.toLocaleString('id-ID')}
                </button>
            </div>
        </div>
    );
};

export default Checkout;

// Komponen Pembantu untuk opsi Metode Pembayaran (tidak ada perubahan)
interface PaymentOptionProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    isSelected: boolean;
    onSelect: () => void;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({ icon, title, description, isSelected, onSelect }) => (
    <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-center space-x-3 rounded-lg border p-3 text-left transition-colors duration-200 ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300 hover:border-gray-400'} focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none`}
    >
        <div className={`rounded-full p-2 ${isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>{icon}</div>
        <div className="flex-1">
            <p className="font-medium text-gray-800">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        {isSelected && (
            <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
            </svg>
        )}
    </button>
);
