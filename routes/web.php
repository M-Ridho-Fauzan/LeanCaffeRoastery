<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Resources\ProductResource;
use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

// Route::get('/menu2', [MenuItemController::class, 'index'])
//     ->name('menu2.index');

Route::get('/products', function () {
    return Inertia::render('products/index'); // Arahkan ke komponen React Anda
})->name('products.index');

// Route::get('/products/{product}', function (Product $product) {
//     return Inertia::render('products/show', ['product' => $product]);
// })->name('products.show');
// Route::get('/products/{product:slug}', function (Product $product) {
//     // Opsi 1: Panggil Controller (Direkomendasikan jika logic controller sudah rapi)
//     // Ini akan menjalankan logic controller, termasuk load relasi dan resource transformation
//     $productResource = (new ProductController())->show($product);

//     return Inertia::render('products/show', [ // Sesuaikan path Inertia jika perlu
//         'product' => $productResource->toArray(request()),
//     ]);

//     // Opsi 2: Lakukan secara manual di sini (jika tidak ingin memanggil controller dari route)
//     // $product->load(['origins', 'processes', 'brewMethods', 'images', 'primaryImage']); // Muat relasi yang sama dengan controller
//     // return Inertia::render('Products/Show', [
//     //     'product' => (new ProductResource($product))->toArray(request()),
//     // ]);
// })->name('products.show');
Route::get('/products/{product:slug}', function (Product $product) {
    // Langsung eager load dan buat resource di sini
    $product->load(['origins', 'processes', 'brewMethods', 'images', 'primaryImage']);

    return Inertia::render('products/show', [
        'product' => new ProductResource($product), // Pastikan namespace benar
    ]);
})->name('products.show');



Route::get('/articles', function () {
    return Inertia::render('articles');
})->name('articles');

Route::get('/location', function () {
    return Inertia::render('location');
})->name('location');

Route::get('/kebijakan-privasi', function () {
    return Inertia::render('legal_authority/privacy');
})->name('privacy_policy');

Route::middleware(['auth', 'verified', 'role:admin,author'])
    ->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');
    });

// require __DIR__ . '/api.php';
require __DIR__ . '/author.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
