<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'avatar' => '/public/img_asset/',
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'gender' => fake()->randomElement(['pria', 'wanita', 'lainnya']),
            'role' => 'user',
            'is_oauth' => false,
            'birthday' => fake()->date(),
            'phone' => fake()->phoneNumber(),
            'phone_verified_at' => now(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user has a specific role.
     */
    public function withRole(string $role): static
    {
        return $this->state(fn(array $attributes) => [
            'role' => $role,
        ]);
    }

    /**
     * Indicate that the user is an author.
     */
    public function author(): static
    {
        return $this->withRole('author');
    }

    /**
     * Indicate that the user is an admin.
     */
    public function admin(): static
    {
        return $this->withRole('admin');
    }
}
