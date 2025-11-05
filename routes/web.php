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
// Tidak perlu RobertBoes\InertiaBreadcrumbs\Breadcrumb di sini, karena Diglactic\Breadcrumbs sudah cukup
// use RobertBoes\InertiaBreadcrumbs\Breadcrumb;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// =========================================================================
// Rute Publik (Akses Tanpa Autentikasi)
// =========================================================================

// Rute Halaman Utama
Route::get('/', function () {
    Breadcrumbs::render('home');
    return Inertia::render('home');
})->name('home');

// Rute Halaman About
Route::get('/about', function () {
    // Breadcrumbs::render('about'); // Jika Anda punya breadcrumb untuk about
    return Inertia::render('about');
})->name('about');

// Rute Produk Publik
Route::prefix('products')->name('products.')->group(function () {
    Route::get('/', function () {
        // Breadcrumbs::render('products.index'); // Jika Anda punya breadcrumb untuk products
        return Inertia::render('businesses/products/index');
    })->name('index');

    Route::get('/{product:slug}', function (Product $product) {
        $product->load(['origins', 'processes', 'brewMethods', 'images', 'primaryImage']);
        // Breadcrumbs::render('products.show', $product); // Jika Anda punya breadcrumb untuk product detail
        return Inertia::render('businesses/products/show', [
            'product' => new ProductResource($product),
        ]);
    })->name('show');
});


// Rute Blog Publik
Route::prefix('blog')->name('blog.')->group(function () {
    Route::get('/', [BlogController::class, 'index'])->name('index');
    Route::get('/{slug}', [BlogController::class, 'show'])->name('show');
});

// Rute Halaman Lainnya (Location, Kebijakan Privasi)
Route::get('/location', function () {
    // Breadcrumbs::render('location');
    return Inertia::render('location');
})->name('location');

Route::get('/kebijakan-privasi', function () {
    // Breadcrumbs::render('privacy_policy');
    return Inertia::render('legal_authority/privacy');
})->name('privacy_policy');


// =========================================================================
// Rute Terotentikasi & Terverifikasi
// =========================================================================
Route::middleware(['auth', 'verified'])
    ->group(function () {
        // Rute Dashboard
        Route::get('dashboard', function () {
            Breadcrumbs::render('dashboard');
            return Inertia::render('dashboard');
        })->name('dashboard');

        // Rute Profil
        // Asumsi ini diambil dari default Breeze/Jetstream
        // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


        // =========================================================================
        // Rute Editor (Akses Admin DAN Author)
        // Fokus pada pengelolaan konten blog: Artikel, Kategori, Tag
        // =========================================================================
        Route::prefix('editor')
            ->name('editor.')
            ->middleware('role:admin,author') // Hanya Admin atau Author yang bisa akses ini
            ->group(function () {
                // Articles Management (CRUD)
                Route::resource('articles', ArticleController::class);

                // Categories Management (CRUD)
                Route::resource('categories', CategoryController::class);

                // Tags Management (CRUD)
                Route::resource('tags', TagController::class);

                // Catatan: Jika Anda sebelumnya memiliki Route::get('/articles', ...)
                // dengan nama 'editor.articles.index', itu sekarang sudah tercakup oleh
                // Route::resource('articles', ...) yang membuat rute 'editor.articles.index'
                // secara otomatis. Jadi, blok kode itu dihapus untuk menghindari duplikasi.
                // Jika Anda perlu breadcrumbs di sana, itu ditangani di dalam ArticleController@index.
            });

        // =========================================================================
        // Rute Admin (Akses HANYA Admin)
        // Fokus pada pengelolaan sistem secara keseluruhan: User, Products (jika ini admin produk), dll.
        // =========================================================================
        Route::prefix('admin')
            ->name('admin.')
            ->middleware('role:admin') // Hanya Admin yang bisa akses ini
            ->group(function () {
                // User Management
                Route::get('/users', function () {
                    Breadcrumbs::render('admin.users.index');
                    return Inertia::render('editors/authority/user/index');
                })->name('users.index');

                // Product Management (jika 'products' di sini adalah untuk admin mengelola,
                // berbeda dengan products publik di atas)
                Route::get('products', function () {
                    Breadcrumbs::render('admin.products.index');
                    return Inertia::render('editors/products/index');
                })->name('products.index');

                // Catatan: Route::resource('categories', ...) dan Route::resource('tags', ...)
                // yang sebelumnya ada di grup 'admin' telah DIPINDAHKAN ke grup 'editor'
                // agar konsisten dengan akses 'admin,author' untuk manajemen blog.
                // Jika Anda punya fitur admin-only untuk kategori/tag yang berbeda,
                // baru tambahkan rute khusus di sini.
            });

        // Route::get('product/ordering', function () {
        //     return Inertia::render('ordering/payments/ordering');
        // })->name('product.payments.ordering');

        Route::get('product/charts', function () {
            return Inertia::render('ordering/payments/charts');
        })->name('product.payments.charts');
    });

// =========================================================================
// File Rute Eksternal
// =========================================================================
// Pastikan file-file ini tidak menduplikasi rute yang sudah didefinisikan di atas
require __DIR__ . '/editors.php'; // Mungkin berisi rute yang spesifik untuk editor
require __DIR__ . '/settings.php'; // Mungkin berisi rute pengaturan umum
require __DIR__ . '/auth.php'; // Rute autentikasi (login, register, dll.)



