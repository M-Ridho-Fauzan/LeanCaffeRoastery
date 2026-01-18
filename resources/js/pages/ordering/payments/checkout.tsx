import CheckoutStepCheckout from '@/components/checkout_steps/checkout';
import CheckoutStepPaymentCompleted from '@/components/checkout_steps/payment-completed';
import CheckoutStepPaymentDetails from '@/components/checkout_steps/payment-details';
import CheckoutStepTrackOrder from '@/components/checkout_steps/track-order';

import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { CartItem, CheckoutStep, Product, VA_DATA_TYPE } from '@/types';
import { ArrowLeft } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

interface CheckoutProps {
    product: Product;
    cartItems?: CartItem[];
    onClose: () => void;
}

// Data Dummy VA (Local constant)
const VA_DATA: VA_DATA_TYPE = {
    bca: { name: 'Bank Central Asia', vaNumber: '7001280255100' },
    bri: { name: 'Bank Rakyat Indonesia', vaNumber: '8888010009876' },
    mandiri: { name: 'Bank Mandiri', vaNumber: '9001234567890' },
};

const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer' },
    { id: 'virtual_account', name: 'Virtual Account' },
    { id: 'e_wallet', name: 'E-Wallet' },
    { id: 'qr_code', name: 'QRIS' },
];

const SHIPPING_COST = 15000;

