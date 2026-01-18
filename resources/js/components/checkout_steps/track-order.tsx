import { CheckCircle2, Package, Truck } from 'lucide-react';
import React from 'react';

type CheckoutStep = 'checkout' | 'paymentDetails' | 'paymentSuccess' | 'trackOrder';

interface CheckoutStepTrackOrderProps {
    onClose: () => void;
    setCurrentStep: (step: CheckoutStep) => void;
}

const CheckoutStepTrackOrder: React.FC<CheckoutStepTrackOrderProps> = ({ onClose }) => {
    return (
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
    );
};

export default CheckoutStepTrackOrder;
