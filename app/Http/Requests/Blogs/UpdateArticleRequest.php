<?php

namespace App\Http\Requests\Blogs;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->role === 'admin' || $this->user()->role === 'author');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Ambil ID artikel dari route parameter
        $articleId = $this->route('article')->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            // Validasi slug unique diabaikan karena HasSlug trait akan menghandle nya berdasarkan title yang berubah
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            // Jika ada file baru, atau remove_featured_image diset true, atau tidak ada gambar baru tapi ada gambar lama
            'featured_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'remove_featured_image' => ['nullable', 'boolean'], // Field baru untuk menandakan penghapusan gambar
            'category_id' => ['nullable', 'exists:categories,id'],
            'tags' => ['array'],
            'tags.*' => ['exists:tags,id'],
            'published_at' => ['nullable', 'date'],
            'status' => ['required', 'string', Rule::in(['draft', 'published', 'archived'])],
            '_method' => ['required', 'in:PUT'], // Tambahan untuk Inertia/FormData PUT
        ];
    }
}
