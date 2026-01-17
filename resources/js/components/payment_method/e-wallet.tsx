// payment_method/e-wallet.tsx
import React from 'react';
// Import EWalletProps dari index.d.ts (sesuaikan path)
import { EWalletProps } from '@/types';

// Data Wallet Options
const walletOptions = [
    { id: 'dana', label: 'DANA', logo: '/img_asset/logo-dana.png' },
    { id: 'ovo', label: 'OVO', logo: '/img_asset/logo-ovo.png' },
    { id: 'gopay', label: 'GoPay', logo: '/img_asset/logo-gopay.png' },
    { id: 'shopeepay', label: 'ShopeePay', logo: '/img_asset/logo-shopeepay.png' },
];

const EWalletMethod: React.FC<EWalletProps> = ({
    formattedTotalAmount,
    totalAmount,
    isProcessingPayment,
    handleGoBackToCheckout,
    handleFinalizePayment,
    selectedWallet,
    setSelectedWallet,
    showQRIS,
    setShowQRIS,
}) => {
    const activeWallet = selectedWallet ? walletOptions.find((w) => w.id === selectedWallet) : null;

    // TAMPILAN 1: QRIS SCANNER (Jika sudah memilih wallet dan klik confirm)
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
                    <h4 className="mb-6 text-center text-sm font-bold tracking-wide text-[#2e305c] uppercase">QRIS {activeWallet.label}</h4>

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
                                    className="h-8 w-auto max-w-20 object-contain px-2"
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
};

export default EWalletMethod;
