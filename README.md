# react-auto-skeleton

**Automatic, layout-accurate skeleton loaders for React**

Zero manual skeleton components. Automatically generates visually identical skeleton versions of your React components by analyzing the rendered DOM and preserving exact layout, spacing, and structure.

---

## 🎯 Problem

Current skeleton loading approaches require:
- Manually creating separate skeleton components
- Maintaining skeletons alongside UI components
- Updating skeletons every time UI changes
- Writing duplicate layout code

This causes code duplication, inconsistency, and maintenance overhead.

---

## 💡 Solution

`react-auto-skeleton` solves this by:
1. Rendering your component invisibly
2. Letting the browser compute the final layout (including Tailwind CSS, inline styles, etc.)
3. Automatically generating a skeleton that preserves:
   - Layout structure (flex, grid, block)
   - Spacing (padding, margin, gap)
   - Dimensions (width, height)
   - Element hierarchy

**No manual skeleton components needed.**

---

## 📦 Installation

```bash
npm install @zakiibnu723/react-auto-skeleton
```

or

```bash
yarn add @zakiibnu723/react-auto-skeleton
```

or

```bash
pnpm add @zakiibnu723/react-auto-skeleton
```

---

## 🚀 Quick Start

```tsx
import { AutoSkeleton } from '@zakiibnu723/react-auto-skeleton';
// or use alias: import { SkeletonMorph } from '@zakiibnu723/react-auto-skeleton';
import { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AutoSkeleton loading={loading}>
      <YourComponent />
    </AutoSkeleton>
  );
}
```

That's it! When `loading` is `true`, AutoSkeleton shows a skeleton. When `false`, it shows the actual component. No manual CSS imports required (zero-config).

---

## 📖 API Reference

### `<AutoSkeleton>`

Wrapper component that automatically generates skeleton loaders.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | `true` | When `true`, shows skeleton. When `false`, shows actual component. |
| `animate` | `'shimmer'` \| `'pulse'` \| `'none'` | `'shimmer'` | Animation style for skeleton elements. |
| `ignore` | `string[]` | `undefined` | CSS selectors to skip during skeleton generation (e.g., `['svg', '.icon']`). |
| `className` | `string` | `undefined` | CSS class applied to the wrapper container. |
| `children` | `ReactNode` | *required* | The component(s) to wrap with skeleton functionality. |

---

## 🎨 Animation Modes

### Shimmer (Default)
Animated gradient sweep effect that moves across skeleton elements.

```tsx
<AutoSkeleton loading={loading} animate="shimmer">
  <ProductCard />
</AutoSkeleton>
```

### Pulse
Gentle fade in/out animation.

```tsx
<AutoSkeleton loading={loading} animate="pulse">
  <UserProfile />
</AutoSkeleton>
```

### None
Static skeleton without animation.

```tsx
<AutoSkeleton loading={loading} animate="none">
  <CommentList />
</AutoSkeleton>
```

---

## 🔧 Advanced Usage

### Ignoring Elements

Use the `ignore` prop to skip certain elements (like decorative icons) during skeleton generation:

```tsx
<AutoSkeleton 
  loading={loading} 
  ignore={['svg', 'path', '.icon']}
>
  <Dashboard />
</AutoSkeleton>
```

This is useful for:
- SVG icons that don't need skeleton versions
- Decorative elements
- Elements with complex rendering logic

### Custom Styling

Apply custom styles to the skeleton container:

```tsx
<AutoSkeleton 
  loading={loading} 
  className="my-skeleton-wrapper"
>
  <Card />
</AutoSkeleton>
```

### Conditional Loading

```tsx
function DataView() {
  const { data, isLoading } = useQuery();

  return (
    <AutoSkeleton loading={isLoading}>
      {data && <DataTable data={data} />}
    </AutoSkeleton>
  );
}
```

---

## 🏗️ How It Works

1. **Invisible Render**: Component is rendered with `visibility: hidden`
2. **DOM Analysis**: Browser computes final layout including all CSS (Tailwind, styled-components, etc.)
3. **Skeleton Generation**: Walks the DOM tree and creates skeleton elements preserving:
   - Display types (flex, grid, block)
   - Layout properties (padding, margin, gap)
   - Dimensions (width, height)
   - Parent-child relationships
4. **Display**: Shows generated skeleton with chosen animation

### Element Handling

- **Text nodes** → Converted to skeleton bars with computed line height
- **Images** → Rectangular skeletons preserving dimensions
- **Buttons/Inputs** → Converted to non-interactive skeleton blocks
- **Containers** → Preserve layout (flex/grid) and spacing

---

## ✅ Features

