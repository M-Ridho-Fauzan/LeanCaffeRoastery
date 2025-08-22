<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;
use Database\Seeders\MenuSeed\MenuTagSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Seeders\MenuSeed\MenuItemSeeder;
use Database\Seeders\MenuSeed\MenuRoastLevelSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Author User',
            'email' => 'author@gmail.com',
            'role' => 'author',
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'role' => 'user',
        ]);

        $this->call([
            MenuRoastLevelSeeder::class,      // Harus pertama
            MenuTagSeeder::class,              // Harus kedua
            MenuItemSeeder::class,         // Terakhir, karena butuh data dari atas
        ]);

        MenuItem::factory()->count(20)->create();
    }
}
