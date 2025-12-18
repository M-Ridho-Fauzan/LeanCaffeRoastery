<?php

namespace App\Http\Controllers\Contens\Blogs\Editors;

use App\Models\Tag;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\Blogs\StoreTagRequest;
use App\Http\Requests\Blogs\UpdateTagRequest;
use App\Http\Resources\Blogs\Editors\TagResource;
use Diglactic\Breadcrumbs\Breadcrumbs;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Tag::class);

        $tags = Tag::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        Breadcrumbs::render('editor.tags.index');

        return Inertia::render('editors/authority/blogs/tags/index', [
            'tags' => TagResource::collection($tags),
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Tag::class);

        return Inertia::render('Admin/Tags/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTagRequest $request)
    {
        Tag::create($request->validated());

        // PERUBAHAN: Jika ini adalah permintaan XHR (Inertia), kembalikan respon Inertia/JSON sederhana.
        // Inertia secara default menganggap request POST/PUT/DELETE sebagai permintaan Inertia/AJAX.
        // if ($request->expectsJson() || $request->header('X-Inertia')) {
        //     // Mengembalikan TagResource dari tag yang baru dibuat
        //     return response()->json([
        //         'success' => 'Tag created successfully.',
        //         'tag' => new TagResource($tag),
        //     ], 201);
        // }

        return redirect()->route('editor.articles.index')
            ->with('success', 'Tag created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag)
    {
        Gate::authorize('view', $tag);

        return Inertia::render('Admin/Tags/Show', [
            'tag' => new TagResource($tag),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tag $tag)
    {
        Gate::authorize('update', $tag);

        return Inertia::render('Admin/Tags/Edit', [
            'tag' => new TagResource($tag),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTagRequest $request, Tag $tag)
    {
        $tag->update($request->validated());

        return redirect()->route('editor.tags.index')
            ->with('success', 'Tag updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag)
    {
        Gate::authorize('delete', $tag);

        $tag->delete();

        return redirect()->route('editor.tags.index')->with('success', 'Tag deleted successfully.');
    }
}
