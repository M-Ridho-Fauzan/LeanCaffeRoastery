<?php

namespace App\Http\Controllers\Contens\Menus\Publics;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Resources\Menus\Publics\ProductResource;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = Product::query()
            ->with(['origins', 'processes', 'brewMethods', 'images', 'primaryImage']) // Pastikan primaryImage juga dimuat
            ->orderByRaw('is_specialty DESC, product_name ASC')
            ->when($request->type, function (Builder $query, string $type) {
                $query->where('type', $type);
            })
            ->when($request->origin_id, function (Builder $query, string $originId) {
                $query->whereHas('origins', fn(Builder $q) => $q->where('origins.id', $originId));
            })
            ->when($request->process_id, function (Builder $query, string $processId) {
                $query->whereHas('processes', fn(Builder $q) => $q->where('processes.id', $processId));
            })
            ->when($request->brew_method_id, function (Builder $query, string $brewMethodId) {
                $query->whereHas('brewMethods', fn(Builder $q) => $q->where('brew_methods.id', $brewMethodId));
            })
            ->paginate(9)
            ->withQueryString();

        return ProductResource::collection($products);
    }

    // /**
    //  * Store a newly created resource in storage.
    //  */
    // public function store(StoreProductRequest $request)
    // {
    //     $product = DB::transaction(function () use ($request) {
    //         $product = Product::create($request->validated());

    //         if ($request->hasFile('images')) {
    //             foreach ($request->file('images') as $key => $imageFile) {
    //                 $path = $imageFile->store('products', 'public');

    //                 $product->images()->create([
    //                     'image_url' => $path,
    //                     'alt_text' => $product->product_name . ' image ' . ($key + 1),
    //                     'is_primary' => $key === 0,
    //                 ]);
    //             }
    //         }

    //         if ($request->has('origins')) {
    //             $product->origins()->sync($request->input('origins'));
    //         }
    //         return $product;
    //     });

    //     // Load relasi agar respons API sesuai dengan format `show()`
    //     $product->load(['images', 'origins', 'processes', 'brewMethods']);

    //     return new ProductResource($product);
    // }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load(['origins', 'processes', 'brewMethods', 'images', 'primaryImage']);

        return new ProductResource($product);
    }

    // /**
    //  * Update the specified resource in storage.
    //  */
    // public function update(Request $request, string $id)
    // {
    //     //
    // }

    // /**
    //  * Remove the specified resource from storage.
    //  */
    // public function destroy(Product $product)
    // {
    //     foreach ($product->images as $image) {
    //         Storage::disk('public')->delete($image->image_url);
    //     }

    //     $product->delete();

    //     return response()->json(['message' => 'Product deleted successfully.'], 200);
    // }
}
