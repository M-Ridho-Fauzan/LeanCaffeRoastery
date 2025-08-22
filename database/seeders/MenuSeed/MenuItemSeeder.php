<?php

namespace Database\Seeders\MenuSeed;

use App\Models\MenuTag;
use App\Models\MenuItem;
use App\Models\MenuRoastLevel;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ambil semua data atribut yang dibutuhkan terlebih dahulu
        // Menggunakan keyBy('name') membuat pencarian menjadi sangat mudah dan efisien
        $roastLevels = MenuRoastLevel::all()->keyBy('name');
        $tags = MenuTag::all()->keyBy('name');

        // 2. Definisikan data produk kopi Anda
        $menuData = [
            [
                'name' => 'The Sagara 1999',
                'description' => 'Our flagship blend with rich chocolate and caramel notes.',
                'price' => 120000,
                'category' => 'House Blend',
                'origin' => 'Brazil & Colombia',
                'image_url' => 'https://placehold.co/400x400.png?text=Sagara+1999',
                'roast_level' => 'Medium', // Nama roast level
                'flavor_notes' => ['Chocolate', 'Caramel', 'Nutty'], // Nama-nama tag
                'brewing_methods' => ['Espresso', 'French Press', 'Pour Over'], // Nama-nama tag
            ],
            [
                'name' => 'Gayo Wine Coffee',
                'description' => 'Unique single origin from Aceh with a distinct fruity and winey flavor.',
                'price' => 155000,
                'category' => 'Single Origin',
                'origin' => 'Aceh, Indonesia',
                'image_url' => 'https://placehold.co/400x400.png?text=Gayo+Wine',
                'roast_level' => 'Light',
                'flavor_notes' => ['Fruity', 'Floral'],
                'brewing_methods' => ['V60', 'Pour Over', 'Aeropress'],
            ],
            [
                'name' => 'Sumatra Dark Roast',
                'description' => 'A bold and intense coffee with spicy notes, perfect for a strong morning kick.',
                'price' => 95000,
                'category' => 'Single Origin',
                'origin' => 'Sumatra, Indonesia',
                'image_url' => 'https://placehold.co/400x400.png?text=Sumatra+Dark',
                'roast_level' => 'Dark',
                'flavor_notes' => ['Spicy', 'Chocolate'],
                'brewing_methods' => ['French Press', 'Espresso'],
            ],
        ];

        // 3. Looping data dan masukkan ke database
        foreach ($menuData as $data) {
            // Buat menu item utama
            $menuItem = MenuItem::create([
                'name' => $data['name'],
                'description' => $data['description'],
                'price' => $data['price'],
                'category' => $data['category'],
                'origin' => $data['origin'],
                'image_url' => $data['image_url'],
                'menu_roast_level_id' => $roastLevels[$data['roast_level']]->id, // Ambil ID dari koleksi
            ]);

            // Ambil ID dari semua tag yang relevan
            $flavorNoteIds = collect($data['flavor_notes'])->map(fn($name) => $tags[$name]->id);
            $brewingMethodIds = collect($data['brewing_methods'])->map(fn($name) => $tags[$name]->id);

            // Gabungkan semua ID tag
            $allTagIds = $flavorNoteIds->merge($brewingMethodIds);

            // 4. Attach relasi Many-to-Many ke tabel pivot
            $menuItem->tags()->attach($allTagIds);
        }
    }
}
