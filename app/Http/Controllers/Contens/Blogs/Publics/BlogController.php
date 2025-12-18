<?php

namespace App\Http\Controllers\Contens\Blogs\Publics;

use App\Models\Tag;
use Inertia\Inertia;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Blogs\Editors\TagResource;
use App\Http\Resources\Blogs\Editors\CategoryResource;
use App\Http\Resources\Blogs\Editors\ArticleDetailResource;
use App\Http\Resources\Blogs\Editors\ArticleSummaryResource;

class BlogController extends Controller
{
    /**
     * Display a listing of the published articles for the public blog.
     *
     * @param \Illuminate\Http\Request $request
     */
    public function index(Request $request)
    {
        $query = Article::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->with(['category', 'user', 'tags']); // Tambahkan eager load untuk tags

        // Handle search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $categorySlug));
        }

        if ($tagSlug = $request->input('tag')) {
            $query->whereHas('tags', fn($q) => $q->where('slug', $tagSlug));
        }

        $articles = $query->latest('published_at')
            ->paginate(10)
            ->withQueryString(); // Pertahankan query string untuk navigasi paginasi

        return Inertia::render('businesses/articles/index', [
            'articles' => ArticleSummaryResource::collection($articles),
            'filters' => $request->only(['search', 'category', 'tag']),
            'categories' => CategoryResource::collection(Category::all(['id', 'name', 'slug'])),
            'tags' => TagResource::collection(Tag::all(['id', 'name', 'slug'])),
        ]);
    }

    public function show(string $slug)
    {
        $article = Article::where('slug', $slug)
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->with(['user', 'category', 'tags'])
            ->firstOrFail();

        // Opsional: Tingkatkan view count
        $article->increment('views_count');

        return Inertia::render('businesses/articles/show', [
            'article' => new ArticleDetailResource($article),
        ]);
    }
}
