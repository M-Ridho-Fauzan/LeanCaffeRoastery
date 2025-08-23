<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_name',
        'type',
        'price',
        'flavor_notes',
        'is_specialty'
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            $product->slug = Str::slug($product->product_name);
        });

        static::updating(function (Product $product) {
            if ($product->isDirty('product_name')) {
                $product->slug = Str::slug($product->product_name);
            }
        });
    }

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug'; // <-- Beritahu Laravel untuk menggunakan kolom 'slug'
    }

    /**
     * Summary of imageUrl
     * @return Attribute
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ?:
                'https://placehold.co/600x400/EEE/31343C?text=Lean+Coffee',
        );
    }

    public function origins(): BelongsToMany
    {
        return $this->belongsToMany(Origin::class, 'product_origins');
    }

    public function processes(): BelongsToMany
    {
        return $this->belongsToMany(Process::class, 'product_processes');
    }

    public function brewMethods(): BelongsToMany
    {
        return $this->belongsToMany(BrewMethod::class, 'product_brew_method');
    }
}
