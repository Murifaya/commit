
# CampusBite — Pre-Order Makanan & Minuman Kantin Kampus

**CampusBite** adalah aplikasi web *frontend* untuk memesan makanan dan minuman dari kantin atau kios kampus secara *pre-order* agar mahasiswa bisa mengambil pesanan tanpa mengantre. Aplikasi ini berjalan di sisi klien (*frontend-only*) tanpa backend eksternal menggunakan data statis dan *state* di browser.

## Tim & Pembagian Tugas
Nama Tim: **The Cawaprezz**

Anggota:
- **[Muhammad Fakhri Al Farizi Waldiya]** 
- **[Billal Mahardika Aslam]** 
- **[Ibnu Royhan Firdausy]** — 

## Fitur Utama
- **Pengaturan & Pelacakan Budget:** Mengatur nominal budget makan (input manual atau pilihan cepat) lengkap dengan indikator sisa budget dan peringatan jika total belanja melebihi batas.
- **Daftar Kantin & Kios:** Memilih semua kios atau menyaring berdasarkan kios tertentu, lengkap dengan estimasi waktu siap (`ETA`) dan status buka/tutup.
- **Katalog & Pencarian Menu:** Mencari menu berdasarkan nama, menyaring kategori (`Semua`, `Makanan`, `Minuman`, `Camilan`), mengurutkan berdasarkan rating atau harga, serta mengaktifkan filter menu sesuai sisa budget.
- **Keranjang & *Checkout*:** Menambah, mengurangi, atau menghapus item, memilih slot waktu pengambilan, mengisi nama pengambil dan catatan pesanan, serta melihat total biaya.
- **Pelacakan Status Pesanan:** Memantau progres pesanan secara bertahap (`Diterima`, `Diproses`, `Siap diambil`, hingga `Selesai`) beserta kode pesanan.

## Teknologi yang Digunakan
- **React** (dengan **Vite** sebagai *build tool* / *dev server*)
- **Tailwind CSS** (v3) dan **PostCSS** untuk *styling* antarmuka
- **Lucide React** untuk ikon antarmuka
- **Git & GitHub** untuk *version control* dan kolaborasi tim (alur *branch* & *Pull Request*)

## Petunjuk Instalasi dan Cara Menjalankan

1. **Clone repositori:**
   ```
   git clone <URL-REPOSITORI-GITHUB>
   cd <NAMA-FOLDER-PROYEK>
   ```

2. **Install dependensi:**
   ```
   npm install
   ```

3. **Jalankan server pengembangan:**
   ```
   npm run dev
   ```

4. **Buka aplikasi di browser:**
   Akses tautan lokal yang muncul di terminal (biasanya `http://localhost:5173`).

*(Opsional)* Untuk membuat *build* produksi:
```
npm run build
```

## Penggunaan AI, Template, Starter Code, dan Sumber Aset
- **Starter Code / Template:** Proyek diinisialisasi menggunakan *starter template* React + Vite (`npm create vite@latest`) beserta konfigurasi dasar ESLint, `index.html`, dan `src/main.jsx`.
- **Penggunaan AI:** Bantuan AI digunakan dalam proses perancangan/iterasi kode antarmuka (`CampusBite.jsx`), penyesuaian konfigurasi Tailwind CSS, serta penyusunan panduan alur kerja Git dan dokumentasi.
- **Sumber Aset:** Ikon antarmuka menggunakan pustaka **Lucide React**, sementara ilustrasi makanan/kios menggunakan *emoji* bawaan sistem/peramban dan data *dummy* kios serta menu.
