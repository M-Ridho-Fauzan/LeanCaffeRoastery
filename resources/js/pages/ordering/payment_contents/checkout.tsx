// resources/js/pages/ordering/payments/checkout.tsx
import PaymentMethodRenderer from '@/components/payment_method';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Product } from '@/types';
import {
    ArrowLeft,
    Banknote,
    CheckCircle2,
    CircleCheckBig,
    CreditCard,
    Landmark,
    MapPin,
    Package,
    QrCode,
    ShoppingCart,
    Truck,
    Wallet,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

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

const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer', description: 'Transfer Ke Rekening Bank Kami', icon: <Banknote className="h-5 w-5" /> },
    { id: 'virtual_account', name: 'Virtual Account', description: 'BCA, BRI, Mandiri Virtual Account', icon: <Landmark className="h-5 w-5" /> },
    { id: 'e_wallet', name: 'E-Wallet', description: 'DANA, OVO, GoPay, ShopeePay', icon: <Wallet className="h-5 w-5" /> },
    { id: 'qr_code', name: 'QRIS', description: 'Scan QR Code Untuk Membayar', icon: <QrCode className="h-5 w-5" /> },
];

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
        {isSelected && <CircleCheckBig className="h-5 w-5 text-indigo-600" />}
    </button>
);

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
        setShowQRIS(false); // Reset QRIS saat kembali
    };

    const handleFinalizePayment = useCallback(() => {
        setIsProcessingPayment(true);
        console.log(`Memproses pembayaran ${selectedPaymentMethod} untuk ${quantity}x "${product.product_name}" total Rp ${formattedTotalAmount}...`);

        setTimeout(() => {
            console.log('Pembayaran berhasil dikonfirmasi!');
            setIsProcessingPayment(false);
            setCurrentStep('paymentSuccess');
        }, 2500);
    }, [selectedPaymentMethod, quantity, product, formattedTotalAmount]);

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
            vaData: VA_DATA, // Masukkan data VA mock
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
                <>
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
                                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md">
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
                                                <span className="font-semibold text-gray-800">
                                                    Rp {(item.price * item.qty).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-start space-y-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md">
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
                </>
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
                        {selectedPaymentMethod && (
                            <PaymentMethodRenderer
                                selectedPaymentMethod={selectedPaymentMethod}
                                baseProps={baseProps}
                                vaProps={vaProps}
                                eWalletProps={eWalletProps}
                            />
                        )}
                        {/* {renderPaymentDetailsContent()} */}
                    </div>
                </div>
            )}

            {currentStep === 'paymentSuccess' && (
                <div className="flex-1 overflow-y-auto px-6 pt-2 pb-8">
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <div className="rounded-full bg-white">
                                <CircleCheckBig className="h-20 w-20 fill-green-300 text-green-500" />
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
                                    <div className="shrink-0">
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
                                    <div className="shrink-0">
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
                                    <div className="shrink-0">
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
                                    <div className="shrink-0">
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
