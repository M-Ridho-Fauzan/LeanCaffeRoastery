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
            ->with(['category', 'user']); // Eager load category dan user untuk summary

        // Filter berdasarkan pencarian
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        // Filter berdasarkan kategori
        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $categorySlug));
        }

        // Filter berdasarkan tag
        if ($tagSlug = $request->input('tag')) {
            $query->whereHas('tags', fn($q) => $q->where('slug', $tagSlug));
        }

        $articles = $query->latest('published_at') // Urutkan berdasarkan tanggal publikasi terbaru
            ->paginate(10) // Paginasi 10 artikel per halaman
            ->withQueryString(); // Pertahankan query string untuk navigasi paginasi

        return Inertia::render('articles/index', [
            'articles' => ArticleSummaryResource::collection($articles), // Gunakan ArticleSummaryResource
            'filters' => $request->only(['search', 'category', 'tag']), // Kirim filter ke frontend
            'categories' => CategoryResource::collection(Category::all(['id', 'name', 'slug'])), // Semua kategori untuk filter
            'tags' => TagResource::collection(Tag::all(['id', 'name', 'slug'])), // Semua tag untuk filter
        ]);
    }

    public function show(string $slug)
    {
        $article = Article::where('slug', $slug)
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->with(['user', 'category', 'tags']) // Eager load semua relasi untuk detail
            ->firstOrFail(); // Akan throw 404 jika tidak ditemukan atau tidak memenuhi kriteria

        // Opsional: Tingkatkan view count
        $article->increment('views_count');

        return Inertia::render('Blog/Show', [
            'article' => new ArticleDetailResource($article), // Gunakan ArticleDetailResource
        ]);
    }
}
