import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { addToCart as addToCartApi, clearCart as clearCartApi, getCart as getCartApi, removeCartItem as removeCartItemApi, updateCartItem as updateCartItemApi } from '@/api/cart';
import type { CartData } from '@/api/models';

export const STORAGE_KEY = 'cart_session_id';

function generateSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `sess_${crypto.randomUUID()}`;
  }
  return `sess_${Math.random().toString(36).slice(2, 12)}`;
}

function getOrCreateSessionId() {
  if (typeof window === 'undefined') return undefined;
  let sessionId = window.localStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    window.localStorage.setItem(STORAGE_KEY, sessionId);
  }
  return sessionId;
}

export function useCart() {
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | undefined>(() => getOrCreateSessionId());

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const nextSessionId = event.newValue ?? getOrCreateSessionId();
      if (nextSessionId !== sessionId) {
        setSessionId(nextSessionId);
        queryClient.invalidateQueries('cart');
      }
    };

    const handleCartRefresh = () => {
      queryClient.invalidateQueries('cart');
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('cart-refetch', handleCartRefresh);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cart-refetch', handleCartRefresh);
    };
  }, [queryClient, sessionId]);

  const cartQuery = useQuery<CartData>(['cart', sessionId], () => getCartApi(sessionId), {
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const addMutation = useMutation((payload: { product_id: number; quantity: number }) => addToCartApi({ ...payload, session_id: sessionId }), {
    onSuccess: () => queryClient.invalidateQueries('cart'),
  });

  const updateMutation = useMutation((payload: { product_id: number; quantity: number }) => updateCartItemApi(payload.product_id, { quantity: payload.quantity, session_id: sessionId }), {
    onSuccess: () => queryClient.invalidateQueries('cart'),
  });

  const removeMutation = useMutation((product_id: number) => removeCartItemApi(product_id, sessionId), {
    onSuccess: () => queryClient.invalidateQueries('cart'),
  });

  const clearMutation = useMutation(() => clearCartApi(sessionId), {
    onSuccess: () => queryClient.invalidateQueries('cart'),
  });

  const addToCart = useCallback((productId: number, quantity: number) => {
    return addMutation.mutateAsync({ product_id: productId, quantity });
  }, [addMutation]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    return updateMutation.mutateAsync({ product_id: productId, quantity });
  }, [updateMutation]);

  const removeItem = useCallback((productId: number) => {
    return removeMutation.mutateAsync(productId);
  }, [removeMutation]);

  const clearCart = useCallback(() => {
    return clearMutation.mutateAsync();
  }, [clearMutation]);

  const isLoading = cartQuery.isLoading || addMutation.isLoading || updateMutation.isLoading || removeMutation.isLoading || clearMutation.isLoading;
  const error = cartQuery.error || addMutation.error || updateMutation.error || removeMutation.error || clearMutation.error;

  return {
    cart: cartQuery.data,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    isLoading,
    error,
    isFetching: cartQuery.isFetching,
  };
}