const Checkout: React.FC<CheckoutProps> = ({ product, cartItems, onClose }) => {
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('checkout');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(paymentMethods[0].id);

    const isCartCheckout = useMemo(() => cartItems && cartItems.length > 0, [cartItems]);
    const initialQuantity = isCartCheckout ? 1 : 1;

    const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

    // State for Payment Details (Passed to PaymentDetails and Renderer)
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    const [showQRIS, setShowQRIS] = useState(false);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [showVADetails, setShowVADetails] = useState(false);

    // State for Shipping/Order Info (Passed to CheckoutStepCheckout)
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(initialQuantity);
    const [city, setCity] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [orderNotes, setOrderNotes] = useState<string>('');

    // --- Calculations ---

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

    const productNameForDisplay = isCartCheckout ? 'Multiple Items' : product.product_name;

    // --- Handlers ---

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
        setShowVADetails(false);
        setShowQRIS(false);
    };

    const handleFinalizePayment = useCallback(() => {
        setIsProcessingPayment(true);
        console.log(
            `Memproses pembayaran ${selectedPaymentMethod} untuk ${quantity}x "${productNameForDisplay}" total Rp ${formattedTotalAmount}...`,
        );

        setTimeout(() => {
            console.log('Pembayaran berhasil dikonfirmasi!');
            setIsProcessingPayment(false);
            setCurrentStep('paymentSuccess');
        }, 2500);
    }, [selectedPaymentMethod, quantity, productNameForDisplay, formattedTotalAmount]);

    // --- Props Bundles for Payment Renderer (in Interfaces from index.d.ts) ---

    const baseProps = useMemo(
        () => ({
            formattedTotalAmount,
            totalAmount,
            isProcessingPayment,
            handleCopy,
            handleGoBackToCheckout,
            handleFinalizePayment,
        }),
        [handleFinalizePayment, formattedTotalAmount, totalAmount, isProcessingPayment],
    );

    const vaProps = useMemo(
        () => ({
            selectedBank,
            setSelectedBank,
            showVADetails,
            setShowVADetails,
            vaData: VA_DATA,
        }),
        [selectedBank, showVADetails],
    );

    const eWalletProps = useMemo(
        () => ({
            selectedWallet,
            setSelectedWallet,
            showQRIS,
            setShowQRIS,
        }),
        [selectedWallet, showQRIS],
    );

    // --- Dynamic Dialog Content ---

    const dialogTitle = useMemo(() => {
        if (currentStep === 'checkout') return 'Checkout';
        if (currentStep === 'paymentDetails') return 'Detail Pembayaran';
        if (currentStep === 'paymentSuccess') return 'Payment Successful';
        if (currentStep === 'trackOrder') return 'Track Your Order';
        return '';
    }, [currentStep]);

    const dialogDescription = useMemo(() => {
        if (currentStep === 'paymentSuccess') return 'Your order has been confirmed and is being processed.';
        if (currentStep === 'paymentDetails') return `Pembayaran untuk "${productNameForDisplay}"`;
        if (currentStep === 'checkout') return 'Lengkapi pesanan Anda.';
        return '';
    }, [currentStep, productNameForDisplay]);

    return (
        <div className="flex h-full flex-col p-0">
            <DialogHeader className="relative border-b-0 px-6 py-6">
                {currentStep !== 'checkout' && (
                    <button
                        onClick={() => {
                            if (currentStep === 'trackOrder') setCurrentStep('paymentSuccess');
                            else handleGoBackToCheckout();
                        }}
                        className="absolute top-6 left-6 z-10 rounded-full p-1 transition-colors duration-200 hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-6 w-6 text-[#1e1b4b]" />
                    </button>
                )}

                <DialogTitle
                    className={`text-center text-2xl font-bold ${
                        currentStep === 'paymentSuccess' ? 'text-green-500' : currentStep === 'trackOrder' ? 'text-[#1e1b4b]' : 'text-gray-900'
                    }`}
                >
                    {dialogTitle}
                </DialogTitle>

                {currentStep !== 'trackOrder' && (
                    <DialogDescription className="mt-2 text-center text-gray-500">{dialogDescription}</DialogDescription>
                )}
            </DialogHeader>

            {currentStep === 'checkout' && (
                <CheckoutStepCheckout
                    product={product}
                    cartItems={cartItems}
                    isCartCheckout={isCartCheckout}
                    SHIPPING_COST={SHIPPING_COST}
                    // State Getters
                    quantity={quantity}
                    fullName={fullName}
                    email={email}
                    phoneNumber={phoneNumber}
                    city={city}
                    postalCode={postalCode}
                    address={address}
                    orderNotes={orderNotes}
                    selectedPaymentMethod={selectedPaymentMethod}
                    isProcessingPayment={isProcessingPayment}
                    // State Setters
                    setQuantity={setQuantity}
                    setFullName={setFullName}
                    setEmail={setEmail}
                    setPhoneNumber={setPhoneNumber}
                    setCity={setCity}
                    setPostalCode={setPostalCode}
                    setAddress={setAddress}
                    setOrderNotes={setOrderNotes}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                    // Handlers & Derived Data
                    handleProceedToPayment={handleProceedToPayment}
                    formattedProductPrice={formattedProductPrice}
                    formattedSubtotalPrice={formattedSubtotalPrice}
                    formattedTotalAmount={formattedTotalAmount}
                />
            )}

            {currentStep === 'paymentDetails' && (
                <CheckoutStepPaymentDetails
                    // Order Summary
                    productNameForDisplay={productNameForDisplay}
                    isCartCheckout={isCartCheckout}
                    cartItems={cartItems}
                    quantity={quantity}
                    product={product}
                    SHIPPING_COST={SHIPPING_COST}
                    formattedSubtotalPrice={formattedSubtotalPrice}
                    formattedTotalAmount={formattedTotalAmount}
                    // Payment Props
                    selectedPaymentMethod={selectedPaymentMethod}
                    baseProps={baseProps}
                    vaProps={vaProps}
                    eWalletProps={eWalletProps}
                />
            )}

            {currentStep === 'paymentSuccess' && (
                <CheckoutStepPaymentCompleted onClose={onClose} setCurrentStep={setCurrentStep} formattedTotalAmount={formattedTotalAmount} />
            )}

            {currentStep === 'trackOrder' && <CheckoutStepTrackOrder onClose={onClose} setCurrentStep={setCurrentStep} />}
        </div>
    );
};

export default Checkout;
