import { useMutation, useQueryClient } from 'react-query'
import api from '@/api'

const BASE = '/auth'

export function useRegister() {
  return useMutation((payload: { email: string; password: string; username?: string }) => api.post(`${BASE}/register`, payload))
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation((payload: { email: string; password: string }) => api.post(`${BASE}/login`, payload), {
    onSuccess: () => {
      // after login most apps refetch current user or other queries
      qc.invalidateQueries()
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation(() => api.post(`${BASE}/logout`), {
    onSuccess: () => qc.invalidateQueries(),
  })
}
