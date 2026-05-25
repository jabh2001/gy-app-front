import api from './index';
import type { Product } from './models';

export type ProductCreatePayload = {
  name: string;
  description?: string;
  short_description?: string;
  sku?: string;
  price: number;
  sale_price?: number;
  stock?: number;
  is_active?: boolean;
  is_featured?: boolean;
  is_on_sale?: boolean;
  badge?: string;
  rating?: number;
  main_image?: string;
  attributes?: Record<string, unknown>;
  categories?: Array<string | number>;
  tags?: Array<string | number>;
  images?: Array<{
    url: string;
    alt_text?: string;
    is_main?: boolean;
    order?: number;
  }>;
};

export type ProductFilters = {
  category?: string;
  tag?: string;
  q?: string;
  featured?: boolean;
  on_sale?: boolean;
};

export async function listProducts(filters?: ProductFilters): Promise<Product[]> {
  return api.get('/products/', { params: filters });
}

export async function getProduct(productId: number): Promise<Product> {
  return api.get(`/products/${productId}/`);
}

export async function createProduct(payload: ProductCreatePayload | FormData): Promise<Product> {
  return api.post('/products/', payload);
}

export async function updateProduct(productId: number, payload: ProductCreatePayload | FormData): Promise<Product> {
  return api.put(`/products/${productId}/`, payload);
}

// products.ts (agregado)
export type InventoryImportResponse = {
  success: boolean;
  message: string;
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{ row: number; error: string }>;
};

// Para enviar JSON con items
export async function importInventory(items: any[]): Promise<InventoryImportResponse> {
  return api.post('/products/import-inventory/', items);
}

// Para enviar archivo Excel
export async function importInventoryFile(file: File): Promise<InventoryImportResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/products/import-inventory-file/', formData);
}