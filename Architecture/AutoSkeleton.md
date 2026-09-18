# `src/AutoSkeleton.tsx` — Main Component

## Tanggung Jawab

File ini adalah **entry point React** dari library. Ia menerima props dari pengguna, mengatur state skeleton, dan mengorkestrasi alur rendering antara _hidden probe_, _analyzer_, dan _skeleton overlay_.

---

## Props

| Prop | Type | Default | Keterangan |
|---|---|---|---|
| `loading` | `boolean` | `true` | Jika true, tampilkan skeleton. Jika false, tampilkan children asli. |
| `animate` | `"shimmer" \| "pulse" \| "none"` | `"shimmer"` | Mode animasi skeleton. |
| `ignore` | `string[]` | `undefined` | Daftar CSS selector yang dilewati saat generate skeleton. |
| `className` | `string` | `undefined` | Class CSS untuk wrapper container paling luar. |
| `children` | `ReactNode` | required | Komponen yang dibungkus skeleton. |

*Type `AutoSkeletonProps` didefinisikan di `src/utils/constants.ts`.*

---

## State & Refs

```ts
const hiddenRef = useRef<HTMLDivElement | null>(null);
// Ref ke div pembungkus hidden probe. Digunakan oleh useLayoutEffect
// untuk mencari [data-ras-probe] dan membaca DOM-nya.

const [skeleton, setSkeleton] = useState<ReactNode | null>(null);
// Menyimpan React tree hasil generatesi skeleton.
// Di-set ulang setiap kali animate/ignore/children/loading berubah.
```

---

## Hooks

### `useEffect` — Injeksi stylesheet

```ts
useEffect(() => {
  if (!loading) return;
  ensureStyleSheetInjected();
}, [loading]);
```

Memanggil `ensureStyleSheetInjected()` dari `core/styles.ts`. Hanya berjalan di client. Aman dipanggil berkali-kali — fungsi tersebut sudah idempoten.

---

### `useLayoutEffect` — Analisis DOM & build skeleton

```ts
useLayoutEffect(() => {
  if (!loading) return;
  const probe = hiddenRef.current?.querySelector("[data-ras-probe]");
  setSkeleton(buildSkeletonTree(probe, animate, ignore));

  const observer = new ResizeObserver(() => {
    setSkeleton(buildSkeletonTree(probe, animate, ignore));
  });
  observer.observe(probe);
  return () => observer.disconnect();
}, [animate, ignore, loading, children]);
```

`useLayoutEffect` dipilih (bukan `useEffect`) karena:
- Computed styles dan `getBoundingClientRect()` harus dibaca **setelah** DOM ter-paint.
- Mencegah _flash_ antara render pertama dan skeleton muncul.

`ResizeObserver` memastikan skeleton di-rebuild jika container berubah ukuran (responsive layout).

---

## Struktur JSX

```
<div className={containerClassName}>   ← wrapper
  <div ref={hiddenRef} aria-hidden>    ← hidden probe container
    <div data-ras-probe>               ← probe root (dibaca analyzer)
      {children}                       ← children real, rendered invisible
    </div>
  </div>
  <div>                                ← skeleton overlay (NO className — lihat catatan)
    {skeleton}                         ← React tree dari buildSkeletonTree()
  </div>
</div>
```

**Hidden probe** di-style dengan `opacity: 0`, `pointerEvents: none`, `zIndex: -1`, dan `position: absolute` sehingga tidak menempati ruang visual. Children tetap di-render agar browser bisa menghitung layout aslinya.

> **Catatan penting:** Skeleton overlay wrapper **sengaja tidak diberi** animation class. Setiap elemen `.ras-skeleton` individual sudah membawa class animasinya sendiri (via `animateClass` di `createSkeletonNode`). Jika wrapper diberi class shimmer, gradient background-nya akan menembus sudut-sudut transparan yang diciptakan oleh `border-radius` pada elemen anak — menghasilkan artefak putih/terang di pojok skeleton.

---

## Alur Render Lengkap

```
loading=true →
  Render wrapper
    ├─ Hidden probe merender children (invisible)
    └─ useLayoutEffect membaca DOM probe
         ├─ buildSkeletonTree() → ReactNode
         └─ setSkeleton(tree)
              └─ React re-render → skeleton overlay tampil

loading=false →
  Return <>{children}</> langsung (no wrapper, no overhead)
```
