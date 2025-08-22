<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menu_roast_levels', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Cth: Light, Medium, Dark
            $table->timestamps();
        });

        Schema::create('menu_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // 'flavor_note' atau 'brewing_method'

            // Mencegah duplikasi nama dan tipe, cth: tidak ada 2 'Nutty' di flavor_note
            $table->unique(['name', 'type']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_attributes');
        Schema::dropIfExists('menu_tags');
        Schema::dropIfExists('menu_roast_levels');
    }
};
