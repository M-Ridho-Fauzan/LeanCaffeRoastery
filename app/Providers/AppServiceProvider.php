<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Gate untuk mengecek apakah user adalah admin
        Gate::define('is-admin', function (User $user) {
            return $user->role === 'admin';
        });

        // Gate untuk mengecek apakah user adalah author
        Gate::define('is-author', function (User $user) {
            return $user->role === 'author';
        });

        // Gate untuk mengecek apakah user adalah admin ATAU author
        Gate::define('is-content-manager', function (User $user) {
            return in_array($user->role, ['admin', 'author']);
        });
    }
}
