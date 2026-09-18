# `src/core/styles.ts` — Global CSS & Stylesheet Injection

## Tanggung Jawab

File ini mengelola **semua kebutuhan CSS** library:
1. Mendefinisikan string stylesheet lengkap (`styleSheet`)
2. Menyimpan konstanta ID untuk `<style>` tag (`STYLE_ID`)
3. Menyediakan fungsi injeksi yang idempoten (`ensureStyleSheetInjected`)

Dengan memusatkan CSS di satu file, library tidak membutuhkan build step terpisah untuk CSS (tidak ada `.css` file) — stylesheet diinjeksi langsung ke `<head>` via JavaScript.

---

## Konstanta: `STYLE_ID`

```ts
export const STYLE_ID = "ras-style-sheet";
```

ID unik untuk `<style>` tag yang diinjeksi. Digunakan oleh `ensureStyleSheetInjected()` untuk mengecek apakah stylesheet sudah ada sebelum menambahkan yang baru (mencegah duplikasi).

---

## Konstanta: `styleSheet`

String CSS lengkap yang berisi semua rule yang dibutuhkan library.

### CSS Custom Properties (Theming)

```css
:root {
  --ras-base: #e5e7eb;       /* warna abu-abu dasar skeleton */
  --ras-highlight: #f8fafc;  /* warna terang untuk shimmer */
}
```

Pengguna bisa meng-override kedua variabel ini di CSS mereka sendiri untuk menyesuaikan warna skeleton.

---

### `.ras-skeleton` — Base Style

```css
.ras-skeleton {
  position: relative;
  background: var(--ras-base);
  border-radius: var(--ras-radius, 8px);
  overflow: hidden;
  transform: translateZ(0);  /* promote ke GPU layer → animasi lebih smooth */
}
```

Setiap element skeleton (block, bar teks, media, interactive) mendapat class ini.

---

### `.ras-animate-shimmer` — Shimmer Animation

```css
.ras-animate-shimmer {
  background: linear-gradient(90deg, var(--ras-base) 0%, var(--ras-highlight) 50%, var(--ras-base) 100%);
  background-size: 200% 100%;
  animation: ras-shimmer 1.6s linear infinite;
}

@keyframes ras-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

Gradient bergerak dari kanan ke kiri menciptakan efek "cahaya yang menyapu". `background-size: 200%` memastikan gradient lebih lebar dari elemen sehingga transisi terlihat smooth.

---

### `.ras-animate-pulse` — Pulse Animation

```css
.ras-animate-pulse {
  animation: ras-pulse 1.4s ease-in-out infinite;
}

@keyframes ras-pulse {
  0%   { opacity: 0.88; }
  50%  { opacity: 0.52; }
  100% { opacity: 0.88; }
}
```

Animasi opacity sederhana — skeleton "bernafas" naik turun. Lebih halus dan tidak mencolok dibanding shimmer.

---

### `.ras-text-stack` — Text Bar Container

```css
.ras-text-stack {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
```

Wrapper untuk stack bar teks yang dibuat oleh `generator.tsx`. Kolom vertikal dengan jarak antar-bar kecil agar terlihat seperti paragraf.

---

## Fungsi: `ensureStyleSheetInjected()`

```ts
export function ensureStyleSheetInjected() {
  if (typeof document === "undefined") return;  // SSR guard
  if (document.getElementById(STYLE_ID)) return;  // idempotency check
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = styleSheet;
  document.head.appendChild(style);
}
```

**Dipanggil dari:** `AutoSkeleton.tsx` di dalam `useEffect` setiap kali `loading` berubah menjadi `true`.

**Kenapa idempoten?** Karena `useEffect` bisa dipanggil ulang, dan ada banyak instance `<AutoSkeleton>` yang mungkin aktif bersamaan — kita hanya perlu satu `<style>` tag.
