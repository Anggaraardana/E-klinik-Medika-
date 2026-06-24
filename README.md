# E-Klinik Medika - Implementasi Struktur Data

> Tugas Akhir Semester - Mata Kuliah Struktur Data
> **Nama:** Anggaraardana
> **Program Studi:** Teknik Informatika

## Deskripsi Proyek
E-Klinik Medika adalah aplikasi web dashboard yang mensimulasikan sistem manajemen pasien pada sebuah klinik. Proyek ini dibangun sebagai implementasi praktis dari teori Struktur Data, khususnya dalam penerapan antrean (Queue). Aplikasi ini menggunakan HTML, CSS murni (Vanilla CSS dengan prinsip desain modern), dan JavaScript untuk logika interaktif di sisi klien.

## Struktur Data yang Diimplementasikan
Proyek ini mengimplementasikan dua jenis struktur data antrean utama:
1. **Regular Queue (FIFO - First In First Out)**
   Digunakan untuk pendaftaran antrean pasien umum. Pasien yang mendaftar lebih awal akan dilayani lebih dahulu.
2. **Priority Queue (Antrean Berprioritas)**
   Digunakan untuk pasien dengan kondisi gawat darurat atau membutuhkan penanganan khusus. Pasien dengan tingkat prioritas lebih tinggi akan menyela atau ditempatkan di depan pasien reguler dalam antrean (atau diproses secara paralel sesuai resource dokter).

## Fitur Aplikasi
- **Dashboard Interaktif**: Statistik real-time jumlah dokter, pasien dalam antrean, dan ruang rawat.
- **Manajemen Antrean**: Penambahan pasien ke dalam antrean (Regular & Priority) dengan validasi data.
- **Pemrosesan Pasien**: Simulasi pemanggilan pasien sesuai urutan struktur data.
- **Manajemen Data Klinik**: Fitur CRUD untuk menambah data Obat, Kamar, dan Dokter.
- **Searching & Filtering**: Pencarian pasien berdasarkan nama menggunakan linear search.
- **Notifikasi**: Sistem toast notification interaktif untuk memberikan feedback pada pengguna.

## Teknologi yang Digunakan
- **HTML5**: Semantic HTML untuk struktur dokumen.
- **CSS3**: Vanilla CSS dengan Flexbox, CSS Grid, CSS Variables (Custom Properties), dan modern micro-animations (Glassmorphism effect).
- **Vanilla JavaScript**: Logika bisnis, manipulasi DOM, simulasi array dan struktur data (Queue).

## Cara Menjalankan
1. Clone repositori ini ke lokal komputer Anda:
   ```bash
   git clone https://github.com/Anggaraardana/E-klinik-Medika-.git
   ```
2. Buka folder proyek.
3. Jalankan file `e klinik medika 1.html` menggunakan web browser (disarankan menggunakan Google Chrome atau Microsoft Edge terbaru).
4. Tidak diperlukan instalasi package atau server tambahan karena aplikasi berjalan sepenuhnya di *client-side*.

---
*Dibuat untuk memenuhi kriteria kelulusan evaluasi akhir mata kuliah Struktur Data.*
