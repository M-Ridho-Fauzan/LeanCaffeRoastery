<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    protected $model = Article::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(rand(5, 10));
        return [
            'user_id' => User::factory()->author(), // Ini akan membuat user baru dengan role 'author' jika dipanggil langsung
            'category_id' => Category::factory(), // Akan membuat category baru jika tidak ditentukan
            'title' => $title,
            // Tambahkan hash ke slug untuk memastikan keunikan jika title sama persis
            'slug' => Str::slug($title) . '-' . Str::random(5),
            'excerpt' => $this->faker->paragraph(rand(2, 4)),
            // Menggunakan HTML tag dasar untuk simulasi Rich Text Editor
            'content' => collect($this->faker->paragraphs(rand(5, 15)))
                ->map(fn($p) => "<p>$p</p>")
                ->implode(''),
            'featured_image_url' => $this->faker->imageUrl(640, 480, 'nature', true, 'Faker'), // Gambar placeholder
            'published_at' => $this->faker->optional(0.8)->dateTimeBetween('-1 year', 'now'), // 80% kemungkinan sudah published
            'status' => $this->faker->randomElement(['draft', 'published']),
            'views_count' => $this->faker->numberBetween(0, 5000),
        ];
    }
}
