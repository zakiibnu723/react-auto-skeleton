# `src/core/generator.tsx` — Skeleton Element Renderer

## Tanggung Jawab

File ini bertanggung jawab atas **pembuatan elemen skeleton visual** untuk konten berbasis teks. Ia mengambil informasi layout dari `analyzer.tsx` dan menghasilkan JSX skeleton yang sesuai.

---

## Fungsi: `isMeaningfulText(node)`

```ts
export function isMeaningfulText(node: ChildNode): boolean {
  return node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim());
}
```

Mengecek apakah sebuah `ChildNode` adalah text node yang mengandung konten nyata (bukan whitespace).

**Digunakan oleh:** `analyzer.tsx` → `createSkeletonNode()` untuk mendeteksi apakah sebuah elemen adalah _text-only leaf_ (elemen yang hanya berisi teks, tanpa child element).

---

## Fungsi: `createTextBars(style, rect, animateClass)`

```ts
export function createTextBars(
  style: CSSStyleDeclaration,
  rect: DOMRect,
  animateClass: string
): ReactElement
```

Mengonversi sebuah elemen teks menjadi satu atau beberapa **bar persegi panjang** yang menyimulasikan baris teks.

### Parameter

| Parameter | Tipe | Keterangan |
|---|---|---|
| `style` | `CSSStyleDeclaration` | Computed style elemen asli |
| `rect` | `DOMRect` | Bounding rect elemen asli |
| `animateClass` | `string` | CSS animation class ("ras-animate-shimmer", dll) |

### Algoritma

```
1. Baca fontSize dari computed style (fallback: 14px)
2. Hitung lineHeight dalam px:
   - Jika berakhiran "px" → parse langsung
   - Jika "normal" → fontSize × 1.4
   - Jika angka unitless → angka × fontSize
3. lineCount = round(rect.height / lineHeight), minimum 1
4. barHeight = clamp(lineHeight × 0.9, 6px, 22px)
5. Untuk setiap baris:
   - width = rect.width (full)
   - Kecuali baris terakhir dari multi-line → width = 60% (simulasi akhir paragraf)
6. Return <div class="ras-text-stack"> berisi N bar
```

### Contoh Output

Untuk paragraf 3 baris:
```html
<div class="ras-text-stack">
  <div class="ras-skeleton ras-animate-shimmer" style="height:14px; width:280px" />
  <div class="ras-skeleton ras-animate-shimmer" style="height:14px; width:280px" />
  <div class="ras-skeleton ras-animate-shimmer" style="height:14px; width:168px" />  ← 60%
</div>
```

### Kenapa 60% untuk baris terakhir?

Paragraf teks nyata hampir tidak pernah berakhir tepat di tepi kanan container. Baris terakhir yang lebih pendek membuat skeleton terlihat lebih natural dan realistis.

---

## Dependensi

```
generator.tsx
  └─ Tidak mengimport dari file lain dalam library
     (hanya React dari react)
```

File ini **tidak bergantung** pada `constants.ts` atau `analyzer.tsx`, sehingga tidak ada circular dependency.
