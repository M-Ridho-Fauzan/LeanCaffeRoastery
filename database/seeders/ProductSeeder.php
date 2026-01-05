<?php

namespace Database\Seeders;

use App\Models\BrewMethod;
use App\Models\Origin;
use App\Models\Process;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- 1. DEKLARASI DATA MASTER ---
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

        // HANYA 2 BREW METHOD: Single Origin dan Espresso Based
        $brewMethodsData = [
            ['brew_name' => 'Single Origin', 'description' => 'Kopi yang berasal dari satu daerah atau perkebunan tertentu.'],
            ['brew_name' => 'Espresso Based', 'description' => 'Kopi yang diformulasikan khusus untuk ekstraksi espresso.'],
        ];

        // --- 2. BUAT DATA MASTER DI DATABASE ---
        // Hapus data yang ada terlebih dahulu untuk menghindari duplikasi
        Origin::query()->delete();
        Process::query()->delete();
        BrewMethod::query()->delete();
        Product::query()->delete();

        Origin::query()->insert($originsData);
        Process::query()->insert($processesData);
        BrewMethod::query()->insert($brewMethodsData);

        // Ambil kembali data yang sudah dibuat untuk mendapatkan ID-nya
        $origins = Origin::all();
        $processes = Process::all();
        $brewMethods = BrewMethod::all();

        // --- 3. DEKLARASI DATA PRODUK YANG LEBIH MODULAR ---
        // SESUAIKAN DENGAN ENUM YANG ADA DI DATABASE
        // Diasumsikan ENUM values untuk 'type' adalah: 'Single Origin', 'House Blend', 'Microlot', 'Commercial'
        $productsData = [
            // Single Origin Coffees
            [
                'product_name' => 'Aceh Gayo Natural',
                'type' => 'Single Origin',
                'price' => 120000,
                'is_specialty' => true,
                'flavor_notes' => 'Fruity, Winey, Chocolate, Brown Sugar',
                'origins' => ['Gayo'],
                'processes' => ['Natural'],
                'brew_methods' => ['Single Origin'],
            ],
            [
                'product_name' => 'Ethiopia Sidamo Washed',
                'type' => 'Single Origin',
                'price' => 150000,
                'is_specialty' => true,
                'flavor_notes' => 'Floral, Lemon, Black Tea, Jasmine',
                'origins' => ['Sidamo'],
                'processes' => ['Full Washed'],
                'brew_methods' => ['Single Origin'],
            ],
            [
                'product_name' => 'Bali Kintamani Natural',
                'type' => 'Single Origin',
                'price' => 115000,
                'is_specialty' => true,
                'flavor_notes' => 'Citrus, Orange, Tamarind, Herbal',
                'origins' => ['Kintamani'],
                'processes' => ['Natural'],
                'brew_methods' => ['Single Origin'],
            ],
            [
                'product_name' => 'Kenya AA Washed',
                'type' => 'Single Origin',
                'price' => 165000,
                'is_specialty' => true,
                'flavor_notes' => 'Blackcurrant, Tomato, Bright Acidity, Juicy',
                'origins' => ['Kenya AA'],
                'processes' => ['Full Washed'],
                'brew_methods' => ['Single Origin'],
            ],
            [
                'product_name' => 'Guatemala Antigua Honey Process',
                'type' => 'Single Origin',
                'price' => 135000,
                'is_specialty' => true,
                'flavor_notes' => 'Sweet, Orange Peel, Maple Syrup, Clean Finish',
                'origins' => ['Antigua'],
                'processes' => ['Honey'],
                'brew_methods' => ['Single Origin'],
            ],
            [
                'product_name' => 'Colombia Supremo Anaerobic',
                'type' => 'Microlot',
                'price' => 180000,
                'is_specialty' => true,
                'flavor_notes' => 'Cinnamon, Tropical Fruit, Winey, Complex',
                'origins' => ['Colombia Supremo'],
                'processes' => ['Anaerobic'],
                'brew_methods' => ['Single Origin'],
            ],
            [
                'product_name' => 'Sumatra Toraja Giling Basah',
                'type' => 'Single Origin',
                'price' => 110000,
                'is_specialty' => false,
                'flavor_notes' => 'Earthy, Spicy, Cedar, Bold Body',
                'origins' => ['Toraja'],
                'processes' => ['Giling Basah'],
                'brew_methods' => ['Single Origin'],
            ],

            // House Blend / Espresso Based Coffees
            [
                'product_name' => 'Lean Coffee House Blend',
                'type' => 'House Blend',
                'price' => 95000,
                'is_specialty' => false,
                'flavor_notes' => 'Balanced, Nutty, Caramel, Low Acidity',
                'origins' => ['Gayo', 'Brazil Cerrado'],
                'processes' => ['Full Washed'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Brazil Cerrado Espresso Roast',
                'type' => 'House Blend',
                'price' => 85000,
                'is_specialty' => false,
                'flavor_notes' => 'Dark Chocolate, Roasted Nuts, Full Body',
                'origins' => ['Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Morning Espresso Blend',
                'type' => 'House Blend',
                'price' => 100000,
                'is_specialty' => false,
                'flavor_notes' => 'Sweet, Cocoa, Red Berries, Smooth Finish',
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],

            // Microlot / Premium Coffees (cocok untuk keduanya)
            [
                'product_name' => 'Ethiopia Yirgacheffe Washed',
                'type' => 'Microlot',
                'price' => 175000,
                'is_specialty' => true,
                'flavor_notes' => 'Bergamot, Jasmine, Peach, Tea-like',
                'origins' => ['Yirgacheffe'],
                'processes' => ['Full Washed'],
                'brew_methods' => ['Single Origin', 'Espresso Based'],
            ],
            [
                'product_name' => 'Premium House Blend',
                'type' => 'Microlot',
                'price' => 125000,
                'is_specialty' => true,
                'flavor_notes' => 'Complex, Dark Chocolate, Cherry, Long Aftertaste',
                'origins' => ['Sidamo', 'Antigua', 'Brazil Cerrado'],
                'processes' => ['Full Washed', 'Natural'],
                'brew_methods' => ['Single Origin', 'Espresso Based'],
            ],
            [
                'product_name' => 'Midnight Cold Brew Blend',
                'type' => 'House Blend',
                'price' => 105000,
                'is_specialty' => false,
                'flavor_notes' => 'Smooth, Chocolate, Low Acidity, Sweet',
                'origins' => ['Colombia Supremo', 'Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
        ];

        // --- 4. GENERATE IMAGES DAN BUAT PRODUK ---
        foreach ($productsData as $productData) {
            $stock = random_int(10, 100); // Minimal 10 stock agar status aktif
            $status = $stock > 0;
            
            $product = Product::create([
                'product_name' => $productData['product_name'],
                'slug' => Str::slug($productData['product_name']),
                'type' => $productData['type'],
                'price' => $productData['price'],
                'flavor_notes' => $productData['flavor_notes'],
                'is_specialty' => $productData['is_specialty'],
                'stock' => $stock,
                'status' => $status,
            ]);

            // Buat gambar dummy untuk produk
            $imageUrls = [
                'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
                'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ];

            foreach ($imageUrls as $index => $imageUrl) {
                $product->images()->create([
                    'image_url' => $imageUrl,
                    'alt_text' => 'Image of ' . $productData['product_name'],
                    'is_primary' => $index === 0, // Gambar pertama sebagai primary
                ]);
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

        // --- 5. TAMBAHKAN DATA EXTRA UNTUK VARIASI ---
        // Buat beberapa data tambahan untuk variasi
        $extraProducts = [
            [
                'product_name' => 'Brazil Santos Natural',
                'type' => 'Commercial',
                'price' => 75000,
                'is_specialty' => false,
                'flavor_notes' => 'Nutty, Milk Chocolate, Low Acidity',
                'origins' => ['Brazil Cerrado'],
                'processes' => ['Natural'],
                'brew_methods' => ['Espresso Based'],
            ],
            [
                'product_name' => 'Rwandan Natural Process',
                'type' => 'Microlot',
                'price' => 140000,
                'is_specialty' => true,
                'flavor_notes' => 'Berry, Wine, Sweet, Full Body',
                'origins' => ['Kenya AA'], // Gunakan origin yang sudah ada
                'processes' => ['Natural'],
                'brew_methods' => ['Single Origin'],
            ],
        ];

        foreach ($extraProducts as $productData) {
            $stock = random_int(10, 100);
            $status = $stock > 0;
            
            $product = Product::create([
                'product_name' => $productData['product_name'],
                'slug' => Str::slug($productData['product_name']),
                'type' => $productData['type'],
                'price' => $productData['price'],
                'flavor_notes' => $productData['flavor_notes'],
                'is_specialty' => $productData['is_specialty'],
                'stock' => $stock,
                'status' => $status,
            ]);

            // Gambar untuk produk tambahan
            $imageUrls = [
                'https://images.unsplash.com/photo-1570196911496-66bd58a5b7b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1570196911496-66bd58a5b7b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            ];

            foreach ($imageUrls as $index => $imageUrl) {
                $product->images()->create([
                    'image_url' => $imageUrl,
                    'alt_text' => 'Image of ' . $productData['product_name'],
                    'is_primary' => $index === 0,
                ]);
            }

            // Hubungkan relasi
            $originIds = $origins->whereIn('origin_name', $productData['origins'])->pluck('id');
            $processIds = $processes->whereIn('process_name', $productData['processes'])->pluck('id');
            $brewMethodIds = $brewMethods->whereIn('brew_name', $productData['brew_methods'])->pluck('id');

            $product->origins()->attach($originIds);
            $product->processes()->attach($processIds);
            $product->brewMethods()->attach($brewMethodIds);
        }
    }
}