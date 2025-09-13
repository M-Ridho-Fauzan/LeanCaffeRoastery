<?php

use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbGenerator;

Breadcrumbs::for('home', function (BreadcrumbGenerator $trail) {
    $trail->push('Home', route('home'));
});

Breadcrumbs::for('about', function (BreadcrumbGenerator $trail) {
    $trail->push('About', route('about'));
});

Breadcrumbs::for('menu', function (BreadcrumbGenerator $trail) {
    $trail->push('Menu', route('menu'));
});

Breadcrumbs::for('location', function (BreadcrumbGenerator $trail) {
    $trail->push('Location', route('location'));
});

Breadcrumbs::for('dashboard', function (BreadcrumbGenerator $trail) {
    $trail->push('Dashboard', route('dashboard'));
});

// Dashboard > Manage Users
Breadcrumbs::for('admin.users.index', function (BreadcrumbGenerator $trail) {
    $trail->parent('dashboard');
    $trail->push('Manage Users', route('admin.users.index'));
});

// Contoh untuk Manage Products
// Breadcrumbs::for('admin.products.index', function (BreadcrumbGenerator $trail) {
//     $trail->parent('dashboard');
//     $trail->push('Manage Products', route('admin.products.index'));
// });
