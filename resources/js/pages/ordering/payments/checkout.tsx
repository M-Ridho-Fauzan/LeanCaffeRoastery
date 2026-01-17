// resources/js/pages/ordering/payments/checkout.tsx
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Product } from '@/types';
import {
    ArrowLeft,
    Banknote,
    CheckCircle,
    CheckCircle2,
    Copy, // Tambahan Import Icon Copy
    CreditCard,
    Landmark,
    MapPin,
    Package,
    QrCode,
    ShoppingCart,
    Truck,
    Wallet,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface CartItem {
    name: string;
    price: number;
    qty: number;
    primary_image_url?: string | null;
}

// --------------------------------------------------------------------

interface CheckoutProps {
    product: Product;
    cartItems?: CartItem[];
    onClose: () => void;
}

// Data Dummy VA untuk setiap Bank (Tambahan)
const VA_DATA: Record<string, { name: string; vaNumber: string }> = {
    bca: { name: 'Bank Central Asia', vaNumber: '7001280255100' },
    bri: { name: 'Bank Rakyat Indonesia', vaNumber: '8888010009876' },
    mandiri: { name: 'Bank Mandiri', vaNumber: '9001234567890' },
};

const SHIPPING_COST = 15000;

interface PaymentOptionProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    isSelected: boolean;
    onSelect: () => void;
    disabled?: boolean;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({ icon, title, description, isSelected, onSelect, disabled }) => (
    <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-center space-x-3 rounded-lg border p-3 text-left transition-colors duration-200 ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300 hover:border-gray-400'} ${disabled ? 'cursor-not-allowed opacity-60' : ''} focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none`}
        disabled={disabled}
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

const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer', description: 'Transfer Ke Rekening Bank Kami', icon: <Banknote className="h-5 w-5" /> },
    { id: 'virtual_account', name: 'Virtual Account', description: 'BCA, BRI, Mandiri Virtual Account', icon: <Landmark className="h-5 w-5" /> },
    { id: 'e_wallet', name: 'E-Wallet', description: 'DANA, OVO, GoPay, ShopeePay', icon: <Wallet className="h-5 w-5" /> },
    { id: 'qr_code', name: 'QRIS', description: 'Scan QR Code Untuk Membayar', icon: <QrCode className="h-5 w-5" /> },
];

const Checkout: React.FC<CheckoutProps> = ({ product, cartItems, onClose }) => {
    const [currentStep, setCurrentStep] = useState<'checkout' | 'paymentDetails' | 'paymentSuccess' | 'trackOrder'>('checkout');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(paymentMethods[0].id);

    const isCartCheckout = useMemo(() => cartItems && cartItems.length > 0, [cartItems]);
    const initialQuantity = isCartCheckout ? 1 : 1;

    const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

    // Tambahkan baris ini di dalam component Checkout
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    // State untuk mengatur kapan QRIS muncul (false = pilih wallet, true = muncul QR)
    const [showQRIS, setShowQRIS] = useState(false);

    // State untuk Virtual Account
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [showVADetails, setShowVADetails] = useState(false); // State baru untuk menampilkan detail VA

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

    // Helper Copy Text
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Disalin ke clipboard: ' + text);
    };

    const handleProceedToPayment = () => {
        if (!fullName || !email || !phoneNumber || !city || !postalCode || !address) {
            alert('Harap lengkapi semua informasi pengiriman.');
            return;
        }
        if (!selectedPaymentMethod) {
            alert('Mohon pilih metode pembayaran terlebih dahulu.');
            return;
        }
        if (!isCartCheckout && quantity < 1) {
            alert('Jumlah produk harus minimal 1.');
            return;
        }
        setCurrentStep('paymentDetails');
    };

    const handleGoBackToCheckout = () => {
        setCurrentStep('checkout');
        setShowVADetails(false); // Reset VA details saat kembali
    };

    const handleFinalizePayment = () => {
        setIsProcessingPayment(true);
        console.log(`Memproses pembayaran ${selectedPaymentMethod} untuk ${quantity}x "${product.product_name}" total Rp ${formattedTotalAmount}...`);

        setTimeout(() => {
            console.log('Pembayaran berhasil dikonfirmasi!');
            setIsProcessingPayment(false);
            setCurrentStep('paymentSuccess');
        }, 2500);
    };

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
                return (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                        {/* --- Header Section --- */}
                        <div className="mb-8">
                            <h3 className="mb-1 text-sm font-bold text-[#2e305c]">Payment Details</h3>
                            <p className="text-sm font-medium text-slate-500">
                                Total Amount : <span className="font-bold text-[#2e305c]">Rp. {formattedTotalAmount}</span>
                            </p>
                        </div>

                        {/* --- Transfer Details Area --- */}
                        <div className="flex flex-col items-center">
                            <h4 className="mb-6 text-center text-base font-bold text-[#2e305c]">Bank Transfer Details</h4>

                            {/* Kartu Detail Transfer */}
                            <div className="w-full max-w-lg rounded-xl border border-slate-200 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] sm:p-8">
                                {/* Baris 1: Bank */}
                                <div className="mb-5 flex items-center justify-between border-b border-dashed border-slate-100 pb-4 last:border-0 last:pb-0 sm:border-0 sm:pb-0">
                                    <span className="font-bold text-[#2e305c]">Bank :</span>
                                    <span className="font-medium text-slate-600">Bank Central Asia</span>
                                </div>

                                {/* Baris 2: Account Number */}
                                <div className="mb-5 flex items-center justify-between border-b border-dashed border-slate-100 pb-4 last:border-0 last:pb-0 sm:border-0 sm:pb-0">
                                    <span className="font-bold text-[#2e305c]">Account Number :</span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-base font-medium text-slate-600">12345678910</span>
                                        <button
                                            onClick={() => handleCopy('12345678910')}
                                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#2e305c]"
                                            title="Salin No. Rek"
                                        >
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Baris 3: Account Name */}
                                <div className="mb-5 flex items-center justify-between border-b border-dashed border-slate-100 pb-4 last:border-0 last:pb-0 sm:border-0 sm:pb-0">
                                    <span className="font-bold text-[#2e305c]">Account Name :</span>
                                    <span className="font-medium text-slate-600">Lean Coffee</span>
                                </div>

                                {/* Baris 4: Amount */}
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-[#2e305c]">Amount :</span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-slate-600">Rp . {formattedTotalAmount}</span>
                                        <button
                                            onClick={() => handleCopy(totalAmount.toString())}
                                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#2e305c]"
                                            title="Salin Jumlah"
                                        >
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
                                Please transfer the exact amount and upload your payment proof below.
                            </p>
                        </div>

                        {/* --- Action Buttons --- */}
                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <button
                                onClick={handleGoBackToCheckout}
                                className="w-full rounded-xl border border-[#2e305c] py-3 text-sm font-bold text-[#2e305c] transition-colors hover:bg-slate-50"
                            >
                                Back To Checkout
                            </button>

                            <button
                                onClick={handleFinalizePayment} // Lanjut ke proses selanjutnya
                                disabled={isProcessingPayment}
                                className={`w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg shadow-[#2e305c]/20 transition-all ${
                                    isProcessingPayment ? 'cursor-not-allowed bg-slate-300' : 'bg-[#2e305c] hover:bg-[#23244a]'
                                } `}
                            >
                                {isProcessingPayment ? 'Processing...' : 'Confirm Payment'}
                            </button>
                        </div>
                    </div>
                );
            // --- PERUBAHAN UTAMA DI SINI ---
            case 'virtual_account':
                // eslint-disable-next-line no-case-declarations
                const activeVA = selectedBank ? VA_DATA[selectedBank] : null;

                return (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                        {/* --- Header Section --- */}
                        <div className="mb-8">
                            <h3 className="mb-1 text-sm font-bold text-[#2e305c]">Payment Details</h3>
                            <p className="text-sm font-medium text-slate-500">
                                Total Amount : <span className="font-bold text-[#2e305c]">Rp. {formattedTotalAmount}</span>
                            </p>
                        </div>

                        {/* --- Bank Selection Area --- */}
                        <div className="flex flex-col items-center">
                            <h4 className="mb-2 text-center text-base font-bold text-[#2e305c]">Virtual Account Payment</h4>
                            <p className="mb-6 text-center text-sm text-slate-500">
                                Choose your preferred bank to generate a Virtual <br className="hidden sm:block" /> Account number:
                            </p>

                            {/* Pilihan Bank */}
                            <div className="flex flex-wrap justify-center gap-4">
                                {[
                                    { id: 'bca', label: 'BCA', logo: '/img_asset/logo-bca.png' },
                                    { id: 'bri', label: 'BANK BRI', logo: '/img_asset/logo-bri.png' },
                                    { id: 'mandiri', label: 'mandiri', logo: '/img_asset/logo-mandiri.png' },
                                ].map((bank) => {
                                    const isSelected = selectedBank === bank.id;
                                    return (
                                        <div
                                            key={bank.id}
                                            onClick={() => {
                                                setSelectedBank(bank.id);
                                                setShowVADetails(false); // Reset detail jika ganti bank
                                            }}
                                            className={`group flex h-24 w-24 cursor-pointer items-center justify-center rounded-2xl border-2 bg-white transition-all duration-200 ${
                                                isSelected
                                                    ? 'border-[#2e305c] shadow-md ring-1 ring-[#2e305c]'
                                                    : 'border-slate-200 hover:border-[#2e305c]/50 hover:shadow-sm'
                                            } `}
                                        >
                                            <img
                                                src={bank.logo}
                                                alt={bank.label}
                                                className="h-8 w-auto object-contain px-2"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement!.innerText = bank.label;
                                                    e.currentTarget.parentElement!.classList.add(
                                                        'font-bold',
                                                        'text-[#2e305c]',
                                                        'text-xs',
                                                        'text-center',
                                                    );
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* --- KOTAK DETAIL VA (Muncul hanya jika showVADetails === true) --- */}
                            {showVADetails && activeVA && (
                                <div className="mt-8 w-full max-w-md rounded-2xl border border-[#2e305c] p-5 text-sm duration-300 animate-in fade-in slide-in-from-top-4 md:p-6">
                                    {/* Baris 1: Bank Name */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="font-bold text-[#2e305c]">Bank :</span>
                                        <span className="font-medium text-slate-600">{activeVA.name}</span>
                                    </div>

                                    {/* Baris 2: VA Number */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="font-bold text-[#2e305c]">Virtual Account Number :</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-medium text-slate-600">{activeVA.vaNumber}</span>
                                            <button onClick={() => handleCopy(activeVA.vaNumber)} className="text-slate-400 hover:text-[#2e305c]">
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Baris 3: Amount */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="font-bold text-[#2e305c]">Amount :</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-600">Rp . {formattedTotalAmount}</span>
                                            <button
                                                onClick={() => handleCopy(totalAmount.toString())}
                                                className="text-slate-400 hover:text-[#2e305c]"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Baris 4: Expires */}
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[#2e305c]">Expires :</span>
                                        <span className="font-medium text-slate-400">8/15/2025, 1:14:35 AM</span>
                                    </div>
                                </div>
                            )}

                            <p className="mt-6 text-center text-xs leading-relaxed text-[#2e305c]">
                                Transfer the exact amount to the Virtual Account number above.
                                <br className="hidden sm:block" />
                                Payment will be automatically verified.
                            </p>
                        </div>

                        {/* --- Action Buttons --- */}
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <button
                                onClick={handleGoBackToCheckout}
                                className="w-full rounded-xl border border-[#2e305c] py-3 text-sm font-bold text-[#2e305c] transition-colors hover:bg-slate-50"
                            >
                                Back To Checkout
                            </button>

                            {/* Logic Tombol Confirm / Paid */}
                            {!showVADetails ? (
                                <button
                                    disabled={!selectedBank}
                                    onClick={() => {
                                        if (selectedBank) {
                                            setShowVADetails(true); // Tampilkan detail VA
                                        }
                                    }}
                                    className={`w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all ${
                                        selectedBank
                                            ? 'bg-[#2e305c] shadow-[#2e305c]/20 hover:bg-[#23244a]'
                                            : 'cursor-not-allowed bg-slate-300 shadow-none'
                                    } `}
                                >
                                    Confirm Payment
                                </button>
                            ) : (
                                <button
                                    onClick={handleFinalizePayment} // Lanjut ke Tracking/Success
                                    className="w-full rounded-xl bg-[#2e305c] py-3 text-sm font-bold text-white shadow-lg shadow-[#2e305c]/20 transition-all hover:bg-[#23244a]"
                                >
                                    Confrim Payment
                                </button>
                            )}
                        </div>
                    </div>
                );
            // --------------------------------

            case 'e_wallet':
                // 1. Definisi Data Wallet (Logo & Label)
                // eslint-disable-next-line no-case-declarations
                const walletOptions = [
                    {
                        id: 'dana',
                        label: 'DANA',
                        logo: '/img_asset/logo-dana.png',
                    },
                    {
                        id: 'ovo',
                        label: 'OVO',
                        logo: '/img_asset/logo-ovo.png',
                    },
                    {
                        id: 'gopay',
                        label: 'GoPay',
                        logo: '/img_asset/logo-gopay.png',
                    },
                    {
                        id: 'shopeepay',
                        label: 'ShopeePay',
                        logo: '/img_asset/logo-shopeepay.png',
                    },
                ];

                // Cari data wallet yang sedang aktif
                // eslint-disable-next-line no-case-declarations
                const activeWallet = selectedWallet ? walletOptions.find((w) => w.id === selectedWallet) : null;

                // --- LOGIKA TAMPILAN: QRIS VS PILIHAN ---

                // TAMPILAN 1: QRIS SCANNER (Muncul jika showQRIS = true)
                if (showQRIS && activeWallet) {
                    return (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm duration-300 animate-in fade-in zoom-in-95 md:p-8">
                            {/* Header */}
                            <div className="mb-4">
                                <h3 className="mb-1 text-sm font-bold text-[#2e305c]">Payment Details</h3>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Amount : <span className="font-bold text-[#2e305c]">Rp. {formattedTotalAmount}</span>
                                </p>
                            </div>

                            <div className="flex flex-col items-center">
                                {/* Judul Dinamis */}
                                <h4 className="mb-6 text-center text-sm font-bold tracking-wide text-[#2e305c] uppercase">
                                    QRIS {activeWallet.label}
                                </h4>

                                {/* KOTAK QR CODE */}
                                <div className="relative mb-6 flex items-center justify-center rounded-xl border bg-white p-4 shadow-sm">
                                    {/* QR Code Image (Dummy generated via API) */}
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Bayar${activeWallet.label}-${totalAmount}`}
                                        alt="QR Code"
                                        className="h-48 w-48 object-contain opacity-90 sm:h-56 sm:w-56"
                                    />

                                    {/* Logo Wallet di Tengah QR Code (Overlay) */}
                                    <div className="absolute rounded-full border border-slate-100 bg-white p-1.5 shadow-md">
                                        <img src={activeWallet.logo} alt={activeWallet.label} className="h-8 w-8 object-contain" />
                                    </div>
                                </div>

                                <p className="mb-8 max-w-[250px] text-center text-xs leading-relaxed text-slate-400">
                                    Scan this QR code with any QRIS-compatible app to pay Rp. {formattedTotalAmount}
                                </p>

                                {/* Tombol Aksi QRIS */}
                                <div className="flex w-full flex-col gap-3 sm:flex-row">
                                    <button
                                        onClick={() => setShowQRIS(false)} // Tombol Back: Kembali ke pemilihan wallet
                                        className="w-full rounded-xl border border-[#2e305c] py-3 text-sm font-bold text-[#2e305c] transition-colors hover:bg-slate-50"
                                    >
                                        Change Method
                                    </button>
                                    <button
                                        onClick={handleFinalizePayment} // Tombol Sukses: Trigger fungsi bayar
                                        className="w-full rounded-xl bg-[#2e305c] py-3 text-sm font-bold text-white shadow-lg shadow-[#2e305c]/20 transition-all hover:bg-[#23244a]"
                                    >
                                        Confirm Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }

                // TAMPILAN 2: PILIHAN WALLET (Default)
                return (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h3 className="mb-1 text-sm font-bold text-[#2e305c]">Payment Details</h3>
                            <p className="text-sm font-medium text-slate-500">
                                Total Amount : <span className="font-bold text-[#2e305c]">Rp. {formattedTotalAmount}</span>
                            </p>
                        </div>

                        {/* Area Pilihan E-Wallet */}
                        <div className="flex flex-col items-center">
                            <h4 className="mb-6 text-center text-base font-bold text-[#2e305c]">E - Wallet Payment</h4>

                            {/* Grid Pilihan Wallet (2 Kolom) */}
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                {walletOptions.map((wallet) => {
                                    const isSelected = selectedWallet === wallet.id;
                                    return (
                                        <div
                                            key={wallet.id}
                                            onClick={() => {
                                                setSelectedWallet(wallet.id);
                                                setShowQRIS(false); // Pastikan QR tertutup saat ganti wallet
                                            }}
                                            className={`group flex h-24 w-32 cursor-pointer items-center justify-center rounded-2xl border-2 bg-white transition-all duration-200 sm:w-40 ${
                                                isSelected
                                                    ? 'border-[#2e305c] shadow-md ring-1 ring-[#2e305c]'
                                                    : 'border-slate-200 hover:border-[#2e305c]/50 hover:shadow-sm'
                                            } `}
                                        >
                                            <img
                                                src={wallet.logo}
                                                alt={wallet.label}
                                                className="h-8 w-auto max-w-[80px] object-contain px-2"
                                                onError={(e) => {
                                                    // Fallback jika gambar rusak
                                                    e.currentTarget.style.display = 'none';
                                                    if (e.currentTarget.parentElement) {
                                                        e.currentTarget.parentElement.innerText = wallet.label;
                                                        e.currentTarget.parentElement.classList.add('font-bold', 'text-[#2e305c]', 'text-sm');
                                                    }
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tombol Aksi Pilihan */}
                        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <button
                                onClick={handleGoBackToCheckout}
                                className="w-full rounded-xl border border-[#2e305c] py-3 text-sm font-bold text-[#2e305c] transition-colors hover:bg-slate-50"
                            >
                                Back To Checkout
                            </button>

                            <button
                                disabled={!selectedWallet || isProcessingPayment}
                                onClick={() => setShowQRIS(true)} // KLIK INI -> Masuk ke Tampilan QRIS
                                className={`w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all ${
                                    selectedWallet && !isProcessingPayment
                                        ? 'bg-[#2e305c] shadow-[#2e305c]/20 hover:bg-[#23244a]'
                                        : 'cursor-not-allowed bg-slate-300 shadow-none'
                                } `}
                            >
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                );
            case 'qr_code':
                return (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                        {/* --- Header Section --- */}
                        <div className="mb-8">
                            <h3 className="mb-1 text-sm font-bold text-[#2e305c]">Payment Details</h3>
                            <p className="text-sm font-medium text-slate-500">
                                Total Amount : <span className="font-bold text-[#2e305c]">Rp. {formattedTotalAmount}</span>
                            </p>
                        </div>

                        {/* --- QRIS Display Area --- */}
                        <div className="flex flex-col items-center">
                            <h4 className="mb-6 text-center text-base font-bold text-[#2e305c]">QRIS Payment</h4>

                            {/* Kotak QR Code */}
                            <div className="relative mb-6 flex items-center justify-center rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                                {/* Generate QR Code */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PAY-QRIS-${product.id}-${totalAmount}`}
                                    alt="QRIS Code"
                                    className="h-48 w-48 object-contain opacity-90 sm:h-60 sm:w-60"
                                />

                                {/* Logo Overlay di Tengah (Logo QRIS) */}
                                <div className="absolute rounded-lg border border-slate-100 bg-white p-2 shadow-md">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png"
                                        alt="QRIS Logo"
                                        className="h-6 w-auto object-contain sm:h-8"
                                    />
                                </div>
                            </div>

                            <p className="mb-8 max-w-[280px] text-center text-xs leading-relaxed text-slate-400">
                                Scan this QR code with any QRIS-compatible app to pay Rp. {formattedTotalAmount}
                            </p>
                        </div>

                        {/* --- Action Buttons --- */}
                        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <button
                                onClick={handleGoBackToCheckout}
                                className="w-full rounded-xl border border-[#2e305c] py-3 text-sm font-bold text-[#2e305c] transition-colors hover:bg-slate-50"
                            >
                                Back To Checkout
                            </button>

                            <button
                                onClick={handleFinalizePayment}
                                disabled={isProcessingPayment}
                                className={`w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg shadow-[#2e305c]/20 transition-all ${
                                    isProcessingPayment ? 'cursor-not-allowed bg-slate-300' : 'bg-[#2e305c] hover:bg-[#23244a]'
                                }`}
                            >
                                {isProcessingPayment ? 'Processing...' : 'Confirm Payment'}
                            </button>
                        </div>
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
            {/* Header Dialog */}
            <DialogHeader className="relative border-b-0 px-6 py-6">
                <button
                    onClick={() => {
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

            {/* Konten Utama - Checkout */}
            {currentStep === 'checkout' && (
                <div className="m-0 max-h-[calc(90vh-170px)] flex-1 space-y-4 overflow-y-auto p-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                            <ShoppingCart className="mr-2 h-5 w-5 text-gray-600" />
                            Order Summary
                        </h3>

                        {isCartCheckout ? (
                            <div className="space-y-3">
                                {cartItems!.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                                <img
                                                    src={
                                                        item.primary_image_url
                                                            ? item.primary_image_url
                                                            : `https://placehold.co/600x600/2A2F5B/FFFFFF?text=${encodeURIComponent(truncateText(item.name, 10))}`
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
                                        <div className="text-right">
                                            <span className="font-semibold text-gray-800">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
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

            {currentStep === 'checkout' && (
                <div className="w-full border-t border-gray-200 bg-white p-6 shadow-md">
                    <button
                        type="button"
                        className="w-full rounded-md bg-indigo-700 px-6 py-3 text-lg font-medium text-white shadow-sm transition-colors duration-200 hover:bg-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-indigo-400"
                        onClick={handleProceedToPayment}
                        disabled={isProcessingPayment || !selectedPaymentMethod || (!isCartCheckout && quantity < 1)}
                    >
                        Continue To Payment - Rp {formattedTotalAmount}
                    </button>
                </div>
            )}

            {/* Langkah 2: Detail Pembayaran */}
            {currentStep === 'paymentDetails' && (
                <div className="max-h-[calc(100vh-180px)] flex-1 space-y-6 overflow-y-auto px-6 py-6">
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
                </div>
            )}

            {currentStep === 'paymentSuccess' && (
                <div className="flex-1 overflow-y-auto px-6 pt-2 pb-8">
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <div className="rounded-full bg-white">
                                <CheckCircle className="h-20 w-20 fill-green-500 text-green-500 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 w-full rounded-xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-blue-900">Order Details</h4>
                            <div className="mt-1 flex items-center">
                                <span className="mr-2 text-sm text-gray-400">Total Amount :</span>
                                <span className="font-bold text-blue-900">Rp . 135.000</span>
                            </div>
                        </div>

                        <div className="mb-4 text-center">
                            <span className="text-sm font-semibold text-blue-900">Bank Transfer Details</span>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4 text-sm">
                                <div>
                                    <p className="mb-1 text-xs text-gray-400">Order ID</p>
                                    <p className="font-semibold text-blue-900">ORD-1755264937855</p>
                                </div>
                                <div className="text-right">
                                    <p className="mb-1 text-xs text-gray-400">Tracking Number</p>
                                    <p className="font-semibold text-blue-900">TRK64937856</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-gray-400">Order Date</p>
                                    <p className="font-semibold text-blue-900">8/15/2025</p>
                                </div>
                                <div className="text-right">
                                    <p className="mb-1 text-xs text-gray-400">Estimated Delivery</p>
                                    <p className="font-semibold text-blue-900">8/17/2025</p>
                                </div>

                                <div className="col-span-2 mt-2">
                                    <p className="mb-1 text-xs text-gray-400">Item Ordered</p>
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-blue-900">The Sagara 1999 x 1</p>
                                        <p className="font-semibold text-blue-900">Rp . 120.000</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4 border-gray-200" />

                            <div className="flex items-center justify-between">
                                <span className="text-base font-bold text-blue-900">Total Paid</span>
                                <span className="text-base font-bold text-blue-900">Rp . 135.000</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-blue-900 bg-white px-4 py-3 text-sm font-semibold text-blue-900 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            Continue Shopping
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentStep('trackOrder')}
                            className="flex-1 rounded-lg bg-[#2e3192] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-900"
                        >
                            Track Order
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 'trackOrder' && (
                <div className="flex-1 overflow-y-auto px-6 pt-2 pb-8">
                    <div className="mb-8 w-full rounded-xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                        <h3 className="mb-6 text-xl font-bold text-[#1e1b4b]">Order #ORD-1755264937855</h3>

                        <div className="mb-8 grid grid-cols-2 gap-x-4 gap-y-6">
                            <div>
                                <p className="mb-1 text-sm text-gray-400">Order Date</p>
                                <p className="font-bold text-[#1e1b4b]">8/15/2025</p>
                            </div>
                            <div className="text-right sm:text-left">
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

                        <div className="mb-6">
                            <h4 className="mb-4 text-lg font-bold text-[#1e1b4b]">Order Progress</h4>

                            <div className="relative mb-8 h-3 w-full overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                                <div className="absolute top-0 left-0 h-full w-[35%] rounded-full bg-[#1e1b4b]"></div>
                            </div>

                            <div className="relative space-y-6">
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

                                <div className="flex gap-4 opacity-50">
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
