<?php


use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Diglactic\Breadcrumbs\Breadcrumbs;

use App\Http\Resources\Menus\Publics\ProductResource;

use App\Http\Controllers\Contens\Blogs\Editors\TagController;
use App\Http\Controllers\Contens\Blogs\Publics\BlogController;
use App\Http\Controllers\Contens\Blogs\Editors\ArticleController;
use App\Http\Controllers\Contens\Blogs\Editors\CategoryController;

Route::get('/', function () {
    Breadcrumbs::render('home');
    return Inertia::render('home');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/products', function () {
    return Inertia::render('businesses/products/index');
})->name('products.index');

Route::get('/products/{product:slug}', function (Product $product) {
    $product->load(['origins', 'processes', 'brewMethods', 'images', 'primaryImage']);

    return Inertia::render('businesses/products/show', [
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
            Breadcrumbs::render('dashboard');

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
                Breadcrumbs::render('admin.users.index');

                // $fullBreadcrumbTrail = \Diglactic\Breadcrumbs\Breadcrumbs::render('admin.users.index');
                // dd($fullBreadcrumbTrail);

                return Inertia::render('editors/authority/user/index');
            })->name('users.index');

            Route::get('products', function () {
                Breadcrumbs::render('admin.products.index');

                return Inertia::render('editors/products/index');
            })->name('products.index');
        }
    );


Route::middleware(['auth', 'verified', 'role:admin,author'])
    ->prefix('editor')
    ->name('editor.')
    ->group(
        function () {
            Route::get('/articles', function () {
                Breadcrumbs::render('editor.articles.index');

                return Inertia::render('editors/blogs/index');
            })->name('articles.index');
        }
    );


require __DIR__ . '/editors.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
