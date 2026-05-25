import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '@/api'
import type { Product } from "@/api/models"
import { usePaginatedQuery } from '@/hooks/api/usePaginatedQuery'
import { getProduct } from '@/api/products'
import { useDebounce } from '@/hooks/use-debounce'
import { usePagination } from '@/hooks/use-pagination'
import { usePage, useActive, useFeatured, useOnSale, useOrder } from '@/hooks/api/use-query-params'
import { useEffect } from 'react'

const BASE = '/products'


export function useProducts(params?: Record<string, unknown>, options?: any) {
  // Query state for filters and pagination
  const [page, setPage] = usePage()
  const debouncedPage = useDebounce(page, 500)
  const [order, setOrder] = useOrder()
  
  const [active, setActive ] = useActive()
  const [featured, setFeatured] = useFeatured()
  const [onSale, setOnSale] = useOnSale()

  const newParams = { sort: order, page: debouncedPage, active, featured, on_sale:onSale, ...params }
  const query = usePaginatedQuery<Product>(['products', newParams], BASE, newParams, options)
  const pagination = usePagination({ page, setPage, items:query.data?.items, meta:query.data?.meta })
  useEffect(() => {
    console.log("Query params changed:", { order, active, featured, onSale })
    pagination.firstPage() // Reset to first page when filters or sorting change
  }, [order, active, featured, onSale])
  return {
    ...query,
    params: { 
      active, setActive, featured, setFeatured, onSale, setOnSale, order, setOrder, page, setPage 
    },
    pagination
  }
}

export function useProductDetail(id?: number | string, options?: any) {
  return useQuery<Product>(['product', id], () => getProduct(Number(id)), {
    enabled: Boolean(id),
    ...options,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation((payload: FormData | Partial<Product>) => api.post(BASE, payload), {
    onSuccess: () => qc.invalidateQueries('products'),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation(
    ({ productId, payload }: { productId: number; payload: FormData | Partial<Product> }) =>
      api.put(`${BASE}/${productId}/`, payload),
    {
      onSuccess: () => qc.invalidateQueries('products'),
    },
  )
}

export function useImportInventory() {
  const qc = useQueryClient()
  return useMutation((formData: FormData | Record<string, unknown>) => {
    if (formData instanceof FormData) {
      return api.post(`${BASE}/import-inventory-file/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.post(`${BASE}/import-inventory/`, formData)
  }, {
    onSuccess: () => qc.invalidateQueries('products'),
  })
}
