import { useState, useMemo, useEffect } from 'react';

/**
 * Hook para gerenciar paginação de listas.
 *
 * @param {Array} items - Lista completa de itens a paginar
 * @param {number} itemsPerPage - Quantidade de itens por página
 * @returns {{
 *   page: number,
 *   setPage: (n: number) => void,
 *   paginated: Array,
 *   totalPages: number,
 *   next: () => void,
 *   prev: () => void,
 *   startIndex: number,
 *   endIndex: number,
 *   total: number
 * }}
 *
 * @example
 * const { page, paginated, totalPages, next, prev } = usePagination(lista, 10);
 */
export function usePagination(items, itemsPerPage) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, items.length);

  const paginated = useMemo(
    () => items.slice(startIndex, startIndex + itemsPerPage),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, startIndex, itemsPerPage]
  );

  // Corrige a página quando os dados mudam (ex.: fitlragem reduz o total)
  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
    else if (page === 0 && totalPages > 0) setPage(1);
  }, [totalPages, page]);

  const next = () => page < totalPages && setPage((p) => p + 1);
  const prev = () => page > 1 && setPage((p) => p - 1);

  return {
    page,
    setPage,
    paginated,
    totalPages,
    next,
    prev,
    startIndex,
    endIndex,
    total: items.length,
  };
}

export default usePagination;
