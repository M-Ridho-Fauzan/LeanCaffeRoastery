<?php

namespace App\Traits\Articles;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Secara otomatis menghasilkan dan memastikan keunikan slug untuk artikel, kategori, dan tag Anda
 */
trait HasSlug
{
    /**
     * Boot the trait.
     */
    protected static function bootHasSlug()
    {
        static::creating(function (Model $model) {
            if (empty($model->slug)) {
                $model->slug = static::generateUniqueSlug($model, $model->title ?? $model->name);
            }
        });

        static::updating(function (Model $model) {
            if ($model->isDirty('title') || $model->isDirty('name')) { // Jika judul/nama berubah
                $model->slug = static::generateUniqueSlug($model, $model->title ?? $model->name);
            }
        });
    }

    /**
     * Generate a unique slug for the model.
     *
     * @param Model $model
     * @param string $source
     * @return string
     */
    protected static function generateUniqueSlug(Model $model, string $source): string
    {
        $slug = Str::slug($source);
        $originalSlug = $slug;
        $i = 1;

        // Check for uniqueness in the database
        while (static::where('slug', $slug)
            ->where('id', '!=', $model->id) // Exclude current model when updating
            ->exists()
        ) {
            $slug = $originalSlug . '-' . $i++;
        }

        return $slug;
    }
}
