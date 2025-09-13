<?php

namespace App\Models;

use App\Policies\Blogs\ArticlePolicy;
use Illuminate\Support\Str;
use App\Traits\Articles\HasSlug;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[UsePolicy(ArticlePolicy::class)]
class Article extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image_url',
        'published_at',
        'status',
        'views_count',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    // Otomatis membuat slug saat menyimpan jika belum ada
    protected static function booted()
    {
        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
        });

        static::updating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
        });
    }

    /**
     * Get the user that wrote the article.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that owns the article.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the tags associated with the article.
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
