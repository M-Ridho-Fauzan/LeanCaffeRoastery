<?php


use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\Publics\ProductResource;

use App\Http\Controllers\Contens\Blogs\Publics\BlogController;

use App\Http\Controllers\Contens\Blogs\Editors\TagController;
use App\Http\Controllers\Contens\Blogs\Editors\ArticleController;
use App\Http\Controllers\Contens\Blogs\Editors\CategoryController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/products', function () {
    return Inertia::render('products/index');
})->name('products.index');

Route::get('/products/{product:slug}', function (Product $product) {
    $product->load(['origins', 'processes', 'brewMethods', 'images', 'primaryImage']);

    return Inertia::render('products/show', [
        'product' => new ProductResource($product),
    ]);
})->name('products.show');

Route::prefix('blog')
    ->name('blog.')
    ->group(function () {

        Route::get('/', [BlogController::class, 'index'])
            ->name('index');
        Route::get('/{slug}', [BlogController::class, 'show'])
            ->name('show');
    });


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

        // Admin Routes untuk Blog/Article Management
        Route::prefix('editor')
            ->name('editor.')
            ->group(function () {
                Route::resource('articles', ArticleController::class);
                Route::resource('categories', CategoryController::class);
                Route::resource('tags', TagController::class);
            });
    });

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(
        function () {
            Route::get('/users', function () {
                return Inertia::render('editors/authority/user/index');
            })->name('users.index');
        }
    );


Route::middleware(['auth', 'verified', 'role:admin,author'])
    ->prefix('author')
    ->name('author.')
    ->group(
        function () {
            Route::get('/articles', function () {
                return Inertia::render('editors/blogs/authors/index');
            })->name('articles.index');
        }
    );


require __DIR__ . '/editors.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
