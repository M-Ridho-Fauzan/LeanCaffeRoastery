/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 18/08/2025 - 23:07:54
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 18/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/

import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { User } from '@/types';
import { useRef, useState } from 'react';
import AvatarCropperModal from './avatar-cropper-modal';
import InputError from './input-error';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface UpdateAvatarFieldProps {
    currentUser: User;
    avatarFile: File | Blob | null;
    error?: string;
    onFileChange: (file: File | Blob | null) => void;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function UpdateAvatarField({ currentUser, avatarFile, error, onFileChange }: UpdateAvatarFieldProps) {
    const getInitials = useInitials();
    const fileInput = useRef<HTMLInputElement>(null);

    // State untuk modal cropper
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);

    // Dapatkan URL preview dari file yang sudah di-crop atau dari user data
    const previewUrl = avatarFile ? URL.createObjectURL(avatarFile) : currentUser.avatar_url;

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            // Validasi tipe file
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                alert('Please select a valid image file (JPG, PNG, WEBP).');
                return;
            }
            // Buat URL sementara untuk ditampilkan di cropper
            setImageToCrop(URL.createObjectURL(file));
        }
        // Reset input file agar bisa memilih file yang sama lagi
        event.target.value = '';
    };

    const handleCropSave = (croppedImageBlob: Blob) => {
        // Panggil prop dari parent dengan Blob hasil crop
        onFileChange(croppedImageBlob);
        // Tutup modal
        setImageToCrop(null);
    };

    return (
        <>
            <div className="grid gap-2">
                <Label>Photo</Label>
                <div className="mt-1 flex items-center gap-x-4">
                    <Avatar className="h-20 w-20 rounded-full text-xl">
                        {/* AvatarImage sekarang selalu menampilkan preview yang benar */}
                        <AvatarImage src={previewUrl} alt="Profile" />
                        <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                            {getInitials(currentUser.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <Input
                            id="avatar"
                            type="file"
                            className="hidden"
                            ref={fileInput}
                            onChange={handleFileSelect} // <-- Ganti handler
                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        />
                        <Button type="button" variant="secondary" onClick={() => fileInput.current?.click()}>
                            Change Photo
                        </Button>
                        <InputError className="mt-2" message={error} />
                    </div>
                </div>
            </div>

            {/* Render Modal Cropper secara kondisional */}
            <AvatarCropperModal isOpen={!!imageToCrop} imageSrc={imageToCrop} onClose={() => setImageToCrop(null)} onSave={handleCropSave} />
        </>
    );
}
