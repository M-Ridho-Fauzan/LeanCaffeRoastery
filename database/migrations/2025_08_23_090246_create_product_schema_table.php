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
        // 1. Tabel Master
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->string('slug')->unique(); // DIBUAT TIDAK NULLABLE, KARENA WAJIB ADA
            $table->enum('type', ['Single Origin', 'House Blend', 'Microlot', 'Commercial']);
            $table->unsignedInteger('price');
            $table->text('flavor_notes');
            $table->integer('stock')->default(0);
            $table->boolean('status')->default(true);
            $table->boolean('is_specialty')->default(false);
            $table->timestamps();
        });

        Schema::create('origins', function (Blueprint $table) {
            $table->id();
            $table->string('origin_name');
            $table->string('region');
            $table->string('country');
            $table->timestamps();
        });

        Schema::create('processes', function (Blueprint $table) {
            $table->id();
            $table->string('process_name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('brew_methods', function (Blueprint $table) {
            $table->id();
            $table->string('brew_name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Tabel yang memiliki foreign key ke tabel master
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('image_url');
            $table->string('alt_text')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        // 2. Tabel Pivot
        Schema::create('product_origin', function (Blueprint $table) { // PENYESUAIAN NAMA: singular_singular
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('origin_id')->constrained()->onDelete('cascade');
            $table->unique(['product_id', 'origin_id']);
        });

        Schema::create('product_process', function (Blueprint $table) { // PENYESUAIAN NAMA: singular_singular
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('process_id')->constrained()->onDelete('cascade');
            $table->unique(['product_id', 'process_id']);
        });

        Schema::create('brew_method_product', function (Blueprint $table) { // PENYESUAIAN NAMA: singular_singular alphabetical
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('brew_method_id')->constrained()->onDelete('cascade'); // Tidak perlu nama tabel jika mengikuti konvensi
            $table->unique(['product_id', 'brew_method_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * Urutan penghapusan adalah kebalikan dari `up()`
     */
    public function down(): void
    {
        // DIBENARKAN: Urutan dibalik persis dari method up()
        Schema::dropIfExists('brew_method_product');
        Schema::dropIfExists('product_process');
        Schema::dropIfExists('product_origin');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('brew_methods');
        Schema::dropIfExists('processes');
        Schema::dropIfExists('origins');
        Schema::dropIfExists('products');
    }
};
