<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Contens\Menus\Publics\ProductController;
use App\Http\Controllers\Contens\Menus\Publics\FilterOptionsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Di sini Anda mendaftarkan route API. Route ini secara otomatis
| memiliki prefix '/api' dan menggunakan grup middleware 'api'.
*/

// --- ENDPOINT PUBLIK (TIDAK PERLU LOGIN) ---
// Route untuk Produk
Route::get('/products', [ProductController::class, 'index'])
    ->name('products.index.api');

Route::get('/products/{product}', [ProductController::class, 'show'])
    ->name('products.show.api');

// Route untuk mendapatkan opsi filter
Route::get('/filter-options', FilterOptionsController::class)
    ->name('filters.options.api');


// --- ENDPOINT YANG DILINDUNGI (PERLU LOGIN) ---
Route::middleware('auth:sanctum')->group(function () {});
