// payment_method/virtual-account.tsx
import { Copy } from 'lucide-react';
import React from 'react';
// Import VirtualAccountProps dari index.d.ts (sesuaikan path)
import { VirtualAccountProps } from '@/types';

// Data bank logo options (Bisa dipindahkan ke data/constants jika mau)
const BANK_OPTIONS = [
    { id: 'bca', label: 'BCA', logo: '/img_asset/logo-bca.png' },
    { id: 'bri', label: 'BANK BRI', logo: '/img_asset/logo-bri.png' },
    { id: 'mandiri', label: 'mandiri', logo: '/img_asset/logo-mandiri.png' },
];

const VirtualAccountMethod: React.FC<VirtualAccountProps> = ({
    formattedTotalAmount,
    totalAmount,
    handleCopy,
    handleGoBackToCheckout,
    handleFinalizePayment,
    selectedBank,
    setSelectedBank,
    showVADetails,
    setShowVADetails,
    vaData,
}) => {
    const activeVA = selectedBank ? vaData[selectedBank] : null;

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
                    {BANK_OPTIONS.map((bank) => {
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
                                        e.currentTarget.parentElement!.classList.add('font-bold', 'text-[#2e305c]', 'text-xs', 'text-center');
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
                                <button onClick={() => handleCopy(totalAmount.toString())} className="text-slate-400 hover:text-[#2e305c]">
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Baris 4: Expires (Hardcoded di kode lama) */}
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
                            selectedBank ? 'bg-[#2e305c] shadow-[#2e305c]/20 hover:bg-[#23244a]' : 'cursor-not-allowed bg-slate-300 shadow-none'
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
};

export default VirtualAccountMethod;
