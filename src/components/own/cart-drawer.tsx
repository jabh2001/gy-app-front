import { X, Minus, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetClose 
} from "@/components/ui/sheet";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const cartItems = [
    {
      id: 1,
      name: "Power Cable | PC/Monitor UK 3-Pin 3M",
      price: 8.99,
      quantity: 1,
      image: "https://megatekk.com.mt/pub/media/catalog/product/p/o/power-cable.jpg",
    }
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[400px] p-0 flex flex-col border-l-0">
        <SheetHeader className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <SheetTitle className="text-lg font-bold uppercase tracking-tight text-slate-900">
              Mi carrito
            </SheetTitle>
            <p className="text-xs text-slate-500">Tus productos seleccionados</p>
          </div>
          <SheetClose asChild>
            <button
              type="button"
              aria-label="Cerrar carrito"
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-900 transition hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </SheetClose>
        </SheetHeader>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 border border-gray-100 rounded-lg p-3 relative group">
              <button className="absolute -top-2 -right-2 bg-gray-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={12} />
              </button>
              <div className="w-20 h-20 bg-gray-50 rounded flex-shrink-0 p-1">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="text-[12px] font-bold leading-tight text-gray-800 italic">
                  {item.name}
                </h4>
                <div className="flex items-center justify-between">
                  {/* Selector de Cantidad (image_7fbfff.png) */}
                  <div className="flex items-center border border-gray-200 rounded-md bg-gray-50 overflow-hidden">
                    <button className="px-2 py-1 hover:text-[#E6E600]"><Minus size={12} /></button>
                    <span className="px-3 py-1 text-xs font-bold border-x border-gray-200">{item.quantity}</span>
                    <button className="px-2 py-1 hover:text-[#E6E600]"><Plus size={12} /></button>
                  </div>
                  <span className="font-bold text-sm">€ {item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white border-t border-slate-200 space-y-5">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Total</span>
            <span className="font-bold text-slate-900">€ {total.toFixed(2)}</span>
          </div>

          <Button className="w-full rounded-xl bg-[#E6E600] px-6 py-4 text-base font-black text-black transition hover:bg-yellow-400">
            <div className="flex w-full items-center justify-between">
              <span>Finalizar compra</span>
              <ArrowRight size={18} />
            </div>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}