/**
 * Barrel de exportação dos hooks globais.
 * Permite imports como: import { useModal, usePagination } from '@/hooks';
 * Permite imports como: import { useDashboardKpis, usePedidosProduto } from '@/hooks';
 */

export { useModal } from './useModal';
export { usePagination } from './usePagination';
export * from './queries';
