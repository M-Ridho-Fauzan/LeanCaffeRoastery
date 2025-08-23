<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Ubah ke false jika ada logic otorisasi, misal hanya admin
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_name' => 'required|string|max:255',
            'type' => 'required|in:Single Origin,House Blend,Microlot,Commercial',
            'price' => 'required|integer|min:0',
            'flavor_notes' => 'required|string',
            'is_specialty' => 'required|boolean',

            // Validasi untuk relasi (harus berupa array dan ID-nya ada di tabel masing-masing)
            'origins' => 'required|array',
            'origins.*' => 'required|integer|exists:origins,id',
            'processes' => 'required|array',
            'processes.*' => 'required|integer|exists:processes,id',
            'brew_methods' => 'required|array',
            'brew_methods.*' => 'required|integer|exists:brew_methods,id',
        ];
    }
}
