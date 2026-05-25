import { useCallback, useMemo } from "react"
import type { PaginationMeta } from "@/hooks/api/types"

type PageSetter = (
  value: number | ((prev: number) => number)
) => void | Promise<unknown>

type Props<T> = {
  page: number
  setPage: PageSetter
  items?: T[]
  meta?: PaginationMeta | null
  defaultPageSize?: number
}

export const usePagination = <T,>({
  page,
  setPage,
  items = [],
  meta,
  defaultPageSize = 20,
}: Props<T>) => {
  const total = meta?.total ?? 0
  const totalPages = Math.max(meta?.total_pages ?? 1, 1)
  const pageSize = meta?.page_size ?? defaultPageSize
  const currentPage = meta?.page ?? page
  const pageIndex = Math.max(currentPage - 1, 0)

  const from = useMemo(() => {
    if (total === 0) return 0
    return pageIndex * pageSize + 1
  }, [total, pageIndex, pageSize])

  const to = useMemo(() => {
    if (total === 0) return 0
    return Math.min(pageIndex * pageSize + items.length, total)
  }, [total, pageIndex, pageSize, items.length])

  const showedItems = to

  const canPrevPage = page > 1
  const canNextPage = page < totalPages

  const nextPage = useCallback(() => {
    setPage((prev) => {
      if (prev >= totalPages) return prev
      return prev + 1
    })
  }, [setPage, totalPages])

  const prevPage = useCallback(() => {
    setPage((prev) => {
      if (prev <= 1) return prev
      return prev - 1
    })
  }, [setPage])

  const goToPage = useCallback(
    (targetPage: number) => {
      const safePage = Math.min(Math.max(targetPage, 1), totalPages)
      setPage(safePage)
    },
    [setPage, totalPages]
  )

  const firstPage = useCallback(() => {
    setPage(1)
  }, [setPage])

  const lastPage = useCallback(() => {
    setPage(totalPages)
  }, [setPage, totalPages])

  const resetPage = useCallback(() => {
    setPage(1)
  }, [setPage])

  const paginationText = meta
    ? `Página ${currentPage} de ${totalPages}`
    : "Cargando..."

  const resultsText =
    total > 0
      ? `Mostrando ${from}-${to} de ${total}`
      : "Mostrando 0 resultados"

  return {
    page,
    currentPage,
    pageIndex,
    pageSize,
    total,
    totalPages,

    from,
    to,
    showedItems,
    itemsCount: items.length,

    canPrevPage,
    canNextPage,
    isFirstPage: page <= 1,
    isLastPage: page >= totalPages,
    hasResults: total > 0,

    nextPage,
    prevPage,
    goToPage,
    firstPage,
    lastPage,
    resetPage,

    paginationText,
    resultsText,
  }
}