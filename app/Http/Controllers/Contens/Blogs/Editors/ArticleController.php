<?php

namespace App\Http\Controllers\Contens\Blogs\Editors;

use App\Models\Tag;
use Inertia\Inertia;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Blogs\StoreArticleRequest;
use App\Http\Requests\Blogs\UpdateArticleRequest;
use App\Http\Resources\Blogs\Editors\TagResource;
use App\Http\Resources\Blogs\Editors\CategoryResource;
use App\Http\Resources\Blogs\Editors\ArticleDetailResource;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Article::class);
        // Eager load category dan user untuk ditampilkan di tabel
        $articles = Article::query()
            ->with(['category', 'user'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->when($request->input('category'), function ($query, $categorySlug) {
                $query->whereHas('category', fn($q) => $q->where('slug', $categorySlug));
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('editors/blogs/publics/index', [
            // Gunakan ArticleDetailResource::collection() untuk daftar artikel admin
            'articles' => ArticleDetailResource::collection($articles),
            'filters' => $request->only(['search', 'category', 'status']),
            // Menggunakan CategoryResource::collection() untuk daftar kategori agar konsisten
            'categories' => CategoryResource::collection(Category::all()),
            'statuses' => ['draft', 'published', 'archived'],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Article::class);

        return Inertia::render('Admin/Articles/Create', [
            'categories' => CategoryResource::collection(Category::all()), // Gunakan Resource
            'tags' => TagResource::collection(Tag::all()), // Gunakan Resource
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticleRequest $request)
    {
        $validatedData = $request->validated();

        $imagePath = null;
        if ($request->hasFile('featured_image')) {
            $imagePath = $request->file('featured_image')->store('articles', 'public'); // Simpan di storage/app/public/articles
        }

        $article = Article::create([
            'user_id' => Auth(),
            'category_id' => $validatedData['category_id'] ?? null, // Default null jika tidak ada
            'title' => $validatedData['title'],
            'excerpt' => $validatedData['excerpt'] ?? null, // Default null jika tidak ada
            'content' => $validatedData['content'],
            'featured_image_url' => $imagePath,
            'published_at' => $validatedData['published_at'] ?? null, // Default null jika tidak ada
            'status' => $validatedData['status'],
        ]);

        if (isset($validatedData['tags'])) {
            $article->tags()->attach($validatedData['tags']); // Attach tags
        }

        return redirect()->route('admin.articles.index')->with('success', 'Article created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        Gate::authorize('view', $article);

        // Eager load relasi untuk detail tampilan
        $article->load(['user', 'category', 'tags']);

        return Inertia::render('Admin/Articles/Show', [
            'article' => new ArticleDetailResource($article), // Gunakan ArticleDetailResource
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        Gate::authorize('update', $article);

        // Eager load relasi untuk mengisi form edit
        $article->load(['category', 'tags']);

        return Inertia::render('Admin/Articles/Edit', [
            'article' => new ArticleDetailResource($article), // Gunakan ArticleDetailResource untuk data artikel yang diedit
            'categories' => CategoryResource::collection(Category::all()), // Gunakan Resource
            'tags' => TagResource::collection(Tag::all()), // Gunakan Resource
            'selectedTags' => $article->tags->pluck('id')->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticleRequest $request, Article $article)
    {
        $validatedData = $request->validated(); // Ambil data yang sudah divalidasi

        $imagePath = $article->featured_image_url;
        if ($request->hasFile('featured_image')) {
            // Hapus gambar lama jika ada
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('featured_image')->store('articles', 'public');
        } elseif ($request->boolean('remove_featured_image')) { // Jika ada checkbox untuk menghapus gambar
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = null;
        }

        $article->update([
            'category_id' => $validatedData['category_id'] ?? null,
            'title' => $validatedData['title'],
            'excerpt' => $validatedData['excerpt'] ?? null,
            'content' => $validatedData['content'],
            'featured_image_url' => $imagePath,
            'published_at' => $validatedData['published_at'] ?? null,
            'status' => $validatedData['status'],
        ]);

        if (isset($validatedData['tags'])) {
            $article->tags()->sync($validatedData['tags']); // Sync tags (menambah/menghapus)
        } else {
            $article->tags()->detach(); // Hapus semua tags jika tidak ada yang dikirim
        }

        return redirect()->route('admin.articles.index')->with('success', 'Article updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        Gate::authorize('delete', $article);

        if ($article->featured_image_url && Storage::disk('public')->exists($article->featured_image_url)) {
            Storage::disk('public')->delete($article->featured_image_url);
        }

        $article->delete();

        return redirect()->route('admin.articles.index')->with('success', 'Article deleted successfully.');
    }
}
