// ─── Style Sheet ID ───────────────────────────────────────────────────────────

/** Unique ID of the <style> tag injected into <head>. Used to prevent duplicates. */
export const STYLE_ID = "ras-style-sheet";

// ─── Global CSS ───────────────────────────────────────────────────────────────

/**
 * All CSS required by the library, injected once into <head> on first render.
 *
 * Includes:
 *  - CSS custom properties (--ras-base, --ras-highlight) for easy theming
 *  - .ras-skeleton  — base style for every skeleton block
 *  - .ras-animate-shimmer — horizontal gradient sweep animation
 *  - .ras-animate-pulse   — opacity fade-in/out animation
 *  - .ras-text-stack      — flex column container for multi-line text bars
 */
export const styleSheet = `
:root {
  /* Tier 1: Container / Card Surface (Abu Cerah) */
  --ras-card-bg: #e2e8f0;
  --ras-card-border: #cbd5e1;
  --ras-subcontainer-bg: #cbd5e1;
  --ras-subcontainer-border: #94a3b8;

  /* Tier 2: Leaf Component Elements (Abu Dark) */
  --ras-base: #334155;
  --ras-highlight: #475569;
}

.ras-container {
  background-color: var(--ras-card-bg) !important;
  border: 1px solid var(--ras-card-border) !important;
  background-image: none !important;
  box-shadow: none !important;
}

.ras-subcontainer {
  background-color: var(--ras-subcontainer-bg) !important;
  border: 1px solid var(--ras-subcontainer-border) !important;
  background-image: none !important;
  box-shadow: none !important;
}

.ras-skeleton {
  position: relative;
  background: var(--ras-base) !important;
  background-color: var(--ras-base) !important;
  border: none !important;
  border-radius: var(--ras-radius, 8px);
  overflow: hidden;
  transform: translateZ(0);
}

.ras-animate-shimmer {
  background: linear-gradient(90deg, var(--ras-base) 0%, var(--ras-highlight) 50%, var(--ras-base) 100%) !important;
  background-size: 200% 100% !important;
  animation: ras-shimmer 1.6s linear infinite !important;
}

.ras-animate-pulse {
  animation: ras-pulse 1.4s ease-in-out infinite !important;
}

@keyframes ras-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes ras-pulse {
  0% { opacity: 0.88; }
  50% { opacity: 0.45; }
  100% { opacity: 0.88; }
}

.ras-text-stack {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
`;

// ─── Style Injection ──────────────────────────────────────────────────────────

/**
 * Injects the library stylesheet into `<head>` exactly once.
 * Safe to call multiple times — it checks for STYLE_ID before inserting.
 * No-op in SSR environments (where `document` is undefined).
 */
export function ensureStyleSheetInjected() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = styleSheet;
  document.head.appendChild(style);
}
