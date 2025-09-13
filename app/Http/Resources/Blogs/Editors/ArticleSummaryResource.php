<?php

namespace App\Http\Resources\Blogs\Editors;

use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleSummaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Pastikan relasi 'user' dan 'category' sudah di-eager-load di controller
        // Jika tidak, this->whenLoaded() akan mengembalikan null dan relasi tidak akan disertakan
        // Ini adalah cara untuk menghindari N+1 query problem di resource.
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'featured_image_url' => $this->featured_image_url
                ? Storage::url($this->featured_image_url) // Ubah path menjadi URL publik
                : null,
            'published_at' => $this->published_at ? $this->published_at->format('Y-m-d H:i:s') : null,
            'status' => $this->status,
            'views_count' => $this->views_count,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),

            // Hanya sertakan relasi jika sudah di-eager-load
            'category' => new CategoryResource($this->whenLoaded('category')),
            'author' => new UserResource($this->whenLoaded('user')),
            // JANGAN sertakan 'content' di sini
            // JANGAN sertakan 'tags' di sini (kecuali jika dibutuhkan di summary)
        ];
    }
}
