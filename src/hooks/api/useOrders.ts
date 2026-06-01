import { useQuery, useMutation, useQueryClient, type UseMutationOptions } from 'react-query'
import api from '@/api'
import { usePaginatedQuery } from '@/hooks/api/usePaginatedQuery'
import { useDebounce } from '@/hooks/use-debounce'
import { usePagination } from '@/hooks/use-pagination'
import { usePage, useQ } from '@/hooks/api/use-query-params'
import type { Order } from '@/api/models'
import type { ListOrdersParams } from '@/api/orders'

const BASE = '/orders'// Interfaces de payloads y respuestas basadas en tu backend de Flask
export interface CheckoutPayload {
  session_id?: string
  billing_data_id: number
  payment_method: string
}

export interface CheckoutResponse {
  order: Order
  whatsapp_sent: boolean
  order_url: string
  whatsapp_url: string | null
}

export function useOrders(params?: ListOrdersParams, options?: any) {
  const [page, setPage] = usePage()
  const [q, setQ] = useQ()
  const debouncedQuery = useDebounce(q, 500)
  const newParams = { page, q: debouncedQuery, ...params }

  const query = usePaginatedQuery<Order>(['orders', newParams], BASE+'/', newParams, options)
  const pagination = usePagination({ page, setPage, items: query.data?.items, meta: query.data?.meta })

  return {
    ...query,
    params: {
      page,
      setPage,
      q,
      setQ,
    },
    pagination,
  }
}

export function useOrderDetail(orderId?: number | string, options?: any) {
  return useQuery<Order>(['order', orderId], () => api.get(`${BASE}/${orderId}/`), {
    enabled: Boolean(orderId),
    ...options,
  })
}

export function useCheckout(
  options?: UseMutationOptions<CheckoutResponse, Error, CheckoutPayload>
) {
  const queryClient = useQueryClient()
  
  return useMutation<CheckoutResponse, Error, CheckoutPayload>(
    (payload) => api.post('/cart/checkout/', payload), 
    {
      ...options,
      onSuccess: (...args) => {
        queryClient.invalidateQueries('cart')
        queryClient.invalidateQueries('orders')
        // Si pasaste un onSuccess por opciones externas, lo ejecuta resguardando la lógica
        if (options?.onSuccess) options.onSuccess(...args)
      },
    }
  )
}

export function useCancelOrder() {
  const queryClient = useQueryClient()
  return useMutation((orderId: number) => api.post(`${BASE}/cancel/${orderId}/`), {
    onSuccess: () => {
      queryClient.invalidateQueries('orders')
    },
  })
}
