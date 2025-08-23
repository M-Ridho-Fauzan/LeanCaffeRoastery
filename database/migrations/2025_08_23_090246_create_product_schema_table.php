<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Urutan pembuatan:
     * 1. Tabel master (products, origins, processes, brew_methods)
     * 2. Tabel pivot (yang memiliki foreign key)
     */
    public function up(): void
    {
        // 1. Tabel Master
        Schema::create('products', callback: function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->string('slug')->unique()->nullable();
            $table->string('image_url')->nullable();
            $table->enum('type', ['Single Origin', 'House Blend', 'Microlot', 'Commercial']);
            $table->unsignedInteger('price');
            $table->text('flavor_notes');
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

        // 2. Tabel Pivot
        Schema::create('product_origins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('origin_id')->constrained()->onDelete('cascade');
            $table->unique(['product_id', 'origin_id']); // Opsional: mencegah duplikasi
        });

        Schema::create('product_processes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('process_id')->constrained()->onDelete('cascade');
            $table->unique(['product_id', 'process_id']);
        });

        Schema::create('product_brew_method', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('brew_method_id')->constrained('brew_methods')->onDelete('cascade');
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
        Schema::dropIfExists('product_brew_method');
        Schema::dropIfExists('product_processes');
        Schema::dropIfExists('product_origins');
        Schema::dropIfExists('brew_methods');
        Schema::dropIfExists('processes');
        Schema::dropIfExists('origins');
        Schema::dropIfExists('products');
    }
};
