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

/**
 *
 *|***********************************************|
 *|                                               |
 *| ############  DASHBOARD ROUTE  #############  |
 *|                                               |
 *|***********************************************|

 */

Breadcrumbs::for('dashboard', function (BreadcrumbGenerator $trail) {
    $trail->push('Dashboard', route('dashboard'));
});

Breadcrumbs::for('admin.users.index', function (BreadcrumbGenerator $trail) {
    $trail->parent('dashboard');
    $trail->push('Manage Users', route('admin.users.index'));
});

Breadcrumbs::for('admin.products.index', function (BreadcrumbGenerator $trail) {
    $trail->parent('dashboard');
    $trail->push('Manage Products', route('admin.products.index'));
});

Breadcrumbs::for('editor.articles.index', function (BreadcrumbGenerator $trail) {
    $trail->parent('dashboard');
    $trail->push('Manage Articles', route('editor.articles.index'));
});
