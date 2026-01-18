import type { Product } from '@/types';
import { Copy } from 'lucide-react';
import React from 'react';

// Data Dummy Sesuai File Asli
const VA_DATA: Record<string, { name: string; vaNumber: string }> = {
    bca: { name: 'Bank Central Asia', vaNumber: '7001280255100' },
    bri: { name: 'Bank Rakyat Indonesia', vaNumber: '8888010009876' },
    mandiri: { name: 'Bank Mandiri', vaNumber: '9001234567890' },
};

const WALLET_OPTIONS = [
    { id: 'dana', label: 'DANA', logo: '/img_asset/logo-dana.png' },
    { id: 'ovo', label: 'OVO', logo: '/img_asset/logo-ovo.png' },
    { id: 'gopay', label: 'GoPay', logo: '/img_asset/logo-gopay.png' },
    { id: 'shopeepay', label: 'ShopeePay', logo: '/img_asset/logo-shopeepay.png' },
];

interface PaymentDetailsProps {
    method: string | null;
    totalAmount: number;
    product: Product;
    isProcessing: boolean;
    // Props State
    selectedBank: string | null;
    setSelectedBank: (val: string | null) => void;
    showVADetails: boolean;
    setShowVADetails: (val: boolean) => void;
    selectedWallet: string | null;
    setSelectedWallet: (val: string | null) => void;
    showQRIS: boolean;
    setShowQRIS: (val: boolean) => void;
    // Actions
    onConfirm: () => void;
    onBack: () => void;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({
    method,
    totalAmount,
    product,
    isProcessing,
    selectedBank,
    setSelectedBank,
    showVADetails,
    setShowVADetails,
    selectedWallet,
    setSelectedWallet,
    showQRIS,
    setShowQRIS,
    onConfirm,
    onBack,
}) => {
    const formattedTotalAmount = totalAmount.toLocaleString('id-ID');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Disalin ke clipboard: ' + text);
    };

    if (isProcessing) {
        return (
            <div className="py-10 text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-lg font-semibold text-gray-700">Memproses pembayaran Anda...</p>
                <p className="text-sm text-gray-500">Mohon tunggu sebentar.</p>
            </div>
        );
    }

