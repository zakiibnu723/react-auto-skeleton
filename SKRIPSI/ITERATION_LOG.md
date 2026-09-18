# LOG REKAM JEJAK ITERASI PENGEMBANGAN PROTOTIPE LIBRARY (SDLC PROTOTYPING)
**Nama Proyek:** react-auto-skeleton  
**Metodologi:** Evolutionary Prototyping (Pressman, 7th Edition)  
**Pengembang:** Ibnu Zaki Alhawari (22106050027)  
**Target Pengguna / Stakeholder:** React Frontend Developers  

---

## 1. Siklus Iterasi 1: Prototipe Awal (Core Prototype v0.0.1)

### A. Quick Plan 1 (Fokus Kebutuhan Inti)
* Mewujudkan otomatisasi konversi komponen React menjadi skeleton visual tanpa komponen manual.
* Membaca struktur DOM dan *computed styles* (lebar, tinggi, warna latar).
* Menyediakan kontrol `loading` (boolean).

### B. Construction of Prototype 1
* Dibuat modul `AutoSkeleton.tsx` awal dengan *probe container* (elemen div tersembunyi `opacity: 0`).
* Digunakan *hook* `useEffect` untuk memicu ekstraksi DOM setelah render.
* Digunakan `getComputedStyle()` untuk membaca properti dimensi dasar.
* Elemen anak dirender sebagai balok skeleton abu-abu statis.

### C. Deployment, Delivery & Feedback 1 (Uji Coba Stakeholder)
Prototipe diuji coba oleh pengembang React pada komponen kartu produk (*Product Card*) dan daftar profil (*User Profile*).

#### Temuan Masalah & Umpan Balik Stakeholder:
1. **Masalah Kerusakan Layout (Flexbox & Grid):**  
   *Keluhan:* Komponen yang menggunakan Flexbox (`flex-row`, `gap`) dan CSS Grid tampil berantakan; skeleton bertumpuk ke bawah secara vertikal.  
   *Akar Masalah:* Ekstraksi gaya hanya membaca `width` dan `height`, tidak menyalin properti tata letak kontainer (`display`, `flex-direction`, `grid-template-columns`, `gap`).
2. **Masalah Teks Multi-baris Menjadi Balok Tunggal:**  
   *Keluhan:* Paragraf deskripsi produk yang panjang tampil sebagai satu balok semen persegi panjang yang tebal, tidak menyerupai bentuk teks paragraf aslinya.  
   *Akar Masalah:* Seluruh teks dalam satu elemen dianggap sebagai satu kontainer blok tunggal tanpa pembagian baris berdasarkan `line-height`.
3. **Efek Kedip / Layout Shift (FOUC):**  
   *Keluhan:* Terlihat kedipan layar sesaat sebelum skeleton muncul.  
   *Akar Masalah:* Penggunaan `useEffect` berjalan secara asinkron setelah browser menggambar layar (*paint*).
4. **Kebutuhan Fitur Baru dari Stakeholder (Requirements Refinement):**  
   * Permintaan 1: *"Tolong sediakan opsi untuk mengabaikan ikon SVG atau tombol aksi tertentu agar tidak berubah jadi balok skeleton"* $\rightarrow$ **Kebutuhan Prop `ignore`**.
   * Permintaan 2: *"Tolong sediakan animasi shimmer atau pulse agar tampilan loading terasa lebih hidup"* $\rightarrow$ **Kebutuhan Prop `animate`**.
   * Permintaan 3: *"Saat jendela browser di-resize, ukuran skeleton tidak ikut menyesuaikan secara dinamis"* $\rightarrow$ **Kebutuhan `ResizeObserver`**.

---

## 2. Siklus Iterasi 2: Penyempurnaan & Versi Rilis Stabil (Release Candidate v0.1.0)

### A. Quick Plan 2 (Perbaikan Bug & Integrasi Kebutuhan Baru)
* Migrasi lifecycle DOM ke `useLayoutEffect` guna mengeliminasi kedipan (flicker).
* Rekayasa ulang modul `analyzer.tsx` dengan *Deep Layout Extraction* (Flexbox, CSS Grid, Spacing).
* Pembuatan generator baris teks adaptif di `generator.tsx`.
* Penambahan prop `ignore` dengan selektor CSS toleran kesalahan (*try-catch*).
* Penambahan prop `animate` ('shimmer' | 'pulse' | 'none') dengan isolasi gaya.
* Integrasi `ResizeObserver` untuk responsivitas layar dinamis.

### B. Construction of Prototype 2 (Implementasi Refinement)
1. **Zero-Flicker Lifecycle:**  
   Mengganti `useEffect` menjadi `useLayoutEffect` di `AutoSkeleton.tsx` sehingga kalkulasi bounding rect selesai sebelum *first paint*.
2. **Deep Layout Engine (`baseBoxStyle`):**  
   Mengekstrak secara detail:
   * Flexbox: `flexDirection`, `alignItems`, `justifyContent`, `flexWrap`, `gap`, `rowGap`, `columnGap`.
   * CSS Grid: `gridTemplateColumns`, `gridTemplateRows`, `gap`, `gridColumn`, `gridRow`.
   * Spacing: `padding`, `margin`, `flex`, `alignSelf`, `aspectRatio`.
3. **Adaptive Multi-line Text Generator (`createTextBars`):**  
   Menghitung jumlah baris otomatis: $\text{Jumlah Baris} = \text{round}(\text{Tinggi} / \text{Line-Height})$. Baris terakhir secara proporsional dipangkas menjadi ~70% dari lebar maksimal.
4. **Fitur Pengabaian Selektor (`matchesIgnore`):**  
   Mengevaluasi CSS selector array (misal `ignore={['svg', '.icon']}`) menggunakan `Element.matches()` di dalam blok `try...catch`.
5. **Animasi & Isolasi Gaya:**  
   Animasi `ras-animate-shimmer` dan `ras-animate-pulse` diterapkan pada *leaf node* individual untuk menghindari *gradient bleeding* pada sudut membulat (*border-radius*).
6. **Dynamic Resize Observer:**  
   Menambahkan `ResizeObserver` pada kontainer *probe* tersembunyi untuk mentrigger `buildSkeletonTree()` secara otomatis saat kontainer mengalami perubahan ukuran.

### C. Deployment, Delivery & Feedback 2 (Evaluasi Akhir)
* **Pengujian Blackbox / Unit Testing:** Menggunakan Vitest dan React Testing Library, 100% test case lulus.
* **Evaluasi Stakeholder:** Pengembang menyatakan layout visual skeleton 100% identik dengan komponen asli, fleksibel dalam styling, tidak ada flicker, dan penanganan elemen SVG berhasil dengan prop `ignore`.
* **Kesiapan Rilis (NPM Ready):** Modul dikompilasi menggunakan `tsup` menghasilkan bundel CommonJS (CJS), ES Module (ESM), dan TypeScript declaration files (`.d.ts`) dengan ukuran bersih sangat efisien (~10 KB unminified, ~3.5 KB gzipped).
