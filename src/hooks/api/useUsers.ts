import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '@/api'
import type { User } from "@/api/models" // Asegúrate de tener la interfaz User en tus modelos
import { usePaginatedQuery } from '@/hooks/api/usePaginatedQuery'
import { useDebounce } from '@/hooks/use-debounce'
import { usePagination } from '@/hooks/use-pagination'
import { useOrder, usePage } from '@/hooks/api/use-query-params'

const BASE = '/users'

export function useUsers(params?: Record<string, unknown>, options?: any) {
    // Estado para la paginación
    const [page, setPage] = usePage()
    const debouncedPage = useDebounce(page, 500)
    const [order, setOrder] = useOrder()

    // El backend soporta 'q' (búsqueda) y 'role' (filtro).
    // Estos se pueden inyectar dinámicamente mediante el argumento `params`.
    const newParams = { sort: order, page: debouncedPage, ...params }

    const query = usePaginatedQuery<User>(['users', newParams], BASE, newParams, options)
    const pagination = usePagination({ page, setPage, items: query.data?.items, meta: query.data?.meta })

    return {
        ...query,
        params: {
            order, setOrder, page, setPage 
        },
        pagination
    }
}

export function useUserDetail(id?: number | string, options?: any) {
    return useQuery<User>(
        ['user', id],
        // Si tienes un archivo api/users.ts, podrías importar getUser() en su lugar
        () => api.get(`${BASE}/${id}/`).then(res => res.data?.data || res.data),
        {
            enabled: Boolean(id),
            ...options,
        }
    )
}

export function useCreateUser() {
    const qc = useQueryClient()
    return useMutation((payload: Partial<User> & { password?: string }) => api.post(BASE, payload), {
        onSuccess: () => qc.invalidateQueries('users'),
    })
}

export function useUpdateUser() {
    const qc = useQueryClient()
    return useMutation(
        ({ userId, payload }: { userId: number | string; payload: Partial<User> & { password?: string } }) =>
            api.put(`${BASE}/${userId}/`, payload),
        {
            onSuccess: () => qc.invalidateQueries('users'),
            // Invalida también la caché individual del usuario editado
            onSettled: (_, __, variables) => {
                qc.invalidateQueries(['user', variables.userId])
            }
        },
    )
}

export function useDeleteUser() {
    const qc = useQueryClient()
    return useMutation((userId: number | string) => api.delete(`${BASE}/${userId}/`), {
        onSuccess: () => qc.invalidateQueries('users'),
    })
}