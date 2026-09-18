import { useState } from "react";
import { AutoSkeleton } from "react-auto-skeleton";
import { ProductCard } from "./components/ProductCard";
import { UserProfile } from "./components/UserProfile";
import { CommentList } from "./components/CommentList";
import { StatCard } from "./components/StatCard";
import { FormSection } from "./components/FormSection";
import { MediaGallery } from "./components/MediaGallery";

type DemoSection = {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  defaultLoading: boolean;
};

export default function App() {
  const [sections] = useState<DemoSection[]>([
    {
      id: "shimmer-card",
      title: "Shimmer Animation - Product Card",
      description: "Animated gradient sweep effect (default)",
      component: <ProductCard />,
      defaultLoading: true
    },
    {
      id: "pulse-profile",
      title: "Pulse Animation - User Profile",
      description: "Gentle fade in/out animation",
      component: <UserProfile />,
      defaultLoading: true
    },
    {
      id: "none-comments",
      title: "No Animation - Comment Thread",
      description: "Static skeleton without animation",
      component: <CommentList />,
      defaultLoading: true
    },
    {
      id: "ignore-stats",
      title: "Ignore Selector - Statistics Dashboard",
      description: "Using ignore prop to skip SVG icons",
      component: <StatCard />,
      defaultLoading: true
    },
    {
      id: "complex-form",
      title: "Complex Layout - Form with Inputs",
      description: "Handles inputs, selects, and textareas",
      component: <FormSection />,
      defaultLoading: true
    },
    {
      id: "media-gallery",
      title: "Media Elements - Image Gallery",
      description: "Automatically detects and converts images",
      component: <MediaGallery />,
      defaultLoading: true
    }
  ]);

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => ({ ...acc, [section.id]: section.defaultLoading }), {})
  );

  const toggleLoading = (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getAnimateMode = (id: string) => {
    if (id.includes("shimmer")) return "shimmer";
    if (id.includes("pulse")) return "pulse";
    if (id.includes("none")) return "none";
    return "shimmer";
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="logo">react-auto-skeleton</h1>
              <p className="tagline">Automatic, layout-accurate skeleton loaders for React</p>
            </div>
            <a href="#docs" className="btn-docs">
              Documentation
            </a>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <section className="intro">
            <h2>Interactive Demo</h2>
            <p className="intro-text">
              Toggle loading state for each component to see how AutoSkeleton automatically generates visually
              identical skeleton versions. Each example demonstrates different features and use cases.
            </p>
          </section>

          <div className="demo-grid">
            {sections.map((section) => (
              <div key={section.id} className="demo-card">
                <div className="demo-header">
                  <div>
                    <h3>{section.title}</h3>
                    <p className="demo-desc">{section.description}</p>
                  </div>
                  <button
                    className={`toggle-btn ${loadingStates[section.id] ? "loading" : "loaded"}`}
                    onClick={() => toggleLoading(section.id)}
                  >
                    {loadingStates[section.id] ? "Loading..." : "Loaded"}
                  </button>
                </div>
                <div className="demo-content">
                  <AutoSkeleton
                    loading={loadingStates[section.id]}
                    animate={getAnimateMode(section.id)}
                    ignore={section.id.includes("ignore") ? ["svg", "path"] : undefined}
                  >
                    {section.component}
                  </AutoSkeleton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="docs" id="docs">
        <div className="container">
          <h2>Documentation</h2>

          <section className="doc-section">
            <h3>Installation</h3>
            <pre>
              <code>npm install react-auto-skeleton</code>
            </pre>
          </section>

          <section className="doc-section">
            <h3>Basic Usage</h3>
            <pre>
              <code>{`import { AutoSkeleton } from 'react-auto-skeleton';

function MyComponent() {
  const [loading, setLoading] = useState(true);
  
  return (
    <AutoSkeleton loading={loading}>
      <YourComponent />
    </AutoSkeleton>
  );
}`}</code>
            </pre>
          </section>

          <section className="doc-section">
            <h3>Props</h3>
            <table className="props-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>loading</code>
                  </td>
                  <td>
                    <code>boolean</code>
                  </td>
                  <td>
                    <code>true</code>
                  </td>
                  <td>When true, shows skeleton. When false, shows actual component.</td>
                </tr>
                <tr>
                  <td>
                    <code>animate</code>
                  </td>
                  <td>
                    <code>'shimmer' | 'pulse' | 'none'</code>
                  </td>
                  <td>
                    <code>'shimmer'</code>
                  </td>
                  <td>Animation style for skeleton elements.</td>
                </tr>
                <tr>
                  <td>
                    <code>ignore</code>
                  </td>
                  <td>
                    <code>string[]</code>
                  </td>
                  <td>
                    <code>undefined</code>
                  </td>
                  <td>Array of CSS selectors to skip during skeleton generation (e.g., ['svg', '.icon']).</td>
                </tr>
                <tr>
                  <td>
                    <code>className</code>
                  </td>
                  <td>
                    <code>string</code>
                  </td>
                  <td>
                    <code>undefined</code>
                  </td>
                  <td>CSS class to apply to the wrapper container.</td>
                </tr>
                <tr>
                  <td>
                    <code>children</code>
                  </td>
                  <td>
                    <code>ReactNode</code>
                  </td>
                  <td>
                    <em>required</em>
                  </td>
                  <td>The component(s) to wrap with skeleton functionality.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="doc-section">
            <h3>How It Works</h3>
            <ol className="how-list">
              <li>
                <strong>Invisible Render:</strong> Component is rendered invisibly with{" "}
                <code>visibility: hidden</code>
              </li>
              <li>
                <strong>DOM Analysis:</strong> Browser computes final layout including all CSS (Tailwind, etc.)
              </li>
              <li>
                <strong>Skeleton Generation:</strong> Walks DOM tree and creates skeleton elements preserving:
                <ul>
                  <li>Layout structure (flex, grid, block)</li>
                  <li>Spacing (padding, margin, gap)</li>
                  <li>Dimensions (width, height)</li>
                  <li>Element hierarchy</li>
                </ul>
              </li>
              <li>
                <strong>Display:</strong> Shows generated skeleton with chosen animation
              </li>
            </ol>
          </section>

          <section className="doc-section">
            <h3>Features</h3>
            <ul className="feature-list">
              <li>✅ Zero manual skeleton components</li>
              <li>✅ Preserves exact layout and spacing</li>
              <li>✅ Works with Tailwind CSS and any CSS framework</li>
              <li>✅ Handles text, images, buttons, and complex layouts</li>
              <li>✅ Multiple animation modes (shimmer, pulse, none)</li>
              <li>✅ Customizable via ignore selectors</li>
              <li>✅ TypeScript support</li>
              <li>✅ Responsive by default</li>
            </ul>
          </section>

          <section className="doc-section">
            <h3>Limitations</h3>
            <ul className="limitation-list">
              <li>⚠️ Requires first render to compute layout</li>
              <li>⚠️ Skeleton appears after initial paint (not SSR compatible)</li>
              <li>⚠️ Best for client-side rendered components</li>
            </ul>
          </section>

          <section className="doc-section">
            <h3>Examples</h3>
            <div className="example-grid">
              <div className="example">
                <h4>Shimmer Animation</h4>
                <pre>
                  <code>{`<AutoSkeleton loading={loading} animate="shimmer">
  <ProductCard />
</AutoSkeleton>`}</code>
                </pre>
              </div>
              <div className="example">
                <h4>Pulse Animation</h4>
                <pre>
                  <code>{`<AutoSkeleton loading={loading} animate="pulse">
  <UserProfile />
</AutoSkeleton>`}</code>
                </pre>
              </div>
              <div className="example">
                <h4>No Animation</h4>
                <pre>
                  <code>{`<AutoSkeleton loading={loading} animate="none">
  <CommentList />
</AutoSkeleton>`}</code>
                </pre>
              </div>
              <div className="example">
                <h4>Ignore SVG Icons</h4>
                <pre>
                  <code>{`<AutoSkeleton 
  loading={loading} 
  ignore={['svg', 'path']}
>
  <Dashboard />
</AutoSkeleton>`}</code>
                </pre>
              </div>
            </div>
          </section>
        </div>
      </footer>
    </div>
  );
}
