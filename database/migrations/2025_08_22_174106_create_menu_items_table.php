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
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama kopi, cth: "Arabica Gayo"
            $table->text('description'); // Deskripsi singkat
            $table->decimal('price', 10, 2); // Harga, cth: 50000.00
            $table->string('image_url')->nullable(); // URL gambar produk (bisa null)
            $table->string('category')->nullable(); // Cth: House Blend, Single Origin
            $table->string('origin')->nullable(); // Cth: Brazil & Colombia

            // Relasi ke tabel yang dibuat di migrasi sebelumnya
            $table->foreignId('menu_roast_level_id')
                ->nullable()
                ->constrained('menu_roast_levels');

            $table->timestamps();
        });

        // Nama tabel adalah gabungan nama model dalam urutan alfabet dan bentuk tunggal
        Schema::create('menu_item_menu_tag', function (Blueprint $table) {
            $table->primary(['menu_item_id', 'menu_tag_id']); // Composite primary key

            $table->foreignId('menu_item_id')
                ->constrained('menu_items')
                ->onDelete('cascade');

            $table->foreignId('menu_tag_id')
                ->constrained('menu_tags')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_item_tag');
        Schema::dropIfExists('menu_items');
    }
};
