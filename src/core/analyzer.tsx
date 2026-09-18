import React, { CSSProperties, ReactElement, ReactNode } from "react";
import { INTERACTIVE_TAGS, MEDIA_TAGS, AutoSkeletonProps } from "../utils/constants";
import { isMeaningfulText, createTextBars } from "./generator";

// ─── Selector Matching ────────────────────────────────────────────────────────

/**
 * Returns true if `el` matches any selector in the `ignore` array.
 * Invalid selectors are silently ignored (try/catch) to prevent crashes.
 *
 * @param el      The DOM element to test
 * @param ignore  Array of CSS selector strings from the `ignore` prop
 */
export function matchesIgnore(el: Element, ignore?: string[]): boolean {
  if (!ignore || ignore.length === 0) return false;
  return ignore.some((selector) => {
    try {
      return el.matches(selector);
    } catch {
      return false;
    }
  });
}

// ─── CSS Layout Extraction ────────────────────────────────────────────────────

/**
 * Reads a computed style + bounding rect and returns a React CSSProperties object
 * that faithfully reproduces the layout of the original element as a skeleton block.
 *
 * Preserved properties:
 *  - display (block / flex / grid / inline-block)
 *  - flex container props (direction, wrap, align, justify, gap)
 *  - grid container props (template columns/rows, gap)
 *  - grid item positioning (gridColumn, gridRow)
 *  - spacing (padding, margin, flex, alignSelf)
 *  - positioning (position, top/right/bottom/left, zIndex)
 *  - dimensions (width, height, min/max variants, aspectRatio)
 *  - visual (borderRadius, backgroundColor, border)
 *
 * @param style  Computed style of the original element
 * @param rect   Bounding rect of the original element
 */
export function baseBoxStyle(
  style: CSSStyleDeclaration,
  rect: DOMRect,
  isContainer = false,
  depth = 0
): CSSProperties {
  const result: CSSProperties = {};
  const display = style.display === "inline" ? "inline-block" : style.display;
  result.display = display as CSSProperties["display"];

  // Flex container
  if (display.startsWith("flex")) {
    result.flexDirection = style.flexDirection as CSSProperties["flexDirection"];
    result.alignItems = style.alignItems as CSSProperties["alignItems"];
    result.justifyContent = style.justifyContent as CSSProperties["justifyContent"];
    result.flexWrap = style.flexWrap as CSSProperties["flexWrap"];
    if (style.gap !== "normal") result.gap = style.gap;
    if (style.rowGap !== "normal") result.rowGap = style.rowGap;
    if (style.columnGap !== "normal") result.columnGap = style.columnGap;
  }

  // Grid container
  if (display.startsWith("grid")) {
    result.display = style.display as CSSProperties["display"];
    result.gridTemplateColumns = style.gridTemplateColumns;
    result.gridTemplateRows = style.gridTemplateRows;
    result.gap = style.gap;
  }

  // Grid item positioning
  if (style.gridColumn && style.gridColumn !== "auto") result.gridColumn = style.gridColumn;
  if (style.gridRow && style.gridRow !== "auto") result.gridRow = style.gridRow;

  // Spacing & flex item
  if (style.padding !== "") result.padding = style.padding;
  if (style.margin !== "") result.margin = style.margin;
  if (style.flex !== "0 1 auto") result.flex = style.flex;
  if (style.alignSelf !== "auto") result.alignSelf = style.alignSelf as CSSProperties["alignSelf"];

  // Non-static positioning
  if (style.position && style.position !== "static") {
    result.position = style.position as CSSProperties["position"];
    if (style.top && style.top !== "auto") result.top = style.top;
    if (style.right && style.right !== "auto") result.right = style.right;
    if (style.bottom && style.bottom !== "auto") result.bottom = style.bottom;
    if (style.left && style.left !== "auto") result.left = style.left;
    if (style.zIndex && style.zIndex !== "auto") result.zIndex = style.zIndex;
  }

  // Dimensions
  if (style.width && style.width !== "auto") result.width = style.width;
  if (style.minWidth && style.minWidth !== "auto") result.minWidth = style.minWidth;
  if (style.maxWidth && style.maxWidth !== "none") result.maxWidth = style.maxWidth;
  if (style.height && style.height !== "auto") result.height = style.height;
  if (style.minHeight && style.minHeight !== "auto") result.minHeight = style.minHeight;
  if (style.maxHeight && style.maxHeight !== "none") result.maxHeight = style.maxHeight;
  if (style.aspectRatio && style.aspectRatio !== "auto") result.aspectRatio = style.aspectRatio;

  // Visual — border-radius scales with element height, clamped 2–12px
  result.borderRadius =
    style.borderRadius && style.borderRadius !== "0px"
      ? style.borderRadius
      : isContainer
        ? undefined
        : `${Math.max(2, Math.min(12, rect.height / 4 || 8))}px`;

  // Preserve or transform background color & border
  const hasBg =
    (style.backgroundColor &&
      style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
      style.backgroundColor !== "transparent") ||
    (style.backgroundImage && style.backgroundImage !== "none");

  const hasBorder = style.border && style.border !== "0px none rgb(0, 0, 0)";

  if (isContainer) {
    if (hasBg) {
      result.backgroundColor =
        depth > 0
          ? "var(--ras-subcontainer-bg, #cbd5e1)"
          : "var(--ras-card-bg, #e2e8f0)";
      result.backgroundImage = "none";
    }
    if (hasBorder) {
      result.borderColor =
        depth > 0
          ? "var(--ras-subcontainer-border, #94a3b8)"
          : "var(--ras-card-border, #cbd5e1)";
    }
    result.boxShadow = "none";
  } else {
    // Leaf elements: background is driven by .ras-skeleton and shimmer animations
    delete result.backgroundColor;
    delete result.backgroundImage;
    result.borderColor = "transparent";
  }

  return result;
}

