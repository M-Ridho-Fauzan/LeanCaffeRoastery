// resources/js/pages/ordering/payments/checkout.tsx
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Sesuaikan path ini jika berbeda
import type { Product } from '@/types'; // Import tipe Product Anda
import React, { useState } from 'react';

// Import ikon yang diperlukan
// Pastikan semua ikon yang digunakan diimpor di sini
import { ArrowLeft, Banknote, CheckCircle, CreditCard, Landmark, MapPin, QrCode, ShoppingCart, Wallet } from 'lucide-react';

// Definisikan props untuk komponen Checkout
interface CheckoutProps {
    product: Product; // Produk yang akan di-checkout
    onClose: () => void; // Fungsi untuk menutup seluruh dialog
}

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

// Dummy data untuk metode pembayaran, disesuaikan untuk tampilan awal dan detail
const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer', description: 'Transfer Ke Rekening Bank Kami', icon: <Banknote className="h-5 w-5" /> },
    { id: 'virtual_account', name: 'Virtual Account', description: 'BCA, BRI, Mandiri Virtual Account', icon: <Landmark className="h-5 w-5" /> },
    { id: 'e_wallet', name: 'E-Wallet', description: 'DANA, OVO, GoPay, ShopeePay', icon: <Wallet className="h-5 w-5" /> },
    { id: 'qr_code', name: 'QRIS', description: 'Scan QR Code Untuk Membayar', icon: <QrCode className="h-5 w-5" /> },
    // Menambahkan Credit Card agar dapat ditangani di renderPaymentDetailsContent jika diperlukan
    { id: 'credit_card', name: 'Credit Card', description: 'Visa, Mastercard', icon: <CreditCard className="h-5 w-5" /> },
];

