<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /**
         * @CAUTION!!
         * JANGAN sertakan data sensitif seperti password, remember_token, dll.
         * Bahkan kolom seperti phone, birthday mungkin tidak perlu di public blog
         * Sesuaikan kolom yang disertakan HANYA yang benar-benar dibutuhkan untuk public display
         */
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role, // Penting untuk otorisasi di frontend
            'avatar_url' => $this->avatar_path
                ? Storage::url($this->avatar_path)
                : null, // Jika ada kolom avatar_path di tabel users
        ];
    }
}
