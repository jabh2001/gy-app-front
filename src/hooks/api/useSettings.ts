import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '@/api'
import type { SettingsFormData } from '@/components/own/forms/settings-form'

const BASE = '/settings'

export function useSettings() {
  return useQuery(['settings'], () => api.get(BASE))
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation((payload: Partial<SettingsFormData>) => api.post(BASE, payload), {
    onSuccess: () => qc.invalidateQueries('settings'),
  })
}
