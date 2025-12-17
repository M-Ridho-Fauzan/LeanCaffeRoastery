import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bell, Mail, Save, Volume2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings',
    },
    {
        title: 'Store Settings',
        href: '/settings/store',
    },
];

export default function Appearance() {
    // State untuk Form Fields
    const [formData, setFormData] = useState({
        storeName: 'Lean Coffee Roastery',
        phone: '+622112345678',
        email: 'Lean0@gmail.com',
        address: 'Jl. Raya Sukanagara, Sukanagara Cianjur, Indonesia',
    });

    // State untuk Toggles
    const [toggles, setToggles] = useState({
        sound: true,
        email: true,
        push: true,
    });

    // Handle Perubahan Input Text
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Toggle Switch
    const toggleSwitch = (key: keyof typeof toggles) => {
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Style Helper
    const labelClass = 'block text-sm font-bold text-[#2D2A6E] mb-2';
    const inputClass =
        'w-full rounded-full border border-indigo-200 px-5 py-2.5 text-sm text-slate-600 placeholder:text-slate-400 focus:border-[#2D2A6E] focus:outline-none focus:ring-1 focus:ring-[#2D2A6E] transition-all';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Store Settings" />

            <div className="flex min-h-screen w-full items-start justify-center bg-slate-50 p-4 md:p-8">
                {/* 
                    Main Card Container 
                    PERUBAHAN: max-w-7xl (sebelumnya 5xl) agar lebih lebar
                */}
                <div className="w-full max-w-7xl rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm md:p-10">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="mb-6 text-xl font-bold text-[#2D2A6E]">Setting</h1>

                        <button className="flex items-center gap-2 rounded-full bg-[#2D2A6E] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f1d4d] hover:shadow-lg">
                            <Save className="h-4 w-4" />
                            Save Setting
                        </button>
                    </div>

                    {/* Section 1: Information Store */}
                    <div className="mb-10">
                        <h2 className="mb-6 text-base font-bold text-[#2D2A6E]">Information Store</h2>

                        {/* Grid diperlebar gap-nya agar proporsional */}
                        <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                            {/* Store Name */}
                            <div>
                                <label className={labelClass}>Store Name</label>
                                <input type="text" name="storeName" value={formData.storeName} onChange={handleInputChange} className={inputClass} />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className={labelClass}>Phone Number</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass} />
                            </div>

                            {/* Email */}
                            <div>
                                <label className={labelClass}>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} />
                            </div>

                            {/* Address */}
                            <div>
                                <label className={labelClass}>Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Notification Settings */}
                    <div>
                        <h2 className="mb-6 text-base font-bold text-[#2D2A6E]">Notification Settings</h2>

                        <div className="max-w-md space-y-6">
                            {/* Sound Notification */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Volume2 className="h-5 w-5 text-[#2D2A6E]" />
                                    <span className="text-sm font-medium text-[#2D2A6E]">Sound Notification</span>
                                </div>
                                <Toggle isOn={toggles.sound} onToggle={() => toggleSwitch('sound')} />
                            </div>

                            {/* Email Notification */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-[#2D2A6E]" />
                                    <span className="text-sm font-medium text-[#2D2A6E]">Email Notification</span>
                                </div>
                                <Toggle isOn={toggles.email} onToggle={() => toggleSwitch('email')} />
                            </div>

                            {/* Push Notification */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Bell className="h-5 w-5 text-[#2D2A6E]" />
                                    <span className="text-sm font-medium text-[#2D2A6E]">Push Notification</span>
                                </div>
                                <Toggle isOn={toggles.push} onToggle={() => toggleSwitch('push')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Komponen Toggle Switch Custom
function Toggle({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                isOn ? 'bg-[#2D2A6E]' : 'bg-slate-300'
            }`}
        >
            <span
                className={`${
                    isOn ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
            />
        </button>
    );
}
