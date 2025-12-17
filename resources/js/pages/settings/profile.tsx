import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Image as ImageIcon, User as UserIcon } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const fileInput = useRef<HTMLInputElement>(null);

    // === STATE LOGIC: View (False) vs Edit (True) ===
    const [isEditing, setIsEditing] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = auth.user as any;

    const { data, setData, post, processing, errors, recentlySuccessful, reset, cancel, clearErrors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        birth_date: user.birth_date || '',
        address: user.address || '',
        avatar: null as File | null,
        _method: 'patch',
    });

    // Handle Submit
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false); // Kembali ke mode View setelah sukses
                reset('avatar');
            },
        });
    };

    // Handle Toggle Mode (Edit <-> View)
    const toggleEditMode = (e?: React.MouseEvent) => {
        e?.preventDefault();
        if (isEditing) {
            // Jika sedang Edit lalu tekan Back -> Batalkan perubahan (Reset)
            reset();
            cancel();
            clearErrors();
        }
        setIsEditing(!isEditing);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('avatar', e.target.files[0]);
        }
    };

    // Preview Gambar
    const avatarUrl = data.avatar ? URL.createObjectURL(data.avatar) : user.avatar;

    // === DESAIN ASLI (ORIGINAL STYLE) ===
    const inputClass = `w-full rounded-full border px-5 py-3 text-slate-700 bg-white placeholder:text-slate-400 focus:outline-none transition-all duration-200 
        ${
            isEditing
                ? 'border-indigo-300 focus:border-indigo-900 focus:ring-1 focus:ring-indigo-900 cursor-text' // Mode Edit
                : 'border-indigo-200 cursor-default' // Mode View
        }`;

    const labelClass = 'block mb-2 text-base font-bold text-[#2D2A6E]';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile Settings" />

            <div className="min-h-screen bg-white pb-20">
                {/* 1. HEADER IMAGE */}
                <div className="relative flex h-[180px] w-full items-center justify-center overflow-hidden bg-slate-900">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-60"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2574&auto=format&fit=crop')",
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-black/40"></div>
                    <h1 className="relative z-10 text-4xl font-bold text-white drop-shadow-lg">Profile Setting</h1>
                </div>

                <div className="relative container mx-auto max-w-6xl px-4">
                    {/* 
                        2. TOMBOL BACK 
                        Change Log: Mengubah 'top-12' menjadi 'top-20' agar turun lebih ke bawah lagi.
                    */}
                    <div className="absolute top-20 left-4 z-10 h-10 w-10">
                        {isEditing && (
                            <button onClick={toggleEditMode} className="inline-flex items-center text-[#2D2A6E] transition hover:opacity-75">
                                <ArrowLeft className="h-8 w-8" strokeWidth={2.5} />
                            </button>
                        )}
                    </div>

                    <form onSubmit={submit} className="mt-4">
                        {/* 3. AVATAR SECTION */}
                        <div className="relative -mt-16 mb-12 flex justify-center">
                            <div
                                className={`group relative h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                                onClick={() => isEditing && fileInput.current?.click()}
                            >
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[#b8b6d8] text-[#2D2A6E]">
                                        <UserIcon className="h-16 w-16 opacity-50" />
                                    </div>
                                )}
                            </div>

                            {/* Ikon Galeri Kecil */}
                            {isEditing && (
                                <div
                                    className="absolute bottom-1 ml-24 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2 border-white bg-[#2D2A6E] text-white shadow-sm transition-transform hover:scale-105"
                                    onClick={() => fileInput.current?.click()}
                                >
                                    <ImageIcon className="h-5 w-5" />
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInput}
                                className="hidden"
                                onChange={handleFileChange}
                                accept="image/*"
                                disabled={!isEditing}
                            />
                            {errors.avatar && <p className="absolute -bottom-6 text-sm text-red-500">{errors.avatar}</p>}
                        </div>

                        {/* 4. FORM INPUTS */}
                        <div className="space-y-8 px-2 md:px-10">
                            {/* Row 1: Name, Email, Phone */}
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                <div>
                                    <label htmlFor="name" className={labelClass}>
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        readOnly={!isEditing}
                                        className={inputClass}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className={labelClass}>
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        readOnly={!isEditing}
                                        className={inputClass}
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className={labelClass}>
                                        Phone
                                    </label>
                                    <input
                                        id="phone"
                                        type="text"
                                        readOnly={!isEditing}
                                        className={inputClass}
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Row 2: City, Birth Date */}
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                <div className="md:col-span-1">
                                    <label htmlFor="city" className={labelClass}>
                                        City
                                    </label>
                                    <input
                                        id="city"
                                        type="text"
                                        readOnly={!isEditing}
                                        className={inputClass}
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-1">
                                    <label htmlFor="birth_date" className={labelClass}>
                                        Birth Date
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="birth_date"
                                            type="date"
                                            readOnly={!isEditing}
                                            className={`${inputClass} ${!isEditing && '[&::-webkit-calendar-picker-indicator]:hidden'}`}
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Address */}
                            <div>
                                <label htmlFor="address" className={labelClass}>
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    rows={5}
                                    readOnly={!isEditing}
                                    className={`w-full rounded-3xl border bg-white px-5 py-4 text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:outline-none ${
                                        isEditing
                                            ? 'border-indigo-300 focus:border-indigo-900 focus:ring-1 focus:ring-indigo-900'
                                            : 'resize-none border-indigo-200'
                                    }`}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                ></textarea>
                            </div>

                            {/* 5. ACTION BUTTON */}
                            <div className="flex flex-col items-center pt-6 pb-10">
                                {isEditing ? (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="h-12 w-48 rounded-lg bg-[#2D2A6E] text-sm font-bold text-white shadow-md transition hover:bg-[#1f1d4d] focus:ring-2 focus:ring-[#2D2A6E] focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Update Profile'}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={toggleEditMode}
                                        className="h-12 w-48 rounded-lg bg-[#2D2A6E] text-sm font-bold text-white shadow-md transition hover:bg-[#1f1d4d] focus:ring-2 focus:ring-[#2D2A6E] focus:ring-offset-2 focus:outline-none"
                                    >
                                        Edit Profile
                                    </button>
                                )}

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="mt-4 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-600">
                                        Data Saved Successfully!
                                    </p>
                                </Transition>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
