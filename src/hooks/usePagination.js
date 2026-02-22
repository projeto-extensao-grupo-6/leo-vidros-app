import { useState, useMemo, useEffect } from 'react';

export function usePagination(items, itemsPerPage) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, items.length);

  const paginated = useMemo(
    () => items.slice(startIndex, startIndex + itemsPerPage),
    [items, startIndex, itemsPerPage]
  );

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
