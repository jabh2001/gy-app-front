import { X, Minus, Plus, ArrowRight, Truck } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from '@/hooks/api/useCart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const subtotal = cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  const taxes = subtotal * 0.18;
  const total = subtotal + taxes;
  const freeShippingThreshold = 50;
  const isEligibleForFreeShipping = subtotal >= freeShippingThreshold;
  const progress = Math.min(100, subtotal / freeShippingThreshold * 100);

  const navigate = useNavigate();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[420px] p-0 flex flex-col border-l-0 bg-slate-50">
        <SheetHeader className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <SheetTitle className="text-lg font-bold tracking-tight text-slate-900">
              Carrito
            </SheetTitle>
            <button
              type="button"
              onClick={() => clearCart()}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Vaciar carrito
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && !cart ? (
            <div className="text-sm text-slate-500">Loading cart...</div>
          ) : cart?.items.length ? (
            cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 border border-gray-100 rounded-xl bg-white p-4 shadow-sm relative">
                <button
                  type="button"
                  onClick={() => removeItem(item.product?.id ?? 0)}
                  className="absolute right-3 top-3 h-7 w-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center transition hover:bg-slate-200"
                >
                  <X size={12} />
                </button>
                <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100">
                  <img
                    src={item.product?.main_image_url_path ?? item.product?.main_image ?? ''}
                    alt={item.product?.name ?? 'Product'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                      {item.product?.name ?? 'Product'}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product?.id ?? 0, item.quantity - 1)}
                        className="h-8 w-8 flex items-center justify-center rounded-l-full hover:bg-slate-200"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-2">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product?.id ?? 0, item.quantity + 1)}
                        className="h-8 w-8 flex items-center justify-center rounded-r-full hover:bg-slate-200"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-slate-900">€ {Number(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              Your cart is empty.
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-slate-200 space-y-5">
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
            <Truck size={18} />
            <div>
              <p className="font-semibold">
                {isEligibleForFreeShipping ? 'You are eligible for free shipping!' : 'Add more items to qualify for free shipping.'}
              </p>
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>€ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Taxes</span>
              <span>€ {taxes.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Promo</span>
            </div>
          </div>

          <Button variant="default" size="lg" className="w-full" onClick={() => { onClose(); navigate('/cart') }}>
            <div className="text-left">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{cart?.items.length ?? 0} artículos</p>
              <p className="text-xl font-black">€ {total.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-50">
              <span>Ver checkout</span>
              <ArrowRight size={20} />
            </div>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}