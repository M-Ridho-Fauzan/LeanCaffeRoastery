// payment_method/qr-code.tsx
import React from 'react';
// Import BasePaymentProps dari index.d.ts (sesuaikan path)
import { BasePaymentProps } from '@/types';

// NOTE: Komponen ini perlu akses ke product.id untuk QR code.
// Karena kita hanya passing BasePaymentProps, kita asumsikan product.id
// atau identifier unik sudah di-embed dalam totalAmount atau di-mock.
// Untuk saat ini, kita gunakan mock `product.id` (misal 101).

const QRData = {
    productId: 101, // Mocked product ID
};

const QRCodeMethod: React.FC<BasePaymentProps> = ({
    formattedTotalAmount,
    totalAmount,
    isProcessingPayment,
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

            {/* --- QRIS Display Area --- */}
            <div className="flex flex-col items-center">
                <h4 className="mb-6 text-center text-base font-bold text-[#2e305c]">QRIS Payment</h4>

                {/* Kotak QR Code */}
                <div className="relative mb-6 flex items-center justify-center rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    {/* Generate QR Code */}
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PAY-QRIS-${QRData.productId}-${totalAmount}`}
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
};

export default QRCodeMethod;
