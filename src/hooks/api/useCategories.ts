import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '@/api'
import { usePaginatedQuery } from './usePaginatedQuery'
import { useDebounce } from '@/hooks/use-debounce'
import { usePagination } from '@/hooks/use-pagination'
import { usePage, useActive, useFeatured, useOrder } from '@/hooks/api/use-query-params'
import type { Category } from '@/api/models'

const BASE = '/categories'

export function useCategories(params?: Record<string, unknown>, options?: any) {
  const [page, setPage] = usePage()
  const debouncedPage = useDebounce(page, 500)
  const [order, setOrder] = useOrder()

  const [active, setActive ] = useActive()
  const [featured, setFeatured] = useFeatured()

  const newParams = { sort: order, page: debouncedPage, active, featured, ...params }
  const query =  usePaginatedQuery<Category>(['categories', newParams], BASE, newParams, options)
  const pagination = usePagination({ page, setPage, items:query.data?.items, meta:query.data?.meta })

  return {
    ...query,
    params: { 
      active, setActive, featured, setFeatured, order, setOrder, page, setPage 
    },
    pagination
  }
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation((payload: Partial<Category>) => api.post(BASE, payload), {
    onSuccess: () => qc.invalidateQueries('categories'),
  })
}

export type CategoryPathMode = 'as_list' | 'as_json'

export type CategoryPathNode = Category & {
  child?: CategoryPathNode
}

export type CategoryDetail = Category & {
  path?: Category[] | CategoryPathNode | null
}

function normalizeCategoryPathMode(path: CategoryPathMode = 'as_list') {
  return path === 'as_list' ? 'as_list' : path
}

export function getCategory(categoryId: number, path: CategoryPathMode = 'as_list'): Promise<CategoryDetail> {
  const normalizedPath = normalizeCategoryPathMode(path)

  return api.get(`${BASE}/${categoryId}/`, {
    params: { path: normalizedPath },
  })
}

export function useCategoryDetail(
  id?: number | string,
  path: CategoryPathMode = 'as_list',
  options?: any,
) {
  const categoryId = Number(id)
  const normalizedPath = normalizeCategoryPathMode(path)

  return useQuery<CategoryDetail>(
    ['category', id, normalizedPath],
    () => getCategory(categoryId, normalizedPath),
    {
      enabled: Boolean(id) && Number.isFinite(categoryId),
      ...options,
    },
  )
}

export function useUpdateCategory() {
  const qc = useQueryClient()

  return useMutation(
    ({ categoryId, payload }: { categoryId: number; payload: Partial<Category> }) =>
      api.put(`${BASE}/${categoryId}/`, payload),
    {
      onSuccess: (_, variables) => {
        qc.invalidateQueries('categories')
        qc.invalidateQueries(['category', variables.categoryId])
      },
    },
  )
}