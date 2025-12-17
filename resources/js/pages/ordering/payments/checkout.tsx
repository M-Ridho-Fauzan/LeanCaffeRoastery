// resources/js/pages/ordering/payments/checkout.tsx
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Product } from '@/types';
import { CheckCircle2, MapPin, Package, Truck } from 'lucide-react'; // Pastikan import icon
import React, { useMemo, useState } from 'react'; // Tambahkan useMemo

import { ArrowLeft, Banknote, CheckCircle, CreditCard, Landmark, QrCode, ShoppingCart, Wallet } from 'lucide-react';
interface CartItem {
    name: string;
    price: number;
    qty: number;
    primary_image_url?: string | null; // Tambahkan properti gambar
}
// --------------------------------------------------------------------

// Definisikan props untuk komponen Checkout
interface CheckoutProps {
    product: Product;
    cartItems?: CartItem[]; // Properti opsional untuk checkout keranjang
    onClose: () => void;
}

// Utility function (disalin dari ProductDetail)
// const truncateText = (text: string | null | undefined, maxLength: number): string => {
//     if (!text) return '';
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
// };

// Biaya ongkir tetap
const SHIPPING_COST = 15000;

// Komponen Pembantu untuk opsi Metode Pembayaran
interface PaymentOptionProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    isSelected: boolean;
    onSelect: () => void;
    disabled?: boolean; // Tambahkan prop disabled
}
const PaymentOption: React.FC<PaymentOptionProps> = ({ icon, title, description, isSelected, onSelect, disabled }) => (
    <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-center space-x-3 rounded-lg border p-3 text-left transition-colors duration-200 ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300 hover:border-gray-400'} ${disabled ? 'cursor-not-allowed opacity-60' : ''} focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none`}
        disabled={disabled} // Terapkan prop disabled
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
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 0 00-1.414 1.414l2 2a1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
            </svg>
        )}
    </button>
);
// Dummy data untuk metode pembayaran, Dihapus: Credit Card
const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer', description: 'Transfer Ke Rekening Bank Kami', icon: <Banknote className="h-5 w-5" /> },
    { id: 'virtual_account', name: 'Virtual Account', description: 'BCA, BRI, Mandiri Virtual Account', icon: <Landmark className="h-5 w-5" /> },
    { id: 'e_wallet', name: 'E-Wallet', description: 'DANA, OVO, GoPay, ShopeePay', icon: <Wallet className="h-5 w-5" /> },
    { id: 'qr_code', name: 'QRIS', description: 'Scan QR Code Untuk Membayar', icon: <QrCode className="h-5 w-5" /> },
];

