<?php

namespace App\Http\Controllers\Contens\Menus\Editors;

use Inertia\Inertia;
use App\Models\Origin;
use App\Models\Process;
use App\Models\Product;
use App\Models\BrewMethod;
use Illuminate\Http\Request;
use App\Traits\Products\ImageUploadTrait;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\Menus\Publics\ProductResource;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    use ImageUploadTrait;

    // Path dasar untuk komponen Inertia
    private string $componentPath = 'editors/products/';

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $productsQuery = Product::with(['primaryImage', 'origins', 'processes', 'brewMethods'])
            ->when($request->search, function ($query, $search) {
                $query->where('product_name', 'like', "%{$search}%");
            })
            ->when($request->status !== null && $request->status !== 'All Status', function ($query) use ($request) {
                $status = filter_var($request->status, FILTER_VALIDATE_BOOLEAN);
                $query->where('status', $status);
            })
            ->latest();

        $products = $productsQuery->paginate(10)->withQueryString();

        return Inertia::render($this->componentPath . 'index', [
            'products' => ProductResource::collection($products),
            'filterOptions' => [
                'origins' => Origin::all(),
                'processes' => Process::all(),
                'brewMethods' => BrewMethod::all(),
                'types' => Product::TYPES,
            ],
            'activeFilters' => $request->only(['search', 'status']),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => route('dashboard')],
                ['title' => 'Products', 'href' => route('admin.products.index')],
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        DB::beginTransaction();

        try {
            // 1. Buat Product baru
            $product = Product::create([
                'product_name' => $request->product_name,
                'type' => $request->type,
                'price' => $request->price,
                'flavor_notes' => $request->flavor_notes ?? '',
                'is_specialty' => $request->is_specialty ?? false,
                'stock' => $request->stock,
                'status' => $request->status ?? false,
            ]);

            // 2. Sinkronisasi Relasi Many-to-Many
            $product->origins()->sync($request->origin_ids ?? []);
            $product->processes()->sync($request->process_ids ?? []);
            $product->brewMethods()->sync($request->brew_method_ids ?? []);

            // 3. Simpan Gambar Baru (Menggunakan Trait)
            if ($request->hasFile('image_files')) {
                // Trait akan otomatis menangani primary image karena belum ada gambar
                $this->handleProductImages($product, $request->file('image_files'));
            }

            DB::commit();

            return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the exception
            return redirect()->back()->with('error', 'Failed to create product: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     * Menggunakan Route Model Binding dengan key 'slug' (default Product model)
     */
    public function show(Product $product)
    {
        $product->load(['images', 'origins', 'processes', 'brewMethods']);

        // Mengirimkan data produk yang detail ke modal/dialog (FE akan melakukan AJAX request)
        return response()->json([
            'product' => ProductResource::make($product),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     * Menggunakan Route Model Binding dengan key 'slug'
     */
    public function edit(Product $product)
    {
        $product->load(['images', 'origins', 'processes', 'brewMethods']); // Load data yang sudah ada

        return Inertia::render($this->componentPath . 'form', [ // Asumsi Anda menggunakan form yang sama
            'product' => ProductResource::make($product), // Mengirimkan produk untuk diisi di form
            'origins' => Origin::all(),
            'processes' => Process::all(),
            'brewMethods' => BrewMethod::all(),
            'types' => Product::TYPES,
            'breadcrumbs' => [
                ['title' => 'Products', 'href' => route('admin.products.index')],
                ['title' => 'Edit ' . $product->product_name, 'href' => route('admin.products.edit', $product)],
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        DB::beginTransaction();

        try {
            // 1. Update Product data
            $product->update([
                'product_name' => $request->product_name,
                'type' => $request->type,
                'price' => $request->price,
                'flavor_notes' => $request->flavor_notes ?? '',
                'is_specialty' => $request->is_specialty ?? false,
                'stock' => $request->stock,
                'status' => $request->status ?? false,
            ]);

            // 2. Sinkronisasi Relasi Many-to-Many
            $product->origins()->sync($request->origin_ids ?? []);
            $product->processes()->sync($request->process_ids ?? []);
            $product->brewMethods()->sync($request->brew_method_ids ?? []);

            // 3. Update/Hapus/Tambah Gambar (Menggunakan Trait)
            // Asumsi: Request dari frontend akan mengirimkan dua array terpisah:
            // a. image_files (Gambar baru yang diupload)
            // b. images_to_delete_ids (ID ProductImage yang dihapus)

            $imagesToDeleteIds = $request->input('images_to_delete_ids', []); // ID gambar yang akan dihapus
            $newFiles = $request->file('image_files'); // File gambar baru

            $this->handleProductImages(
                $product,
                $newFiles,
                $imagesToDeleteIds
            );

            // Catatan: Jika Anda juga perlu mengubah gambar mana yang menjadi primary,
            // Anda perlu menambahkannya di sini (misalnya: $product->images()->where('id', $request->primary_image_id)->update(['is_primary' => true]);)
            $product->images()->where('id', $request->primary_image_id)->update(['is_primary' => true]);

            DB::commit();

            return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update product: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        DB::beginTransaction();
        try {
            // Hapus semua gambar dari storage dan DB
            $imagesToDelete = $product->images()->pluck('id')->toArray();
            $this->deleteProductImages($product, $imagesToDelete);

            $product->delete();
            DB::commit();

            return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to delete product: ' . $e->getMessage());
        }
    }
}
