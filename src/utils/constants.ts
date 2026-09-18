import { ReactNode } from "react";

// ─── Public Props Type ────────────────────────────────────────────────────────

export type AutoSkeletonProps = {
  /** When true, renders the skeleton overlay. When false, renders real children. */
  loading?: boolean;
  /** Animation style applied to every skeleton element. Default: "shimmer". */
  animate?: "shimmer" | "pulse" | "none";
  /** Array of CSS selectors whose matching elements are skipped during generation. */
  ignore?: string[];
  /** CSS class added to the outermost wrapper container. */
  className?: string;
  /** The React component(s) to wrap with skeleton functionality. Required. */
  children: ReactNode;
};

// ─── DOM Classification Sets ──────────────────────────────────────────────────

/** Display values that behave like inline elements and need width coercion. */
export const INLINE_BLOCK_LIKE = new Set(["inline", "inline-block", "inline-flex"]);

/** HTML tags treated as interactive form controls → rendered as solid skeleton blocks. */
export const INTERACTIVE_TAGS = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA"]);

/** HTML tags treated as media containers → rendered as solid skeleton blocks. */
export const MEDIA_TAGS = new Set(["IMG", "VIDEO", "CANVAS", "PICTURE"]);
