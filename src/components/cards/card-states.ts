import type { Variants, Transition } from "framer-motion";
import type { VisualState } from "@/types/state";

/**
 * Framer Motion variants for each VisualState.
 * Used by TeamCard to animate based on team.visual_state.
 *
 * Note: border styles and box-shadow are handled via inline styles
 * because Framer Motion cannot animate CSS custom properties.
 * These variants handle transform and opacity only (GPU-accelerated).
 */
export const cardVariants: Variants = {
  active: {
    scale: 1,
    opacity: 1,
    rotate: 0,
  },
  waiting: {
    scale: 1,
    opacity: 1,
    rotate: 0,
  },
  celebrating: {
    scale: 1.05,
    opacity: 1,
    rotate: 0,
  },
  pivoting: {
    scale: 0.9,
    opacity: 0,
    rotate: 0,
  },
  pivoted: {
    scale: 1,
    opacity: 1,
    rotate: 0,
  },
  hero: {
    scale: 1.02,
    opacity: 1,
    rotate: 0,
  },
};

/**
 * Transition configs per visual state.
 */
export const cardTransitions: Record<VisualState, Transition> = {
  active: {
    type: "tween" as const,
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1],
  },
  waiting: {
    type: "tween" as const,
    duration: 0.3,
  },
  celebrating: {
    type: "spring" as const,
    duration: 0.5,
  },
  pivoting: {
    type: "tween" as const,
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  pivoted: {
    type: "tween" as const,
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1],
  },
  hero: {
    type: "tween" as const,
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
  },
};

/**
 * Border and glow styles per visual state.
 * Returns CSS-compatible inline style properties.
 */
export function getStateBorderStyle(
  visualState: VisualState,
  teamColor: string
): {
  borderColor: string;
  borderWidth: number;
  borderStyle: string;
  boxShadow: string;
} {
  switch (visualState) {
    case "hero":
      return {
        borderColor: "#FFD700",
        borderWidth: 4,
        borderStyle: "solid",
        boxShadow: "var(--shadow-glow-gold)",
      };
    case "celebrating":
      return {
        borderColor: "#FFFFFF",
        borderWidth: 4,
        borderStyle: "solid",
        boxShadow: "var(--shadow-glow-white)",
      };
    case "waiting":
      return {
        borderColor: "#BFFF00",
        borderWidth: 3,
        borderStyle: "solid",
        boxShadow: "var(--shadow-glow-lime)",
      };
    case "pivoting":
      return {
        borderColor: "#818CF8",
        borderWidth: 2,
        borderStyle: "dashed",
        boxShadow: "none",
      };
    case "pivoted":
      return {
        borderColor: "#818CF8",
        borderWidth: 3,
        borderStyle: "dashed",
        boxShadow: "none",
      };
    default:
      return {
        borderColor: teamColor || "#7C3AED",
        borderWidth: 3,
        borderStyle: "solid",
        boxShadow: "var(--shadow-glow-violet)",
      };
  }
}
