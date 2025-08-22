<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/menu', function () {
    return Inertia::render('menu');
})->name('menu');

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

require __DIR__ . '/author.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
