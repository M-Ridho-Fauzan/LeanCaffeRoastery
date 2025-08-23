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
        // Mendeteksi nama field secara dinamis
        $nameKey = collect($this->resource
            ->getAttributes())
            ->keys()
            ->first(
                fn($key)
                => Str::contains($key, '_name')
            );

        return [
            'id' => $this->id,
            $nameKey => $this->{$nameKey},
        ];
    }
}
