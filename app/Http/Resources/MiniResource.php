<?php

namespace App\Http\Resources;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MiniResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
        ];

        // Mendeteksi nama field utama (misal: 'origin_name', 'brew_name', 'process_name')
        $nameKey = collect($this->resource->getAttributes())
            ->keys()
            ->first(fn($key) => Str::contains($key, '_name'));

        if ($nameKey) {
            $data[$nameKey] = $this->{$nameKey};
        }

        // --- TAMBAHKAN INI UNTUK MENYERTANAKAN FIELD LAIN SECARA KONDISIONAL ---
        // Jika ada field 'description', sertakan
        if (isset($this->description)) {
            $data['description'] = $this->description;
        }

        // Jika ada field 'region' dan 'country' (untuk Origin), sertakan
        if (isset($this->region)) {
            $data['region'] = $this->region;
        }
        if (isset($this->country)) {
            $data['country'] = $this->country;
        }
        // --- AKHIR TAMBAHAN ---

        return $data;
    }
}
