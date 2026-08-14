import { useMemo, useState } from 'react';

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(0);
  const [prevTotal, setPrevTotal] = useState(items.length);

  if (items.length !== prevTotal) {
    setPrevTotal(items.length);
    setPage(0);
  }

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  const pagedItems = useMemo(
    () => items.slice(safePage * pageSize, safePage * pageSize + pageSize),
    [items, safePage, pageSize]
  );

  return {
    page: safePage,
    setPage,
    totalPages,
    pagedItems,
    pageSize,
    totalItems,
  };
}
