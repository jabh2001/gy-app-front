import api from './index'
import type { BillingData } from './models'

export type BillingDataPayload = {
  full_name: string
  address_line1?: string | null
  rif: string
  phone?: string | null
}

const BASE = '/billing-data'

export async function listBillingData(): Promise<BillingData[]> {
  return api.get(BASE + '/')
}

export async function createBillingData(payload: BillingDataPayload): Promise<BillingData> {
  return api.post(BASE + '/', payload)
}

export async function updateBillingData(billingId: number, payload: Partial<BillingDataPayload>): Promise<BillingData> {
  return api.put(`${BASE}/${billingId}/`, payload)
}

export async function deleteBillingData(billingId: number): Promise<{ message: string }> {
  return api.delete(`${BASE}/${billingId}/`)
}