    switch (method) {
        case 'bank_transfer':
            return (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <div className="mb-8">
                        <h3 className="mb-1 text-sm font-bold text-[#2e305c]">Payment Details</h3>
                        <p className="text-sm font-medium text-slate-500">
                            Total Amount : <span className="font-bold text-[#2e305c]">Rp. {formattedTotalAmount}</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="mb-6 text-center text-base font-bold text-[#2e305c]">Bank Transfer Details</h4>
                        <div className="w-full max-w-lg rounded-xl border border-slate-200 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] sm:p-8">
                            <div className="mb-5 flex items-center justify-between border-b border-dashed border-slate-100 pb-4 last:border-0 last:pb-0 sm:border-0 sm:pb-0">
                                <span className="font-bold text-[#2e305c]">Bank :</span>
                                <span className="font-medium text-slate-600">Bank Central Asia</span>
                            </div>
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
                            <div className="mb-5 flex items-center justify-between border-b border-dashed border-slate-100 pb-4 last:border-0 last:pb-0 sm:border-0 sm:pb-0">
                                <span className="font-bold text-[#2e305c]">Account Name :</span>
                                <span className="font-medium text-slate-600">Lean Coffee</span>
                            </div>
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
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <button
                            onClick={onBack}
                            className="w-full rounded-xl border border-[#2e305c] py-3 text-sm font-bold text-[#2e305c] transition-colors hover:bg-slate-50"
                        >
                            Back To Checkout
                        </button>
                        <button
                            onClick={onConfirm}
                            className="w-full rounded-xl bg-[#2e305c] py-3 text-sm font-bold text-white shadow-lg shadow-[#2e305c]/20 transition-all hover:bg-[#23244a]"
                        >
                            Confirm Payment
                        </button>
                    </div>
                </div>
            );

        case 'virtual_account':
            // eslint-disable-next-line no-case-declarations
            const activeVA = selectedBank ? VA_DATA[selectedBank] : null;
            return (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <div className="mb-8">
                        <h3 className="mb-1 text-sm font-bold text-[#2e305c]">Payment Details</h3>
                        <p className="text-sm font-medium text-slate-500">
                            Total Amount : <span className="font-bold text-[#2e305c]">Rp. {formattedTotalAmount}</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="mb-2 text-center text-base font-bold text-[#2e305c]">Virtual Account Payment</h4>
                        <p className="mb-6 text-center text-sm text-slate-500">
                            Choose your preferred bank to generate a Virtual <br className="hidden sm:block" /> Account number:
                        </p>
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
                                            setShowVADetails(false);
                                        }}
                                        className={`group flex h-24 w-24 cursor-pointer items-center justify-center rounded-2xl border-2 bg-white transition-all duration-200 ${isSelected ? 'border-[#2e305c] shadow-md ring-1 ring-[#2e305c]' : 'border-slate-200 hover:border-[#2e305c]/50 hover:shadow-sm'}`}
                                    >
                                        <img
                                            src={bank.logo}
                                            alt={bank.label}
                                            className="h-8 w-auto object-contain px-2"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerText = bank.label;
                                                e.currentTarget.parentElement!.classList.add('font-bold', 'text-[#2e305c]', 'text-xs', 'text-center');
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        {showVADetails && activeVA && (
                            <div className="mt-8 w-full max-w-md rounded-2xl border border-[#2e305c] p-5 text-sm duration-300 animate-in fade-in slide-in-from-top-4 md:p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="font-bold text-[#2e305c]">Bank :</span>
                                    <span className="font-medium text-slate-600">{activeVA.name}</span>
                                </div>
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="font-bold text-[#2e305c]">Virtual Account Number :</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-medium text-slate-600">{activeVA.vaNumber}</span>
                                        <button onClick={() => handleCopy(activeVA.vaNumber)} className="text-slate-400 hover:text-[#2e305c]">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="font-bold text-[#2e305c]">Amount :</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-600">Rp . {formattedTotalAmount}</span>
                                        <button onClick={() => handleCopy(totalAmount.toString())} className="text-slate-400 hover:text-[#2e305c]">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
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
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <button
                            onClick={onBack}
                            className="w-full rounded-xl border border-[#2e305c] py-3 text-sm font-bold text-[#2e305c] transition-colors hover:bg-slate-50"
                        >
                            Back To Checkout
                        </button>
                        {!showVADetails ? (
                            <button
                                disabled={!selectedBank}
                                onClick={() => {
                                    if (selectedBank) setShowVADetails(true);
                                }}
                                className={`w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all ${selectedBank ? 'bg-[#2e305c] shadow-[#2e305c]/20 hover:bg-[#23244a]' : 'cursor-not-allowed bg-slate-300 shadow-none'}`}
                            >
                                Confirm Payment
                            </button>
                        ) : (
                            <button
                                onClick={onConfirm}
                                className="w-full rounded-xl bg-[#2e305c] py-3 text-sm font-bold text-white shadow-lg shadow-[#2e305c]/20 transition-all hover:bg-[#23244a]"
                            >
                                Confrim Payment
                            </button>
                        )}
                    </div>
                </div>
            );

        case 'e_wallet':
            // eslint-disable-next-line no-case-declarations
            const activeWallet = selectedWallet ? WALLET_OPTIONS.find((w) => w.id === selectedWallet) : null;
            if (showQRIS && activeWallet) {
                return (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm duration-300 animate-in fade-in zoom-in-95 md:p-8">
                        <div className="mb-4">
                            <h3 className="mb-1 text-sm font-bold text-[#2e305c]">Payment Details</h3>
                            <p className="text-sm font-medium text-slate-500">
                                Total Amount : <span className="font-bold text-[#2e305c]">Rp. {formattedTotalAmount}</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="mb-6 text-center text-sm font-bold tracking-wide text-[#2e305c] uppercase">QRIS {activeWallet.label}</h4>
                            <div className="relative mb-6 flex items-center justify-center rounded-xl border bg-white p-4 shadow-sm">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Bayar${activeWallet.label}-${totalAmount}`}
                                    alt="QR Code"
                                    className="h-48 w-48 object-contain opacity-90 sm:h-56 sm:w-56"
                                />
                                <div className="absolute rounded-full border border-slate-100 bg-white p-1.5 shadow-md">
                                    <img src={activeWallet.logo} alt={activeWallet.label} className="h-8 w-8 object-contain" />
                                </div>
                            </div>
                            <p className="mb-8 max-w-[250px] text-center text-xs leading-relaxed text-slate-400">
                                Scan this QR code with any QRIS-compatible app to pay Rp. {formattedTotalAmount}
                            </p>
                            <div className="flex w-full flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={() => setShowQRIS(false)}
                                    className="w-full rounded-xl border border-[#2e305c] py-3 text-sm font-bold text-[#2e305c] transition-colors hover:bg-slate-50"
                                >
                                    Change Method
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="w-full rounded-xl bg-[#2e305c] py-3 text-sm font-bold text-white shadow-lg shadow-[#2e305c]/20 transition-all hover:bg-[#23244a]"
                                >
                                    Confirm Payment
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }
            return (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <div className="mb-8">
                        <h3 className="mb-1 text-sm font-bold text-[#2e305c]">Payment Details</h3>
                        <p className="text-sm font-medium text-slate-500">
                            Total Amount : <span className="font-bold text-[#2e305c]">Rp. {formattedTotalAmount}</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="mb-6 text-center text-base font-bold text-[#2e305c]">E - Wallet Payment</h4>
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            {WALLET_OPTIONS.map((wallet) => {
                                const isSelected = selectedWallet === wallet.id;
                                return (
                                    <div
                                        key={wallet.id}
                                        onClick={() => {
                                            setSelectedWallet(wallet.id);
                                            setShowQRIS(false);
                                        }}
                                        className={`group flex h-24 w-32 cursor-pointer items-center justify-center rounded-2xl border-2 bg-white transition-all duration-200 sm:w-40 ${isSelected ? 'border-[#2e305c] shadow-md ring-1 ring-[#2e305c]' : 'border-slate-200 hover:border-[#2e305c]/50 hover:shadow-sm'}`}
                                    >
                                        <img
                                            src={wallet.logo}
                                            alt={wallet.label}
                                            className="h-8 w-auto max-w-[80px] object-contain px-2"
                                            onError={(e) => {
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
                    <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <button
                            onClick={onBack}
                            className="w-full rounded-xl border border-[#2e305c] py-3 text-sm font-bold text-[#2e305c] transition-colors hover:bg-slate-50"
                        >
                            Back To Checkout
                        </button>
                        <button
                            disabled={!selectedWallet}
                            onClick={() => setShowQRIS(true)}
                            className={`w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all ${selectedWallet ? 'bg-[#2e305c] shadow-[#2e305c]/20 hover:bg-[#23244a]' : 'cursor-not-allowed bg-slate-300 shadow-none'}`}
                        >
                            Confirm Payment
                        </button>
                    </div>
                </div>
            );

        case 'qr_code':
            return (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <div className="mb-8">
                        <h3 className="mb-1 text-sm font-bold text-[#2e305c]">Payment Details</h3>
                        <p className="text-sm font-medium text-slate-500">
                            Total Amount : <span className="font-bold text-[#2e305c]">Rp. {formattedTotalAmount}</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="mb-6 text-center text-base font-bold text-[#2e305c]">QRIS Payment</h4>
                        <div className="relative mb-6 flex items-center justify-center rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PAY-QRIS-${product.id}-${totalAmount}`}
                                alt="QRIS Code"
                                className="h-48 w-48 object-contain opacity-90 sm:h-60 sm:w-60"
                            />
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
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <button
                            onClick={onBack}
                            className="w-full rounded-xl border border-[#2e305c] py-3 text-sm font-bold text-[#2e305c] transition-colors hover:bg-slate-50"
                        >
                            Back To Checkout
                        </button>
                        <button
                            onClick={onConfirm}
                            className="w-full rounded-xl bg-[#2e305c] py-3 text-sm font-bold text-white shadow-lg shadow-[#2e305c]/20 transition-all hover:bg-[#23244a]"
                        >
                            Confirm Payment
                        </button>
                    </div>
                </div>
            );
        default:
            return <p className="text-gray-500">Pilih metode pembayaran untuk melihat detail.</p>;
    }
};
