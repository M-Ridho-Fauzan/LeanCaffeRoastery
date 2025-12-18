<?php

namespace App\Http\Resources\Menus\Publics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_name' => $this->product_name,
            'slug' => $this->slug,
            // 'image_url' => $this->image_url,
            'type' => $this->type,
            'price' => $this->price,
            'status' => $this->status,
            'stock' => $this->stock,
            'flavor_notes' => $this->flavor_notes,
            'is_specialty' => $this->is_specialty,

            // Opsi 1: Menampilkan HANYA gambar utama (jika ada)
            'primary_image_url' => $this->whenLoaded('primaryImage', $this->primaryImage?->image_url),

            // Opsi 2: Menampilkan SEMUA gambar sebagai array objek
            'images' => ProductImageResource::collection($this->whenLoaded('images')),

            // Menggunakan MiniResource untuk relasi agar formatnya konsisten
            'origins' => MiniResource::collection($this->whenLoaded('origins')),
            'processes' => MiniResource::collection($this->whenLoaded('processes')),
            'brew_methods' => MiniResource::collection($this->whenLoaded('brewMethods')),
        ];
    }
}
