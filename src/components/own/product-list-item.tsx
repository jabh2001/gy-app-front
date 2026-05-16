import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string; // La API de EscuelaJS proporciona descripción
}

export function ProductListItem({ product }: { product: Product }) {
  return (
    <Card className="group border-border bg-card text-card-foreground hover:shadow-md transition-all duration-300 rounded-[var(--radius)] overflow-hidden">
      <CardContent className="p-0 flex flex-col md:flex-row items-center gap-6">
        
        {/* Imagen - Lado Izquierdo (Referencia image_71b099.png) */}
        <div className="w-full md:w-72 aspect-square md:aspect-video flex items-center justify-center p-4 bg-white/5">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Información Central y Acción */}
        <div className="flex-1 flex flex-col md:flex-row justify-between p-6 gap-6 w-full">
          
          {/* Detalles del Producto */}
          <div className="space-y-3 flex-1">
            <h4 className="text-secondary text-xl font-bold hover:underline cursor-pointer transition-colors">
              {product.name}
            </h4>
            <p className="text-foreground text-2xl font-black tracking-tighter">
              € {product.price.toFixed(2)}
            </p>
            {product.description && (
              <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed max-w-2xl">
                {product.description}
              </p>
            )}
          </div>

          {/* Botón de Acción - Lado Derecho */}
          <div className="flex items-end md:items-center shrink-0">
            <Button 
              variant="default"
              className="w-full md:w-auto px-8 font-bold text-xs uppercase tracking-wider h-12 rounded-[calc(var(--radius)-4px)] shadow-sm flex items-center justify-center gap-2 group-active:scale-95 transition-transform"
            >
              <ShoppingCart size={20} strokeWidth={2.5} />
              ADD TO CART
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}