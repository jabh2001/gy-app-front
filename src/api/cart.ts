import api from './index';
import type { CartData, Order } from './models';

export type AddToCartPayload = {
  product_id: number;
  quantity?: number;
  session_id?: string;
};

export type UpdateCartPayload = {
  quantity: number;
  session_id?: string;
};

export type CheckoutPayload = {
  session_id?: string;
  billing_data_id: number;
  payment_method: string;
};

export async function addToCart(payload: AddToCartPayload): Promise<CartData> {
  return api.post('/cart/items/', payload, {
    headers: {
      'X-Session-ID': payload.session_id || undefined,
    },
  });
}

export async function getCart(session_id?: string): Promise<CartData> {
  return api.get('/cart/', {
    headers: {
      'X-Session-ID': session_id || undefined,
    },
  });
}

export async function updateCartItem(productId: number, payload: UpdateCartPayload): Promise<CartData> {
  return api.put(`/cart/items/${productId}/`, { quantity: payload.quantity }, {
    headers: {
      'X-Session-ID': payload.session_id || undefined,
    },
  });
}

export async function removeCartItem(productId: number, session_id?: string): Promise<CartData> {
  return api.delete(`/cart/items/${productId}/`, {
    headers: {
      'X-Session-ID': session_id || undefined,
    },
  });
}

export async function clearCart(session_id?: string): Promise<CartData> {
  return api.delete('/cart/', {
    headers: {
      'X-Session-ID': session_id || undefined,
    },
  });
}

export async function checkout(payload: CheckoutPayload): Promise<{ order: Order; whatsapp_sent: boolean; order_url?: string; whatsapp_url?: string }> {
  return api.post('/cart/checkout/', payload);
}
