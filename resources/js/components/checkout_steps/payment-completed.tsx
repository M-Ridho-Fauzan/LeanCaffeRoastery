import { CheckoutStep } from '@/types';
import { CircleCheckBig } from 'lucide-react';
import React from 'react';

interface CheckoutStepPaymentCompletedProps {
    onClose: () => void;
    setCurrentStep: (step: CheckoutStep) => void;
    formattedTotalAmount: string;
}

const CheckoutStepPaymentCompleted: React.FC<CheckoutStepPaymentCompletedProps> = ({ onClose, setCurrentStep, formattedTotalAmount }) => {
    // Note: MOCK data is kept static as per the original component's structure, except for the total amount display.
    const displayAmount = formattedTotalAmount;

    return (
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
                        <span className="font-bold text-blue-900">{displayAmount}</span>
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
                        <span className="text-base font-bold text-blue-900">{displayAmount}</span>
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
    );
};

export default CheckoutStepPaymentCompleted;
