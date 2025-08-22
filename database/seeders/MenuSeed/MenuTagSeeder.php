<?php

namespace Database\Seeders\MenuSeed;

use App\Models\MenuTag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $flavorNotes = ['Chocolate', 'Caramel', 'Nutty', 'Fruity', 'Floral', 'Spicy'];
        $brewingMethods = ['Espresso', 'French Press', 'Pour Over', 'V60', 'Aeropress', 'Cold Brew'];

        foreach ($flavorNotes as $flavor) {
            MenuTag::firstOrCreate(
                ['name' => $flavor, 'type' => 'flavor_note']
            );
        }

        foreach ($brewingMethods as $method) {
            MenuTag::firstOrCreate(
                ['name' => $method, 'type' => 'brewing_method']
            );
        }
    }
}
