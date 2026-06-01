import { useReducedMotion } from 'framer-motion';

// Cubic-bezier ease-out matching CSS ease-out
const EASE_OUT = [0, 0, 0.2, 1];
const EASE_IN = [0.4, 0, 1, 1];

// Duration constants — all interaction animations stay ≤ 300 ms
const D_NORMAL = 0.25;   // 250 ms — enters / page transitions
const D_FAST   = 0.15;   // 150 ms — exits / taps
const D_STAGGER = 0.06;  // 60 ms between staggered children

// ─── Full variants (motion enabled) ────────────────────────────────────────

const full = {
  /** Fade + slide-up for page-level route changes */
  page: {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: D_NORMAL, ease: EASE_OUT },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: { duration: D_FAST, ease: EASE_IN },
    },
  },

  /** Container that staggers its children on mount / re-mount */
  listContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: D_STAGGER, delayChildren: 0.02 },
    },
  },

  /** Individual list/card item animated by the container's stagger */
  listItem: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: D_NORMAL, ease: EASE_OUT },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: { duration: D_FAST },
    },
  },

  /** Horizontal slide used inside multi-step / tabbed flows */
  slideForward: {
    initial: { opacity: 0, x: 32 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: D_NORMAL, ease: EASE_OUT },
    },
    exit: {
      opacity: 0,
      x: -32,
      transition: { duration: D_FAST, ease: EASE_IN },
    },
  },

  /** Card hover — subtle lift + scale */
  cardHover: { scale: 1.02, y: -4, transition: { duration: D_FAST, ease: EASE_OUT } },
  cardTap:   { scale: 0.99,        transition: { duration: 0.1 } },
};

// ─── Reduced variants (opacity only, no spatial motion) ────────────────────

const reduced = {
  page: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.1 } },
    exit:    { opacity: 0, transition: { duration: 0.1 } },
  },
  listContainer: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
  },
  listItem: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } },
    exit:    { opacity: 0, transition: { duration: 0.1 } },
  },
  slideForward: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.1 } },
    exit:    { opacity: 0, transition: { duration: 0.1 } },
  },
  cardHover: {},
  cardTap:   {},
};

// ─── Hook ──────────────────────────────────────────────────────────────────

/**
 * Returns motion variants tuned to the user's `prefers-reduced-motion`
 * setting.  Drop-in replacement for the raw variant objects so every call
 * site automatically respects the OS accessibility preference.
 */
export function useMotionVariants() {
  const shouldReduce = useReducedMotion();
  return shouldReduce ? reduced : full;
}
