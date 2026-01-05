<?php

namespace Database\Seeders;

use App\Models\BrewMethod;
use App\Models\Origin;
use App\Models\Process;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str; // DITAMBAHKAN: Untuk membuat slug

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- 1. DEKLARASI DATA MASTER ---
        // Menggunakan createMany untuk efisiensi dan kebersihan kode.

        $originsData = [
            // Indonesia
            ['origin_name' => 'Gayo', 'region' => 'Aceh', 'country' => 'Indonesia'],
            ['origin_name' => 'Kintamani', 'region' => 'Bali', 'country' => 'Indonesia'],
            ['origin_name' => 'Toraja', 'region' => 'Sulawesi', 'country' => 'Indonesia'],
            // Afrika
            ['origin_name' => 'Sidamo', 'region' => 'Sidamo', 'country' => 'Ethiopia'],
            ['origin_name' => 'Yirgacheffe', 'region' => 'Yirgacheffe', 'country' => 'Ethiopia'],
            ['origin_name' => 'Kenya AA', 'region' => 'Nyeri', 'country' => 'Kenya'],
            // Amerika
            ['origin_name' => 'Antigua', 'region' => 'Antigua', 'country' => 'Guatemala'],
            ['origin_name' => 'Colombia Supremo', 'region' => 'Huila', 'country' => 'Colombia'],
            ['origin_name' => 'Brazil Cerrado', 'region' => 'Minas Gerais', 'country' => 'Brazil'],
        ];

        $processesData = [
            ['process_name' => 'Full Washed', 'description' => 'Biji kopi dicuci bersih sebelum dijemur.'],
            ['process_name' => 'Natural', 'description' => 'Biji kopi dijemur bersama dengan buahnya.'],
            ['process_name' => 'Honey', 'description' => 'Biji kopi dijemur dengan sebagian lendir buah masih menempel.'],
            ['process_name' => 'Anaerobic', 'description' => 'Proses fermentasi tanpa oksigen untuk rasa yang unik.'],
            ['process_name' => 'Giling Basah', 'description' => 'Metode khas Indonesia (Wet-Hulled).'],
        ];

        $brewMethodsData = [
            ['brew_name' => 'Espresso Based', 'description' => 'Ekstraksi dengan tekanan tinggi.'],
            ['brew_name' => 'Filter Series', 'description' => 'Metode seduh manual pour-over.']
        ];

        // --- 2. BUAT DATA MASTER DI DATABASE ---
        Origin::query()->insert($originsData);
        Process::query()->insert($processesData);
        BrewMethod::query()->insert($brewMethodsData);

        // Ambil kembali data yang sudah dibuat untuk mendapatkan ID-nya
        $origins = Origin::all();
        $processes = Process::all();
        $brewMethods = BrewMethod::all();

        $image1 = '';
        $image2 = '';
        $image3 = '';

        // $status = (bool) random_int(0, 1);
        // $status = fake()->boolean(60);

        // --- 3. DEKLARASI DATA PRODUK ---
        $productsData = [
            [
                'product_name' => 'Aceh Gayo Natural',
                'type' => 'Single Origin',
                'price' => 120000,
                'is_specialty' => true,
                // 'status' => $status,
                'flavor_notes' => 'Fruity, Winey, Chocolate, Brown Sugar',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Gayo'],
                'processes' => ['Natural'],
                'brew_methods' => ['Filter Series', 'Filter Series', 'Espresso Based'],
            ],
            [
                'product_name' => 'Ethiopia Sidamo Washed',
                'type' => 'Single Origin',
                'price' => 150000,
                'is_specialty' => true,
                // 'status' => $status,
                'flavor_notes' => 'Floral, Lemon, Black Tea, Jasmine',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Sidamo'],
                'processes' => ['Full Washed'],
                'brew_methods' => ['Filter Series', 'Espresso Based'],
            ],
            [
                'product_name' => 'Lean Coffee House Blend',
                'type' => 'House Blend',
                'price' => 95000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Balanced, Nutty, Caramel, Low Acidity',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Gayo', 'Brazil Cerrado'],
                'processes' => ['Full Washed'],
                'brew_methods' => ['Espresso Based', 'Filter Series', 'Espresso Based'],
            ],
            [
                'product_name' => 'Guatemala Antigua Honey Process',
                'type' => 'Microlot',
                'price' => 135000,
                'is_specialty' => true,
                // 'status' => $status,
                'flavor_notes' => 'Sweet, Orange Peel, Maple Syrup, Clean Finish',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Antigua'],
                'processes' => ['Honey'],
                'brew_methods' => ['Filter Series', 'Filter Series'],
            ],
            [
                'product_name' => 'Bali Kintamani Natural',
                'type' => 'Single Origin',
                'price' => 115000,
                'is_specialty' => true,
                // 'status' => $status,
                'flavor_notes' => 'Citrus, Orange, Tamarind, Herbal',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Kintamani'],
                'processes' => ['Natural'],
                'brew_methods' => ['Filter Series', 'Filter Series'],
            ],
            [
                'product_name' => 'Kenya AA Washed',
                'type' => 'Single Origin',
                'price' => 165000,
                'is_specialty' => true,
                // 'status' => $status,
                'flavor_notes' => 'Blackcurrant, Tomato, Bright Acidity, Juicy',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Kenya AA'],
                'processes' => ['Full Washed'],
                'brew_methods' => ['Filter Series', 'Espresso Based'],
            ],
            [
                'product_name' => 'Colombia Supremo Anaerobic',
                'type' => 'Microlot',
                'price' => 180000,
                'is_specialty' => true,
                // 'status' => $status,
                'flavor_notes' => 'Cinnamon, Tropical Fruit, Winey, Complex',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo'],
                'processes' => ['Anaerobic'],
                'brew_methods' => ['Filter Series', 'Filter Series'],
            ],
            [
                'product_name' => 'Brazil Cerrado Espresso Based Roast',
                'type' => 'Commercial',
                'price' => 85000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Dark Chocolate, Roasted Nuts, Full Body',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based', 'Filter Series'],
            ],
            [
                'product_name' => 'Sumatra Toraja Giling Basah',
                'type' => 'Single Origin',
                'price' => 110000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Earthy, Spicy, Cedar, Bold Body',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Toraja'],
                'processes' => ['Giling Basah'],
                'brew_methods' => ['Filter Series', 'Filter Series'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Espresso Based Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                // 'status' => $status,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'images' => [
                    ['image_url' => $image1, 'is_primary' => true],
                    ['image_url' => $image2],
                    ['image_url' => $image3],
                ],
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
        ];


        // --- 4. LOOP DAN BUAT PRODUK BESERTA RELASINYA ---
        foreach ($productsData as $productData) {
            $stock = random_int(0, 100);

            $product = Product::create([
                'product_name' => $productData['product_name'],
                'slug' => Str::slug($productData['product_name']), // INI YANG DITAMBAHKAN
                'type' => $productData['type'],
                'price' => $productData['price'],
                'flavor_notes' => $productData['flavor_notes'],
                'is_specialty' => $productData['is_specialty'],
                'stock' => $stock,
                'status' => $stock > 0,
            ]);

            // Buat relasi gambar
            if (!empty($productData['images'])) {
                foreach ($productData['images'] as $imageData) {
                    $product->images()->create([
                        'image_url' => $imageData['image_url'],
                        // DIBENARKAN: Hapus key 'product' yang tidak perlu
                        'alt_text' => 'Image of ' . $productData['product_name'],
                        'is_primary' => $imageData['is_primary'] ?? false,
                    ]);
                }
            }


            // Ambil ID dari relasi berdasarkan nama
            $originIds = $origins->whereIn('origin_name', $productData['origins'])->pluck('id');
            $processIds = $processes->whereIn('process_name', $productData['processes'])->pluck('id');
            $brewMethodIds = $brewMethods->whereIn('brew_name', $productData['brew_methods'])->pluck('id');

            // Hubungkan relasi many-to-many
            $product->origins()->attach($originIds);
            $product->processes()->attach($processIds);
            $product->brewMethods()->attach($brewMethodIds);
        }
    }
}