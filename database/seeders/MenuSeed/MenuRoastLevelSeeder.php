<?php

namespace Database\Seeders\MenuSeed;

use App\Models\MenuRoastLevel;
use Illuminate\Database\Seeder;

class MenuRoastLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = ['Light', 'Medium', 'Dark'];

        foreach ($levels as $level) {
            MenuRoastLevel::firstOrCreate(['name' => $level]);
        }
    }
}
