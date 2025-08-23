<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:Single Origin,House Blend,Microlot,Commercial',
            'price' => 'sometimes|required|integer|min:0',
            'flavor_notes' => 'sometimes|required|string',
            'is_specialty' => 'sometimes|required|boolean',

            'origins' => 'sometimes|required|array',
            'origins.*' => 'required|integer|exists:origins,id',
            'processes' => 'sometimes|required|array',
            'processes.*' => 'required|integer|exists:processes,id',
            'brew_methods' => 'sometimes|required|array',
            'brew_methods.*' => 'required|integer|exists:brew_methods,id',
        ];
    }
}
