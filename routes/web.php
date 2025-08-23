<?php

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

Route::get('/menu2', function () {
    return Inertia::render('menu2'); // Arahkan ke komponen React Anda
})->name('products.index');

Route::get('/products/{product}', function (Product $product) {
    return Inertia::render('Products/Show', ['product' => $product]);
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
