<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Requests\Product\StoreProductRequest;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = Product::query()
            ->with(['origins', 'processes', 'brewMethods', 'images', 'primaryImage']) // Pastikan primaryImage juga dimuat
            ->latest()
            ->when($request->type, function (Builder $query, string $type) {
                $query->where('type', $type);
            })
            ->when($request->origin_id, function (Builder $query, string $originId) {
                $query->whereHas('origins', fn(Builder $q) => $q->where('origins.id', $originId));
            })
            // TAMBAHKAN INI UNTUK FILTER PROCESS
            ->when($request->process_id, function (Builder $query, string $processId) {
                $query->whereHas('processes', fn(Builder $q) => $q->where('processes.id', $processId));
            })
            // TAMBAHKAN INI UNTUK FILTER BREW METHOD (dari tabs)
            ->when($request->brew_method_id, function (Builder $query, string $brewMethodId) {
                $query->whereHas('brewMethods', fn(Builder $q) => $q->where('brew_methods.id', $brewMethodId));
            })
            ->paginate(9)
            ->withQueryString();

        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        // Gunakan transaksi database untuk memastikan semua operasi berhasil atau tidak sama sekali
        $product = DB::transaction(function () use ($request) {
            // 1. Buat produk terlebih dahulu
            $product = Product::create($request->validated());

            // 2. Proses upload gambar jika ada
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $key => $imageFile) {
                    // Simpan file ke storage dan dapatkan path-nya
                    $path = $imageFile->store('products', 'public');

                    // 3. Buat entri di tabel product_images
                    $product->images()->create([
                        'image_url' => $path,
                        'alt_text' => $product->product_name . ' image ' . ($key + 1),
                        // Tandai gambar pertama sebagai primary
                        'is_primary' => $key === 0,
                    ]);
                }
            }

            // Kaitkan relasi many-to-many (jika ada di request)
            if ($request->has('origins')) {
                $product->origins()->sync($request->input('origins'));
            }
            // ... lakukan hal yang sama untuk processes dan brewMethods

            return $product;
        });

        // Load relasi agar respons API sesuai dengan format `show()`
        $product->load(['images', 'origins', 'processes', 'brewMethods']);

        return new ProductResource($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        // DIBENARKAN: Load semua relasi yang dibutuhkan oleh resource, termasuk images
        $product->load(['origins', 'processes', 'brewMethods', 'images']);

        return new ProductResource($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Hapus semua file gambar dari storage SEBELUM menghapus produk
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_url);
        }

        // Hapus produk dari database. Relasi akan terhapus otomatis karena 'cascade'.
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully.'], 200);
    }
}
