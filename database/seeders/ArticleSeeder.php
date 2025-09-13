<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\User;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buat beberapa user dengan role yang berbeda
        // Contoh user admin
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // Ganti dengan password kuat di produksi
        ]);

        // Contoh user author
        User::factory()->author()->create([
            'name' => 'Author User',
            'email' => 'author@example.com',
            'password' => Hash::make('password'),
        ]);

        // Buat beberapa user author tambahan (misalnya 3 lagi)
        User::factory(3)->author()->create();

        // Buat beberapa user biasa
        User::factory(5)->create();

        // Ambil semua user yang ber-role 'author' untuk mengaitkan dengan artikel
        $authors = User::where('role', 'author')->get();

        // Jika tidak ada authors, buat setidaknya satu
        if ($authors->isEmpty()) {
            $authors = collect([User::factory()->author()->create()]);
        }


        // 2. Buat Kategori
        $categories = Category::factory(10)->create();

        // 3. Buat Tag
        $tags = Tag::factory(20)->create();

        // 4. Buat Artikel dan kaitkan dengan user 'author', kategori, dan tag
        Article::factory(50)
            ->recycle($authors) // Menggunakan hanya user dengan role 'author' secara bergantian
            ->create([
                // category_id akan ditentukan di each loop
            ])
            ->each(function (Article $article) use ($categories, $tags) {
                // Kaitkan setiap artikel dengan satu kategori acak
                if (is_null($article->category_id)) { // Jika factory belum menentukannya
                    $article->category_id = $categories->random()->id;
                    $article->save(); // Simpan perubahan category_id
                }

                // Kaitkan setiap artikel dengan 1 hingga 5 tag acak
                $article->tags()->attach(
                    $tags->random(rand(1, 5))->pluck('id')
                );
            });

        // 5. Contoh: Membuat satu artikel yang pasti published untuk memudahkan testing awal
        Article::factory()->create([
            'user_id' => $authors->first()->id, // Pastikan penulisnya adalah author
            'category_id' => $categories->first()->id,
            'title' => 'Sample Published Article for Testing',
            'slug' => 'sample-published-article-for-testing',
            'status' => 'published',
            'published_at' => now(),
            'content' => '<p>This is a test article content. It is definitely published and ready to be viewed.</p>',
            'excerpt' => 'A short excerpt for the sample published article.',
        ])->tags()->attach($tags->random(2)->pluck('id'));
    }
}
