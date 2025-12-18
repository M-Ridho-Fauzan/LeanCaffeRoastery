<?php

namespace App\Http\Controllers\Contens\Blogs\Editors;

use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\Blogs\StoreCategoryRequest;
use App\Http\Requests\Blogs\UpdateCategoryRequest;
use App\Http\Resources\Blogs\Editors\CategoryResource;
use Diglactic\Breadcrumbs\Breadcrumbs;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Category::class);

        // Untuk menampilkan daftar kategori di halaman admin
        $categories = Category::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString(); // Agar query string filter/search tetap ada di paginasi

        Breadcrumbs::render('editor.categories.index');

        return Inertia::render('editors/authority/blogs/categories/index', [
            'categories' => CategoryResource::collection($categories),
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Category::class);

        return Inertia::render('Admin/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        Category::create($request->validated());

        // Jika ini adalah permintaan XHR (Inertia), kembalikan respon Inertia/JSON sederhana.
        // if ($request->expectsJson() || $request->header('X-Inertia')) {
        //     // Mengembalikan CategoryResource dari category yang baru dibuat
        //     return response()->json([
        //         'success' => 'Category created successfully.',
        //         'category' => new CategoryResource($category),
        //     ], 201);
        // }

        return redirect()->route('editor.articles.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        Gate::authorize('view', $category);

        return Inertia::render('Admin/Categories/Show', [
            'category' => $category,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        Gate::authorize('update', $category);

        return Inertia::render('Admin/Categories/Edit', [
            'category' => new CategoryResource($category),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return redirect()->route('editor.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        Gate::authorize('delete', $category);

        $category->delete();

        return redirect()->route('editor.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
