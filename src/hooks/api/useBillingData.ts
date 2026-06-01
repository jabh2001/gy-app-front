import { useQuery, useMutation, useQueryClient } from 'react-query'
import { listBillingData, createBillingData, updateBillingData, deleteBillingData } from '@/api/billing'
import type { BillingData } from '@/api/models'
import type { BillingDataPayload } from '@/api/billing'

const BASE_QUERY_KEY = ['billing-data']

export function useBillingData() {
  return useQuery<BillingData[]>(BASE_QUERY_KEY, () => listBillingData(), {
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })
}

export function useCreateBillingData() {
  const queryClient = useQueryClient()
  return useMutation((payload: BillingDataPayload) => createBillingData(payload), {
    onSuccess: () => queryClient.invalidateQueries(BASE_QUERY_KEY),
  })
}

export function useUpdateBillingData() {
  const queryClient = useQueryClient()
  return useMutation(
    ({ billingId, payload }: { billingId: number; payload: Partial<BillingDataPayload> }) => updateBillingData(billingId, payload),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(BASE_QUERY_KEY)
        queryClient.invalidateQueries(['billing-data', variables.billingId])
      },
    },
  )
}

export function useDeleteBillingData() {
  const queryClient = useQueryClient()
  return useMutation((billingId: number) => deleteBillingData(billingId), {
    onSuccess: () => queryClient.invalidateQueries(BASE_QUERY_KEY),
  })
}
