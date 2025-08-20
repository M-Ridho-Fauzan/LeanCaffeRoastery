<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'avatar_path',
        'name',
        'email',
        'password',
        'is_oauth',
        'email_verified_at',
        'must_set_password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'role',
        'is_oauth',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's avatar URL.
     *
     * @return \Illuminate\Database\Eloquent\Casts\Attribute
     */
    protected function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->avatar_path
                ? Storage::url($this->avatar_path)
                : 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=random&color=fff',
        );
    }

    /**
     * Summary of socialite
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne<Socialite, User>
     */
    public function socialite()
    {
        return $this->hasOne(Socialite::class);
    }

    /**
     * Summary of addresses
     * @return HasMany<UserAddress, User>
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(UserAddress::class);
    }
}
