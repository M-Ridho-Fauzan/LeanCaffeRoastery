<?php

namespace App\Models;

use Illuminate\Support\Str;
use App\Traits\Articles\HasSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'product_name',
        'slug',
        'type',
        'price',
        'flavor_notes',
        'is_specialty',
    ];

    public const TYPES = ['Single Origin', 'House Blend', 'Microlot', 'Commercial'];

    /**
     * The "booted" method of the model.
     * DIBENARKAN: Logika slug sekarang menangani duplikasi.
     */
    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            $product->slug = self::generateUniqueSlug($product->product_name);
        });

        static::updating(function (Product $product) {
            if ($product->isDirty('product_name')) {
                $product->slug = self::generateUniqueSlug($product->product_name, $product->id);
            }
        });
    }

    /**
     * Helper function untuk membuat slug yang unik.
     */
    private static function generateUniqueSlug(string $name, int $exceptId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        // Loop sampai kita menemukan slug yang belum ada di database
        while (static::where('slug', $slug)->when($exceptId, fn($query) => $query->where('id', '!=', $exceptId))->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }


    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Relasi untuk mengambil satu gambar utama.
     */
    public function primaryImage(): HasOne // <--- Relasi HasOne ditambahkan di sini
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true)->orderBy('id', 'asc'); // Order by ID sebagai fallback jika ada 2 primary
    }

    /**
     * DIBENARKAN: Accessor `primary_image_url` (bukan `thumbnailUrl`) dioptimalkan.
     * Menggunakan relasi `primaryImage` yang sudah di-load.
     * Pastikan ProductResource Anda mengambil `primary_image_url` bukan `thumbnail_url`.
     *
     * @return Attribute
     */
    protected function primaryImageUrl(): Attribute // <--- Ubah nama accessor ini
    {
        return Attribute::make(
            get: function () {
                // Prioritaskan relasi 'primaryImage' jika sudah di-load
                if ($this->relationLoaded('primaryImage') && $this->primaryImage) {
                    return $this->primaryImage->image_url;
                }

                // Jika 'primaryImage' belum di-load, coba relasi 'images' jika sudah di-load
                if ($this->relationLoaded('images')) {
                    $image = $this->images->firstWhere('is_primary', true) ?? $this->images->first();
                    return $image?->image_url ?? null; // Return null jika tidak ada gambar sama sekali
                }

                // Fallback: Lakukan query jika tidak ada relasi yang di-load.
                // Ini akan menyebabkan N+1 jika tidak di-eager load.
                // Ini akan mengambil gambar yang primary, atau gambar pertama jika tidak ada primary.
                $image = $this->images()->where('is_primary', true)->first() ?? $this->images()->first();
                return $image?->image_url ?? null;
            }
        )->shouldCache(); // Cache hasilnya setelah diakses pertama kali per request.
    }

    // DISESUAIKAN: Mengikuti konvensi nama tabel pivot Laravel (singular, alphabetical)
    public function origins(): BelongsToMany
    {
        return $this->belongsToMany(Origin::class, 'product_origin');
    }

    public function processes(): BelongsToMany
    {
        return $this->belongsToMany(Process::class, 'product_process');
    }

    public function brewMethods(): BelongsToMany
    {
        return $this->belongsToMany(BrewMethod::class, 'brew_method_product');
    }
}
