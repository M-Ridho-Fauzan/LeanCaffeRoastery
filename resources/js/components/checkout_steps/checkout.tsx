import { CartItem, Product } from '@/types';
import { Banknote, CircleCheckBig, CreditCard, Landmark, MapPin, QrCode, ShoppingCart, Wallet } from 'lucide-react';
import React from 'react';

// --- Placeholder/Utility Components ---
const Input = (props: React.InputHTMLAttributes<HTMLInputElement> & { disabled?: boolean }) => (
    <input {...props} className="block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500" />
);
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { disabled?: boolean }) => (
    <textarea
        {...props}
        className="block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
);

// --- Local Constants ---

const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer', description: 'Transfer Ke Rekening Bank Kami', icon: <Banknote className="h-5 w-5" /> },
    { id: 'virtual_account', name: 'Virtual Account', description: 'BCA, BRI, Mandiri Virtual Account', icon: <Landmark className="h-5 w-5" /> },
    { id: 'e_wallet', name: 'E-Wallet', description: 'DANA, OVO, GoPay, ShopeePay', icon: <Wallet className="h-5 w-5" /> },
    { id: 'qr_code', name: 'QRIS', description: 'Scan QR Code Untuk Membayar', icon: <QrCode className="h-5 w-5" /> },
];

const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// --- Payment Option Component ---

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

// --- Main Step Component Props ---

interface CheckoutStepCheckoutProps {
    product: Product;
    cartItems?: CartItem[];
    isCartCheckout: boolean | undefined;
    SHIPPING_COST: number;
    formattedProductPrice: string;
    formattedSubtotalPrice: string;
    formattedTotalAmount: string;

    // State Getters
    quantity: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    city: string;
    postalCode: string;
    address: string;
    orderNotes: string;
    selectedPaymentMethod: string | null;
    isProcessingPayment: boolean;

    // State Setters
    setQuantity: (qty: number) => void;
    setFullName: (val: string) => void;
    setEmail: (val: string) => void;
    setPhoneNumber: (val: string) => void;
    setCity: (val: string) => void;
    setPostalCode: (val: string) => void;
    setAddress: (val: string) => void;
    setOrderNotes: (val: string) => void;
    setSelectedPaymentMethod: (methodId: string | null) => void;

    // Handlers
    handleProceedToPayment: () => void;
}

const CheckoutStepCheckout: React.FC<CheckoutStepCheckoutProps> = (props) => {
    const {
        product,
        cartItems,
        isCartCheckout,
        SHIPPING_COST,
        quantity,
        fullName,
        email,
        phoneNumber,
        city,
        postalCode,
        address,
        orderNotes,
        selectedPaymentMethod,
        isProcessingPayment,
        formattedProductPrice,
        formattedSubtotalPrice,
        formattedTotalAmount,
        setQuantity,
        setFullName,
        setEmail,
        setPhoneNumber,
        setCity,
        setPostalCode,
        setAddress,
        setOrderNotes,
        setSelectedPaymentMethod,
        handleProceedToPayment,
    } = props;

    return (
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
                                        <span className="font-semibold text-gray-800">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
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

                {/* Shipping Information */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                        <MapPin className="mr-2 h-5 w-5 text-gray-600" />
                        Shipping Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Input Fields */}
                        <div>
                            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                id="fullName"
                                placeholder="Enter Your Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={isProcessingPayment}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isProcessingPayment}
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <Input
                                type="tel"
                                id="phoneNumber"
                                placeholder="Enter Your Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={isProcessingPayment}
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <Input
                                type="text"
                                id="city"
                                placeholder="Enter Your City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                disabled={isProcessingPayment}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="postalCode" className="mb-1 block text-sm font-medium text-gray-700">
                                Postal Code
                            </label>
                            <Input
                                type="text"
                                id="postalCode"
                                placeholder="Enter Postal Code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                disabled={isProcessingPayment}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <Input
                                type="text"
                                id="address"
                                placeholder="Enter Your Full Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                disabled={isProcessingPayment}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="orderNotes" className="mb-1 block text-sm font-medium text-gray-700">
                                Order Notes (Opsional)
                            </label>
                            <Textarea
                                id="orderNotes"
                                rows={3}
                                placeholder="Any Special Instructions or Requests"
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                disabled={isProcessingPayment}
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method Selection */}
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
    );
};

export default CheckoutStepCheckout;
