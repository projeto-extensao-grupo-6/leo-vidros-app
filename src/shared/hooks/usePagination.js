import { useState, useMemo, useCallback } from 'react';

/**
 * Hook customizado para paginação de listas
 * @param {Array} items - Array de itens a serem paginados
 * @param {number} itemsPerPage - Número de itens por página (padrão: 10)
 * @returns {Object} Estado e handlers de paginação
 * 
 * @example
 * const { 
 *   currentPage, 
 *   totalPages, 
 *   paginatedItems, 
 *   goToPage, 
 *   nextPage, 
 *   prevPage,
 *   canGoNext,
 *   canGoPrev
 * } = usePagination(items, 10);
 */
export const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Items da página atual
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Ir para uma página específica
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  // Ir para próxima página
  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  // Ir para página anterior
  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  // Verificar se pode avançar
  const canGoNext = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  // Verificar se pode voltar
  const canGoPrev = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  // Reset para primeira página quando items mudarem
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Informações da página
  const pageInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);
    
    return {
      from: items.length > 0 ? startIndex + 1 : 0,
      to: endIndex,
      total: items.length,
      currentPage,
      totalPages
    };
  }, [currentPage, items.length, itemsPerPage, totalPages]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    reset,
    pageInfo,
    setItemsPerPage: itemsPerPage, // Para referência
  };
};

export default usePagination;
