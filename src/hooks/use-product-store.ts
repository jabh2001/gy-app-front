import { create } from 'zustand';

interface Category {
  id: number;
  name: string;
  image: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
  category: Category;
  description: string;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  hasFetchedProducts: boolean;
  hasFetchedCategories: boolean;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  hasFetchedProducts: false,
  hasFetchedCategories: false,

  fetchProducts: async () => {
    // Lógica: Si ya se buscaron, no hacer nada
    if (get().hasFetchedProducts) return;

    set({ loading: true });
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/products');
      const data = await response.json();
      set({ products: data, hasFetchedProducts: true });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    if (get().hasFetchedCategories) return;

    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/categories');
      const data = await response.json();
      set({ categories: data, hasFetchedCategories: true });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  },
}));