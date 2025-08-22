<?php

namespace App\Models;

use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MenuTag extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'type'];

    /**
     * Relasi ke MenuItem (satu tag bisa dimiliki banyak menu item)
     *
     * @return BelongsToMany<MenuItem, MenuTag, \Illuminate\Database\Eloquent\Relations\Pivot>
     */
    public function menuItems(): BelongsToMany
    {
        return $this->belongsToMany(MenuItem::class);
    }
}
