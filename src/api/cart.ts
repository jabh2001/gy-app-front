import api from './index';
import type { Cart, Order } from './models';

export type AddToCartPayload = {
  product_id: number;
  quantity?: number;
  session_id?: string;
};

export type CheckoutPayload = {
  session_id?: string;
  customer_name: string;
  customer_phone: string;
};

export async function addToCart(payload: AddToCartPayload): Promise<Cart> {
  return api.post('/cart/add', payload);
}

export async function getCart(session_id?: string): Promise<Cart> {
  return api.get('/cart', { params: { session_id } });
}

export async function checkout(payload: CheckoutPayload): Promise<{ order: Order; whatsapp_sent: boolean }> {
  return api.post('/cart/checkout', payload);
}
