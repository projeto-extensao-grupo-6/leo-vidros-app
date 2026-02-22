import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes condicionais (clsx) e resolve conflitos do Tailwind (twMerge).
 *
 * @param {...import('clsx').ClassValue} inputs - Classes ou expressões condicionais
 * @returns {string} String de classes CSS mesclada e sem conflitos
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'px-2') // → 'py-2 bg-blue-500 px-2'
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}