export interface PaginationMeta {
  page: number
  page_size: number
  total: number
  total_pages: number
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

export interface Tag {
  id?: number
  name: string
  slug?: string
}

export interface Attribute {
  id?: number
  name: string
  slug?: string
}

export interface ProductImage {
  id?: number
  url: string
  alt_text?: string
  is_main?: boolean
}

export interface Product extends Record<string, any> {
  id?: number
  name: string
}

export interface Category extends Record<string, any> {
  id?: number
  name: string
  slug?: string
}

export interface User extends Record<string, any> {
  id?: number
  name?: string
  email?: string
}

export interface Order extends Record<string, any> {
  id?: number
}
