<?php

namespace Database\Factories;

use App\Models\MenuTag;
use App\Models\MenuItem;
use App\Models\MenuRoastLevel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MenuItem>
 */
class MenuItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Menggunakan Faker untuk data dinamis
            'name' => ucwords(fake()->words(2, true)) . ' Blend', // Cth: "Voluptas Ducimus Blend"
            'description' => fake()->sentence(15), // Membuat kalimat panjang acak
            'price' => fake()->numberBetween(75000, 250000), // Harga acak antara 75rb - 250rb
            'category' => fake()->randomElement(['House Blend', 'Single Origin', 'Limited Edition']),
            'origin' => fake()->country(), // Nama negara acak
            'image_url' => 'https://placehold.co/400x400.png?text=' . urlencode(fake()->word()),

            // Mengambil relasi secara acak dari tabel yang sudah ada
            // Penting: Ini mengasumsikan seeder untuk MenuRoastLevel sudah berjalan
            'menu_roast_level_id' => MenuRoastLevel::inRandomOrder()->first()->id,
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        // afterCreating adalah hook yang berjalan SETELAH satu MenuItem dibuat.
        // Ini adalah tempat yang tepat untuk menangani relasi many-to-many.
        return $this->afterCreating(function (MenuItem $menuItem) {
            // Ambil 2 sampai 5 tags secara acak dari database
            $tags = MenuTag::inRandomOrder()->limit(fake()->numberBetween(2, 5))->get();

            // Pasang (attach) tags tersebut ke MenuItem yang baru saja dibuat
            $menuItem->tags()->attach($tags);
        });
    }
}
