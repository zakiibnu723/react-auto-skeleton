# react-auto-skeleton — Architecture

Folder ini berisi **dokumentasi arsitektur** library `react-auto-skeleton`. Setiap file `.md` menjelaskan satu modul: tanggung jawabnya, cara kerjanya, dan fungsi-fungsi di dalamnya.

> Folder ini **bukan kode sumber**. Source code ada di `src/`.

---

## Peta Arsitektur

```
src/
├── utils/
│   └── constants.ts       # Types, tag sets, konstanta klasifikasi DOM
│
├── core/
│   ├── styles.ts          # CSS global, STYLE_ID, injeksi stylesheet
│   ├── generator.tsx      # Renderer text bars (createTextBars)
│   └── analyzer.tsx       # DOM walker & skeleton tree builder
│
├── AutoSkeleton.tsx       # Main React component (entry point)
└── index.ts               # Public API
```

---

## Alur Data (Data Flow)

```
[loading=true]
      │
      ▼
AutoSkeleton.tsx
  └─ Render children tersembunyi di [data-ras-probe]
      │
      ▼ useLayoutEffect
core/analyzer.tsx → buildSkeletonTree()
  └─ Iterasi childNodes dari probe element
      │
      ▼ per node
  createSkeletonNode()
    ├─ matchesIgnore()       → skip jika cocok selector
    ├─ baseBoxStyle()        → baca computed style → CSSProperties
    ├─ (jika teks)
    │    └─ generator.tsx → createTextBars() → stack <div> bars
    └─ (jika container)
         └─ rekursi ke children
      │
      ▼
Skeleton React tree di-render → ditampilkan dengan animasi CSS
      │
      ▼ ResizeObserver
  Rebuild otomatis jika ukuran berubah
```

---

## Dokumentasi Per Modul

| File | Dokumentasi |
|---|---|
| `src/utils/constants.ts` | [constants.md](./utils/constants.md) |
| `src/core/styles.ts` | [styles.md](./core/styles.md) |
| `src/core/generator.tsx` | [generator.md](./core/generator.md) |
| `src/core/analyzer.tsx` | [analyzer.md](./core/analyzer.md) |
| `src/AutoSkeleton.tsx` | [AutoSkeleton.md](./AutoSkeleton.md) |

---

## Prinsip Desain

1. **Invisible Render First** — Anak-anak di-render secara tersembunyi agar browser menghitung layout aslinya.
2. **Read, Don't Guess** — Semua dimensi dan style diambil dari `getComputedStyle` + `getBoundingClientRect`, bukan di-hardcode.
3. **Recursive Tree Mirror** — DOM tree dicerminkan satu-per-satu menjadi skeleton tree React.
4. **Zero Config** — Tidak perlu menulis skeleton component apapun. Cukup bungkus dengan `<AutoSkeleton>`.
5. **Single Stylesheet** — CSS diinjeksi satu kali ke `<head>`. Tidak ada CSS-in-JS runtime.
