export interface AuditLog {
  id: number;
  table_name: string;
  target_id: number;
  action: string;
  column_name?: string | null;
  old_value?: string | null;
  new_value?: string | null;
  user_id?: number | null;
  timestamp: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'seller' | 'customer';
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  is_featured: boolean;
  parent_id?: number | null;
  children_count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Attribute {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export interface ProductAttributeValue {
  id: number;
  attribute: Attribute | null;
  value: string;
}

export interface ProductImage {
  id: number;
  url: string;
  url_path: string;
  alt_text?: string | null;
  is_main: boolean;
  order: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  short_description?: string | null;
  sku?: string | null;
  price: number;
  sale_price?: number | null;
  display_price: number;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_on_sale: boolean;
  badge?: string | null;
  rating: number;
  main_image?: string | null;
  main_image_url_path?: string | null;
  attributes: Attribute[];
  attribute_values: ProductAttributeValue[];
  categories: Category[];
  tags: Tag[];
  images: ProductImage[];
  created_at: string;
}

export interface CartItem {
  id: number;
  product_id?: number; // Opcional, ya que to_dict del backend no lo retorna explícitamente
  product: Product | null;
  quantity: number;
  price: number;
}

export interface CartData {
  id: number;
  user_id?: number | null;
  session_id?: string | null;
  items: CartItem[];
  total: number;
}

export type Cart = CartData;

export interface OrderItem {
  id: number;
  product: Product | null;
  quantity: number;
  price: number;
}

export interface BillingData {
  id: number;
  user_id: number;
  full_name: string;
  address_line1?: string | null;
  rif: string;
  phone?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Representa la instantánea exacta guardada en formato JSON dentro de la orden
export type BillingDataSnapshot = {
  full_name: string;
  address_line1?: string | null;
  rif: string;
  phone?: string | null;
}

export type OrderStatus = 'pending' | 'invoiced' | 'completed' | 'cancelled' | string;

export interface Order {
  id: number;
  user_id?: number | null;
  billing_data_id?: number | null;
  payment_method?: string | null;
  billing_data_snapshot?: BillingDataSnapshot | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CheckoutResponse {
  order_id: number;
  order_url: string;
  whatsapp_url: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  site_description?: string | null;
  logo_url?: string | null;
  hero_images: string[];
  banner_images: string[];
  footer_links: Array<Record<string, string>>;
  social_links: Array<Record<string, string>>;
  floating_whatsapp?: string | null;
  order_whatsapp?: string | null;
  category_max_children?: number | null;
  category_max_depth?: number | null;
  contact_email?: string | null;
  created_at: string;
  updated_at: string;
}