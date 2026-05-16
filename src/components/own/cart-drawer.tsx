import { X, Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetClose 
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Datos de ejemplo basados en image_7fbfff.png
  const cartItems = [
    {
      id: 1,
      name: "Power Cable | PC/Monitor UK 3-Pin 3M",
      price: 8.99,
      quantity: 1,
      image: "https://megatekk.com.mt/pub/media/catalog/product/p/o/power-cable.jpg",
    }
  ];

  const subtotal = 7.62;
  const taxes = 1.37;
  const total = 8.99;
  const freeShippingThreshold = 50;
  const awayFromFreeShipping = 41.01;
  const progressValue = (total / freeShippingThreshold) * 100;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[400px] p-0 flex flex-col border-l-0">
        {/* Header del Carrito */}
        <SheetHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <SheetTitle className="text-sm font-bold uppercase tracking-tight">
              Your Cart <span className="text-gray-400 font-medium normal-case">(Clear Cart)</span>
            </SheetTitle>
          </div>
          <SheetClose className="rounded-full hover:bg-gray-100 p-1">
            <X size={20} />
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

        {/* Footer con Totales y Barra de Progreso */}
        <div className="p-6 bg-white border-t space-y-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-bold">
              <span>Subtotal</span>
              <span>€ {subtotal}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Taxes</span>
              <span>€ {taxes}</span>
            </div>
            <div className="text-right">
              <button className="text-[10px] uppercase font-bold text-sky-600 hover:underline">
                Apply promo code
              </button>
            </div>
          </div>

          {/* Barra de Envío Gratis (image_7fbfff.png) */}
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-gray-600">
              You're <span className="font-bold">€ {awayFromFreeShipping}</span> away from <span className="font-bold">free shipping!</span>
            </p>
            <Progress value={progressValue} className="h-2 bg-gray-100" />
          </div>

          {/* Botón de Checkout */}
          <Button className="w-full bg-[#E6E600] hover:bg-yellow-500 text-black font-black italic uppercase h-14 rounded-md text-lg flex justify-between px-6">
             <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-bold">1 items</span>
                <span>€ {total}</span>
             </div>
             <div className="flex items-center gap-2">
                Proceed To Checkout <ArrowRight size={18} />
             </div>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}