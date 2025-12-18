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

        // $spaceRelace = str_replace(' ', '+', $title);

        $formatted = Str::of($title)
            ->words(3, ' ...') // Potong jadi 3 kata
            ->replace(' ', '+') // Ubah spasi jadi +
            ->value();

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
            'featured_image_url' => 'https://placehold.co/640x480/5c5e5e/transparent?text=' . $formatted,
            'published_at' => $this->faker->optional(0.8)->dateTimeBetween('-1 year', 'now'), // 80% kemungkinan sudah published
            'status' => $this->faker->randomElement(['draft', 'published', 'archived']),
            'views_count' => $this->faker->numberBetween(0, 5000),
        ];
    }
}
