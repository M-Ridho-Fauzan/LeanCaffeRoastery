# Lean Coffe Roastery

![Lean Coffe Roastery Logo](</public/img_asset/Lean Logo White.png>)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Sebuah aplikasi web modern yang dibangun dengan TALL Stack versi "TRIV" (Tailwind CSS, React, Inertia.js, Vite) di atas framework Laravel.

## Tentang Proyek

Proyek ini bertujuan untuk [Jelaskan secara singkat tujuan proyek Anda di sini. Misal: "membangun sistem manajemen konten internal", atau "platform e-learning interaktif"].

Fitur utama yang sudah ada:

- Autentikasi Pengguna (Login, Register)
- Sistem Role-Based Access Control (Admin, Author, User)
- Halaman Pengaturan Profil (Update Info, Ganti Password, Upload Avatar)
- UI yang responsif dan modern.

### Dibangun Dengan

Teknologi utama yang digunakan dalam proyek ini:

- **Backend:** [Laravel 12](https://laravel.com/)
- **Frontend:** [React 19.1](https://reactjs.org/) (dengan TypeScript)
- **Jembatan Backend-Frontend:** [Inertia.js](https://inertiajs.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)

---

## Memulai

Untuk menjalankan salinan proyek ini di mesin lokal Anda untuk tujuan pengembangan dan pengujian, ikuti langkah-langkah berikut.

### Prasyarat

Pastikan Anda sudah menginstal perangkat lunak berikut:

- PHP >= 8.3.12
- Composer 2.8.6
- Node.js >= 20.18.0 & NPM
- Git
- Database SQlite (sementara)

### Konfigurasi SQlite sementara

1. Pastikan instalasi versi core (node, php, dll) sama dengan spesifikasi [di atas](#prasyarat).
2. hidupkan server local laragon.
3. klik kanan di laragon, arahkan ke `php > Extensions`.
4. di `Extensions`, centang `pdo_sqlite` dan `sqlite`.

### Instalasi

1.  **Clone repositori:**

    ```sh
    git clone https://github.com/M-Ridho-Fauzan/LeanCaffeRoastery.git
    cd LeanCaffeRoastery
    ```

2.  **Install dependensi Backend (PHP):**

    ```sh
    composer install
    ```

3.  **Install dependensi Frontend (JavaScript):**

    ```sh
    npm install
    ```

4.  **Setup file environment:**
    Salin file `.env.example` menjadi `.env` dan sesuaikan konfigurasinya, terutama untuk koneksi database.

    ```sh
    cp .env.example .env
    ```

    \***Skip dulu ini (Karena pakai sqlite):**
    Setelah itu, buka file `.env` dan isi `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD`.

5.  **Generate kunci aplikasi Laravel:**

    ```sh
    php artisan key:generate
    ```

6.  **Jalankan migrasi dan seeder database:**
    Perintah ini akan membuat struktur tabel dan mengisi data awal (user admin, dll).

    ```sh
    php artisan migrate:fresh --seed
    ```

7.  **Buat symbolic link untuk storage:**
    Ini penting agar file yang di-upload (seperti avatar) bisa diakses publik.

    ```sh
    php artisan storage:link
    ```

8.  **Jalankan server development:**
    Buka dua terminal terpisah.

    ```sh
    # Di terminal 1 (untuk kompilasi aset frontend)
    npm run dev

    # Di terminal 2 (untuk server backend Laravel)
    php artisan serve
    ```

Aplikasi Anda sekarang berjalan di `http://127.0.0.1:8000`.

---

## Akun Dev

> **Peringatan**: Gunakan akun ini hanya untuk tujuan pengembangan, karena bisa berpotensi pemakaiaan berkepanjangan

- **Email**: `leancofferoastery.service@gmail.com`
- **Pass**: `akunlean123`

## Kontributor

- **Front-End**: Adam Maulana - adammaulana0905@gmail.com
- **Back-End**: M. Ridho Fauzan - ridhofauzan275@gmail.com

## Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.
