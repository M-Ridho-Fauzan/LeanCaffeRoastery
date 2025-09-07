<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Origin extends Model
{
    use HasFactory;

    protected $fillable = ['origin_name', 'region', 'country'];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_origin');
    }
}
