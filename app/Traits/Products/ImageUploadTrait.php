<?php

namespace App\Traits\Products;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait ImageUploadTrait
{
    /**
     * Upload dan simpan gambar untuk Product.
     *
     * @param Product $product
     * @param array|null $files Array dari UploadedFile
     * @param array $imagesToDeleteIds Array ID ProductImage yang akan dihapus
     * @param array $existingImagesIds Array ID ProductImage yang dipertahankan (jika ada)
     * @return void
     */
    protected function handleProductImages(Product $product, ?array $files = null, array $imagesToDeleteIds = [], array $existingImagesIds = []): void
    {
        // 1. Hapus gambar yang ditandai untuk dihapus
        if (!empty($imagesToDeleteIds)) {
            $this->deleteProductImages($product, $imagesToDeleteIds);
        }

        // 2. Set ulang status primary jika gambar utama dihapus
        if ($product->images()->where('is_primary', true)->doesntExist()) {
            // Jika gambar utama tidak ada, jadikan gambar pertama yang tersisa sebagai primary
            $firstImage = $product->images()->oldest()->first();
            if ($firstImage) {
                $firstImage->update(['is_primary' => true]);
            }
        }

        // 3. Tambahkan gambar baru
        if ($files) {
            $isPrimary = $product->images()->count() === 0; // Hanya primary jika belum ada gambar

            foreach ($files as $file) {
                if ($file instanceof UploadedFile) {
                    $this->storeSingleImage($product, $file, $isPrimary);
                    $isPrimary = false;
                }
            }
        }
    }

    /**
     * Upload gambar baru dan simpan entri ke DB.
     *
     * @param Product $product
     * @param UploadedFile $file
     * @param bool $isPrimary
     * @return ProductImage
     */
    protected function storeSingleImage(Product $product, UploadedFile $file, bool $isPrimary): ProductImage
    {
        // Path penyimpanan (misalnya: storage/app/public/products/...)
        $path = $file->store('products', 'public');

        // Nonaktifkan primary lama jika ini adalah gambar utama baru
        if ($isPrimary) {
            $product->images()->update(['is_primary' => false]);
        }

        return ProductImage::create([
            'product_id' => $product->id,
            'image_url' => Storage::url($path), // Mendapatkan URL publik
            'alt_text' => $product->product_name,
            'is_primary' => $isPrimary,
        ]);
    }

    /**
     * Hapus gambar dari Storage dan DB.
     *
     * @param Product $product
     * @param array $imageIds
     * @return void
     */
    protected function deleteProductImages(Product $product, array $imageIds): void
    {
        $images = $product->images()->whereIn('id', $imageIds)->get();

        foreach ($images as $image) {
            // Hapus dari Storage (hapus '/storage' dari path URL)
            $filePath = str_replace('/storage/', '', $image->image_url);
            Storage::disk('public')->delete($filePath);

            // Hapus dari DB
            $image->delete();
        }
    }
}
