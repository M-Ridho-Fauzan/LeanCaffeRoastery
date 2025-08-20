<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:admin,author'])
    ->prefix('author')
    ->name('author.')
    ->group(
        function () {
            Route::get('/articles', function () {
                return Inertia::render('author/index');
            })->name('articles.index');
        }
    );
