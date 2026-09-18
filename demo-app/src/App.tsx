import { useState } from "react";
import { AutoSkeleton } from "@zakiibnu723/react-auto-skeleton";

type AnimateMode = "shimmer" | "pulse" | "none";

export default function App() {
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const [animateMode, setAnimateMode] = useState<AnimateMode>("shimmer");

  // Individual card loading states
  const [cardLoading, setCardLoading] = useState({
    product: true,
    profile: true,
    metrics: true,
    article: true,
    form: true,
    ignore: true
  });

  const toggleAll = () => {
    const next = !globalLoading;
    setGlobalLoading(next);
    setCardLoading({
      product: next,
      profile: next,
      metrics: next,
      article: next,
      form: next,
      ignore: next
    });
  };

  const toggleCard = (key: keyof typeof cardLoading) => {
    setCardLoading((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="container">
      {/* Hero Header */}
      <header className="hero">
        <a
          href="https://www.npmjs.com/package/@zakiibnu723/react-auto-skeleton"
          target="_blank"
          rel="noreferrer"
          className="npm-badge"
        >
          <span className="pulse-dot" />
          @zakiibnu723/react-auto-skeleton v0.1.0 (Live on NPM) ↗
        </a>
        <h1>React AutoSkeleton Showcase</h1>
        <p>
          Generasi skeleton loading otomatis dari struktur komponen React asli secara deterministik,
          zero-config, mempertahankan layout Flexbox & CSS Grid tanpa komponen manual.
        </p>
      </header>

      {/* Interactive Control Panel */}
      <section className="control-bar">
        <div className="control-group">
          <button
            type="button"
            onClick={toggleAll}
            className={`btn-toggle-all ${globalLoading ? "loading-active" : "normal-active"}`}
          >
            {globalLoading ? "⚡ Tampilkan Komponen Asli" : "🌀 Aktifkan Skeleton Mode"}
          </button>
        </div>

        <div className="control-group">
          <span className="control-label">Animation Mode:</span>
          <div className="segmented-control">
            {(["shimmer", "pulse", "none"] as AnimateMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`segment-btn ${animateMode === mode ? "active" : ""}`}
                onClick={() => setAnimateMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Showcase: Wrapping Entire Cards Like Real-world Cases */}
      <main className="grid">
        {/* Card 1: E-Commerce Product Card */}
        <div className="demo-unit">
          <div className="unit-top-bar">
            <span className="unit-title">1. E-Commerce Product Card</span>
            <button
              type="button"
              className="unit-toggle-pill"
              onClick={() => toggleCard("product")}
            >
              {cardLoading.product ? "👀 View Real Card" : "💀 View Skeleton"}
            </button>
          </div>

          <AutoSkeleton loading={cardLoading.product} animate={animateMode}>
            <div className="real-card">
              <div className="product-image">🎧</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span className="badge-tag" style={{ alignSelf: "flex-start" }}>
                  Audio Gear
                </span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                  Sony WH-1000XM5 Wireless Headphones
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Industry-leading noise canceling with two processors, 8 microphones, and up to
                  30 hours battery life with ultra-comfort fit.
                </p>
                <div className="product-price-row">
                  <span className="product-price">$398.00</span>
                  <button type="button" className="btn-action">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </AutoSkeleton>
        </div>

        {/* Card 2: User Profile Card */}
        <div className="demo-unit">
          <div className="unit-top-bar">
            <span className="unit-title">2. User Profile Card</span>
            <button
              type="button"
              className="unit-toggle-pill"
              onClick={() => toggleCard("profile")}
            >
              {cardLoading.profile ? "👀 View Real Card" : "💀 View Skeleton"}
            </button>
          </div>

          <AutoSkeleton loading={cardLoading.profile} animate={animateMode}>
            <div className="real-card">
              <div className="user-header">
                <div className="avatar">IZ</div>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Ibnu Zaki Alhawari</h3>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    @zakiibnu723 • Fullstack Engineer
                  </span>
                </div>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Passionate React developer building developer tooling and high performance web
                applications with clean architecture.
              </p>
              <div className="user-stats">
                <div className="stat-item">
                  <div className="stat-val">128</div>
                  <div className="stat-lbl">Repos</div>
                </div>
                <div className="stat-item">
                  <div className="stat-val">4.8k</div>
                  <div className="stat-lbl">Followers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-val">892</div>
                  <div className="stat-lbl">Following</div>
                </div>
              </div>
            </div>
          </AutoSkeleton>
        </div>

        {/* Card 3: Dashboard Analytics Metric */}
        <div className="demo-unit">
          <div className="unit-top-bar">
            <span className="unit-title">3. Analytics Metric Card</span>
            <button
              type="button"
              className="unit-toggle-pill"
              onClick={() => toggleCard("metrics")}
            >
              {cardLoading.metrics ? "👀 View Real Card" : "💀 View Skeleton"}
            </button>
          </div>

          <AutoSkeleton loading={cardLoading.metrics} animate={animateMode}>
            <div className="real-card">
              <div className="metric-top">
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 700 }}>
                  Monthly Recurring Revenue
                </span>
                <span className="metric-trend">+24.8% ↑</span>
              </div>
              <div className="metric-value">$84,320</div>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                Target: $100,000 (84.3% achieved this month)
              </p>
              <div className="metric-bar-wrapper">
                <div className="metric-progress" />
              </div>
            </div>
          </AutoSkeleton>
        </div>

        {/* Card 4: Editorial Blog Post */}
        <div className="demo-unit">
          <div className="unit-top-bar">
            <span className="unit-title">4. Editorial Blog Post</span>
            <button
              type="button"
              className="unit-toggle-pill"
              onClick={() => toggleCard("article")}
            >
              {cardLoading.article ? "👀 View Real Card" : "💀 View Skeleton"}
            </button>
          </div>

          <AutoSkeleton loading={cardLoading.article} animate={animateMode}>
            <div className="real-card">
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span className="badge-tag">Engineering</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Sep 18, 2026 • 5 min read
                </span>
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.4 }}>
                Optimizing Perceived Performance in Modern Web Applications
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Skeleton loaders enhance perceived speed by up to 20% compared to traditional
                loading spinners by priming the user cognitive expectations and stabilizing layout.
              </p>
            </div>
          </AutoSkeleton>
        </div>

        {/* Card 5: Interactive Input Form */}
        <div className="demo-unit">
          <div className="unit-top-bar">
            <span className="unit-title">5. Form & Controls Card</span>
            <button
              type="button"
              className="unit-toggle-pill"
              onClick={() => toggleCard("form")}
            >
              {cardLoading.form ? "👀 View Real Card" : "💀 View Skeleton"}
            </button>
          </div>

          <AutoSkeleton loading={cardLoading.form} animate={animateMode}>
            <div className="real-card">
              <form className="mock-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-field">
                  <label htmlFor="name-input">Developer Full Name</label>
                  <input id="name-input" type="text" defaultValue="Ibnu Zaki Alhawari" />
                </div>
                <div className="form-field">
                  <label htmlFor="framework-select">Preferred Framework</label>
                  <select id="framework-select" defaultValue="React">
                    <option>React 18 / 19</option>
                    <option>Next.js App Router</option>
                    <option>Vite React SPA</option>
                  </select>
                </div>
                <button
                  type="button"
                  style={{
                    padding: "0.65rem",
                    borderRadius: "10px",
                    background: "var(--primary)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Save Configuration
                </button>
              </form>
            </div>
          </AutoSkeleton>
        </div>

        {/* Card 6: Ignore Selector Demo */}
        <div className="demo-unit">
          <div className="unit-top-bar">
            <span className="unit-title">6. Ignore Selector Demo</span>
            <button
              type="button"
              className="unit-toggle-pill"
              onClick={() => toggleCard("ignore")}
            >
              {cardLoading.ignore ? "👀 View Real Card" : "💀 View Skeleton"}
            </button>
          </div>

          <AutoSkeleton
            loading={cardLoading.ignore}
            animate={animateMode}
            ignore={[".ignore-badge", "svg"]}
          >
            <div className="real-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ fontWeight: 700, fontSize: "1.1rem" }}>System Security Status</h4>
                {/* This badge is preserved during loading via ignore prop! */}
                <span className="ignore-badge">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  PRESERVED
                </span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Elemen ini menggunakan prop <code>ignore={[".ignore-badge", "svg"]}</code>. Badge
                merah di atas tetap utuh dan tidak diubah menjadi balok skeleton saat loading!
              </p>
              <div className="status-box">
                Status: All systems operational. Zero vulnerabilities detected.
              </div>
            </div>
          </AutoSkeleton>
        </div>
      </main>
    </div>
  );
}
