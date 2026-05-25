import { useMutation, useQueryClient } from 'react-query'
import api from '@/api'
import type { Category } from './types'
import { usePaginatedQuery } from './usePaginatedQuery'

const BASE = '/categories'

export function useCategories(params?: Record<string, unknown>, options?: any) {
  return usePaginatedQuery<Category>(['categories', params], BASE, params, options)
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation((payload: Partial<Category>) => api.post(BASE, payload), {
    onSuccess: () => qc.invalidateQueries('categories'),
  })
}
