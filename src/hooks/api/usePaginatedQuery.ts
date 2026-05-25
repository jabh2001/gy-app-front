import { useQuery, type UseQueryOptions, type UseQueryResult } from 'react-query'
import api from '@/api'
import type { PaginatedResponse, PaginationMeta } from './types'

export function usePaginatedQuery<T = any>(
  queryKey: any,
  endpoint: string,
  params?: Record<string, unknown>,
  options?: UseQueryOptions<PaginatedResponse<T>>,
): UseQueryResult<PaginatedResponse<T>> & { items: T[]; meta?: PaginationMeta } {
  const result = useQuery<PaginatedResponse<T>>(
    queryKey,
    () => api.get(endpoint, { params }) as Promise<PaginatedResponse<T>>,
    options,
  )

  return {
    ...result,
    items: result.data?.items ?? [],
    meta: result.data?.meta ?? {
      page: 1,
      page_size: 20,
      total: 0,
      total_pages: 0,
    },
  }
}