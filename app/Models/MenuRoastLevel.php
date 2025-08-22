<?php

namespace App\Models;

use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MenuRoastLevel extends Model
{
    use HasFactory;
    protected $fillable = ['name'];

    /**
     * Relasi ke MenuItem (satu roast level bisa dimiliki banyak menu item)
     *
     * @return HasMany<MenuItem, MenuRoastLevel>
     */
    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }
}
