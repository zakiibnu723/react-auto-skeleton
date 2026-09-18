import React, { ReactElement } from "react";

// ─── Text Node Check ──────────────────────────────────────────────────────────

/**
 * Returns true if `node` is a non-empty text node.
 * Used by the analyzer to detect "text-only" leaf elements.
 */
export function isMeaningfulText(node: ChildNode): boolean {
  return node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim());
}

// ─── Text Bar Generator ───────────────────────────────────────────────────────

/**
 * Converts a text-bearing element into a stack of rectangular skeleton bars
 * that mimic the line count and height of the original text.
 *
 * Strategy:
 *  - Compute `lineCount` from `rect.height / lineHeight`
 *  - The last line is shortened to 60% width to simulate a natural paragraph end
 *  - Each bar height is clamped between 6px and 22px for visual consistency
 *
 * @param style       Computed style of the original element
 * @param rect        Bounding rectangle of the original element
 * @param animateClass CSS class for shimmer/pulse animation
 * @returns           A `<div class="ras-text-stack">` wrapping one or more bars
 */
export function createTextBars(
  style: CSSStyleDeclaration,
  rect: DOMRect,
  animateClass: string
): ReactElement {
  const bars: ReactElement[] = [];
  const fontSize = parseFloat(style.fontSize) || 14;

  // Resolve lineHeight to px — handles px, unitless multiplier, and "normal"
  const lineHeight = (() => {
    const raw = style.lineHeight;
    if (raw.endsWith("px")) return parseFloat(raw);
    if (raw === "normal") return fontSize * 1.4;
    if (!Number.isNaN(Number(raw))) return Number(raw) * fontSize;
    return fontSize * 1.4;
  })();

  const height = rect.height || lineHeight;
  const lineCount = Math.max(1, Math.round(height / lineHeight));
  const barHeight = Math.max(6, Math.min(lineHeight * 0.9, 22));

  for (let i = 0; i < lineCount; i += 1) {
    // Last line of multi-line text gets 60% width (natural paragraph break)
    const widthPct = i === lineCount - 1 && lineCount > 1 ? 0.6 : 1;
    const barWidth = rect.width > 0 ? `${rect.width * widthPct}px` : `${widthPct * 100}%`;

    bars.push(
      <div
        key={`text-bar-${i}`}
        className={`ras-skeleton ${animateClass}`.trim()}
        style={{
          height: `${barHeight}px`,
          width: barWidth
        }}
      />
    );
  }

  return <div className="ras-text-stack">{bars}</div>;
}
