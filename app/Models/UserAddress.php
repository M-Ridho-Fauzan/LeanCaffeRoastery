<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserAddress extends Model
{
    use SoftDeletes; // Gunakan trait ini

    protected $fillable = [
        'user_id',
        'label',
        'recipient_name',
        'phone_number',
        'address_line1',
        'address_line2',
        'province',
        'city',
        'district',
        'postal_code',
        'is_primary',
        'latitude',
        'longitude'
    ];

    /**
     * Summary of user
     * @return BelongsTo<User, UserAddress>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
