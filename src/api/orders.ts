import api from './index'
import type { Order } from './models'
import type { PaginationMeta } from '@/hooks/api/types'

export type ListOrdersParams = {
  q?: string
  status?: string
  page?: number
  page_size?: number
}

export type PaginatedOrdersResponse = {
  items: Order[]
  meta: PaginationMeta
}

export type CheckoutPayload = {
  session_id?: string
  billing_data_id: number
  payment_method: string
}

export async function listOrders(params: ListOrdersParams = {}): Promise<PaginatedOrdersResponse> {
  return api.get('/orders/', { params })
}

export async function getOrder(orderId: number): Promise<Order> {
  return api.get(`/orders/${orderId}/`)
}

export async function cancelOrder(orderId: number): Promise<{ message: string; order: Order }> {
  return api.post(`/orders/cancel/${orderId}/`)
}

export async function downloadInvoice(orderId: number): Promise<Blob> {
  return api.get(`/orders/${orderId}/invoice/`, { responseType: 'blob' })
}
