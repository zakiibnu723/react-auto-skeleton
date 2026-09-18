# `src/utils/constants.ts` — Types & Constants

## Tanggung Jawab

File ini adalah **sumber kebenaran tunggal** untuk:
1. Type `AutoSkeletonProps` — kontrak public API library
2. Set konstanta klasifikasi tag HTML — digunakan oleh `analyzer.tsx` untuk menentukan bagaimana sebuah elemen DOM di-skeleton-kan

---

## Type: `AutoSkeletonProps`

```ts
export type AutoSkeletonProps = {
  loading?: boolean;
  animate?: "shimmer" | "pulse" | "none";
  ignore?: string[];
  className?: string;
  children: ReactNode;
};
```

Di-export dan digunakan oleh:
- `src/AutoSkeleton.tsx` — sebagai type props komponen
- `src/index.ts` — sebagai type export publik library
- `src/core/analyzer.tsx` — parameter `animate` bertipe `AutoSkeletonProps["animate"]`

---

## Konstanta DOM Classifier

### `INLINE_BLOCK_LIKE`

```ts
export const INLINE_BLOCK_LIKE = new Set(["inline", "inline-block", "inline-flex"]);
```

Set nilai `display` yang berperilaku seperti inline. Digunakan di `baseBoxStyle()` untuk meng-override `display: inline` menjadi `display: inline-block` (agar skeleton bisa diberi lebar dan tinggi eksplisit).

> **Catatan:** Saat ini konstanta ini dideklarasikan tapi tidak secara aktif digunakan dalam logika `analyzer.tsx`. Ia tetap dipertahankan sebagai referensi / dokumentasi klasifikasi display.

---

### `INTERACTIVE_TAGS`

```ts
export const INTERACTIVE_TAGS = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA"]);
```

Elemen-elemen yang bersifat interaktif. Diperlakukan sebagai **solid skeleton block** (tanpa rekursi ke anak-anaknya), karena:
- Tidak memiliki children yang perlu di-skeleton-kan
- Harus tetap mempertahankan ukuran dan posisi layout-nya

---

### `MEDIA_TAGS`

```ts
export const MEDIA_TAGS = new Set(["IMG", "VIDEO", "CANVAS", "PICTURE"]);
```

Elemen media visual. Diperlakukan sebagai **solid skeleton block** dengan dimensi pixel eksak (`rect.width` × `rect.height`), karena:
- Kita tidak punya akses ke konten visualnya
- Dimensi mereka biasanya sudah jelas dari layout/style

---

## Kenapa di `utils/`?

File ini berisi **data statis dan types** — bukan logika eksekusi. Menempatkannya di `utils/` memisahkan definisi kontrak dari implementasi, sehingga:
- `core/analyzer.tsx` bisa import constants tanpa circular dependency
- `AutoSkeleton.tsx` bisa import type tanpa import seluruh core logic
