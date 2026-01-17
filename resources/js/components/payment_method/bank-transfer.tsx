import { BasePaymentProps } from '@/types';
import { Copy } from 'lucide-react';
import React from 'react';

const BankTransferMethod: React.FC<BasePaymentProps> = ({
    formattedTotalAmount,
    totalAmount,
    isProcessingPayment,
    handleCopy,
    handleGoBackToCheckout,
    handleFinalizePayment,
}) => {
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
                    onClick={handleFinalizePayment}
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
};

export default BankTransferMethod;