const Checkout: React.FC<CheckoutProps> = ({ product, onClose }) => {
    // State untuk mengelola langkah saat ini dalam proses checkout
    const [currentStep, setCurrentStep] = useState<'checkout' | 'paymentDetails' | 'paymentSuccess'>('checkout');
    // State untuk menyimpan metode pembayaran yang dipilih, default ke yang pertama (Bank Transfer)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(paymentMethods[0].id);
    // State untuk jumlah produk
    const [quantity, setQuantity] = useState<number>(1);
    // State untuk menampilkan loading saat proses pembayaran
    const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

    // State untuk informasi pengiriman (ditambahkan)
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [orderNotes, setOrderNotes] = useState<string>('');

    // Perhitungan harga
    const formattedProductPrice = product.price.toLocaleString('id-ID');
    const subtotalPrice = product.price * quantity;
    const formattedSubtotalPrice = subtotalPrice.toLocaleString('id-ID');
    const totalAmount = subtotalPrice + SHIPPING_COST; // Total dengan ongkir
    const formattedTotalAmount = totalAmount.toLocaleString('id-ID');

    // Handler untuk melanjutkan dari pemilihan metode pembayaran ke detail pembayaran (diperbarui)
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
        if (quantity < 1) {
            alert('Jumlah produk harus minimal 1.');
            return;
        }
        setCurrentStep('paymentDetails');
    };

    // Handler untuk kembali dari detail pembayaran ke pemilihan metode pembayaran
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

    // Fungsi untuk merender detail pembayaran berdasarkan metode yang dipilih
    const renderPaymentDetailsContent = () => {
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
            case 'virtual_account': // Gunakan detail bank transfer untuk virtual account
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
                            {' '}
                            {/* Menggunakan flex-wrap dan gap untuk responsivitas */}
                            {/* Gambar dummy untuk logo e-wallet */}
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_OVO.svg/1200px-Logo_OVO.svg.png"
                                alt="OVO"
                                className="h-8 max-w-[80px] object-contain" // max-w untuk kontrol ukuran
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
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PembayaranQRISuntukProduk${product.id}-Rp${totalAmount}`} // Menggunakan totalAmount
                            alt="QRIS Code"
                            className="mx-auto mt-4 w-48 max-w-full rounded-lg border shadow-md" // Menambahkan max-w-full
                            style={{ height: 'auto' }} // Tinggi otomatis agar proporsional
                        />
                        <p className="text-sm text-gray-600">
                            Berlaku selama 15 menit. Total: <span className="font-bold text-gray-800">Rp {formattedTotalAmount}</span>
                        </p>
                    </div>
                );
            case 'credit_card':
                return (
                    <div className="space-y-4">
                        <p className="text-gray-700">Silakan masukkan detail kartu kredit Anda.</p>
                        <input
                            type="text"
                            placeholder="Nomor Kartu (XXXX-XXXX-XXXX-XXXX)"
                            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {' '}
                            {/* Menggunakan grid untuk responsivitas */}
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="CVC"
                                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Nama Pemilik Kartu"
                            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                );
            default:
                return <p className="text-gray-500">Pilih metode pembayaran untuk melihat detail.</p>;
        }
    };

    return (
        <div className="flex h-full flex-col p-0">
            {/* Header Dialog */}
            <DialogHeader className="relative border-b px-6 py-4">
                {/* Tombol kembali, hanya muncul di langkah 'paymentDetails' */}
                {currentStep === 'paymentDetails' && (
                    <button
                        onClick={handleGoBackToCheckout}
                        className="absolute top-4 left-4 z-10 rounded-full p-2 transition-colors duration-200 hover:bg-gray-100"
                        aria-label="Kembali ke pemilihan metode pembayaran"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>
                )}
                <DialogTitle className="text-center text-2xl font-bold text-gray-900">
                    {currentStep === 'checkout'
                        ? 'Checkout' // Judul untuk tampilan awal
                        : currentStep === 'paymentDetails'
                          ? 'Detail Pembayaran'
                          : 'Pembayaran Berhasil!'}
                </DialogTitle>
                <DialogDescription className="text-center text-gray-600">
                    {currentStep === 'checkout'
                        ? 'Lengkapi pesanan Anda.' // Deskripsi untuk tampilan awal
                        : currentStep === 'paymentDetails'
                          ? `Pembayaran untuk "${product.product_name}"`
                          : 'Terima kasih telah berbelanja dengan kami.'}
                </DialogDescription>
            </DialogHeader>

            {/* Konten Utama yang Dapat Di-scroll - Untuk Langkah Checkout */}
            {currentStep === 'checkout' && (
                // Tambahkan max-h-[calc(100vh-180px)] untuk membatasi tinggi konten agar responsif
                // dan overflow-y-auto untuk mengaktifkan scroll jika konten melebihi tinggi
                <div className="m-0 max-h-[calc(100vh-180px)] flex-1 space-y-4 overflow-y-auto p-6">
                    {/* Bagian Ringkasan Pesanan (Order Summary) */}
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                            <ShoppingCart className="mr-2 h-5 w-5 text-gray-600" />
                            Order Summary
                        </h3>
                        <div className="flex flex-col items-start space-y-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                            {product.primary_image_url && (
                                <img
                                    src={product.primary_image_url}
                                    alt={product.product_name}
                                    className="h-16 w-16 flex-shrink-0 rounded-md object-cover shadow-sm"
                                />
                            )}
                            {!product.primary_image_url && (
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-400 shadow-sm">
                                    <ShoppingCart className="h-8 w-8" />
                                </div>
                            )}
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

                    {/* Bagian Informasi Pengiriman (Shipping Information) */}
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
                                    type="tel" // Menggunakan type="tel" untuk nomor telepon
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
                                {/* Menggunakan sm:col-span-2 agar memenuhi lebar penuh di layar kecil */}
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
                                <textarea // Menggunakan textarea untuk catatan yang lebih panjang
                                    id="orderNotes"
                                    rows={3} // Menentukan jumlah baris
                                    placeholder="Any Special Instructions or Requests"
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    disabled={isProcessingPayment}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Bagian Metode Pembayaran (Payment Method) */}
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

            {/* Footer untuk tombol "Continue To Payment" (Hanya tampil di langkah checkout) */}
            {currentStep === 'checkout' && (
                <div className="w-full border-t border-gray-200 bg-white p-6 shadow-md">
                    <button
                        type="button"
                        className="w-full rounded-md bg-indigo-700 px-6 py-3 text-lg font-medium text-white shadow-sm transition-colors duration-200 hover:bg-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-indigo-400"
                        onClick={handleProceedToPayment}
                        disabled={isProcessingPayment || !selectedPaymentMethod || quantity < 1} // Nonaktifkan jika sedang proses atau belum memilih atau qty < 1
                    >
                        Continue To Payment - Rp {formattedTotalAmount}
                    </button>
                </div>
            )}

            {/* Langkah 2: Detail Pembayaran */}
            {currentStep === 'paymentDetails' && (
                // Tambahkan max-h-[calc(100vh-180px)] untuk membatasi tinggi konten agar responsif
                // dan overflow-y-auto untuk mengaktifkan scroll jika konten melebihi tinggi
                <div className="max-h-[calc(100vh-180px)] flex-1 space-y-6 overflow-y-auto px-6 py-6">
                    <div className="flex flex-col items-start space-y-3 border-b pb-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                        {product.primary_image_url && (
                            <img
                                src={product.primary_image_url}
                                alt={product.product_name}
                                className="h-20 w-20 flex-shrink-0 rounded-md object-cover shadow-sm"
                            />
                        )}
                        {!product.primary_image_url && (
                            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-400 shadow-sm">
                                <ShoppingCart className="h-10 w-10" />
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="text-lg font-semibold text-gray-800">{product.product_name}</p>
                            <p className="text-gray-600">Harga Satuan: Rp {formattedProductPrice}</p>
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
                                disabled={true} // Nonaktifkan di langkah detail pembayaran
                            />
                        </div>
                    </div>
                    {/* Ringkasan Harga di langkah detail pembayaran */}
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
                        {' '}
                        {/* Menyesuaikan justify untuk responsivitas */}
                        <button
                            type="button"
                            className="w-full rounded-md border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                            onClick={handleFinalizePayment}
                            disabled={isProcessingPayment} // Nonaktifkan saat proses pembayaran
                        >
                            {isProcessingPayment ? 'Memproses...' : 'Bayar Sekarang'}
                        </button>
                    </div>
                </div>
            )}

            {/* Langkah 3: Pembayaran Berhasil */}
            {currentStep === 'paymentSuccess' && (
                <div className="max-h-[calc(100vh-180px)] flex-1 space-y-4 overflow-y-auto px-6 py-8 text-center">
                    <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
                    <h3 className="text-3xl font-bold text-green-700">Pembayaran Berhasil!</h3>
                    <p className="text-gray-600">Pesanan Anda telah berhasil dikonfirmasi dan akan segera diproses.</p>
                    <p className="text-sm text-gray-500">
                        Nomor Transaksi:{' '}
                        <span className="font-semibold text-gray-700">TXN-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                    </p>
                    <button
                        type="button"
                        className="mt-6 rounded-md border border-transparent bg-blue-600 px-6 py-3 text-lg font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        onClick={onClose} // Menutup seluruh dialog
                    >
                        Selesai
                    </button>
                </div>
            )}
        </div>
    );
};

export default Checkout;