// ─── Recursive DOM Walker ─────────────────────────────────────────────────────

/**
 * Recursively converts a single DOM node into a React skeleton element.
 */
export function createSkeletonNode(
  node: ChildNode,
  animateClass: string,
  ignore?: string[],
  depth = 0
): ReactNode | null {
  if (node.nodeType === Node.TEXT_NODE) return null;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const el = node as HTMLElement;
  if (matchesIgnore(el, ignore)) return null;

  const computed = getComputedStyle(el);
  if (computed.display === "none" || computed.visibility === "hidden") return null;

  const rect = el.getBoundingClientRect();
  const children = Array.from(el.childNodes)
    .map((child) => createSkeletonNode(child, animateClass, ignore, depth + 1))
    .filter(Boolean) as ReactElement[];

  const textOnly = children.length === 0 && Array.from(el.childNodes).some(isMeaningfulText);
  const isMedia = MEDIA_TAGS.has(el.tagName);
  const isInteractive = INTERACTIVE_TAGS.has(el.tagName);
  const isLeaf = children.length === 0 || isMedia || isInteractive;
  const style = baseBoxStyle(computed, rect, false, depth);

  // Detect background, gradient, or border
  const hasBackground =
    (computed.backgroundColor &&
      computed.backgroundColor !== "rgba(0, 0, 0, 0)" &&
      computed.backgroundColor !== "transparent") ||
    (computed.backgroundImage && computed.backgroundImage !== "none") ||
    (computed.borderWidth &&
      parseFloat(computed.borderWidth) > 0 &&
      computed.borderStyle !== "none");

  // Circle detection: avatar or circular badge (50% radius)
  const isCircle =
    computed.borderRadius.includes("50%") ||
    (rect.width > 0 &&
      rect.height > 0 &&
      parseFloat(computed.borderRadius) >= Math.min(rect.width, rect.height) / 2);

  // ── 1. Circular Avatar or Badge → ALWAYS solid round skeleton ──────────────
  if (isCircle && (isLeaf || rect.width <= 140)) {
    return (
      <div
        key={el.dataset?.rasKey || undefined}
        className={`ras-skeleton ${animateClass}`.trim()}
        style={{
          ...style,
          width: rect.width ? `${rect.width}px` : style.width,
          height: rect.height ? `${rect.height}px` : style.height,
          borderRadius: "50%",
          flexShrink: 0
        }}
      />
    );
  }

  // ── 2. Stat Box / Sub-Card Detection (e.g. 128 Repos box) ──────────────────
  // If an element is a sub-box container with a background/border and compact size,
  // render the whole box as a solid skeleton block instead of recursing into tiny text bars!
  const isStatBox =
    children.length > 0 &&
    hasBackground &&
    rect.height > 0 &&
    rect.height <= 110 &&
    rect.width > 0 &&
    rect.width <= 200 &&
    (el.textContent?.trim().length || 0) < 30;

  if (isStatBox) {
    return (
      <div
        key={el.dataset?.rasKey || undefined}
        className={`ras-skeleton ${animateClass}`.trim()}
        style={{
          ...style,
          width: rect.width ? `${rect.width}px` : style.width,
          height: rect.height ? `${rect.height}px` : style.height,
          borderRadius: style.borderRadius || "10px"
        }}
      />
    );
  }

  // ── 3. Media or Interactive → solid block ──────────────────────────────────
  if (isMedia || isInteractive) {
    return (
      <div
        key={el.dataset?.rasKey || undefined}
        className={`ras-skeleton ${animateClass}`.trim()}
        style={{
          ...style,
          width: rect.width ? `${rect.width}px` : style.width,
          height: rect.height ? `${rect.height}px` : style.height
        }}
      />
    );
  }

  // ── 4. Text-bearing leaf node ──────────────────────────────────────────────
  if (isLeaf && textOnly) {
    const textContent = Array.from(el.childNodes)
      .filter((c) => c.nodeType === Node.TEXT_NODE)
      .map((c) => c.textContent?.trim() || "")
      .join("");

    const words = textContent.split(/\s+/).filter(Boolean);

    // True prose text (titles, headings, paragraphs with multiple words)
    // must ALWAYS be rendered as authentic stacked text bars!
    const isProseText = words.length >= 2 || textContent.length > 8;

    // Visual placeholder: only when NOT prose text AND (has background/gradient OR tall height with single emoji/initials)
    const isVisualPlaceholder =
      !isProseText &&
      (hasBackground || (textContent.length <= 4 && (rect.height >= 36 || rect.width >= 36)));

    if (isVisualPlaceholder) {
      return (
        <div
          key={el.dataset?.rasKey || undefined}
          className={`ras-skeleton ${animateClass}`.trim()}
          style={{
            ...style,
            width: rect.width ? `${rect.width}px` : style.width,
            height: rect.height ? `${rect.height}px` : style.height
          }}
        />
      );
    }

    // Standard multi-line or single-line text → stacked bars
    const textBars = createTextBars(computed, rect, animateClass);
    return (
      <div style={style} key={el.dataset?.rasKey || undefined}>
        {textBars}
      </div>
    );
  }

  // ── 5. Other leaf (e.g. empty div, icon wrapper) → solid block ─────────────
  if (isLeaf) {
    return (
      <div
        key={el.dataset?.rasKey || undefined}
        className={`ras-skeleton ${animateClass}`.trim()}
        style={{
          ...style,
          width: rect.width ? `${rect.width}px` : style.width,
          height: rect.height ? `${rect.height}px` : style.height
        }}
      />
    );
  }

  // ── 6. Container → preserve layout, render skeleton children ───────────────
  const containerStyle = baseBoxStyle(computed, rect, true, depth);
  const containerClass = depth > 0 ? "ras-subcontainer" : "ras-container";

  return (
    <div
      className={containerClass}
      style={containerStyle}
      key={el.dataset?.rasKey || undefined}
    >
      {children}
    </div>
  );
}

// ─── Skeleton Tree Builder ────────────────────────────────────────────────────

/**
 * Entry point for generating a full skeleton tree from a real DOM subtree.
 *
 * Resolves the animation CSS class, then maps over all direct children of
 * `root`, calling `createSkeletonNode` on each. Keys are assigned to preserve
 * React reconciliation stability.
 *
 * @param root     The `[data-ras-probe]` element containing the real render
 * @param animate  Value of the `animate` prop
 * @param ignore   Value of the `ignore` prop
 */
export function buildSkeletonTree(
  root: HTMLElement,
  animate: AutoSkeletonProps["animate"],
  ignore?: string[]
) {
  const animateClass =
    animate === "none" ? "" : animate === "pulse" ? "ras-animate-pulse" : "ras-animate-shimmer";

  const children = Array.from(root.childNodes)
    .map((child) => createSkeletonNode(child, animateClass, ignore, 0))
    .filter(Boolean)
    .map((child, index) =>
      React.isValidElement(child) ? React.cloneElement(child, { key: child.key ?? index }) : child
    );

  return <>{children}</>;
}
