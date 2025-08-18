/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 18/08/2025 - 18:26:16
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 18/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import UpdateAvatarField from '@/components/update-avatar-field';
import UpdateProfileField from '@/components/update-profile-field';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        avatar: null as File | Blob | null,
        _method: 'patch',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => reset('avatar'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        {/* Komponen untuk Avatar */}
                        <UpdateAvatarField
                            currentUser={auth.user}
                            avatarFile={data.avatar}
                            onFileChange={(file) => setData('avatar', file)}
                            error={errors.avatar}
                        />

                        {/* Komponen untuk Nama */}
                        <UpdateProfileField
                            id="name"
                            label="Name"
                            type="text"
                            value={data.name}
                            onChange={(value) => setData('name', value)}
                            error={errors.name}
                            autoComplete="name"
                            required
                        />

                        {/* Komponen untuk Email */}
                        <UpdateProfileField
                            id="email"
                            label="Email address"
                            type="email"
                            value={data.email}
                            onChange={(value) => setData('email', value)}
                            error={errors.email}
                            autoComplete="username"
                            required
                        />

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}

// export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
//     const { auth } = usePage<SharedData>().props;
//     const getInitials = useInitials();

//     // 3. Setup `useRef` hanya untuk trigger klik pada input file
//     const fileInput = useRef<HTMLInputElement>(null);

//     // 4. Inisialisasi `useForm` sebagai "source of truth" untuk semua data form
//     const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
//         name: auth.user.name,
//         email: auth.user.email,
//         avatar: null as File | null, // State untuk menampung file avatar yang dipilih
//         _method: 'patch',
//     });

//     // 5. Submit handler yang bersih
//     const submit: FormEventHandler = (e) => {
//         e.preventDefault();
//         // Panggil `patch`. `useForm` akan secara otomatis menangani `multipart/form-data`
//         // dan `method spoofing` (mengirim _method: 'patch')
//         post(route('profile.update'), {
//             preserveScroll: true,
//             // Hapus file dari state setelah berhasil diupload
//             onSuccess: () => reset('avatar'),
//         });
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Profile settings" />

//             <SettingsLayout>
//                 <div className="space-y-6">
//                     <HeadingSmall title="Profile information" description="Update your name and email address" />

//                     {/* 6. Gunakan tag <form> standar dengan handler `onSubmit` */}
//                     <form onSubmit={submit} className="space-y-6">
//                         {/* Avatar Section */}
//                         <div className="grid gap-2">
//                             <Label>Photo</Label>
//                             <div className="mt-1 flex items-center gap-x-4">
//                                 <Avatar className="h-20 w-20 rounded-full text-xl">
//                                     <AvatarImage
//                                         // Preview didapat langsung dari `data.avatar` jika ada
//                                         src={data.avatar ? URL.createObjectURL(data.avatar) : auth.user.avatar_url}
//                                         alt="Profile"
//                                     />
//                                     <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
//                                         {getInitials(auth.user.name)}
//                                     </AvatarFallback>
//                                 </Avatar>
//                                 <div>
//                                     <Input
//                                         id="avatar"
//                                         type="file"
//                                         className="hidden"
//                                         ref={fileInput}
//                                         // Saat file dipilih, update state `data.avatar`
//                                         onChange={(e) => setData('avatar', e.target.files ? e.target.files[0] : null)}
//                                     />
//                                     <Button type="button" variant="secondary" onClick={() => fileInput.current?.click()}>
//                                         Change Photo
//                                     </Button>
//                                     <InputError className="mt-2" message={errors.avatar} />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Name Section */}
//                         <div className="grid gap-2">
//                             <Label htmlFor="name">Name</Label>
//                             <Input
//                                 id="name"
//                                 className="mt-1 block w-full"
//                                 // 7. Menjadi "Controlled Component"
//                                 value={data.name}
//                                 onChange={(e) => setData('name', e.target.value)}
//                                 required
//                                 autoComplete="name"
//                             />
//                             <InputError className="mt-2" message={errors.name} />
//                         </div>

//                         {/* Email Section */}
//                         <div className="grid gap-2">
//                             <Label htmlFor="email">Email address</Label>
//                             <Input
//                                 id="email"
//                                 type="email"
//                                 className="mt-1 block w-full"
//                                 // 7. Menjadi "Controlled Component"
//                                 value={data.email}
//                                 onChange={(e) => setData('email', e.target.value)}
//                                 required
//                                 autoComplete="username"
//                             />
//                             <InputError className="mt-2" message={errors.email} />
//                         </div>

//                         {mustVerifyEmail && auth.user.email_verified_at === null && (
//                             <div>
//                                 <p className="-mt-4 text-sm text-muted-foreground">
//                                     Your email address is unverified.{' '}
//                                     <Link
//                                         href={route('verification.send')}
//                                         method="post"
//                                         as="button"
//                                         className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
//                                     >
//                                         Click here to resend the verification email.
//                                     </Link>
//                                 </p>

//                                 {status === 'verification-link-sent' && (
//                                     <div className="mt-2 text-sm font-medium text-green-600">
//                                         A new verification link has been sent to your email address.
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {/* Actions Section */}
//                         <div className="flex items-center gap-4">
//                             <Button disabled={processing}>Save</Button>
//                             <Transition
//                                 show={recentlySuccessful}
//                                 enter="transition ease-in-out"
//                                 enterFrom="opacity-0"
//                                 leave="transition ease-in-out"
//                                 leaveTo="opacity-0"
//                             >
//                                 <p className="text-sm text-neutral-600">Saved</p>
//                             </Transition>
//                         </div>
//                     </form>
//                 </div>

//                 <DeleteUser />
//             </SettingsLayout>
//         </AppLayout>
//     );
// }
