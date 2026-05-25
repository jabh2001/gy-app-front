import api from './index';
import type { Category } from './models';

export type CategoryCreatePayload = {
  name: string;
  slug?: string;
  description?: string;
  parent_id?: number;
};

export async function listCategories(tree?: boolean): Promise<Category[]> {
  return api.get('/categories/', { params: { tree: tree ? 1 : undefined } });
}

export async function createCategory(payload: CategoryCreatePayload): Promise<Category> {
  return api.post('/categories/', payload);
}
