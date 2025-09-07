<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Process extends Model
{
    use HasFactory;
    protected $guarded = [];

    // Nama tabel 'processes' adalah jamak dari 'process', perlu didefinisikan
    protected $table = 'processes';

    protected $fillable = ['process_name', 'description'];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_process');
    }
}
