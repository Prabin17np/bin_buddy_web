import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const goToPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  return { page, paginated, totalPages, search, setSearch, goToPage };
}

export function filterBySearch<T extends object>(
  items: T[],
  search: string,
  keys: (keyof T)[]
): T[] {
  if (!search.trim()) return items;
  const q = search.toLowerCase();
  return items.filter(item =>
    keys.some(k => String(item[k] ?? "").toLowerCase().includes(q))
  );
}
