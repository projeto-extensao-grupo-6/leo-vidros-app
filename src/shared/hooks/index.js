/**
 * Exportação centralizada de hooks customizados
 * Facilita importações: import { useModal, usePagination } from '@/shared/hooks'
 */

export { useModal } from './useModal';
export { usePagination } from './usePagination';
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useLocalStorage, useLocalStorageSimple } from './useLocalStorage';

// Re-export default para compatibilidade
export { default as useModalDefault } from './useModal';
export { default as usePaginationDefault } from './usePagination';
export { default as useDebounceDefault } from './useDebounce';
export { default as useLocalStorageDefault } from './useLocalStorage';
