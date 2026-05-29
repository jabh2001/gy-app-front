import { useQuery } from 'react-query'
import api from '@/api'
import { useDebounce } from '@/hooks/use-debounce'
import type { Category, Product } from '@/api/models'

// Interfaces básicas para el tipado de las respuestas de búsqueda
interface SuggestionResponse {
  products: Product[]
  categories: Category[]
}

interface FullSearchResponse {
  items: any[]
  meta: {
    page: number
    page_size: number
    total: number
    total_pages: number
  }
}

/**
 * Hook exclusivo para el dropdown / sugerencias en vivo
 * @param q Término de búsqueda en tiempo real enviado desde el input
 */
export function useSearchSuggestions(q: string, options?: any) {
  const debouncedSearch = useDebounce(q, 400) // Evita peticiones basura mientras escribe

  return useQuery<SuggestionResponse>(
    ['search-suggestions', debouncedSearch],
    async () => {
      const response = await api.get('/search/suggestions', {
        params: { q: debouncedSearch }
      })
      console.log({ response })
      return response as any
    },
    {
      // Bloquea la petición si el usuario no ha escrito al menos 2 caracteres// Solo busca si pasa el filtro de caracteres y la opción enabled externa
      enabled: q.trim().length >= 2 && (options?.enabled ?? true),
      keepPreviousData: true,
      ...options
    }
  )
}

/**
 * Hook para traer los resultados completos paginados (cuando da Enter o clic en buscar)
 */
export function useSearchProducts(q: string, page: number = 1, options?: any) {
  return useQuery<FullSearchResponse>(
    ['search-products', q, page],
    async () => {
      const response = await api.get('/search/products', {
        params: { q, page }
      })
      return response.data
    },
    {
      enabled: q.trim().length > 0,
      ...options
    }
  )
}