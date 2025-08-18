# Lean Coffe Roastery 🚀

![Lean Coffe Roastery Logo](</public/img_asset/Lean Logo Whites.png>)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Sebuah aplikasi web modern yang dibangun dengan TALL Stack versi "TRIV" (Tailwind CSS, React, Inertia.js, Vite) di atas framework Laravel.

## 🚩 Tentang Proyek

Proyek ini bertujuan untuk [Jelaskan secara singkat tujuan proyek Anda di sini. Misal: "membangun sistem manajemen konten internal", atau "platform e-learning interaktif"].

Fitur utama yang sudah ada:

- Autentikasi Pengguna (Login, Register)
- Sistem Role-Based Access Control (Admin, Author, User)
- Halaman Pengaturan Profil (Update Info, Ganti Password, Upload Avatar, Edit Avatar)
- Beberapa UI yang responsif dan modern.

### 🚧 Dibangun Dengan

Teknologi utama yang digunakan dalam proyek ini:

- **Backend:** [Laravel 12](https://laravel.com/)
- **Frontend:** [React 19.1](https://reactjs.org/) (dengan TypeScript)
- **Jembatan Backend-Frontend:** [Inertia.js](https://inertiajs.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)

---

## 🏁 Memulai

Untuk menjalankan salinan proyek ini di mesin lokal Anda untuk tujuan pengembangan dan pengujian, ikuti langkah-langkah berikut.

### 🚨 Prasyarat

Pastikan Anda sudah menginstal perangkat lunak berikut:

- PHP >= 8.3.12
- Composer 2.8.6
- Node.js >= 20.18.0 & NPM
- Git
- Database SQlite (sementara)

### 📢 Konfigurasi SQlite sementara

1. Pastikan instalasi versi core (node, php, dll) sama dengan spesifikasi [di atas](#prasyarat).
2. hidupkan server local laragon.
3. klik kanan di laragon, arahkan ke `php > Extensions`.
4. di `Extensions`, centang `pdo_sqlite` dan `sqlite`.

### 🧷 Instalasi

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

## ⚡ Saran Extensions (VS Code)

### # Inti (Wajib Instal)

#### # React & TypeScript/JavaScript

1.  **ESLint** (oleh Microsoft)
    - **Alasan:** Standar industri untuk _linting_ (menemukan dan memperbaiki masalah dalam kode). Wajib untuk menjaga kualitas dan konsistensi kode.
2.  **ES7+ React/Redux/React-Native snippets** (oleh dsznajder)
    - **Alasan:** Ini adalah **satu-satunya paket snippet yang Anda butuhkan**. Sangat komprehensif untuk React (class, function components, hooks), Redux, dan React Native. Menggantikan 3-4 ekstensi snippet di daftar Anda.
3.  **Tailwind CSS IntelliSense** (oleh Tailwind Labs)
    - **Alasan:** Wajib jika Anda menggunakan Tailwind CSS. Memberikan _autocomplete_, _linting_, dan pratinjau saat _hover_ pada class Tailwind.
4.  **PHP Intelephense** (oleh Ben Mewburn)
    - **Alasan:** Memberikan _IntelliSense_ (autocomplete, go to definition, dll.) yang cerdas untuk PHP. Jauh lebih baik daripada fitur bawaan dan wajib untuk pengembangan Laravel.
5.  **GitLens — Git supercharged** (oleh GitKraken)
    - **Alasan:** "Pisau Swiss Army" untuk Git. Memberikan anotasi `git blame` langsung di editor, riwayat file, perbandingan _commit_, dan _commit graph_. **Menggantikan `Git Graph` dan `Git File History`**.

#### # Laravel

1.  **Laravel Artisan** (oleh Tino `ryannaddy` D'Aversa)
    - **Alasan:** Menjalankan perintah Artisan langsung dari VS Code tanpa perlu membuka terminal. Sangat efisien.
2.  **Laravel Blade Snippets** (oleh Winnie Lin)
    - **Alasan:** Snippet dan _syntax highlighting_ yang sangat membantu saat bekerja dengan file Blade.
3.  **Laravel goto view** (oleh codingyu)
    - **Alasan:** Mempercepat navigasi dengan memungkinkan Anda untuk langsung melompat ke file view dari controller.

### # Sangat Direkomendasikan (Peningkat Kualitas Hidup)

1.  **Prettier - Code formatter** (oleh Prettier)
    - **Alasan:** Seharusnya ini masuk kategori wajib. Secara otomatis memformat kode Anda saat disimpan, memastikan gaya penulisan yang konsisten di seluruh proyek. Sangat penting, terutama saat bekerja dalam tim.
2.  **Vite** (oleh antfu)
    - **Alasan:** Jika proyek Anda menggunakan Vite (seperti Laravel Breeze dengan React/Vue), ekstensi ini memberikan integrasi yang lebih baik, seperti memulai/menghentikan dev server.
3.  **npm Intellisense** (oleh Christian Kohler)
    - **Alasan:** Melengkapi nama paket npm secara otomatis saat Anda menulis `import`. Sangat berguna.
4.  **PHP Debug** (oleh Xdebug)
    - **Alasan:** Mengintegrasikan Xdebug untuk _step-by-step debugging_ PHP. Sangat kuat untuk melacak bug yang kompleks.
5.  **DotENV** (oleh mikestead)
    - **Alasan:** Memberikan _syntax highlighting_ untuk file `.env`, membuatnya lebih mudah dibaca.

### # Opsional (Berguna, tapi Tidak Esensial)

1.  **Tailwind Docs** (oleh `austenc`)
    - **Alasan:** Cara cepat untuk membuka dokumentasi Tailwind langsung dari VS Code. Berguna jika Anda sering lupa nama class.
2.  **laravel-goto-components** (oleh `stef-k`)
    - **Alasan:** Mirip dengan `laravel-goto-view`, tapi untuk Blade Components. Berguna jika proyek Anda banyak menggunakan komponen.
3.  **Vscode Google Translate** (oleh `funkyremi`)
    - **Alasan:** Berguna untuk menerjemahkan teks atau komentar langsung di dalam editor.

## 🏢 Akun Dev

> **Peringatan**: Gunakan akun ini hanya untuk tujuan pengembangan, karena bisa berpotensi pemakaiaan berkepanjangan

- **Email**: `leancofferoastery.service@gmail.com`
- **Pass**: `akunlean123`

## 🤝 Kontributor

- **UI/UX Designer**: Mohc. Derall - derralpramudia8@gmail.com
- **Front-End**: Adam Maulana - adammaulana0905@gmail.com
- **Back-End**: Ridho Fauzan - ridhofauzan275@gmail.com
- **Data Science**: Dios Ahmad - diosahmadfadhil01@gmail.com
- **Machine Learning**: Deni Pajri - radenii2002@gmail.com

## Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.
