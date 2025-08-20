<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(
        function () {
            Route::get('/users', function () {
                return Inertia::render('admin/index');
            })->name('users.index');
        }
    );
