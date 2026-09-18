# `src/core/analyzer.tsx` — DOM Analyzer & Skeleton Builder

## Tanggung Jawab

File ini adalah **inti logika library** — ia menganalisis DOM nyata dan menghasilkan pohon React skeleton yang cocok. Berisi tiga lapisan pemrosesan:

1. `matchesIgnore()` — filter elemen yang harus dilewati
2. `baseBoxStyle()` — ekstrak CSS layout dari computed style
3. `createSkeletonNode()` → `buildSkeletonTree()` — rekursi DOM → skeleton tree

---

## Fungsi: `matchesIgnore(el, ignore)`

```ts
export function matchesIgnore(el: Element, ignore?: string[]): boolean
```

Mengecek apakah elemen `el` cocok dengan salah satu CSS selector di array `ignore`. Selector yang tidak valid diabaikan (try/catch) untuk mencegah crash.

**Contoh penggunaan:**
```tsx
<AutoSkeleton ignore={["svg", "path", ".badge"]} loading={true}>
  <MyComponent />
</AutoSkeleton>
```
Elemen `<svg>` dan `<path>` akan di-skip — tidak dikonversi ke skeleton.

---

## Fungsi: `baseBoxStyle(style, rect)`

```ts
export function baseBoxStyle(style: CSSStyleDeclaration, rect: DOMRect): CSSProperties
```

Membaca computed style dan bounding rect dari sebuah elemen DOM, lalu mengembalikan objek `CSSProperties` React yang mereplikasi layout-nya sebagai skeleton block.

### Property yang Dipreservasi

| Kategori | Properties |
|---|---|
| **Display** | `display` (inline → inline-block) |
| **Flex container** | `flexDirection`, `alignItems`, `justifyContent`, `flexWrap`, `gap`, `rowGap`, `columnGap` |
| **Grid container** | `gridTemplateColumns`, `gridTemplateRows`, `gap` |
| **Grid item** | `gridColumn`, `gridRow` |
| **Spacing** | `padding`, `margin`, `flex`, `alignSelf` |
| **Positioning** | `position`, `top`, `right`, `bottom`, `left`, `zIndex` |
| **Dimensi** | `width`, `minWidth`, `maxWidth`, `height`, `minHeight`, `maxHeight`, `aspectRatio` |
| **Visual** | `borderRadius` (auto-computed dari height), `backgroundColor`, `border` |

### Border Radius Auto-Compute

```ts
result.borderRadius =
  style.borderRadius || `${Math.max(2, Math.min(12, rect.height / 4 || 8))}px`;
```

Jika elemen tidak punya `borderRadius`, library menghitung secara adaptif — elemen kecil mendapat radius kecil, elemen besar mendapat radius hingga 12px.

---

## Fungsi: `createSkeletonNode(node, animateClass, ignore)`

```ts
export function createSkeletonNode(
  node: ChildNode,
  animateClass: string,
  ignore?: string[]
): ReactNode | null
```

Fungsi rekursif yang mengonversi satu DOM node menjadi satu React skeleton element.

### Decision Tree

```
node masuk
  │
  ├─ TEXT_NODE → null (teks sendiri tidak dirender)
  ├─ bukan ELEMENT_NODE → null
  ├─ cocok ignore[] → null
  ├─ display:none atau visibility:hidden → null
  │
  ├─ Klasifikasikan elemen:
  │    isMedia = tagName ∈ MEDIA_TAGS
  │    isInteractive = tagName ∈ INTERACTIVE_TAGS
  │    isLeaf = children kosong || isMedia || isInteractive
  │    textOnly = isLeaf && ada child TEXT_NODE yang tidak kosong
  │
  ├─ isMedia || isInteractive
  │    └─ Return: <div class="ras-skeleton" style={dimensi pixel eksak} />
  │
  ├─ isLeaf && textOnly && hasBackground
  │    └─ Return: <div class="ras-skeleton" style={dimensi pixel eksak} />
  │         (badge / chip dengan background color → solid block)
  │
  ├─ isLeaf && textOnly (tanpa background)
  │    └─ createTextBars(computed, rect, animateClass)
  │         └─ Return: <div class="ras-text-stack"> + N bar
  │
  ├─ isLeaf (elemen kosong lainnya)
  │    └─ Return: <div class="ras-skeleton" style={dimensi pixel eksak} />
  │
  └─ Container (punya children)
       └─ Rekursi ke setiap child
            └─ Return: <div style={layout}>{skeletonChildren}</div>
```

---

## Fungsi: `buildSkeletonTree(root, animate, ignore)`

```ts
export function buildSkeletonTree(
  root: HTMLElement,
  animate: AutoSkeletonProps["animate"],
  ignore?: string[]
): ReactElement
```

Entry point yang dipanggil oleh `AutoSkeleton.tsx`. Memetakan semua direct children dari `[data-ras-probe]` melalui `createSkeletonNode()`, lalu membungkus hasilnya dalam Fragment.

**Resolusi animation class:**
```
"shimmer" → "ras-animate-shimmer"
"pulse"   → "ras-animate-pulse"
"none"    → ""
```

Key assignment dilakukan di level ini (bukan di dalam `createSkeletonNode`) untuk stabilitas reconciliation React.

---

## Dependensi

```
analyzer.tsx
  ├─ utils/constants.ts  → INTERACTIVE_TAGS, MEDIA_TAGS, AutoSkeletonProps
  └─ core/generator.tsx  → isMeaningfulText, createTextBars
```
