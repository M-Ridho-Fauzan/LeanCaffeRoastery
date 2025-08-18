/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 19/08/2025 - 00:07:28
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 19/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/

// import { Dialog } from '@radix-ui/react-dialog';
import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Slider } from './ui/slider';

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob | null> {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
        image.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/png');
    });
}

interface AvatarCropperModalProps {
    isOpen: boolean;
    imageSrc: string | null;
    onClose: () => void;
    onSave: (croppedImage: Blob) => void;
}

export default function AvatarCropperModal({ isOpen, imageSrc, onClose, onSave }: AvatarCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (imageSrc && croppedAreaPixels) {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            if (croppedImageBlob) onSave(croppedImageBlob);
        }
    };

    if (!imageSrc) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crop your photo</DialogTitle>
                    <DialogDescription>Adjust your photo to fit the avatar.</DialogDescription>
                </DialogHeader>
                <div className="relative h-80 w-full bg-neutral-100 dark:bg-neutral-800">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // 1 untuk persegi, 16/9 untuk landscape, dll.
                        cropShape="round" // 'rect' atau 'round'
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className="grid grid-cols-5 items-center gap-4">
                    <span className="col-span-1 text-sm">Zoom</span>
                    <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={(value) => setZoom(value[0])} className="col-span-4" />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Photo</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
