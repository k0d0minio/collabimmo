'use client';

import { Variants } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

/**
 * Check if user prefers reduced motion
 */
export function useShouldReduceMotion(): boolean {
  return useReducedMotion() ?? false;
}

/**
 * Detect if device is mobile based on window width
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Get animation duration based on device type and reduced motion preference
 */
export function getAnimationDuration(reduceMotion: boolean, mobile: boolean): number {
  if (reduceMotion) return 0;
  return mobile ? 300 : 500;
}

/**
 * Subtle fade-in-up animation variant
 * Opacity: 0 → 1
 * TranslateY: 20px → 0
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (custom?: { duration?: number; delay?: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom?.duration ?? 0.5,
      delay: custom?.delay ?? 0,
      ease: [0.25, 0.1, 0.25, 1], // ease-out curve
    },
  }),
};

/**
 * Fade-in-down animation variant (for mobile menu)
 */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/**
 * Stagger container variant for animating children with delay
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: (custom?: { staggerDelay?: number }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom?.staggerDelay ?? 0.1,
      delayChildren: 0,
    },
  }),
};

/**
 * Button hover animation variant
 */
export const buttonHover: Variants = {
  rest: {
    scale: 1,
    opacity: 1,
  },
  hover: {
    scale: 1.02,
    opacity: 0.9,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

/**
 * Get optimized animation variants based on device and user preferences
 */
export function getOptimizedVariants(
  baseVariants: Variants,
  reduceMotion: boolean,
  mobile: boolean
): Variants {
  if (reduceMotion) {
    // Return minimal animation for reduced motion
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0 } },
    };
  }

  // Adjust duration for mobile
  const duration = mobile ? 0.3 : 0.5;
  
  // Deep clone and adjust durations
  const optimized = JSON.parse(JSON.stringify(baseVariants));
  
  const adjustDuration = (obj: any) => {
    if (obj && typeof obj === 'object') {
      if (obj.transition && typeof obj.transition.duration === 'number') {
        obj.transition.duration = duration;
      }
      Object.values(obj).forEach(adjustDuration);
    }
  };
  
  adjustDuration(optimized);
  return optimized;
}

