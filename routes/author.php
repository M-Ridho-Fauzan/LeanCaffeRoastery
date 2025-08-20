<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:admin,author'])
    ->prefix('author')
    ->name('author.')
    ->group(
        function () {
            Route::get('/posts', function () {
                return Inertia::render('author/posts/index');
            })->name('posts.index');
        }
    );
