// payment_method/index.tsx
import React from 'react';
// Import Components
import BankTransferMethod from './bank-transfer';
import EWalletMethod from './e-wallet';
import QRCodeMethod from './qr-code';
import VirtualAccountMethod from './virtual-account';

// Import Types (sesuaikan path)
import { PaymentRendererProps } from '@/types';

const Index: React.FC<PaymentRendererProps> = ({ selectedPaymentMethod, baseProps, vaProps, eWalletProps }) => {
    // Menghandle loading/processing state secara global
    if (baseProps.isProcessingPayment) {
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
            return <BankTransferMethod {...baseProps} />;

        case 'virtual_account':
            // Gabungkan BaseProps dengan VirtualAccountProps spesifik
            return <VirtualAccountMethod {...baseProps} {...vaProps} />;

        case 'e_wallet':
            // Gabungkan BaseProps dengan EWalletProps spesifik
            return <EWalletMethod {...baseProps} {...eWalletProps} />;

        case 'qr_code':
            return <QRCodeMethod {...baseProps} />;

        default:
            return <p className="py-10 text-center text-gray-500">Metode pembayaran tidak valid.</p>;
    }
};

export default Index;
