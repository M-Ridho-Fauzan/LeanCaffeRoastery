<?php

namespace App\Policies\Blogs;

use App\Models\Article;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ArticlePolicy
{
    // Admin bisa melakukan apa saja
    public function before(User $user, string $ability): Response
    {
        return $user->role === 'admin'
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): Response
    {
        return $user->role === 'author' || $user->role === 'admin'
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Article $article): Response
    {
        // Author bisa melihat artikelnya sendiri, admin bisa melihat semua
        return $user->role === 'author' && $user->id === $article->user_id
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->role === 'author' || $user->role === 'admin'
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Article $article): Response
    {
        // Author bisa mengupdate artikelnya sendiri
        return $user->role === 'author' && $user->id === $article->user_id
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Article $article): Response
    {
        // Author bisa menghapus artikelnya sendiri
        return $user->role === 'author' && $user->id === $article->user_id
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Article $article): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Article $article): bool
    {
        return false;
    }
}
