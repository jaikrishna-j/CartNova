import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 * This utility function merges Tailwind CSS classes intelligently,
 * resolving conflicts and ensuring proper class precedence.
 * 
 * @param {...(string | object | undefined | null | boolean)} inputs - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
