<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MenuItem extends Model
{
    use HasFactory;

    // Tambahkan field baru ke $fillable
    protected $fillable = [
        'name',
        'description',
        'price',
        'image_url',
        'category',
        'origin',
        'menu_roast_level_id',
    ];

    /**
     * Relasi ke RoastLevel (satu menu item memiliki satu roast level)
     *
     * @return BelongsTo<MenuRoastLevel, MenuItem>
     */
    public function roastLevel(): BelongsTo
    {
        return $this->belongsTo(MenuRoastLevel::class, 'menu_roast_level_id');
    }

    /**
     * Relasi ke Tag (satu menu item bisa punya banyak tag)
     *
     * @return BelongsToMany<MenuTag, MenuItem, \Illuminate\Database\Eloquent\Relations\Pivot>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(MenuTag::class);
    }

    /**
     * Helper relationship untuk mempermudah pengambilan data
     *
     * @return BelongsToMany<MenuTag, MenuItem, \Illuminate\Database\Eloquent\Relations\Pivot>
     */
    public function flavorNotes(): BelongsToMany
    {
        return $this->belongsToMany(MenuTag::class)
            ->where('type', 'flavor_note');
    }

    public function brewingMethods(): BelongsToMany
    {
        return $this->belongsToMany(MenuTag::class)
            ->where('type', 'brewing_method');
    }
}
