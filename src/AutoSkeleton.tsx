import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { AutoSkeletonProps } from "./utils/constants";
import { ensureStyleSheetInjected } from "./core/styles";
import { buildSkeletonTree } from "./core/analyzer";

/**
 * AutoSkeleton — Zero-config skeleton loader for React.
 *
 * Wraps any component and automatically generates a visually identical
 * skeleton overlay while `loading` is true. The skeleton is built by:
 *
 *  1. Rendering children invisibly in a hidden probe container
 *  2. Reading computed styles + bounding rects via `useLayoutEffect`
 *  3. Walking the DOM recursively and building a mirrored skeleton tree
 *  4. Re-building on resize via ResizeObserver
 *
 * When `loading` becomes false, children are rendered normally with no overhead.
 */
export function AutoSkeleton({
  loading = true,
  animate = "shimmer",
  ignore,
  className,
  children
}: AutoSkeletonProps) {
  const hiddenRef = useRef<HTMLDivElement | null>(null);
  const [skeleton, setSkeleton] = useState<ReactNode | null>(null);

  /** Memoize className to avoid unnecessary re-renders */
  const containerClassName = useMemo(() => className ?? "", [className]);

  /** Inject global CSS on first loading render (client-only, fires once) */
  useEffect(() => {
    if (!loading) return;
    ensureStyleSheetInjected();
  }, [loading]);

  /**
   * useLayoutEffect fires synchronously after DOM mutations, so computed styles
   * and bounding rects are available immediately — before the next paint.
   *
   * Re-runs whenever: animate mode, ignore list, loading state, or children change.
   * Sets up a ResizeObserver so the skeleton rebuilds if the container resizes.
   */
  useLayoutEffect(() => {
    if (!loading) return;
    const target = hiddenRef.current;
    if (!target) return;

    const probe = target.querySelector<HTMLElement>("[data-ras-probe]");
    if (!probe) return;

    setSkeleton(buildSkeletonTree(probe, animate, ignore));

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => {
        setSkeleton(buildSkeletonTree(probe, animate, ignore));
      });
      observer.observe(probe);
      return () => observer.disconnect();
    }

    return undefined;
  }, [animate, ignore, loading, children]);

  // ── Not loading → render real children directly ──────────────────────────────
  if (!loading) return <>{children}</>;



  return (
    <div className={containerClassName} style={{ position: "relative", width: "100%" }}>
      {/*
        Hidden probe: renders real children at full width but invisible.
        The browser performs layout on this subtree, making computed styles
        and bounding rects available for the analyzer to read.
      */}
      <div
        ref={hiddenRef}
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: -1,
          width: "100%"
        }}
      >
        <div data-ras-probe style={{ width: "100%" }}>
          {children}
        </div>
      </div>

      {/* Skeleton overlay — shown while loading is true */}
      {/* NOTE: animationClass is NOT applied here on purpose.
          Each .ras-skeleton element already carries the animation class via createSkeletonNode.
          Putting a gradient background on this wrapper would bleed through the
          border-radius corners of child elements that lack overflow:hidden on their
          transparent corners — causing the white/highlight artifact. */}
      <div>{skeleton}</div>
    </div>
  );
}