const Checkout: React.FC<CheckoutProps> = ({ product, cartItems, onClose }) => {
    // Tambahkan cartItems di destrukturisasi
    // State untuk mengelola langkah saat ini dalam proses checkout
    const [currentStep, setCurrentStep] = useState<'checkout' | 'paymentDetails' | 'paymentSuccess' | 'trackOrder'>('checkout');
    // State untuk menyimpan metode pembayaran yang dipilih, default ke yang pertama (Bank Transfer)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(paymentMethods[0].id);
    // State untuk jumlah produk. Jika Cart Checkout, qty tidak dapat diubah, jadi set default 1

    const isCartCheckout = useMemo(() => cartItems && cartItems.length > 0, [cartItems]);
    const initialQuantity = isCartCheckout ? 1 : 1;
    // State untuk menampilkan loading saat proses pembayaran
    const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(initialQuantity);
    const [city, setCity] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [orderNotes, setOrderNotes] = useState<string>('');

    const subtotalPrice = useMemo(() => {
        if (isCartCheckout && cartItems) {
            return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
        }
        return product.price * quantity;
    }, [isCartCheckout, cartItems, product.price, quantity]);

    const formattedProductPrice = product.price.toLocaleString('id-ID');
    const formattedSubtotalPrice = subtotalPrice.toLocaleString('id-ID');
    const totalAmount = subtotalPrice + SHIPPING_COST;
    const formattedTotalAmount = totalAmount.toLocaleString('id-ID');

    const productNameForDisplay = isCartCheckout ? product.product_name : product.product_name;

    const handleProceedToPayment = () => {
        // Validasi informasi pengiriman
        if (!fullName || !email || !phoneNumber || !city || !postalCode || !address) {
            alert('Harap lengkapi semua informasi pengiriman.');
            return;
        }
        if (!selectedPaymentMethod) {
            alert('Mohon pilih metode pembayaran terlebih dahulu.');
            return;
        }
        // Hapus atau modifikasi validasi quantity jika Cart Checkout
        if (!isCartCheckout && quantity < 1) {
            // Hanya validasi qty jika BUKAN cart checkout
            alert('Jumlah produk harus minimal 1.');
            return;
        }
        setCurrentStep('paymentDetails');
    };
    const handleGoBackToCheckout = () => {
        setCurrentStep('checkout');
    };
    // Handler untuk menyelesaikan pembayaran (simulasi)
    const handleFinalizePayment = () => {
        setIsProcessingPayment(true); // Mulai loading
        console.log(`Memproses pembayaran ${selectedPaymentMethod} untuk ${quantity}x "${product.product_name}" total Rp ${formattedTotalAmount}...`);
        // Simulasi panggilan API atau logika pemrosesan pembayaran
        setTimeout(() => {
            console.log('Pembayaran berhasil dikonfirmasi!');
            setIsProcessingPayment(false); // Hentikan loading
            setCurrentStep('paymentSuccess'); // Lanjut ke langkah sukses
        }, 2500); // Simulasi waktu proses 2.5 detik
    };
    // Fungsi untuk merender detail pembayaran berdasarkan metode yang dipilih (TIDAK ADA PERUBAHAN)
    const renderPaymentDetailsContent = () => {
        // ... (kode yang sudah ada) ...
        if (isProcessingPayment) {
            return (
                <div className="py-10 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-lg font-semibold text-gray-700">Memproses pembayaran Anda...</p>
                    <p className="text-sm text-gray-500">Mohon tunggu sebentar.</p>
                </div>
            );
        }
        switch (selectedPaymentMethod) {
            case 'bank_transfer':
            case 'virtual_account':
                return (
                    <div className="space-y-4">
                        <p className="text-gray-700">Transfer ke rekening berikut:</p>
                        <div className="rounded-md border border-gray-200 bg-gray-100 p-4">
                            <p className="font-semibold text-gray-800">Bank BCA</p>
                            <p className="text-sm text-gray-600">
                                No. Rekening: <span className="font-mono font-bold text-blue-700">1234 5678 90</span>
                            </p>
                            <p className="text-sm text-gray-600">Atas Nama: PT Kopi Mantap</p>
                            <p className="mt-2 text-sm text-red-500">Pastikan nominal transfer sama persis dengan total belanja Anda.</p>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText('1234567890');
                                alert('Nomor rekening disalin!');
                            }}
                            className="w-full rounded-md border border-blue-300 bg-blue-50 px-5 py-2.5 text-sm font-medium text-blue-700 shadow-sm transition-colors duration-200 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Salin Nomor Rekening
                        </button>
                    </div>
                );
            case 'e_wallet':
                return (
                    <div className="space-y-4 text-center">
                        <p className="text-gray-700">Anda akan diarahkan ke aplikasi E-Wallet Anda untuk menyelesaikan pembayaran.</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-4">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_OVO.svg/1200px-Logo_OVO.svg.png"
                                alt="OVO"
                                className="h-8 max-w-[80px] object-contain"
                            />
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/DANA_logo_new.svg/1200px-DANA_logo_new.svg.png"
                                alt="DANA"
                                className="h-8 max-w-[80px] object-contain"
                            />
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/1200px-Gopay_logo.svg.png"
                                alt="GoPay"
                                className="h-8 max-w-[80px] object-contain"
                            />
                        </div>
                        <button
                            onClick={() => alert('Membuka aplikasi e-wallet Anda... (simulasi)')}
                            className="w-full rounded-md border border-green-300 bg-green-50 px-5 py-2.5 text-sm font-medium text-green-700 shadow-sm transition-colors duration-200 hover:bg-green-100 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Buka Aplikasi E-Wallet
                        </button>
                    </div>
                );
            case 'qr_code':
                return (
                    <div className="space-y-4 text-center">
                        <p className="text-gray-700">Scan QRIS ini dengan aplikasi pembayaran Anda.</p>
                        {/* Gambar QRIS dummy */}
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PembayaranQRISuntukProduk${product.id}-Rp${totalAmount}`}
                            alt="QRIS Code"
                            className="mx-auto mt-4 w-48 max-w-full rounded-lg border shadow-md"
                            style={{ height: 'auto' }}
                        />
                        <p className="text-sm text-gray-600">
                            Berlaku selama 15 menit. Total: <span className="font-bold text-gray-800">Rp {formattedTotalAmount}</span>
                        </p>
                    </div>
                );
            default:
                return <p className="text-gray-500">Pilih metode pembayaran untuk melihat detail.</p>;
        }
    };
    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="flex h-full flex-col p-0">
            {/* ... (Header Dialog) ... */}

            <DialogHeader className="relative border-b-0 px-6 py-6">
                {/* Tombol Back */}
                <button
                    onClick={() => {
                        // Logika kembali: Jika di Track Order, balik ke Success. Jika lainnya, balik ke Checkout
                        if (currentStep === 'trackOrder') setCurrentStep('paymentSuccess');
                        else handleGoBackToCheckout();
                    }}
                    className="absolute top-6 left-6 z-10 rounded-full p-1 transition-colors duration-200 hover:bg-gray-100"
                >
                    <ArrowLeft className="h-6 w-6 text-[#1e1b4b]" />
                </button>

                <DialogTitle
                    className={`text-center text-2xl font-bold ${
                        currentStep === 'paymentSuccess' ? 'text-green-500' : currentStep === 'trackOrder' ? 'text-[#1e1b4b]' : 'text-gray-900'
                    }`}
                >
                    {currentStep === 'checkout' && 'Checkout'}
                    {currentStep === 'paymentDetails' && 'Detail Pembayaran'}
                    {currentStep === 'paymentSuccess' && 'Payment Successful'}
                    {currentStep === 'trackOrder' && 'Track Your Order'}
                </DialogTitle>

                {/* Sembunyikan deskripsi saat mode Track Order agar header bersih */}
                {currentStep !== 'trackOrder' && (
                    <DialogDescription className="mt-2 text-center text-gray-500">
                        {currentStep === 'paymentSuccess'
                            ? 'Your order has been confirmed and is being processed.'
                            : currentStep === 'paymentDetails'
                              ? `Pembayaran untuk "${productNameForDisplay}"`
                              : 'Lengkapi pesanan Anda.'}
                    </DialogDescription>
                )}
            </DialogHeader>

            {/* Konten Utama yang Dapat Di-scroll - Untuk Langkah Checkout */}
            {currentStep === 'checkout' && (
                <div className="m-0 max-h-[calc(100vh-180px)] flex-1 space-y-4 overflow-y-auto p-6">
                    {/* Bagian Ringkasan Pesanan (Order Summary) */}
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                            <ShoppingCart className="mr-2 h-5 w-5 text-gray-600" />
                            Order Summary
                        </h3>

                        {/* GANTI: Logic untuk menampilkan daftar item atau single product */}
                        {isCartCheckout ? (
                            // RENDER DAFTAR ITEM DARI KERANJANG DENGAN GAMBAR
                            <div className="space-y-3">
                                {cartItems!.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0">
                                        {/* Bagian Kiri: Gambar, Nama, Harga */}
                                        <div className="flex items-center space-x-3">
                                            {/* Gambar Produk / Placeholder yang diminta */}
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                                <img
                                                    src={
                                                        item.primary_image_url
                                                            ? item.primary_image_url
                                                            : `https://placehold.co/600x600/2A2F5B/FFFFFF?text=${encodeURIComponent(truncateText(item.name, 10))}` // Placeholder dark blue
                                                    }
                                                    alt={item.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <p className="text-base font-medium text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {item.qty} x Rp {item.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bagian Kanan: Total Harga Item */}
                                        <div className="text-right">
                                            <span className="font-semibold text-gray-800">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // RENDER SINGLE PRODUCT - MODIFIKASI: Gunakan logika gambar yang sama
                            <div className="flex flex-col items-start space-y-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                    <img
                                        src={
                                            product.primary_image_url
                                                ? product.primary_image_url
                                                : `https://placehold.co/600x600/2A2F5B/FFFFFF?text=${encodeURIComponent(truncateText(product.product_name, 10))}`
                                        }
                                        alt={product.product_name}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-base font-medium text-gray-800">{product.product_name}</p>
                                    <p className="text-sm text-gray-500">Harga Satuan: Rp {formattedProductPrice}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-gray-700">
                                        Jumlah:
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={quantity}
                                        min="1"
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="block w-20 rounded-md border-gray-300 p-2 text-center shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        disabled={isProcessingPayment}
                                    />
                                </div>
                            </div>
                        )}
                        {/* AKHIR LOGIC SINGLE/MULTI ITEM */}

                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Sub Total</span>
                                <span className="font-medium text-gray-800">Rp {formattedSubtotalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium text-gray-800">Rp {SHIPPING_COST.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-bold text-gray-900">
                            <span>Total</span>
                            <span>Rp {formattedTotalAmount}</span>
                        </div>
                    </div>
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
                                    className="block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    disabled={isProcessingPayment}
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
                                    className="block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    disabled={isProcessingPayment}
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
                                    className="block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    disabled={isProcessingPayment}
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
                                    className="block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    disabled={isProcessingPayment}
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
                                    className="block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    disabled={isProcessingPayment}
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
                                    className="block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    disabled={isProcessingPayment}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="orderNotes" className="mb-1 block text-sm font-medium text-gray-700">
                                    Order Notes (Opsional)
                                </label>
                                <textarea
                                    id="orderNotes"
                                    rows={3}
                                    placeholder="Any Special Instructions or Requests"
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    disabled={isProcessingPayment}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    {/* Bagian Metode Pembayaran (Payment Method) - TIDAK ADA PERUBAHAN */}
                    {/* ... (kode Payment Method) ... */}
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                            <CreditCard className="mr-2 h-5 w-5 text-gray-600" />
                            Payment Method
                        </h3>
                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <PaymentOption
                                    key={method.id}
                                    icon={method.icon}
                                    title={method.name}
                                    description={method.description}
                                    isSelected={selectedPaymentMethod === method.id}
                                    onSelect={() => setSelectedPaymentMethod(method.id)}
                                    disabled={isProcessingPayment}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* Footer untuk tombol "Continue To Payment" (Hanya tampil di langkah checkout) - TIDAK ADA PERUBAHAN */}
            {currentStep === 'checkout' && (
                <div className="w-full border-t border-gray-200 bg-white p-6 shadow-md">
                    <button
                        type="button"
                        className="w-full rounded-md bg-indigo-700 px-6 py-3 text-lg font-medium text-white shadow-sm transition-colors duration-200 hover:bg-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-indigo-400"
                        onClick={handleProceedToPayment}
                        disabled={isProcessingPayment || !selectedPaymentMethod || (!isCartCheckout && quantity < 1)} // Modifikasi disable qty
                    >
                        Continue To Payment - Rp {formattedTotalAmount}
                    </button>
                </div>
            )}
            {/* Langkah 2: Detail Pembayaran */}
            {currentStep === 'paymentDetails' && (
                <div className="max-h-[calc(100vh-180px)] flex-1 space-y-6 overflow-y-auto px-6 py-6">
                    {/* GANTI: Tampilkan ringkasan yang sesuai */}
                    <div className="space-y-3 border-b pb-4">
                        <p className="text-xl font-bold text-gray-800">{productNameForDisplay}</p>
                        <ul className="text-sm text-gray-600">
                            {isCartCheckout ? (
                                cartItems!.map((item, index) => (
                                    <li key={index} className="flex justify-between">
                                        <span>
                                            {item.qty}x {item.name}
                                        </span>
                                        <span>Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="flex justify-between">
                                    <span>
                                        {quantity}x {product.product_name}
                                    </span>
                                    <span>Rp {formattedSubtotalPrice}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                    {/* AKHIR GANTI */}
                    {/* Ringkasan Harga di langkah detail pembayaran - TIDAK ADA PERUBAHAN */}
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                            <span>Sub Total:</span>
                            <span>Rp {formattedSubtotalPrice}</span>
                        </div>
                        <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                            <span>Shipping:</span>
                            <span>Rp {SHIPPING_COST.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t pt-2 text-xl font-bold text-gray-900">
                            <span>Total Pembayaran:</span>
                            <span>Rp {formattedTotalAmount}</span>
                        </div>
                    </div>
                    <div className="space-y-4 rounded-lg border bg-gray-50 p-4 shadow-inner">
                        <h3 className="text-xl font-bold text-gray-800">
                            Detail Pembayaran {paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name}
                        </h3>
                        {renderPaymentDetailsContent()}
                    </div>
                    <div className="mt-6 flex justify-center sm:justify-end">
                        <button
                            type="button"
                            className="w-full rounded-md border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                            onClick={handleFinalizePayment}
                            disabled={isProcessingPayment}
                        >
                            {isProcessingPayment ? 'Memproses...' : 'Bayar Sekarang'}
                        </button>
                    </div>
                </div>
            )}
            {currentStep === 'paymentSuccess' && (
                <div className="flex-1 overflow-y-auto px-6 pt-2 pb-8">
                    {/* Ikon Sukses */}
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            {/* Lingkaran background putih agar ikon terlihat bersih */}
                            <div className="rounded-full bg-white">
                                <CheckCircle className="h-20 w-20 fill-green-500 text-green-500 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Kartu Detail Order */}
                    <div className="mb-8 w-full rounded-xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                        {/* Header Bagian Atas Kartu */}
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-blue-900">Order Details</h4>
                            <div className="mt-1 flex items-center">
                                <span className="mr-2 text-sm text-gray-400">Total Amount :</span>
                                <span className="font-bold text-blue-900">Rp . 135.000</span>
                            </div>
                        </div>

                        {/* Judul Tengah */}
                        <div className="mb-4 text-center">
                            <span className="text-sm font-semibold text-blue-900">Bank Transfer Details</span>
                        </div>

                        {/* Kotak Border Dalam */}
                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4 text-sm">
                                {/* Baris 1: Order ID & Tracking */}
                                <div>
                                    <p className="mb-1 text-xs text-gray-400">Order ID</p>
                                    <p className="font-semibold text-blue-900">ORD-1755264937855</p>
                                </div>
                                <div className="text-right">
                                    <p className="mb-1 text-xs text-gray-400">Tracking Number</p>
                                    <p className="font-semibold text-blue-900">TRK64937856</p>
                                </div>

                                {/* Baris 2: Tanggal */}
                                <div>
                                    <p className="mb-1 text-xs text-gray-400">Order Date</p>
                                    <p className="font-semibold text-blue-900">8/15/2025</p>
                                </div>
                                <div className="text-right">
                                    <p className="mb-1 text-xs text-gray-400">Estimated Delivery</p>
                                    <p className="font-semibold text-blue-900">8/17/2025</p>
                                </div>

                                {/* Baris 3: Item */}
                                <div className="col-span-2 mt-2">
                                    <p className="mb-1 text-xs text-gray-400">Item Ordered</p>
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-blue-900">The Sagara 1999 x 1</p>
                                        <p className="font-semibold text-blue-900">Rp . 120.000</p>
                                    </div>
                                </div>
                            </div>

                            {/* Garis Pemisah */}
                            <hr className="my-4 border-gray-200" />

                            {/* Total Paid */}
                            <div className="flex items-center justify-between">
                                <span className="text-base font-bold text-blue-900">Total Paid</span>
                                <span className="text-base font-bold text-blue-900">Rp . 135.000</span>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi (Footer) */}
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose} // Atau fungsi navigasi ke Home
                            className="flex-1 rounded-lg border border-blue-900 bg-white px-4 py-3 text-sm font-semibold text-blue-900 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            Continue Shopping
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentStep('trackOrder')} // <--- UBAH INI
                            className="flex-1 rounded-lg bg-[#2e3192] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-900"
                        >
                            Track Order
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 'trackOrder' && (
                <div className="flex-1 overflow-y-auto px-6 pt-2 pb-8">
                    {/* KARTU UTAMA */}
                    <div className="mb-8 w-full rounded-xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                        {/* Judul Order ID */}
                        <h3 className="mb-6 text-xl font-bold text-[#1e1b4b]">Order #ORD-1755264937855</h3>

                        {/* Grid Informasi Atas */}
                        <div className="mb-8 grid grid-cols-2 gap-x-4 gap-y-6">
                            <div>
                                <p className="mb-1 text-sm text-gray-400">Order Date</p>
                                <p className="font-bold text-[#1e1b4b]">8/15/2025</p>
                            </div>
                            <div className="text-right sm:text-left">
                                {' '}
                                {/* Penyesuaian align */}
                                <p className="mb-1 text-sm text-gray-400">Tracking Number</p>
                                <p className="font-bold text-[#1e1b4b]">TRK64937856</p>
                            </div>
                            <div>
                                <p className="mb-1 text-sm text-gray-400">Total Amount :</p>
                                <p className="font-bold text-[#1e1b4b]">Rp . 135.000</p>
                            </div>
                            <div className="text-right sm:text-left">
                                <p className="mb-1 text-sm text-gray-400">Estimated Delivery</p>
                                <p className="font-bold text-[#1e1b4b]">8/17/2025</p>
                            </div>
                        </div>

                        {/* Bagian Progress */}
                        <div className="mb-6">
                            <h4 className="mb-4 text-lg font-bold text-[#1e1b4b]">Order Progress</h4>

                            {/* Progress Bar Visual */}
                            <div className="relative mb-8 h-3 w-full overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                                {/* Bagian terisi (35% width sebagai contoh 'Processing') */}
                                <div className="absolute top-0 left-0 h-full w-[35%] rounded-full bg-[#1e1b4b]"></div>
                            </div>

                            {/* Timeline Steps */}
                            <div className="relative space-y-6">
                                {/* Step 1: Order Confirmed */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <CheckCircle2 className="h-8 w-8 fill-green-100 text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <p className="text-sm font-bold text-[#1e1b4b]">Order Confirmed</p>
                                            <span className="text-xs text-gray-400">20.35</span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-400">Your order has been received and confirmed</p>
                                    </div>
                                </div>

                                {/* Step 2: Processing (Active) */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <Package className="h-8 w-8 fill-green-100 text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <p className="text-sm font-bold text-[#1e1b4b]">Processing</p>
                                            <span className="text-xs text-gray-400">In Progress</span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-400">Your Coffee Is Being Prepared</p>
                                    </div>
                                </div>

                                {/* Step 3: Shipped */}
                                <div className="flex gap-4 opacity-50">
                                    {' '}
                                    {/* Opacity untuk status belum sampai */}
                                    <div className="flex-shrink-0">
                                        <Truck className="h-8 w-8 fill-green-100 text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <p className="text-sm font-bold text-[#1e1b4b]">Shipped</p>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-400">Your order Is On The Way</p>
                                    </div>
                                </div>

                                {/* Step 4: Delivered */}
                                <div className="flex gap-4 opacity-50">
                                    <div className="flex-shrink-0">
                                        <CheckCircle2 className="h-8 w-8 fill-green-100 text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <p className="text-sm font-bold text-[#1e1b4b]">Delivered</p>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-400">Estimated Delivery 8/10/2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-[#1e1b4b] bg-white px-4 py-3 text-sm font-semibold text-[#1e1b4b] transition-colors hover:bg-gray-50"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="flex-1 rounded-lg bg-[#1e1b4b] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-900"
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