- ✅ Zero manual skeleton components
- ✅ Preserves exact layout and spacing
- ✅ Works with any CSS framework (Tailwind, styled-components, CSS Modules, etc.)
- ✅ Handles text, images, buttons, forms, and complex layouts
- ✅ Multiple animation modes (shimmer, pulse, none)
- ✅ Customizable via `ignore` selectors
- ✅ Full TypeScript support
- ✅ Responsive by default
- ✅ Lightweight (~9KB gzipped)

---

## ⚠️ Limitations

- **Requires first render**: Skeleton appears after initial paint (not SSR compatible)
- **Client-side only**: Best for client-rendered components
- **ResizeObserver dependency**: Uses ResizeObserver for responsive updates (widely supported)

These are acceptable trade-offs for the convenience of automatic skeleton generation.

---

## 📚 Examples

### Product Card

```tsx
<AutoSkeleton loading={loading} animate="shimmer">
  <div className="product-card">
    <img src="product.jpg" alt="Product" />
    <h3>Premium Headphones</h3>
    <p>High-quality audio with noise cancellation</p>
    <div className="price">$199</div>
    <button>Add to Cart</button>
  </div>
</AutoSkeleton>
```

### User Profile

```tsx
<AutoSkeleton loading={loading} animate="pulse">
  <div className="profile">
    <img src="avatar.jpg" alt="User" className="avatar" />
    <h2>John Doe</h2>
    <p>Software Engineer</p>
    <div className="stats">
      <div>1,234 Followers</div>
      <div>567 Following</div>
    </div>
  </div>
</AutoSkeleton>
```

### Comment List

```tsx
<AutoSkeleton loading={loading} animate="none">
  <div className="comments">
    {comments.map(comment => (
      <div key={comment.id} className="comment">
        <img src={comment.avatar} className="avatar" />
        <div>
          <strong>{comment.author}</strong>
          <p>{comment.text}</p>
        </div>
      </div>
    ))}
  </div>
</AutoSkeleton>
```

### Form

```tsx
<AutoSkeleton loading={loading}>
  <form>
    <label>
      Name
      <input type="text" placeholder="Your name" />
    </label>
    <label>
      Email
      <input type="email" placeholder="your@email.com" />
    </label>
    <label>
      Message
      <textarea rows={4} />
    </label>
    <button type="submit">Send</button>
  </form>
</AutoSkeleton>
```

---

## 🎓 Use Cases

### Data Fetching

```tsx
function UserList() {
  const { data, isLoading } = useUsers();

  return (
    <AutoSkeleton loading={isLoading}>
      <div className="user-grid">
        {data?.map(user => <UserCard key={user.id} user={user} />)}
      </div>
    </AutoSkeleton>
  );
}
```

### Lazy Loading

```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={
      <AutoSkeleton loading>
        <HeavyComponentPlaceholder />
      </AutoSkeleton>
    }>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Progressive Enhancement

```tsx
function Dashboard() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoaded(true), 2000);
  }, []);

  return (
    <AutoSkeleton loading={!loaded} animate="shimmer">
      <div className="dashboard">
        <StatCards />
        <Charts />
        <RecentActivity />
      </div>
    </AutoSkeleton>
  );
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT © 2025

---

## 🙏 Acknowledgments

Built for Final Thesis (Tugas Akhir) - Demonstrating automatic UI skeleton generation through DOM analysis and layout preservation.

---

## 🔗 Links

- **Demo**: Run `npm run dev` to see interactive examples
- **Issues**: Report bugs or request features
- **TypeScript**: Full type definitions included

---

## 💻 Development

```bash
# Install dependencies
npm install

# Run demo
npm run dev

# Build library
npm run build

# Run tests
npm test

# Lint
npm run lint
```

---

## 🎯 Design Philosophy

> **Skeletons are NOT designed. Skeletons are GENERATED.**

The library doesn't redesign your UI—it converts it. Every DOM element maps to a skeleton element, preserving the exact layout structure your users expect.

### Key Principles

1. **One Element, One Skeleton**: Never merge multiple elements
2. **Layout Preservation**: Keep display types, spacing, and hierarchy
3. **Automatic Conversion**: Text → bars, Images → blocks, Containers → wrappers
4. **Zero Configuration**: Works out of the box with sensible defaults

---

## ❓ FAQ

**Q: Does this work with Tailwind CSS?**  
A: Yes! AutoSkeleton works with any CSS approach because it reads computed styles from the browser.

**Q: Can I customize skeleton colors?**  
A: Yes, override the CSS variables `--ras-base` and `--ras-highlight`.

**Q: Does this support Server-Side Rendering (SSR)?**  
A: No. The library requires a browser to compute layout. Use traditional skeleton components for SSR.

**Q: How does performance compare to manual skeletons?**  
A: Slightly slower initial render (requires DOM analysis), but negligible in practice. The trade-off is worth it for zero maintenance.

**Q: Can I use this with React Native?**  
A: No. This library depends on browser DOM APIs.

---

**Built with ❤️ for developers who value their time.**
