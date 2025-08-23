<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Arr;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;

class ProductControllerss extends Controller
{
    /**
     * Menampilkan daftar semua produk.
     * Menggunakan eager loading untuk performa yang lebih baik.
     */
    public function index(): JsonResponse
    {
        $products = Product::with(['origins', 'processes', 'brewMethods'])
            ->latest()
            ->paginate(15);

        return response()->json($products);
    }

    /**
     * Menyimpan produk baru ke database.
     * Menggunakan transaction untuk memastikan integritas data.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            // Pisahkan data untuk tabel product dan data untuk relasi
            $productData = Arr::except($validated, ['origins', 'processes', 'brew_methods']);

            $product = Product::create($productData);

            // Lampirkan relasi many-to-many
            $product->origins()->attach($validated['origins']);
            $product->processes()->attach($validated['processes']);
            $product->brewMethods()->attach($validated['brew_methods']);

            DB::commit();

            // Muat ulang relasi agar bisa dikembalikan di response
            $product->load(['origins', 'processes', 'brewMethods']);

            return response()->json($product, 201); // 201 Created

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal menyimpan produk.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan satu produk spesifik.
     * Route-model binding akan otomatis mencari produk atau menampilkan 404.
     */
    public function show(Product $product): JsonResponse
    {
        // Gunakan load() untuk eager loading pada model yang sudah ada
        $product->load(['origins', 'processes', 'brewMethods']);

        return response()->json($product);
    }

    /**
     * Memperbarui produk yang ada di database.
     * Menggunakan sync() untuk memperbarui relasi many-to-many.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $productData = Arr::except($validated, ['origins', 'processes', 'brew_methods']);
            $product->update($productData);

            // sync() akan menghapus relasi lama dan menambahkan yang baru. Sangat efisien!
            if (isset($validated['origins'])) {
                $product->origins()->sync($validated['origins']);
            }
            if (isset($validated['processes'])) {
                $product->processes()->sync($validated['processes']);
            }
            if (isset($validated['brew_methods'])) {
                $product->brewMethods()->sync($validated['brew_methods']);
            }

            DB::commit();

            $product->load(['origins', 'processes', 'brewMethods']);

            return response()->json($product);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal memperbarui produk.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menghapus produk dari database.
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        // onDelete('cascade') di migrasi akan otomatis membersihkan tabel pivot.
        return response()->json(['message' => 'Produk berhasil dihapus.'], 200);
    }
}
