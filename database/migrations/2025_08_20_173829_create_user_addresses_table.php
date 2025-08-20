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
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id();

            // Relasi ke tabel users
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Detail Alamat
            $table->string('label', 50);            // Contoh: "Rumah", "Kantor"
            $table->string('recipient_name');               // Nama penerima
            $table->string('phone_number', 20);     // No. HP penerima

            $table->string('address_line1');                // Nama jalan, nomor rumah, RT/RW
            $table->string('address_line2')->nullable();    // Opsional: Nama gedung, unit apartemen
            $table->string('province', 100);        // Provinsi
            $table->string('city', 100);            // Kota/Kabupaten
            $table->string('district', 100);        // Kecamatan
            $table->string('postal_code', 10);      // Kode Pos

            // Flag & Metadata
            $table->boolean('is_primary')->default(false);           // Penanda alamat utama
            $table->decimal('latitude', 10, 8)->nullable();  // Opsional: untuk GPS
            $table->decimal('longitude', 11, 8)->nullable(); // Opsional: untuk GPS

            $table->timestamps(); // Membuat kolom created_at dan updated_at
            $table->softDeletes(); // Membuat kolom deleted_at untuk soft delete
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
