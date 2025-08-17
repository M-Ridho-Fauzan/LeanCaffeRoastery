# Panduan Berkontribusi

Terima kasih telah meluangkan waktu untuk berkontribusi!

Semua kontribusi untuk proyek ini dirilis di bawah [Kode Etik](#kode-etik) proyek. Mohon untuk mematuhinya dalam semua interaksi Anda.

## Alur Kerja Kontribusi (Feature Branch Workflow)

Kami menggunakan alur kerja _Feature Branch_. Aturan utamanya adalah **branch `main` harus selalu stabil dan siap untuk di-deploy.** Semua pekerjaan harus dilakukan di branch terpisah.

1.  **Buat Branch Baru:**
    Sebelum memulai pekerjaan, pastikan branch `main` lokal Anda sudah yang terbaru.

    ```sh
    git checkout main
    git pull origin main
    ```

    Kemudian buat branch baru yang deskriptif dari `main`.

    ```sh
    # Untuk fitur baru
    git checkout -b feature/nama-fitur-yang-deskriptif

    # Untuk perbaikan bug
    git checkout -b bugfix/perbaikan-masalah-login
    ```

2.  **Lakukan Perubahan & Commit:**
    Lakukan perubahan kode Anda di branch baru ini. Buat commit secara berkala dengan pesan yang jelas dan informatif. Kami menganjurkan penggunaan [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
    - `feat:` untuk fitur baru.
    - `fix:` untuk perbaikan bug.
    - `docs:` untuk perubahan dokumentasi.
    - `style:` untuk formatting, spasi, dll.
    - `refactor:` untuk refactoring kode tanpa mengubah fungsionalitas.
    - `test:` untuk menambah atau memperbaiki tes.

    ```sh
    git add .
    git commit -m "feat: Menambahkan fungsionalitas upload avatar pengguna"
    ```

3.  **Push Branch Anda:**
    Kirim branch Anda ke repositori remote di GitHub.

    ```sh
    git push origin feature/nama-fitur-yang-deskriptif
    ```

4.  **Buka Pull Request (PR):**
    - Buka repositori di GitHub. Anda akan melihat notifikasi untuk membuat Pull Request dari branch yang baru saja Anda push.
    - Klik tombol tersebut.
    - Beri judul PR yang jelas dan deskripsi yang detail tentang perubahan yang Anda buat. Jika PR ini menyelesaikan sebuah _issue_, sebutkan di deskripsi (contoh: `Closes #42`).
    - Tugaskan setidaknya satu _reviewer_ untuk memeriksa kode Anda.
    - Tunggu hingga PR di-review dan disetujui. Lakukan perbaikan jika ada masukan dari reviewer.

5.  **Merge & Hapus Branch:**
    Setelah disetujui, PR akan di-merge ke branch `main`. Setelah itu, Anda bisa menghapus branch fitur Anda baik di lokal maupun di remote.

## Standar Kode

- **Backend (PHP/Laravel):** Ikuti standar **PSR-12**.
- **Frontend (React/TSX):** Ikuti konfigurasi ESLint dan Prettier yang sudah ada di proyek. Jalankan `npm run lint` dan `npm run format` sebelum melakukan commit.

---

## Kode Etik

### Komitmen Kami

Kami sebagai anggota, kontributor, dan pemimpin berkomitmen untuk membuat partisipasi dalam komunitas kami menjadi pengalaman yang bebas pelecehan bagi semua orang, tanpa memandang usia, ukuran tubuh, disabilitas yang terlihat atau tidak terlihat, etnis, karakteristik jenis kelamin, identitas dan ekspresi gender, tingkat pengalaman, pendidikan, status sosial ekonomi, kebangsaan, penampilan pribadi, ras, agama, atau identitas dan orientasi seksual.

Lihat `CODE_OF_CONDUCT.md` untuk detail lengkap.
