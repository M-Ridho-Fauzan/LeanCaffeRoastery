<?php

namespace App\Http\Resources\Blogs\Editors;

use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleDetailResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content, // Ini adalah perbedaan utama: 'content' disertakan
            'featured_image_url' => $this->featured_image_url
                ? Storage::url($this->featured_image_url) // Ubah path menjadi URL publik
                : null,
            'published_at' => $this->published_at ? $this->published_at->format('Y-m-d H:i:s') : null,
            'status' => $this->status,
            'views_count' => $this->views_count,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),

            // Sertakan relasi, pastikan sudah di-eager-load di controller
            'category' => new CategoryResource($this->whenLoaded('category')),
            'author' => new UserResource($this->whenLoaded('user')),
            'tags' => TagResource::collection($this->whenLoaded('tags')), // Gunakan collection untuk banyak tags
        ];
    }
}
