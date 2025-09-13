<?php

namespace App\Http\Requests\Blogs;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreArticleRequest extends FormRequest
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
        return [
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'featured_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'tags' => ['array'], // Array of tag IDs
            'tags.*' => ['exists:tags,id'], // Each tag ID must exist
            'published_at' => ['nullable', 'date'],
            'status' => ['required', 'string', Rule::in(['draft', 'published', 'archived'])],
        ];
    }
}
