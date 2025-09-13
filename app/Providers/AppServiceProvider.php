<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\User;
use App\Models\Origin;
use App\Models\Process;
use App\Models\BrewMethod;
use App\Models\Category;
use App\Models\Tag;
use App\Policies\Blogs\TagPolicy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use App\Observers\FilterOptionsObserver;
use App\Policies\Blogs\ArticlePolicy;
use App\Policies\Blogs\CategoryPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

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

        // Definisikan rate limiter untuk API
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        Origin::observe(FilterOptionsObserver::class);
        Process::observe(FilterOptionsObserver::class);
        BrewMethod::observe(FilterOptionsObserver::class);

        // === Policies ===
        Gate::policy(Article::class, ArticlePolicy::class);
        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(Tag::class, TagPolicy::class);
    }
}
