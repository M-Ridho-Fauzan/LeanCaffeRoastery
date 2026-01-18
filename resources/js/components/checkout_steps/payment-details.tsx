import PaymentMethodRenderer from '@/components/payment_method';
import { BasePaymentProps, CartItem, EWalletProps, Product, VirtualAccountProps } from '@/types';
import React from 'react';

const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer' },
    { id: 'virtual_account', name: 'Virtual Account' },
    { id: 'e_wallet', name: 'E-Wallet' },
    { id: 'qr_code', name: 'QRIS' },
];

interface CheckoutStepPaymentDetailsProps {
    // Order Summary
    productNameForDisplay: string;
    isCartCheckout: boolean | undefined;
    cartItems?: CartItem[];
    quantity: number;
    product: Product;
    SHIPPING_COST: number;

    // Derived Amounts
    formattedSubtotalPrice: string;
    formattedTotalAmount: string;

    // Payment Data & Handlers
    selectedPaymentMethod: string | null;

    // Props bundles for renderer (using Omit defined from index.d.ts)
    baseProps: BasePaymentProps;
    vaProps: Omit<VirtualAccountProps, keyof BasePaymentProps>;
    eWalletProps: Omit<EWalletProps, keyof BasePaymentProps>;
}

const CheckoutStepPaymentDetails: React.FC<CheckoutStepPaymentDetailsProps> = ({
    productNameForDisplay,
    isCartCheckout,
    cartItems,
    quantity,
    product,
    SHIPPING_COST,
    formattedSubtotalPrice,
    formattedTotalAmount,
    selectedPaymentMethod,
    baseProps,
    vaProps,
    eWalletProps,
}) => {
    return (
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
                {selectedPaymentMethod && (
                    <PaymentMethodRenderer
                        selectedPaymentMethod={selectedPaymentMethod}
                        baseProps={baseProps}
                        vaProps={vaProps}
                        eWalletProps={eWalletProps}
                    />
                )}
            </div>
        </div>
    );
};

export default CheckoutStepPaymentDetails;
