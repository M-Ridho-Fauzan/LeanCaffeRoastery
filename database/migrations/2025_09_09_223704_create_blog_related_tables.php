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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique()->index(); // Penting untuk SEO
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique()->index(); // Penting untuk SEO
            $table->timestamps();
        });

        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Penulis artikel
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null'); // Kategori artikel, bisa null
            $table->string('title');
            $table->string('slug')->unique()->index(); // URL unik untuk artikel
            $table->text('excerpt')->nullable(); // Ringkasan singkat/meta description
            $table->longText('content'); // Isi artikel, bisa berupa HTML dari Rich Text Editor
            $table->string('featured_image_url')->nullable(); // URL gambar utama
            $table->timestamp('published_at')->nullable(); // Tanggal publikasi (untuk penjadwalan/draft)
            $table->string('status')->default('draft'); // 'draft', 'published', 'archived'
            $table->integer('views_count')->default(0); // Jumlah tampilan
            $table->timestamps();
        });

        // 4. Tabel Pivot article_tag (many-to-many antara articles dan tags)
        Schema::create('article_tag', function (Blueprint $table) {
            $table->foreignId('article_id')->constrained('articles')->onDelete('cascade');
            $table->foreignId('tag_id')->constrained('tags')->onDelete('cascade');
            $table->primary(['article_id', 'tag_id']); // Memastikan kombinasi unik
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_tag');
        Schema::dropIfExists('articles');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('categories');
    }
};
