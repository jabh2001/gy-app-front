import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '@/api'

const BASE = '/cart'

export function useCart(sessionId?: string) {
  return useQuery(['cart', sessionId], () => api.get(BASE, { params: { session_id: sessionId } }))
}

export function useAddToCart() {
  const qc = useQueryClient()
  return useMutation((payload: { product_id: number; quantity?: number; session_id?: string }) => api.post(`${BASE}/add`, payload), {
    onSuccess: () => qc.invalidateQueries('cart'),
  })
}

export function useCheckout() {
  const qc = useQueryClient()
  return useMutation((payload: { session_id?: string; customer_name?: string; customer_phone?: string }) => api.post(`${BASE}/checkout`, payload), {
    onSuccess: () => qc.invalidateQueries('cart'),
  })
}
